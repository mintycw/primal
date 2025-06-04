import React from "react";
import { RouteParams } from "@/types/param";
import { TClip } from "@/types/clip";
import { getUserClips } from "@/lib/clips/fetchClips";
import Clip from "@/components/clips/Clip";
import { TUser } from "@/types/user";
import { getUser } from "@/lib/user/fetchUser";
import { authOptions } from "@/lib/auth/authOptions";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";

export default async function Page({ params }: RouteParams<{ id: string }>) {
	const { id } = await params;
	const clips: TClip[] | null = await getUserClips(id);
	const user: TUser | null = await getUser(id);
	const session = await getServerSession(authOptions);
	const t = await getTranslations("UserPage");

	return (
		<div className="flex min-h-screen flex-col items-center justify-start gap-4 p-4">
			<h1>
				{session?.user._id === user?._id
					? t("yourClips")
					: user
						? t("usersClip", { name: user?.name })
						: t("userNotFound")}
			</h1>
			{/* Loading state */}
			{!user && <span>{t("loadingClips")}</span>}
			{/* Error fetching user or clips */}
			{user && clips === null && (
				<span className="text-red-500">{t("errorFetchingClips")}</span>
			)}
			{/* No clips */}
			{user && clips && clips.length === 0 && <span>{t("noClipsFound")}</span>}
			{/* Clips list */}
			{user && clips && clips.length > 0 && (
				<ul>
					{clips.map((clip) => (
						<Clip key={clip._id} clip={clip} />
					))}
				</ul>
			)}
		</div>
	);
}
