"use client";

import { deleteClip } from "@/lib/clips/deleteClips";
import { TClip } from "@/types/clip";
import Link from "next/link";

interface ClipDetailsProps {
	clip: TClip;
}

export default function ClipDetails({ clip }: ClipDetailsProps) {
	function handleDelete() {
		deleteClip(clip._id);
	}
	console.log(clip.videoUrl);
	return (
		<div>
			<h1>{clip.title}</h1>
			<p>{clip.description}</p>
			<video controls width="600">
				<source src={clip.videoUrl} type="video/mp4" />
				Your browser does not support the video tag.
			</video>
			<p>Created: {clip.createdAt.toString()}</p>
			<p>Updated: {clip.updatedAt.toString()}</p>
			<button onClick={handleDelete} className="rounded-sm bg-red-500 px-4 py-2 text-white">
				Delete
			</button>
			<Link
				className="rounded-sm bg-green-500 px-4 py-2 text-white"
				href={`${clip._id}/edit`}
			>
				EDIT
			</Link>
		</div>
	);
}
