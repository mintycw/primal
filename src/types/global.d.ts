import mongoose from "mongoose";
import { File } from "multer";
import { IncomingMessage } from "http";

declare global {
	var mongoose: {
		conn: mongoose.Connection | null;
		promise: Promise<typeof mongoose> | null;
	};
}
