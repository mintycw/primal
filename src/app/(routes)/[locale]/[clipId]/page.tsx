import { getClip } from "@/lib/clips/fetchClips";
import { TClip } from "@/types/clip";
import { RouteParams } from "@/types/param";
import ClipDetails from "./ClipDetails";

export default async function Clip({ params }: RouteParams<{ clipId: string }>) {
	const { clipId } = await params;

	if (!clipId) {
		return <div>Page not found</div>;
	}

	const clip: TClip | null = await getClip(clipId);

	if (!clip) {
		return <div>Clip not found</div>;
	}

	return <ClipDetails clip={clip} />;
}
