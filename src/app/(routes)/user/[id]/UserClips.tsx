import { TClip } from "@/types/clip";
import { getUserClips } from "@/lib/clips/fetchClips";
import React from "react";
import Link from "next/link";
import Clip from "@/components/Clip";

export default async function UserClips({ id }: { id: string }) {
	const clips: TClip[] | null = await getUserClips(id);

	return (
		<div>
			<h1>Your Posts</h1>
			{clips.length === 0 ? (
				<p>No posts found.</p>
			) : (
				<ul>
					{clips.map((clip) => (
						<Clip key={clip._id} clip={clip} />
					))}
				</ul>
			)}
		</div>
	);
}
