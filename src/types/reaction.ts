import { TUser } from "./user";

export type TReaction = {
	_id: string;
	user: TUser;
	clip: string;
	emoji: string;
	createdAt: Date;
	updatedAt: Date;
};

export type TReactionCount = {
	emoji: string;
	count: number;
	users: string[]; // Array of user IDs who reacted with this emoji
	hasReacted?: boolean;
};

export type TNewReaction = {
	user: string;
	clip: string;
	emoji: string;
};
