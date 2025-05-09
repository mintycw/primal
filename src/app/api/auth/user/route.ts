import { checkMongodbConnection } from "@/lib/db/checkMongodbConnection";
import { User } from "@/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth/authOptions";

export async function GET() {
	await checkMongodbConnection();
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const user = await User.findOne({ email: session.user?.email });

	return NextResponse.json(user, { status: 200 });
}
