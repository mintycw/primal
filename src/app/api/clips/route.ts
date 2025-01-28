import { connectToDatabase } from "@/lib/mongodb";
import { Clip } from "@/models/Clip";
import { NextResponse } from "next/server";
import s3 from "@/lib/minio";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

export async function GET() {
	try {
		await connectToDatabase();

		const clips = await Clip.find().sort({ createdAt: -1 });

		const clipsWithData = clips.map((clip) => {
			// generate dynamic url
			const videoUrl = `${process.env.MINIO_ENDPOINT}/${process.env.MINIO_BUCKET}/${clip.objectName}`;
			return { ...clip.toObject(), videoUrl };
		});

		console.log("Clips fetched:", clipsWithData);

		return NextResponse.json(clipsWithData);
	} catch (error: any) {
		console.error(error);
		return NextResponse.json({ error: "Failed to fetch clips" }, { status: 500 });
	}
}

export async function POST(request: Request) {
	try {
		const formData = await request.formData();

		const title = formData.get("title") as string;
		const description = formData.get("description") as string;
		const createdAt = formData.get("createdAt") as string;
		const file = formData.get("content") as File;

		if (!title || !description || !file) {
			return NextResponse.json({ error: "All fields are required" }, { status: 400 });
		}

		const bucketName = process.env.MINIO_BUCKET;
		const objectName = `defaultUser/${Date.now()}-${file.name}`; // location and name

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
			signedUrl,
			objectName,
			createdAt: new Date(createdAt),
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

export async function DELETE(req: Request) {
	try {
		await connectToDatabase();
		const url = new URL(req.url);
		const id = url.searchParams.get("id");

		if (!id) {
			return NextResponse.json({ error: "Missing ID parameter" }, { status: 400 });
		}

		// Find the clip in the database
		const clip = await Clip.findById(id);
		if (!clip) {
			return NextResponse.json({ error: "Clip not found" }, { status: 404 });
		}

		// Delete the video from MinIO
		const bucketName = process.env.MINIO_BUCKET;
		const objectName = clip.objectName; // Object name stored in the database

		const deleteCommand = new DeleteObjectCommand({
			Bucket: bucketName,
			Key: objectName, // Path to the video file in MinIO
		});

		await s3.send(deleteCommand); // Delete the file from MinIO

		// Now delete the clip document from MongoDB
		await Clip.findByIdAndDelete(id);

		return NextResponse.json({ message: "Clip and video deleted" }, { status: 200 });
	} catch (error: any) {
		console.error("Error deleting clip:", error);
		return NextResponse.json({ error: "Failed to delete clip" }, { status: 500 });
	}
}
