import { checkMongodbConnection } from "@/lib/db/checkMongodbConnection";
import { Reaction } from "@/models/Reaction";
import { NextResponse } from "next/server";
import { RouteParams } from "@/types/param";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { TReactionCount } from "@/types/reaction";

// Get reactions for a specific clip
export async function GET(req: Request, { params }: RouteParams<{ id: string }>) {
	try {
		await checkMongodbConnection();

		const { id } = await params;

		if (!id) {
			return NextResponse.json({ error: "Missing clip ID parameter" }, { status: 400 });
		}

		// Get all reactions for this clip
		const reactions = await Reaction.find({ clip: id }).populate("user", "name image _id");

		// Group reactions by emoji and count them
		const reactionCounts = reactions.reduce((acc: Record<string, TReactionCount>, reaction) => {
			const emoji = reaction.emoji;

			if (!acc[emoji]) {
				acc[emoji] = {
					emoji,
					count: 0,
					users: [],
				};
			}

			acc[emoji].count += 1;
			acc[emoji].users.push(reaction.user._id.toString());

			return acc;
		}, {});

		// Get the current user's session to check if they've reacted
		const session = await getServerSession(authOptions);
		const currentUserId = session?.user?._id;

		// Convert currentUserId to string for proper comparison
		const currentUserIdStr = currentUserId ? currentUserId.toString() : null;

		// Convert to array and add a flag for the current user's reactions
		const reactionCountsArray = Object.values(reactionCounts).map((count: TReactionCount) => {
			return {
				...count,
				hasReacted: currentUserIdStr ? count.users.includes(currentUserIdStr) : false,
			};
		});

		return NextResponse.json({ reactions: reactionCountsArray }, { status: 200 });
	} catch (error) {
		console.error("Error fetching reactions:", error);
		return NextResponse.json({ error: "Failed to fetch reactions" }, { status: 500 });
	}
}
