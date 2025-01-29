import mongoose, { Schema, Document, Model } from "mongoose";
import { TClip } from "@/types/clip";

type ClipDocument = Omit<TClip, "_id"> & Document;

const ClipSchema = new Schema<ClipDocument>(
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
export const Clip: Model<ClipDocument> = mongoose.models.Clip || mongoose.model("Clip", ClipSchema);
