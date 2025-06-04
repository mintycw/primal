import { TUser } from "./user";
import { TReactionCount } from "./reaction";

export type TClip = {
	_id: string;
	user: TUser;
	clipId: string;
	title: string;
	content?: string;
	description?: string;
	videoUrl: string;
	objectName: string;
	reactions?: TReactionCount[];
	createdAt: Date;
	updatedAt: Date;
};

export type TNewClip = {
	user: string;
	title: string;
	content: string;
	description?: string;
};

export type TClipUpdate = Omit<TNewClip, "user" | "content">;
