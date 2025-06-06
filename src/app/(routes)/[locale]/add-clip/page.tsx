import { authOptions } from "@/lib/auth/authOptions";
import { getServerSession, Session } from "next-auth";
import React from "react";
import PostClipForm from "./PostClipForm";

export default async function CreateClip() {
	const session: Session | null = await getServerSession(authOptions);

	return (
		<div className="flex min-h-screen flex-col items-center justify-start gap-4 p-4">
			<PostClipForm session={session} />
		</div>
	);
}
