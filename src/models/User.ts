import mongoose, { Schema, Document, Model } from "mongoose";
import { TNewUser } from "@/types/user";

type UserDocument = Omit<TNewUser, "_id"> & Document;

const UserSchema = new Schema<UserDocument>(
	{
		name: { type: String, required: true },
		email: { type: String, required: true },
		image: { type: String },
		provider: { type: String, required: true },
	},
	{ timestamps: true }
);

UserSchema.index({ email: 1, provider: 1 }, { unique: true });

// Compile model from schema even if already exists or not
export const User: Model<UserDocument> = mongoose.models.User || mongoose.model("User", UserSchema);
