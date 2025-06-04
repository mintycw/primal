import { checkMongodbConnection } from "@/lib/db/checkMongodbConnection";
import { Clip } from "@/models/Clip";
import { NextResponse } from "next/server";
import s3 from "@/lib/db/s3";
import { PutObjectCommand, HeadBucketCommand } from "@aws-sdk/client-s3";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";
import { authOptions } from "@/lib/auth/authOptions";
import { getServerSession } from "next-auth";
import { TReactionCount } from "@/types/reaction";
import { IReaction } from "@/models/Reaction";

// Does not have to be changed unless we go beyond 1GB
export const config = {
	api: {
		bodyParser: {
			sizeLimit: "1024mb",
		},
	},
};

export async function GET() {
	try {
		await checkMongodbConnection();

		const clips = await Clip.find().sort({ createdAt: -1 }).populate("user", "name image");

		// Get all reactions for all clips
		const { Reaction } = await import("@/models/Reaction");
		const allReactions = await Reaction.find().populate("user", "_id");

		// Group reactions by clip
		const reactionsByClip = allReactions.reduce(
			(acc: Record<string, IReaction[]>, reaction) => {
				const clipId = reaction.clip.toString();
				if (!acc[clipId]) {
					acc[clipId] = [];
				}
				acc[clipId].push(reaction);
				return acc;
			},
			{}
		);

		// Get the current user's session to check if they've reacted
		const session = await getServerSession(authOptions);
		const currentUserId = session?.user?._id;

		// Convert currentUserId to string for proper comparison
		const currentUserIdStr = currentUserId ? currentUserId.toString() : null;

		const clipsWithData = clips.map((clip) => {
			// Type assertion to access the properties we need
			const typedClip = clip as unknown as {
				objectName: string;
				_id: { toString(): string };
				toObject(): Record<string, unknown>;
			};
			// Generates the dynamic URL
			const videoUrl = `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${typedClip.objectName}`;

			// Get reactions for this clip
			const clipReactions = reactionsByClip[typedClip._id.toString()] || [];

			// Group reactions by emoji and count them
			const reactionCounts = clipReactions.reduce(
				(acc: Record<string, TReactionCount>, reaction) => {
					const emoji = reaction.emoji;

					if (!acc[emoji]) {
						acc[emoji] = {
							emoji,
							count: 0,
							users: [],
						};
					}

					acc[emoji].count += 1;
					acc[emoji].users.push(reaction.user._id.toString());

					return acc;
				},
				{}
			);

			// Convert to array and add a flag for the current user's reactions
			const reactionCountsArray = Object.values(reactionCounts).map(
				(count: TReactionCount) => {
					return {
						...count,
						hasReacted: currentUserIdStr
							? count.users.includes(currentUserIdStr)
							: false,
					};
				}
			);

			return {
				...typedClip.toObject(),
				videoUrl,
				reactions: reactionCountsArray,
			};
		});

		return NextResponse.json(clipsWithData);
	} catch (error: unknown) {
		console.error(error);
		return NextResponse.json({ error: "Failed to fetch clips" }, { status: 500 });
	}
}

