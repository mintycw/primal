"use client";

import { deleteClip } from "@/lib/clips/deleteClips";
import { TClip } from "@/types/clip";
import Clip from "@/components/clips/Clip";

type ClipDetailsProps = {
	clip: TClip;
};

export default function ClipDetails({ clip }: ClipDetailsProps) {
	function handleDelete() {
		deleteClip(clip._id);
	}

	return <Clip clip={clip} handleDelete={handleDelete} />;
}
