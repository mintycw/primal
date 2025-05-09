import { checkMongodbConnection } from "@/lib/db/checkMongodbConnection";
import { Clip } from "@/models/Clip";
import { NextResponse } from "next/server";
import { RouteParams } from "@/types/param";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3 from "@/lib/db/s3";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { TReactionCount } from "@/types/reaction";

export async function PUT(req: Request, { params }: RouteParams<{ id: string }>) {
	try {
		await checkMongodbConnection();

		const { id } = await params;

		if (!id) {
			return NextResponse.json({ error: "Missing ID parameter" }, { status: 400 });
		}

		const { title, description } = await req.json();

		if (!title || !description) {
			return NextResponse.json({ error: "Invalid data provided" }, { status: 400 });
		}

		const clip = await Clip.findById(id);

		if (!clip) {
			return NextResponse.json({ error: "Clip not found" }, { status: 404 });
		}

		await Clip.findByIdAndUpdate(id, { title, description });

		return NextResponse.json(clip, { status: 200 });
	} catch (error: unknown) {
		console.error("Error updating clip:", error);
		return NextResponse.json({ error: "Failed to update clip" }, { status: 500 });
	}
}

// Specific clip fetch
export async function GET(req: Request, { params }: RouteParams<{ id: string }>) {
	try {
		await checkMongodbConnection();

		const { id } = await params;

		if (!id) {
			return NextResponse.json({ error: "Missing ID parameter" }, { status: 400 });
		}

		const clip = await Clip.findOne({ _id: id }).populate("user", "name image");

		if (!clip) {
			return NextResponse.json({ error: "Clip not found" }, { status: 404 });
		}

		// Get reactions for this clip
		const { Reaction } = await import("@/models/Reaction");
		const reactions = await Reaction.find({ clip: id }).populate("user", "_id");

		// Get the current user's session to check if they've reacted
		const session = await getServerSession(authOptions);
		const currentUserId = session?.user?._id;

		// Convert currentUserId to string for proper comparison
		const currentUserIdStr = currentUserId ? currentUserId.toString() : null;

		// Group reactions by emoji and count them
		const reactionsByEmoji = reactions.reduce(
			(acc: Record<string, TReactionCount>, reaction) => {
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
			},
			{}
		);

		// Convert to array and add a flag for the current user's reactions
		const reactionCounts = Object.values(reactionsByEmoji).map((count: TReactionCount) => {
			return {
				...count,
				hasReacted: currentUserIdStr ? count.users.includes(currentUserIdStr) : false,
			};
		});

		// Add reactions to the clip object
		const clipWithReactions = {
			...clip.toObject(),
			reactions: reactionCounts,
		};

		return NextResponse.json({ clip: clipWithReactions }, { status: 200 });
	} catch (error: unknown) {
		console.error(error);
		return NextResponse.json({ error: "Failed to fetch clip" }, { status: 500 });
	}
}

export async function DELETE(req: Request, { params }: RouteParams<{ id: string }>) {
	try {
		await checkMongodbConnection();

		const { id } = await params;

		if (!id) {
			return NextResponse.json({ error: "Missing ID parameter" }, { status: 400 });
		}

		const clip = await Clip.findById(id);

		if (!clip) {
			return NextResponse.json({ error: "Clip not found" }, { status: 404 });
		}

		// Delete the video from S3
		const bucketName = process.env.S3_BUCKET;
		const objectName = clip.objectName; // Object name stored in the database

		const deleteCommand = new DeleteObjectCommand({
			Bucket: bucketName,
			Key: objectName, // Path to the video file in S3
		});

		await s3.send(deleteCommand); // Delete the file from S3

		// Delete all reactions associated with this clip
		const { Reaction } = await import("@/models/Reaction");
		await Reaction.deleteMany({ clip: id });

		// Now delete the clip document from MongoDB
		await Clip.findByIdAndDelete(id);

		return NextResponse.json({ message: "Clip deleted" }, { status: 200 });
	} catch (error: unknown) {
		console.error("Error deleting clip:", error);
		return NextResponse.json({ error: "Failed to delete clip" }, { status: 500 });
	}
}
