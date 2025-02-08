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

export type TNewClip = Omit<
	TClip,
	"_id" | "clipId" | "uploadUrl" | "videoUrl" | "createdAt" | "updatedAt" | "objectName"
>;

export type TClipUpdate = {
	title: string;
	description: string;
};
