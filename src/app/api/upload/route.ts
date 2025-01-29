import { NextRequest, NextResponse } from "next/server";
import s3 from "@/lib/minio";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export async function POST(req: NextRequest) {
	const { name, fileType } = await req.json();

	const params = {
		Bucket: process.env.MINIO_BUCKET,
		Key: name, // file name
		ContentType: fileType,
	};

	try {
		// getSignedUrl utility to generate a signed URL
		const command = new PutObjectCommand(params);
		const url = await getSignedUrl(s3, command, { expiresIn: 3600 }); // URL expires in 1 hour

		return NextResponse.json({ url });
	} catch (error) {
		console.error("Error generating signed URL", error);
		return NextResponse.json({ error: "Error generating signed URL" }, { status: 500 });
	}
}
