import { checkMongodbConnection } from "@/lib/db/checkMongodbConnection";
import { NextResponse } from "next/server";
import { Clip } from "@/models/Clip";
import { RouteParams } from "@/types/param";

export async function GET(req: Request, { params }: RouteParams<{ id: string }>) {
	try {
		await checkMongodbConnection();
		const { id } = await params;

		if (!id) {
			return NextResponse.json({ error: "Missing ID parameter" }, { status: 400 });
		}

		const clips = await Clip.find({ user: id })
			.populate("user", "name image")
			.sort({ createdAt: -1 })
			.exec();

		if (!clips) {
			return NextResponse.json({ error: "Clips not found" }, { status: 404 });
		}

		return NextResponse.json(clips);
	} catch (error) {
		console.error("Error fetching user clips:", error);
		return NextResponse.json({ error: "Failed to fetch clips" }, { status: 500 });
	}
}
