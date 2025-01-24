import mongoose, { Schema } from "mongoose";

const ClipSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
            unique: true,
        },
        content: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);
// Compile model from schema even if already exists or not
const Clip = mongoose.models.Clip || mongoose.model("Clip", ClipSchema);

export default Clip;