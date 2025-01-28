import { connectToDatabase } from "@/lib/db/mongodb";
import { Clip } from "@/models/Clip";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		await connectToDatabase();

		const clips = await Clip.find().sort({ createdAt: -1 });

		return NextResponse.json(clips);
	} catch (error: any) {
		console.error(error);
		return NextResponse.json({ error: "Failed to fetch clips" }, { status: 500 });
	}
}

export async function POST(req: Request) {
	try {
		await connectToDatabase();

		const body = await req.json();

		const newClip = new Clip(body);
		await newClip.save();

		return NextResponse.json(newClip, { status: 201 });
	} catch (error: any) {
		console.error("Error creating clip:", error);
		return NextResponse.json({ error: "Failed to create clip" }, { status: 500 });
	}
}
