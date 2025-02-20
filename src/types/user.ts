export type TUser = {
	_id: string;
	name: string;
	email: string;
	image?: string;
	provider: "google" | "discord";
	createdAt: Date;
	updatedAt: Date;
};

export type TNewUser = Omit<TUser, "_id" | "createdAt" | "updatedAt">;
