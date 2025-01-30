import { connectToDatabase } from "@/lib/db/mongodb";
import { Clip } from "@/models/Clip";
import { NextResponse } from "next/server";
import s3 from "@/lib/db/s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";

export const config = {
	api: {
		bodyParser: {
			sizeLimit: "1024mb", // Increase the limit to 50MB (adjust as needed)
		},
	},
};

export async function GET() {
	try {
		await connectToDatabase();

		const clips = await Clip.find().sort({ createdAt: -1 });

		const clipsWithData = clips.map((clip) => {
			// generate dynamic url
			const videoUrl = `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${clip.objectName}`;
			return { ...clip.toObject(), videoUrl };
		});

		console.log("Clips fetched:", clipsWithData);

		return NextResponse.json(clipsWithData);
	} catch (error: any) {
		console.error(error);
		return NextResponse.json({ error: "Failed to fetch clips" }, { status: 500 });
	}
}

export async function POST(req: Request) {
	try {
		const formData = await req.formData();

		const title = formData.get("title") as string;
		const description = formData.get("description") as string;
		const file = formData.get("content") as File;
		const bucketName = process.env.S3_BUCKET;
		const enableCompression = process.env.VIDEO_COMPRESSION === "true";

		if (!title || !description || !file) {
			return NextResponse.json({ error: "All fields are required" }, { status: 400 });
		}

		console.log(`Video compression is ${enableCompression ? "enabled" : "disabled"}`);

		let buffer: Buffer;
		let objectName: string; // location and name

		if (enableCompression) {
			objectName = `defaultUser/${Date.now()}-${file.name.replace(path.extname(file.name), ".mp4")}`;
			const compressionEndpoint = process.env.VIDEO_COMPRESSION_ENDPOINT;
			if (!compressionEndpoint) {
				throw new Error(
					"Video compression endpoint is not defined in environment variables."
				);
			}
			// Compress video on endpoint (can be changed to compressVideoOnNextJS but not recommended)
			buffer = await sendEndpointForCompression(file, compressionEndpoint);
			console.log("Video is being compressed...");
		} else {
			// origninal video
			objectName = `defaultUser/${Date.now()}-${file.name}`; // location and name
			buffer = Buffer.from(await file.arrayBuffer());
			console.log("Using original video without compression.");
		}

		// Generates presigned URL for upload
		const command = new PutObjectCommand({
			Bucket: bucketName,
			Key: objectName,
			ContentType: file.type,
		});

		const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 }); // 1 uur geldig

		await connectToDatabase();

		// Save metadata in MongoDB
		const newClip = new Clip({
			title,
			description,
			videoUrl: `${process.env.S3_ENDPOINT}/${bucketName}/${objectName}`,
			objectName,
		});

		const savedClip = await newClip.save();

		return NextResponse.json(
			{
				message: "Clip created successfully",
				clipId: savedClip._id,
				uploadUrl: signedUrl,
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error creating clip:", error);
		return NextResponse.json({ error: "Failed to create clip" }, { status: 500 });
	}
}

async function sendEndpointForCompression(file: File, truenasEndpoint: string): Promise<Buffer> {
	try {
		const form = new FormData();
		form.append("video", new Blob([await file.arrayBuffer()]), file.name);

		const response = await fetch(`${truenasEndpoint}/compress`, {
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

// NOT IN USE: Compress the video withtin Next.js (not recommended)
async function compressVideoOnNextJS(file: File): Promise<Buffer> {
	const tempInputPath = path.join("/tmp", file.name);
	const tempOutputPath = path.join("/tmp", `compressed-${file.name}`);

	// Write buffer to temp file
	const buffer = Buffer.from(await file.arrayBuffer());
	fs.writeFileSync(tempInputPath, buffer);

	// Compress video
	await new Promise((resolve, reject) => {
		ffmpeg(tempInputPath)
			.output(tempOutputPath)
			.videoCodec("hevc_nvenc")
			.audioCodec("aac")
			.audioBitrate("128k")
			.outputOptions([
				"-preset p4", // Balanced preset
				"-cq 32", // Constant quality
				"-vf scale=1920:1080", // Cap resolution to 1080p
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
