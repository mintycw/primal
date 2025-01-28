export type TClip = {
	_id: string;
	title: string;
	content?: string; // OPTIONAL BUT ONLY TEMPORARILY
	description?: string;
	createdAt: Date;
	updatedAt: Date;
};

export type TNewClip = Omit<TClip, "_id" | "createdAt" | "updatedAt">;
