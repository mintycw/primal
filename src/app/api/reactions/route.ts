import { checkMongodbConnection } from "@/lib/db/checkMongodbConnection";
import { Reaction } from "@/models/Reaction";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";

// Get all reactions (mainly for testing)
export async function GET() {
	try {
		await checkMongodbConnection();

		const reactions = await Reaction.find()
			.populate("user", "name image")
			.populate("clip", "title");

		return NextResponse.json(reactions);
	} catch (error) {
		console.error("Error fetching reactions:", error);
		return NextResponse.json({ error: "Failed to fetch reactions" }, { status: 500 });
	}
}

// Add a new reaction
export async function POST(req: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user?._id) {
			return NextResponse.json({ error: "User is not authenticated" }, { status: 401 });
		}

		await checkMongodbConnection();

		const { clipId, emoji } = await req.json();

		if (!clipId || !emoji) {
			return NextResponse.json({ error: "Clip ID and emoji are required" }, { status: 400 });
		}

		// Check if the user has already reacted with this emoji
		const existingReaction = await Reaction.findOne({
			user: session.user._id,
			clip: clipId,
			emoji: emoji,
		});

		if (existingReaction) {
			// If the reaction already exists, remove it (toggle behavior)
			await Reaction.findByIdAndDelete(existingReaction._id);
			return NextResponse.json({
				message: "Reaction removed",
				action: "removed",
				emoji,
			});
		}

		// Create a new reaction
		const newReaction = new Reaction({
			user: session.user._id,
			clip: clipId,
			emoji,
		});

		await newReaction.save();

		return NextResponse.json(
			{
				message: "Reaction added",
				action: "added",
				reactionId: newReaction._id,
				emoji,
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error adding reaction:", error);
		return NextResponse.json({ error: "Failed to add reaction" }, { status: 500 });
	}
}
