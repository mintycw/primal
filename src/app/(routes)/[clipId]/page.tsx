import { getClip } from "@/lib/clips/fetchClips";
import { TClip } from "@/types/clip";
//import { RouteParams } from "@/types/param";
import ClipDetails from "./ClipDetails";

type tParams = Promise<{ clipId: string }>;

export default async function Clip({ params }: { params: tParams }) {
	const { clipId } = await params;

	const clip: TClip | null = await getClip(clipId);

	if (!clip) {
		return <div>Clip not found</div>;
	}

	return <ClipDetails clip={clip} />;
}
