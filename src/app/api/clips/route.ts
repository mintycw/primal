import { connectToDatabase } from "@/lib/mongodb";
import { Clip } from "@/models/Clip";
import { NextResponse } from "next/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3 from "@/lib/minio";
import { IncomingForm } from "formidable";
import { Fields, Files, File } from "formidable";
import { IncomingMessage } from "http"; // for formidable so we can cast.

// Formidable configuration
const form = new IncomingForm();

export const config = {
	api: {
		bodyParser: false, // disabled Next.js's default body parser to use Formidable
	},
};

export async function GET() {
	try {
		await connectToDatabase();

		const clips = await Clip.find().sort({ createdAt: -1 });

		console.log("Clips fetched:", clips);

		return NextResponse.json(clips);
	} catch (error: any) {
		console.error(error);
		return NextResponse.json({ error: "Failed to fetch clips" }, { status: 500 });
	}
}

export async function POST(req: Request) {
	return new Promise((resolve, reject) => {
		// Cast the Request object to IncomingMessage type for Formidable
		const incomingReq = req as unknown as IncomingMessage;

		form.parse(req as any, async (err: any, fields: any, files: any) => {
			if (err) {
				reject(new NextResponse("Error parsing form data", { status: 400 }));
				return;
			}

			const { title, description, createdAt } = fields;
			const videoFile = files.content[0];

			if (!title || !description || !videoFile || videoFile.length === 0) {
				return NextResponse.json(
					{ error: "Title, description and video file are required" },
					{ status: 400 }
				);
			}

			//await connectToDatabase();
			const fileName = `${Date.now()}-${videoFile[0].originalFilename}`;
			// Ensure ContentType is never null cuz typescript (needs to be undefined)
			const contentType = videoFile.mimetype || "application/octet-stream";

			// upload video to MinIO
			const bucketName = process.env.MINIO_BUCKET || "default-bucket";
			const params = {
				Bucket: bucketName,
				Key: fileName,
				ContentType: contentType,
			};

			try {
				const command = new PutObjectCommand(params);
				const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 }); // 1 hour expiration

				// Save clip metadata to MongoDB
				// const videoUrl = `https://${process.env.MINIO_ENDPOINT}/${bucketName}/${fileName}`;
				// const newClip = new Clip({
				// 	name: title,
				// 	description,
				// 	videoUrl, // Store the full video URL
				// 	createdAt,
				// });
				// await newClip.save();

				// return NextResponse.json({ newClip, uploadUrl }, { status: 201 });
				return resolve(NextResponse.json({ uploadUrl }));
			} catch (error: any) {
				console.error("Error creating clip:", error);
				return NextResponse.json({ error: "Failed to create clip" }, { status: 500 });
			}
		});
	});
}

export async function DELETE(req: Request) {
	try {
		await connectToDatabase();
		const url = new URL(req.url);
		const id = url.searchParams.get("id");

		if (!id) {
			return NextResponse.json({ error: "Missing ID parameter" }, { status: 400 });
		}

		const clip = await Clip.findByIdAndDelete(id);
		if (!clip) {
			return NextResponse.json({ error: "Clip not found" }, { status: 404 });
		}

		const videoUrl = clip.content;
		const bucketName = process.env.MINIO_BUCKET || "default-bucket";

		// asuming location: https://<endpoint>/<bucket>/<key>
		const key = videoUrl.split(`${bucketName}/`)[1];

		if (key) {
			const deleteParams = {
				Bucket: bucketName,
				Key: key,
			};

			const command = new DeleteObjectCommand(deleteParams);
			await s3.send(command);
			console.log(`Video deleted from MinIO: ${key}`);
		}
		return NextResponse.json({ message: "Clip deleted" }, { status: 200 });
	} catch (error: any) {
		console.error("Error deleting clip:", error);
		return NextResponse.json({ error: "Failed to delete clip" }, { status: 500 });
	}
}
