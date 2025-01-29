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
						<div>
							<video controls width="600">
								<source src={clip.videoUrl} type="video/mp4" />
								Your browser does not support the video tag.
							</video>
						</div>
						<p>{clip.description}</p>
						<p>Created: {clip.createdAt.toString()}</p>
						<p>Updated: {clip.updatedAt.toString()}</p>
					</Link>
				))}
			</div>
		</div>
	);
}
