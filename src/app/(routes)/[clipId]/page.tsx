import { getClip } from "@/lib/clips/fetchClips";
import { TClip } from "@/types/clip";
import { RouteParams } from "@/types/param";
import ClipDetails from "./ClipDetails";

export default async function Clip({ params }: RouteParams<{ clipId: string }>) {
	const resolvedParams = await params;

	if (!resolvedParams || !resolvedParams.clipId) {
		return <div>Clip ID is missing</div>;
	}

	const { clipId } = await resolvedParams;

	const clip: TClip | null = await getClip(clipId);

	if (!clip) {
		return <div>Clip not found</div>;
	}

	return <ClipDetails clip={clip} />;
}
