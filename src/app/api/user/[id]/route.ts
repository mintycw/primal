import { connectToDatabase } from "@/lib/db/mongodb";
import { NextResponse } from "next/server";
import { Clip } from "@/models/Clip";
import { RouteParams } from "@/types/param";
import { populate } from "dotenv";

export async function GET(req: Request, { params }: RouteParams<{ id: string }>) {
	try {
		await connectToDatabase();
		const { id } = await params;
		console.log("Clips fetched:", id);

		const clips = await Clip.find({ user: id })
			.populate("user", "name image")
			.sort({ createdAt: -1 })
			.exec();

		console.log("Clips fetched:", clips);

		return NextResponse.json(clips);
	} catch (error) {
		console.error("Error fetching user clips:", error);
		return NextResponse.json({ error: "Failed to fetch clips" }, { status: 500 });
	}
}
