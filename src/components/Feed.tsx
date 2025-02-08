import { getClips } from "@/lib/clips/fetchClips";
import { TClip } from "@/types/clip";
import Link from "next/link";
import Clip from "./Clip";

export default async function Feed() {
	const clips: TClip[] = await getClips();

	return (
		<div>
			<p>Feed page</p>
			<div>
				{clips.map((clip) => (
					<Clip key={clip._id} clip={clip} />
				))}
			</div>
		</div>
	);
}
