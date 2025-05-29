import { getClip } from "@/lib/clips/fetchClips";
import { TClip } from "@/types/clip";
import { RouteParams } from "@/types/param";
import EditClipInfo from "./EditClipInfo";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";

export default async function EditClip({ params }: RouteParams<{ clipId: string }>) {
	const { clipId } = await params;
	const session: Session | null = await getServerSession(authOptions);

	if (!clipId) {
		return <div>Clip ID is missing</div>;
	}

	const clip: TClip | null = await getClip(clipId);

	if (!clip) {
		return <div>Clip not found</div>;
	}

	return (
		<div className="flex min-h-screen flex-col items-center justify-start gap-4 p-4">
			<EditClipInfo session={session} clip={clip} />
		</div>
	);
}
