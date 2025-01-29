export type TClip = {
	_id: string;
	title: string;
	content?: string;
	description?: string;
	videoUrl: string;
	objectName: string;
	createdAt: Date;
	updatedAt: Date;
};

export type TNewClip = Omit<TClip, "_id" | "createdAt" | "updatedAt" | "objectName" | "videoUrl">;
