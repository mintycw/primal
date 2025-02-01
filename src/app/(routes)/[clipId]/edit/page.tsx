import { getClip } from "@/lib/clips/fetchClips";
import { TClip } from "@/types/clip";
import { headers } from "next/headers";

import EditClipInfo from "./EditClipInfo";

export type paramsType = Promise<{ clipId: string }>;

export default async function EditClip(props: { params: paramsType }) {
	const { clipId } = await props.params;

	const headersList = await headers();
	const userAgent = headersList.get("user-agent");

	// Fetch the clip data
	const clip: TClip | null = await getClip(clipId);

	if (!clip) {
		return <div>Clip not found</div>;
	}

	return (
		<div>
			<EditClipInfo id={clip._id} title={clip.title} description={clip.description || ""} />
			<p>User Agent: {userAgent}</p>
		</div>
	);
}
