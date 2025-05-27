"use client";
import React, { useState, useEffect, useCallback } from "react";
import { TReactionCount } from "@/types/reaction";
import { fetchReactions, toggleReaction } from "@/lib/reactions/fetchReactions";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

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
	const [hasInitialized, setHasInitialized] = useState(false);

	const t = useTranslations("ReactionBarComponent");

	function handleShowEmojiPicker(e: React.MouseEvent<HTMLButtonElement>) {
		setShowEmojiPicker((prev) => !prev);
	}

	// Update reactions with client-side session information
	const updateReactionsWithClientSession = useCallback(
		(reactionData: TReactionCount[]) => {
			if (!session?.user?._id) return;

			const userId = session.user._id.toString();
			const updatedReactions = reactionData.map((reaction) => ({
				...reaction,
				hasReacted: reaction.users.includes(userId),
			}));

			setReactions(updatedReactions);
		},
		[session]
	);

	const loadReactions = useCallback(async () => {
		setIsLoading(true);
		try {
			const fetchedReactions = await fetchReactions(clipId);
			setReactions(fetchedReactions);
		} catch (error) {
			console.error("Failed to load reactions:", error);
		} finally {
			setIsLoading(false);
		}
	}, [clipId]);

	useEffect(() => {
		if (hasInitialized) return;

		if (initialReactions.length === 0) {
			loadReactions();
			setHasInitialized(true);
		} else if (session?.user?._id) {
			updateReactionsWithClientSession(initialReactions);
			setHasInitialized(true);
		}
	}, [
		clipId,
		initialReactions,
		session,
		reactions.length,
		loadReactions,
		updateReactionsWithClientSession,
		hasInitialized,
	]);

	const handleReaction = async (e: React.MouseEvent<HTMLButtonElement>, emoji: string) => {
		if (!session || !session.user?._id) {
			// If not logged in, prompt to log in NOTE: This should be handled by the UI later..
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
		return <div className="mt-2 text-sm text-gray-500">{t("loading")}</div>;
	}

	return (
		<div className="z-10 cursor-default" onClick={(e) => e.stopPropagation()}>
			<div className="flex flex-wrap gap-2">
				{/* Display existing reactions */}
				{reactions.map((reaction) => (
					<button
						key={reaction.emoji}
						onClick={(e) => handleReaction(e, reaction.emoji)}
						className={`flex items-center rounded-full px-3 py-1 text-sm text-stone-200 shadow duration-300 ease-in-out hover:cursor-pointer hover:shadow-lg hover:brightness-90 ${
							reaction.hasReacted ? "bg-stone-700" : "bg-stone-800 text-stone-200"
						}`}
					>
						<span className="mr-1">{reaction.emoji}</span>
						<span>{reaction.count}</span>
					</button>
				))}

				{/* Add reaction button */}
				<button
					onClick={handleShowEmojiPicker}
					className="flex items-center rounded-full bg-stone-800 px-3 py-1 text-sm text-stone-200 shadow duration-300 ease-in-out hover:cursor-pointer hover:shadow-lg hover:brightness-90"
				>
					<span className="mr-1">+</span>
					<span>{t("addReaction")}</span>
				</button>
			</div>

			{/* Emoji picker */}
			{showEmojiPicker && (
				<div className="z-10 mt-2 flex flex-wrap gap-2 rounded-full bg-stone-800 px-2 py-1 shadow-lg duration-300 ease-in-out select-none hover:cursor-default hover:shadow-xl">
					{COMMON_EMOJIS.map((emoji) => (
						<button
							key={emoji}
							onClick={(e) => handleReaction(e, emoji)}
							className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-transform duration-100 hover:scale-125"
						>
							<span className="text-2xl">{emoji}</span>
						</button>
					))}
				</div>
			)}
		</div>
	);
}
