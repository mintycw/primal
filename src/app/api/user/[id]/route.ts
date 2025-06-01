import { checkMongodbConnection } from "@/lib/db/checkMongodbConnection";
import { NextResponse } from "next/server";
import { RouteParams } from "@/types/param";
import { User } from "@/models/User";

export async function GET(req: Request, { params }: RouteParams<{ id: string }>) {
	try {
		await checkMongodbConnection();
		const { id } = await params;

		if (!id) {
			return NextResponse.json({ error: "Missing ID parameter" }, { status: 400 });
		}

		const user = await User.findById(id).exec();

		if (!user) {
			return NextResponse.json({ error: "user not found" }, { status: 404 });
		}

		return NextResponse.json(user);
	} catch (error) {
		console.error("Error fetching user:", error);
		return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
	}
}
