import { getClip } from "@/lib/clips/fetchClips";
import { TClip } from "@/types/clip";
import { RouteParams } from "@/types/param";
import ClipDetails from "./ClipDetails";
import { getTranslations } from "next-intl/server";

export default async function Clip({ params }: RouteParams<{ clipId: string }>) {
	const { clipId } = await params;

	const t = await getTranslations("ClipPage");

	if (!clipId) {
		return <div>{t("pageNotFound")}</div>;
	}

	const clip: TClip | null = await getClip(clipId);

	if (!clip) {
		return <div>{t("clipNotFound")}</div>;
	}

	return (
		<div className="flex min-h-screen flex-col items-center justify-start gap-4 p-4">
			<ClipDetails clip={clip} />
		</div>
	);
}
