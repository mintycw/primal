"use client";

import { TClip } from "@/types/clip";
import Clip from "@/components/clips/Clip";
import deleteClip from "@/lib/clips/deleteClips";

type ClipDetailsProps = {
	clip: TClip;
};

export default function ClipDetails({ clip }: ClipDetailsProps) {
	function handleDelete() {
		deleteClip({ id: clip._id });
	}

	return <Clip clip={clip} handleDelete={handleDelete} />;
}
