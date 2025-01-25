import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
	name: string;
	email: string;
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
});

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
