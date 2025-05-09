import { connectToDatabase } from "@/lib/db/mongodb";

export async function checkMongodbConnection() {
	try {
		await connectToDatabase();
	} catch {
		throw new Error("Database connection failed. Is it offline?");
	}
}
