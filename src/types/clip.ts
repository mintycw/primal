import { TUser } from "./user";

export type TClip = {
	_id: string;
	user: TUser;
	clipId: string;
	title: string;
	content?: string;
	description?: string;
	uploadUrl: string;
	videoUrl: string;
	objectName: string;
	createdAt: Date;
	updatedAt: Date;
};

export type TNewClip = {
	user: string;
	title: string;
	content: string;
	description: string;
};

export type TClipUpdate = Omit<TNewClip, "user" | "content">;
