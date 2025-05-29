"use client";

import { putClip } from "@/lib/clips/postClip";
import { TClip, TClipUpdate } from "@/types/clip";
import { Session } from "next-auth";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface EditClipProps {
	session: Session | null;
	clip: TClip;
}

export default function EditClipInfo({ session, clip }: EditClipProps) {
	const router = useRouter();

	const [newTitle, setNewTitle] = useState(clip.title);
	const [newDescription, setNewDescription] = useState(clip.description);

	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const t = useTranslations("ClipComponent");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!newTitle || !newDescription) {
			alert("Both title and description are required");
			return;
		}

		const editClip: TClipUpdate = {
			title: newTitle,
			description: newDescription,
		};

		setLoading(true);
		setError(null);

		const editedClip = await putClip(clip._id, editClip);

		if (!editedClip) {
			alert("Failed to update clip. Please try again.");
		} else {
			router.push(`/${editedClip._id}`);
		}

		setLoading(false);
	};

	return session ? (
		<form
			onSubmit={handleSubmit}
			className={`mb-4 rounded bg-stone-500 p-2 shadow-lg duration-300 ease-in-out last:mb-0 hover:shadow-xl`}
		>
			<div className="flex items-center">
				<div className="relative mr-2 size-12 cursor-pointer p-1">
					<Image
						src={session.user?.image ?? ""}
						alt="Profile Picture"
						referrerPolicy="no-referrer"
						fill
						className="rounded-full border-2 border-stone-300 object-cover"
					/>
				</div>
				<div className="cursor-pointer">
					<span className="text-base font-semibold">{session.user?.name}</span>
				</div>
			</div>

			<hr className="my-2 border-t border-stone-400" />

			<div className="mb-2 px-2">
				<div className="mb-2">
					<input
						type="text"
						value={newTitle}
						onChange={(e) => setNewTitle(e.target.value)}
						required
						placeholder={t("editClip.title")}
						className="w-full rounded-md bg-stone-600 p-2 text-lg font-semibold shadow-lg hover:scale-[1.01]"
						disabled={loading}
					/>
				</div>
				<div>
					<textarea
						value={newDescription}
						onChange={(e) => setNewDescription(e.target.value)}
						placeholder={t("editClip.description")}
						disabled={loading}
						className="min-h-20 w-full rounded-md bg-stone-600 p-2 text-sm shadow-lg hover:scale-[1.01]"
					/>
				</div>
			</div>

			<div>
				<video
					controls
					onClick={(e) => e.stopPropagation()}
					className="mb-2 max-w-2xl rounded-md shadow-lg hover:scale-[1.01]"
				>
					<source src={clip.videoUrl} type="video/mp4" />
					{t("videoNotSupported")}
				</video>
			</div>

			<hr className="my-2 border-t border-stone-400" />

			<div className="mt-2 flex justify-end gap-2">
				<p className="flex items-center justify-center text-sm">
					{error && <div style={{ color: "red" }}>{error}</div>}
				</p>
				<button
					type="submit"
					disabled={loading}
					className="flex h-9 w-24 items-center justify-center truncate rounded-sm border-2 border-green-600 bg-stone-500 font-semibold shadow duration-300 hover:border-4 hover:shadow-lg hover:brightness-90"
				>
					<span className="w-full truncate px-1 text-center">
						{loading ? t("editClip.updatingClip") : t("editClip.updateClipButton")}
					</span>
				</button>
			</div>
		</form>
	) : (
		<div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
			<div className="mb-4 rounded bg-stone-500 p-2 shadow-lg duration-300 ease-in-out last:mb-0 hover:shadow-xl">
				<h1>{t("editClip.loginRequired")}</h1>
			</div>
		</div>
	);
}
