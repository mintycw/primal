import { authOptions } from "@/lib/auth/authOptions";
import ClipClient from "./ClipClient";
import { TClip } from "@/types/clip";
import { getServerSession } from "next-auth";
import { useTranslations } from "next-intl";

type ClipProps = {
	clip: TClip;
	handleDelete?: () => void;
};

export default function Clip({ clip, handleDelete }: ClipProps) {
	const t = useTranslations("ClipComponent");
	const session = getServerSession(authOptions);
	if (!clip) return <div>{t("clipNotFound")}</div>;

	return (
		<ClipClient
			clip={clip}
			editable={!!handleDelete}
			handleDelete={handleDelete}
			session={session}
		/>
	);
}
