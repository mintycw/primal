"use client";
import React, { useState, useEffect } from "react";
import { TReactionCount } from "@/types/reaction";
import { fetchReactions, toggleReaction } from "@/lib/reactions/fetchReactions";
import { useSession } from "next-auth/react";

const COMMON_EMOJIS = ["🔥", "❤️", "😂", "😮", "👏", "💀"];

type ReactionBarProps = {
	clipId: string;
	initialReactions?: TReactionCount[];
};

export default function ReactionBar({ clipId, initialReactions = [] }: ReactionBarProps) {
	const { data: session } = useSession();
	const [reactions, setReactions] = useState<TReactionCount[]>(initialReactions);
	const [isLoading, setIsLoading] = useState<boolean>(initialReactions.length === 0);
	const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

	// Fetch reactions when component mounts if no initial reactions provided
	useEffect(() => {
		if (initialReactions.length === 0) {
			loadReactions();
		}
	}, [clipId, initialReactions]);

	const loadReactions = async () => {
		setIsLoading(true);
		try {
			const fetchedReactions = await fetchReactions(clipId);
			setReactions(fetchedReactions);
		} catch (error) {
			console.error("Failed to load reactions:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleReaction = async (emoji: string) => {
		if (!session || !session.user?._id) {
			// If not logged in, prompt to log in
			alert("Please log in to react to clips");
			return;
		}

		const userId = session.user._id;

		try {
			const result = await toggleReaction(clipId, emoji);

			// Update the local state based on the action
			if (result.action === "added") {
				// Check if this emoji already exists in reactions
				const existingReactionIndex = reactions.findIndex((r) => r.emoji === emoji);

				if (existingReactionIndex >= 0) {
					// Update existing reaction
					const updatedReactions = [...reactions];
					updatedReactions[existingReactionIndex] = {
						...updatedReactions[existingReactionIndex],
						count: updatedReactions[existingReactionIndex].count + 1,
						hasReacted: true,
						users: [...updatedReactions[existingReactionIndex].users, userId],
					};
					setReactions(updatedReactions);
				} else {
					// Add new reaction
					setReactions([
						...reactions,
						{
							emoji,
							count: 1,
							hasReacted: true,
							users: [userId],
						},
					]);
				}
			} else if (result.action === "removed") {
				// Find and update the reaction
				const existingReactionIndex = reactions.findIndex((r) => r.emoji === emoji);

				if (existingReactionIndex >= 0) {
					const updatedReactions = [...reactions];
					const currentReaction = updatedReactions[existingReactionIndex];

					// If count is 1, remove the reaction entirely
					if (currentReaction.count === 1) {
						updatedReactions.splice(existingReactionIndex, 1);
					} else {
						// Otherwise decrement the count
						updatedReactions[existingReactionIndex] = {
							...currentReaction,
							count: currentReaction.count - 1,
							hasReacted: false,
							users: currentReaction.users.filter((id) => id !== userId),
						};
					}

					setReactions(updatedReactions);
				}
			}

			// Hide emoji picker after selection
			setShowEmojiPicker(false);
		} catch (error) {
			console.error("Error toggling reaction:", error);
		}
	};

	if (isLoading) {
		return <div className="mt-2 text-sm text-gray-500">Loading reactions...</div>;
	}

	return (
		<div className="mt-3 border-t border-gray-700 pt-2">
			<div className="flex flex-wrap gap-2">
				{/* Display existing reactions */}
				{reactions.map((reaction) => (
					<button
						key={reaction.emoji}
						onClick={() => handleReaction(reaction.emoji)}
						className={`flex items-center rounded-full px-3 py-1 text-sm ${
							reaction.hasReacted
								? "bg-blue-600 text-white"
								: "bg-gray-800 text-gray-300 hover:bg-gray-700"
						}`}
					>
						<span className="mr-1">{reaction.emoji}</span>
						<span>{reaction.count}</span>
					</button>
				))}

				{/* Add reaction button */}
				<button
					onClick={() => setShowEmojiPicker(!showEmojiPicker)}
					className="flex items-center rounded-full bg-gray-800 px-3 py-1 text-sm text-gray-300 hover:bg-gray-700"
				>
					<span className="mr-1">+</span>
					<span>Add Reaction</span>
				</button>
			</div>

			{/* Emoji picker */}
			{showEmojiPicker && (
				<div className="mt-2 flex flex-wrap gap-2 rounded-md bg-gray-800 p-2">
					{COMMON_EMOJIS.map((emoji) => (
						<button
							key={emoji}
							onClick={() => handleReaction(emoji)}
							className="cursor-pointer text-xl hover:scale-125"
						>
							{emoji}
						</button>
					))}
				</div>
			)}
		</div>
	);
}
