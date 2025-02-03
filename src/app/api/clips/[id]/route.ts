import { connectToDatabase } from "@/lib/db/mongodb";
import { Clip } from "@/models/Clip";
import { NextResponse } from "next/server";
import { RouteParams } from "@/types/param";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3 from "@/lib/db/s3";

export async function PUT(req: Request, { params }: RouteParams<{ id: string }>) {
	try {
		await connectToDatabase();
		const resolvedParams = await params;
		if (!resolvedParams || !resolvedParams.id) {
			return NextResponse.json({ error: "Missing ID parameter" }, { status: 400 });
		}

		const { id } = await resolvedParams;
		const { title, description } = await req.json();
		if (!title || !description) {
			return NextResponse.json({ error: "Invalid data provided" }, { status: 400 });
		}

		const clip = await Clip.findById(id);
		if (!clip) {
			return NextResponse.json({ error: "Clip not found" }, { status: 404 });
		}

		await Clip.findByIdAndUpdate(id, { title, description });
		return NextResponse.json(clip, { status: 200 });
	} catch (error: unknown) {
		console.error("Error updating clip:", error);
		return NextResponse.json({ error: "Failed to update clip" }, { status: 500 });
	}
}

// Specific clip fetch
export async function GET(req: Request, { params }: RouteParams) {
	try {
		await connectToDatabase();
		const resolvedParams = await params;
		if (!resolvedParams || !resolvedParams.id) {
			return NextResponse.json({ error: "Missing ID parameter" }, { status: 400 });
		}

		const { id } = await resolvedParams;
		const clip = await Clip.findOne({ _id: id });

		if (!clip) {
			return NextResponse.json({ error: "Clip not found" }, { status: 404 });
		}

		return NextResponse.json({ clip }, { status: 200 });
	} catch (error: unknown) {
		console.error(error);
		return NextResponse.json({ error: "Failed to fetch clip" }, { status: 500 });
	}
}

export async function DELETE(req: Request, { params }: RouteParams<{ id: string }>) {
	try {
		await connectToDatabase();
		const resolvedParams = await params;
		if (!resolvedParams || !resolvedParams.id) {
			return NextResponse.json({ error: "Missing ID parameter" }, { status: 400 });
		}

		const { id } = await resolvedParams;
		const clip = await Clip.findByIdAndDelete(id);
		if (!clip) {
			return NextResponse.json({ error: "Clip not found" }, { status: 404 });
		}

		// Delete the video from S3
		const bucketName = process.env.S3_BUCKET;
		const objectName = clip.objectName; // Object name stored in the database

		const deleteCommand = new DeleteObjectCommand({
			Bucket: bucketName,
			Key: objectName, // Path to the video file in S3
		});

		await s3.send(deleteCommand); // Delete the file from S3

		// Now delete the clip document from MongoDB
		await Clip.findByIdAndDelete(id);

		return NextResponse.json({ message: "Clip deleted" }, { status: 200 });
	} catch (error: unknown) {
		console.error("Error deleting clip:", error);
		return NextResponse.json({ error: "Failed to delete clip" }, { status: 500 });
	}
}
