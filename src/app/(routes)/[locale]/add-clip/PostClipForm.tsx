"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { postClip } from "@/lib/clips/postClip";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Session } from "next-auth";

export default function PostClipForm({ session }: { session: Session | null }) {
	const router = useRouter();
	const MAX_FILE_SIZE = 500 * Math.pow(1024, 2); // 500 MB

	const [title, setTitle] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const [content, setContent] = useState<File | null>(null);

	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const t = useTranslations("ClipComponent");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!title || !content) {
			alert("Title field and video clip is required");
			return;
		}
		if (content.size > MAX_FILE_SIZE) {
			alert("File size exceeds the limit of 1 GB. Consider shortening the video.");
			return;
		}

		const formData = new FormData();
		formData.append("title", title);
		formData.append("description", description);
		formData.append("content", content);

		setLoading(true);
		setError(null);

		const createdClip = await postClip(formData, content);
		if (!createdClip) {
			setError("Failed to create clip. Please try again.");
		} else {
			router.push(`/${createdClip.clipId}`);
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
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						required
						placeholder={t("createClip.title")}
						className="w-full rounded-md bg-stone-600 p-2 text-lg font-semibold shadow-lg hover:scale-[1.01]"
						disabled={loading}
					/>
				</div>
				<div>
					<textarea
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder={t("createClip.description")}
						disabled={loading}
						className="min-h-20 w-full rounded-md bg-stone-600 p-2 text-sm shadow-lg hover:scale-[1.01]"
					/>
				</div>
			</div>

			<div>
				<label htmlFor="upload" className="px-2 text-sm font-semibold">
					{t("uploadClipLabel")}
				</label>
				<input
					type="file"
					id="upload"
					accept="video/*"
					onChange={(e) => {
						if (e.target.files && e.target.files[0]) {
							const file = e.target.files[0];
							setContent(file);
						}
					}}
					required
					className="mb-2 flex h-60 max-w-2xl flex-col items-start justify-start rounded-md bg-stone-600 p-4 shadow-lg hover:scale-[1.01]"
					disabled={loading}
				/>
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
						{loading ? t("createClip.creatingClip") : t("createClip.createClipButton")}
					</span>
				</button>
			</div>
		</form>
	) : (
		<div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
			<div className="mb-4 rounded bg-stone-500 p-2 shadow-lg duration-300 ease-in-out last:mb-0 hover:shadow-xl">
				<h1>{t("createClip.loginRequired")}</h1>
			</div>
		</div>
	);
}
