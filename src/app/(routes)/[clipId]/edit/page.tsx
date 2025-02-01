import { getClip } from "@/lib/clips/fetchClips";
import { TClip } from "@/types/clip";

import EditClipInfo from "./EditClipInfo";

export default async function EditClip({
	params,
	searchParams,
}: {
	params: { clipId: string };
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	const { clipId } = params;
	const { query } = searchParams;

	// Fetch the clip data
	const clip: TClip | null = await getClip(clipId);

	if (!clip) {
		return <div>Clip not found</div>;
	}

	return (
		<div>
			<EditClipInfo id={clip._id} title={clip.title} description={clip.description || ""} />
			<p>Search Query: {query}</p>
		</div>
	);
}
