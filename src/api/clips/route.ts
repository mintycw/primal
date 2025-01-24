import { connectToDatabase } from "@/lib/mongodb";

export async function POST(request) {
    const { title, description, content } = await request.json();
    await connectToDatabase();
}