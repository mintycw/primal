import { getClip } from "@/lib/clips/fetchClips";
import { TClip } from "@/types/clip";

import EditClipInfo from "./EditClipInfo";

type EditClipProps = {
	params: {
		clipId: string;
	};
};

export default async function EditClip({ params }: EditClipProps) {
	const { clipId } = params;

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