export async function POST(req: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user?._id) {
			return NextResponse.json({ error: "User is not authenticated" }, { status: 401 });
		}

		const formData = await req.formData();

		const title = formData.get("title") as string;
		const description = formData.get("description") as string | null;
		const file = formData.get("content") as File;

		const bucketName = process.env.S3_BUCKET;
		const enableCompression = process.env.VIDEO_COMPRESSION === "true";
		const localCompression = process.env.LOCAL_VIDEO_COMPRESSION === "true";

		if (!bucketName) {
			throw new Error("S3_BUCKET is not defined in environment variables.");
		}

		if (!title || !file) {
			return NextResponse.json(
				{ error: "Title field and video clip is required" },
				{ status: 400 }
			);
		}

		// Check if MongoDB server is online
		await checkMongodbConnection();

		console.log(`Video compression is ${enableCompression ? "enabled" : "disabled"}`);

		let objectName: string;
		let fileBuffer: Buffer;

		if (enableCompression && localCompression) {
			objectName = `${session.user._id}/${Date.now()}-${file.name.replace(path.extname(file.name), ".mp4")}`;

			// Perform local compression
			console.log("Compressing video locally...");
			fileBuffer = await compressVideoOnNextJS(file);
			console.log("Video compressed locally.");
		} else if (enableCompression) {
			objectName = `${session.user._id}/${Date.now()}-${file.name.replace(path.extname(file.name), ".mp4")}`;

			const compressionEndpoint = process.env.VIDEO_COMPRESSION_ENDPOINT;

			if (!compressionEndpoint) {
				throw new Error(
					"Video compression endpoint is not defined in environment variables."
				);
			}

			// Compress video on endpoint
			console.log("Sending video for compression...");
			fileBuffer = await sendEndpointForCompression(file, compressionEndpoint);
			console.log("Video compressed successfully.");
		} else {
			// Original video
			objectName = `${session.user._id}/${Date.now()}-${file.name}`;
			fileBuffer = Buffer.from(await file.arrayBuffer());
			console.log("Using original video without compression.");
		}

		try {
			// Check S3 bucket accessibility
			const headBucketCommand = new HeadBucketCommand({
				Bucket: bucketName,
			});

			await s3.send(headBucketCommand);
			console.log("S3 bucket is accessible");

			// Upload file directly to S3 (server-side upload)
			const uploadCommand = new PutObjectCommand({
				Bucket: bucketName,
				Key: objectName,
				Body: fileBuffer,
				ContentType: file.type,
			});

			await s3.send(uploadCommand);
			console.log("File uploaded successfully to S3");

			// Save metadata in MongoDB
			const newClip = new Clip({
				title,
				description,
				videoUrl: `${process.env.S3_ENDPOINT}/${bucketName}/${objectName}`,
				objectName,
				user: session.user._id,
			});

			const savedClip = await newClip.save();

			return NextResponse.json(
				{
					message: "Clip created and uploaded successfully",
					clipId: savedClip._id,
					videoUrl: `${process.env.S3_ENDPOINT}/${bucketName}/${objectName}`,
				},
				{ status: 201 }
			);
		} catch (s3Error) {
			console.error("Error accessing S3 bucket:", s3Error);
			return NextResponse.json(
				{ error: "Storage service is currently unavailable. Please try again later." },
				{ status: 503 }
			);
		}
	} catch (error) {
		console.error("Error creating clip:", error);
		return NextResponse.json({ error: "Failed to create clip" }, { status: 500 });
	}
}

async function sendEndpointForCompression(
	file: File,
	compressionEndpoint: string
): Promise<Buffer> {
	try {
		const form = new FormData();

		form.append("video", new Blob([await file.arrayBuffer()]), file.name);

		const response = await fetch(`${compressionEndpoint}/compress`, {
			method: "POST",
			body: form,
		});

		if (!response.ok) {
			throw new Error(
				`Compression server returned ${response.status}: ${response.statusText}`
			);
		}

		return Buffer.from(await response.arrayBuffer());
	} catch (error) {
		console.error("Error sending video to compression server:", error);
		throw new Error("Failed to compress video on compression server.");
	}
}

// Compress the video within Next.js (not recommended)
async function compressVideoOnNextJS(file: File): Promise<Buffer> {
	const tempInputPath = path.join("/tmp", file.name);
	const tempOutputPath = path.join("/tmp", `compressed-${file.name}`);

	const localCodec = process.env.LOCAL_VIDEO_CODEC;

	if (!localCodec) {
		throw new Error("LOCAL_VIDEO_ENCODER is not defined in environment variables.");
	}

	// Write buffer to temp file
	const buffer = Buffer.from(await file.arrayBuffer());
	fs.writeFileSync(tempInputPath, buffer);

	// Compress video
	await new Promise((resolve, reject) => {
		ffmpeg(tempInputPath)
			.output(tempOutputPath)
			.videoCodec(localCodec)
			.audioCodec("aac")
			.audioBitrate("128k")
			.outputOptions([
				"-preset p5", // Balanced preset
				"-cq 32", // Constant quality
				"-vf scale=1920:1080:force_original_aspect_ratio=decrease", // Cap resolution to 1080p
				"-f mp4", // Output format
			])
			.on("progress", (progress) => {
				console.log(`Processing: ${Math.round(progress.percent ?? 0)}% done`); // undefined returns 0
			})
			.on("end", resolve)
			.on("error", reject)
			.run();
	});

	// Read compressed video
	const compressedBuffer = fs.readFileSync(tempOutputPath);

	// Clean up
	fs.unlinkSync(tempInputPath);
	fs.unlinkSync(tempOutputPath);

	return compressedBuffer;
}
