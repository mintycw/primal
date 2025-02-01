import { getClip } from "@/lib/clips/fetchClips";
import { TClip } from "@/types/clip";
//import { RouteParams } from "@/types/param";

type tParams = Promise<{ clipId: string }>;

import EditClipInfo from "./EditClipInfo";

export default async function EditClip({ params }: { params: tParams }) {
	const { clipId } = await params;

	if (!clipId) {
		return <div>Clip ID is missing</div>;
	}

	const clip: TClip | null = await getClip(clipId);

	if (!clip) {
		return <div>Clip not found</div>;
	}

	return (
		<div>
			<EditClipInfo id={clip._id} title={clip.title} description={clip.description || ""} />
		</div>
	);
}
