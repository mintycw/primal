import { TReactionCount } from "@/types/reaction";

/**
 * ID of the clip to fetch reactions for
 * @param clipId
 * @returns An array of reaction counts
 */
export async function fetchReactions(clipId: string): Promise<TReactionCount[]> {
	try {
		const response = await fetch(`/api/clips/${clipId}/reactions`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error(`Error fetching reactions: ${response.statusText}`);
		}

		const data = await response.json();
		return data.reactions || [];
	} catch (error) {
		console.error("Error fetching reactions:", error);
		return [];
	}
}

/**
 * Adds or removes a reaction to/from a clip
 * @param clipId The ID of the clip to react to
 * @param emoji The emoji to react with
 * @returns The result of the reaction operation
 */
export async function toggleReaction(
	clipId: string,
	emoji: string
): Promise<{ action: "added" | "removed"; emoji: string }> {
	try {
		const response = await fetch("/api/reactions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ clipId, emoji }),
		});

		if (!response.ok) {
			throw new Error(`Error toggling reaction: ${response.statusText}`);
		}

		const data = await response.json();
		return {
			action: data.action,
			emoji: data.emoji,
		};
	} catch (error) {
		console.error("Error toggling reaction:", error);
		throw error;
	}
}
