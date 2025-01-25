import { connectToDatabase } from "@/lib/mongodb";
import { Clip } from "@/models/Clip";
import { NextResponse } from "next/server";

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
		return NextResponse.json({message: "Clip deleted"}, { status: 200 });

	} catch (error: any) {
		console.error("Error deleting clip:", error);
		return NextResponse.json({ error: "Failed to delete clip" }, { status: 500 });
	}
}
