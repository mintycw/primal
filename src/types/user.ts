export enum AuthProvider {
	google = "google",
	discord = "discord",
}

export type TUser = {
	_id: string;
	name: string;
	email: string;
	image?: string;
	provider: AuthProvider;
	createdAt: Date;
	updatedAt: Date;
};

export type TNewUser = Omit<TUser, "_id" | "createdAt" | "updatedAt">;
