import { getClips } from "@/lib/clips/fetchClips";
import { TClip } from "@/types/clip";
import Link from "next/link";

export default async function Feed() {
	const clips: TClip[] = await getClips();

	return (
		<div>
			<p>Feed page</p>
			<div>
				{clips.map((clip) => (
					<Link
						href={`/${clip._id}`}
						key={clip._id}
						className="mb-2 block h-full w-full bg-gray-700 p-4 last:mb-0"
					>
						<h2>{clip.title}</h2>
						<p>{clip.description}</p>
						<p>Created: {clip.createdAt.toString()}</p>
						<p>Updated: {clip.updatedAt.toString()}</p>
					</Link>
				))}
			</div>
		</div>
	);
}
