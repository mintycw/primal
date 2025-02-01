import mongoose from "mongoose";
import { MongooseCache } from "../db/mongodb";

declare global {
	interface MongooseCache {
		conn: Mongoose | null;
		promise: Promise<Mongoose> | null;
	}
	namespace NodeJS {
		interface Global {
			mongooseCache?: MongooseCache;
		}
	}
}
