import { getClips } from "@/lib/clips/fetchClips";
import { TClip } from "@/types/clip";
import Clip from "./Clip";

export default async function Feed() {
	let clips: TClip[] = [];

	try {
		clips = await getClips();
	} catch {
		alert("Error fetching clips");
	}

	return (
		<div>
			<p>Feed page</p>
			<div>
				{clips.length > 0 ? (
					clips.map((clip) => <Clip key={clip._id} clip={clip} />)
				) : (
					<p>No clips available.</p>
				)}
			</div>
		</div>
	);
}
