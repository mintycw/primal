import mongoose, { Mongoose, ConnectOptions } from "mongoose";

// Get the URI of the local database from the environment
const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
	throw new Error("Please define the MONGODB_URI environment variable.");
}

// Define a type for the global cached connection
interface MongooseCache {
	conn: Mongoose | null;
	promise: Promise<Mongoose> | null;
}

// Add the cache to the global object (to persist it between hot reloads in development)
let cached: MongooseCache = (global as any).mongooseCache || { conn: null, promise: null };

if (!(global as any).mongooseCache) {
	(global as any).mongooseCache = cached;
}

export async function connectToDatabase(): Promise<Mongoose> {
	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {
		const options: ConnectOptions = {};
		cached.promise = mongoose.connect(MONGODB_URI, options);
	}

	cached.conn = await cached.promise;
	return cached.conn;
}
