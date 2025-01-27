import { connectToDatabase } from "@/lib/db/mongodb";
import { Clip } from "@/models/Clip";
import { NextResponse } from "next/server";
import { RouteParams } from "@/types/param";

export async function PUT(req: Request, { params }: RouteParams<{ id: string }>) {
	try {
		await connectToDatabase();
		const { id } = params;

		console.log("PUT ID:", id);

		if (!id) {
			return NextResponse.json({ error: "Missing ID parameter" }, { status: 400 });
		}

		const { newTitle: title, newDescription: description } = await req.json();
		if (!title || !description) {
			return NextResponse.json({ error: "Invalid data provided" }, { status: 400 });
		}

		const clip = await Clip.findById(id);
		if (!clip) {
			return NextResponse.json({ error: "Clip not found" }, { status: 404 });
		}

		await Clip.findByIdAndUpdate(id, { title, description });
		return NextResponse.json({ message: "Clip information updated." }, { status: 200 });
	} catch (error: any) {
		console.error("Error updating clip:", error);
		return NextResponse.json({ error: "Failed to update clip" }, { status: 500 });
	}
}

// Specific clip fetch
export async function GET(req: Request, { params }: RouteParams<{ id: string }>) {
	try {
		await connectToDatabase();
		const { id } = params;
		const clip = await Clip.find().findOne({ _id: id });

		console.log("Clip fetched:", clip);

		return NextResponse.json({ clip }, { status: 200 });
	} catch (error: any) {
		console.error(error);
		return NextResponse.json({ error: "Failed to fetch clip" }, { status: 500 });
	}
}

export async function DELETE(req: Request, { params }: RouteParams<{ id: string }>) {
	try {
		await connectToDatabase();
		const { id } = params;

		if (!id) {
			return NextResponse.json({ error: "Missing ID parameter" }, { status: 400 });
		}

		const clip = await Clip.findByIdAndDelete(id);
		if (!clip) {
			return NextResponse.json({ error: "Clip not found" }, { status: 404 });
		}

		return NextResponse.json({ message: "Clip deleted" }, { status: 200 });
	} catch (error: any) {
		console.error("Error deleting clip:", error);
		return NextResponse.json({ error: "Failed to delete clip" }, { status: 500 });
	}
}
