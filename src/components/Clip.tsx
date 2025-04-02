import { TClip } from "@/types/clip";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import ReactionBar from "./ReactionBar";

type ClipProps = {
	clip: TClip;
	handleDelete?: () => void;
};

export default function Clip({ clip, handleDelete }: ClipProps) {
	if (!clip) {
		return <div>Clip not found</div>;
	}

	const content = (
		<div className="block bg-slate-900 p-2">
			<div className="items-row flex">
				<h1>{clip.user?.name}</h1>
				<div className="relative size-10 p-1">
					<Image
						src={clip.user?.image ?? ""}
						alt="Profile Picture"
						referrerPolicy="no-referrer"
						fill
						className="rounded-full"
					/>
				</div>
			</div>
			<h1>{clip.title}</h1>
			<p>{clip.description}</p>
			<video controls width="600">
				<source src={clip.videoUrl} type="video/mp4" />
				Your browser does not support the video tag.
			</video>
			<p>Created: {clip.createdAt.toString()}</p>
			<p>Updated: {clip.updatedAt.toString()}</p>

			{/* Reaction Bar */}
			<ReactionBar clipId={clip._id} initialReactions={clip.reactions} />

			{handleDelete && (
				<>
					<button
						onClick={handleDelete}
						className="rounded-sm bg-red-500 px-4 py-2 text-white"
					>
						Delete
					</button>
					<div>
						<Link
							className="rounded-sm bg-green-500 px-4 py-2 text-white"
							href={`${clip._id}/edit`}
						>
							EDIT
						</Link>
					</div>
				</>
			)}
		</div>
	);

	return handleDelete ? <div>{content}</div> : <Link href={`/${clip._id}`}>{content}</Link>;
}
