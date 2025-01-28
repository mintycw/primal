import mongoose, { Schema, Document, Model } from "mongoose";

export interface IClip extends Document {
	title: string;
	description: string;
	signedUrl: string;
	objectName: string;
	createdAt: Date;
	updatedAt: Date;
}

const ClipSchema = new Schema<IClip>(
	{
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		signedUrl: {
			type: String,
			required: true,
		},
		objectName: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);
// Compile model from schema even if already exists or not
export const Clip: Model<IClip> = mongoose.models.Clip || mongoose.model("Clip", ClipSchema);
