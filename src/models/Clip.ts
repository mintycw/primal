import mongoose, { Schema, Document, Model } from "mongoose";
import { TClip } from "@/types/clip";

type ClipDocument = Omit<TClip, "_id"> & Document;

const ClipSchema = new Schema<ClipDocument>(
	{
		user: { type: Schema.Types.ObjectId, ref: "User", required: true },
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: false,
		},
		videoUrl: {
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

ClipSchema.index({ user: 1, createdAt: -1 });

// Compile model from schema even if already exists or not
export const Clip: Model<ClipDocument> = mongoose.models.Clip || mongoose.model("Clip", ClipSchema);
