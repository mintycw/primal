"use client";

import { deleteClip } from "@/lib/clips/deleteClips";
import { TClip } from "@/types/clip";
import Clip from "@/components/clips/Clip";
import { useTranslations } from "next-intl";

type ClipDetailsProps = {
	clip: TClip;
};

export default function ClipDetails({ clip }: ClipDetailsProps) {
	const t = useTranslations("ClipComponent");

	function handleDelete() {
		deleteClip(clip._id, t);
	}

	return <Clip clip={clip} handleDelete={handleDelete} />;
}
