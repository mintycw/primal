import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReaction extends Document {
	user: mongoose.Types.ObjectId;
	clip: mongoose.Types.ObjectId;
	emoji: string;
	createdAt: Date;
	updatedAt: Date;
}

const ReactionSchema = new Schema<IReaction>(
	{
		user: { type: Schema.Types.ObjectId, ref: "User", required: true },
		clip: { type: Schema.Types.ObjectId, ref: "Clip", required: true },
		emoji: { type: String, required: true },
	},
	{
		timestamps: true,
	}
);

// Create a compound index to ensure a user can only react once with a specific emoji to a clip
ReactionSchema.index({ user: 1, clip: 1, emoji: 1 }, { unique: true });

// Compile model from schema
export const Reaction: Model<IReaction> =
	mongoose.models.Reaction || mongoose.model("Reaction", ReactionSchema);
