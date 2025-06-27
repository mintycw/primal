"use client";

import { useRouter } from "next/navigation";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import ReactionBar from "@/components/ReactionBar";
import { TClip } from "@/types/clip";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";

type Props = {
	clip: TClip;
	editable?: boolean;
	handleDelete?: () => void;
};

export default function ClipClient({ clip, editable, handleDelete }: Props) {
	const router = useRouter();
	const { data: session } = useSession();
	const goToDetail = () => router.push(`/${clip._id}`);

	const t = useTranslations("ClipComponent");

	const formatRelativeDate = (date: Date | string): string => {
		const createdDate = typeof date === "string" ? new Date(date) : date;
		const now = new Date();
		const diff = now.getTime() - createdDate.getTime();
		const seconds = Math.floor(diff / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);

		if (days > 2) {
			const day = createdDate.getDate();
			const month =
				createdDate.toLocaleString("en-US", { month: "long" }).charAt(0).toUpperCase() +
				createdDate.toLocaleString("en-US", { month: "long" }).slice(1);
			const year = createdDate.getFullYear();
			return `${day} ${month} ${year}`;
		} else if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
		else if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
		else if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
		else return "just now";
	};

	return (
		<div
			onClick={!editable ? goToDetail : undefined}
			className={`mb-4 rounded bg-stone-500 p-2 shadow-lg duration-300 ease-in-out last:mb-0 hover:shadow-xl ${
				!editable ? "cursor-pointer" : ""
			}`}
		>
			<div className="flex items-center" onClick={(e) => e.stopPropagation()}>
				<Link
					href={`/user/${clip.user?._id}`}
					className="relative mr-2 size-12 cursor-pointer p-1"
				>
					<Image
						src={clip.user?.image ?? ""}
						alt="Profile Picture"
						referrerPolicy="no-referrer"
						fill
						className="rounded-full border-2 border-stone-300 object-cover"
					/>
				</Link>
				<Link href={`/user/${clip.user?._id}`} className="cursor-pointer">
					<span className="text-base font-semibold">{clip.user?.name}</span>
				</Link>
			</div>

			<hr className="my-2 border-t border-stone-400" />

			<div className="mb-2 px-2">
				<h2>{clip.title}</h2>
				<p>{clip.description}</p>
			</div>

			<video
				controls
				onClick={(e) => e.stopPropagation()}
				className="mb-2 max-w-2xl rounded-md shadow-lg hover:scale-[1.01]"
			>
				{/* this will make cloudflare think the video is always a new one (disable caching) */}
				<source src={`${clip.videoUrl}?v=${clip.updatedAt}`} type="video/mp4" />
				{t("videoNotSupported")}
			</video>

			<div className="mb-2 flex flex-col px-2">
				<span className="text-sm">
					{t("posted")}: {formatRelativeDate(clip.createdAt)}
				</span>
				<span className="text-sm">
					{t("lastUpdated")}: {formatRelativeDate(clip.updatedAt)}
				</span>
			</div>

			<hr className="my-2 border-t border-stone-400" />

			<ReactionBar clipId={clip._id} initialReactions={clip.reactions} />

			{session && session.user?._id === clip.user?._id && editable && (
				<div onClick={(e) => e.stopPropagation()} className="mt-2 flex justify-end gap-2">
					<button
						onClick={handleDelete}
						className="flex h-9 w-24 items-center justify-center rounded-sm border-2 border-red-600 bg-stone-500 font-semibold shadow duration-300 hover:border-4 hover:shadow-lg hover:brightness-90"
					>
						{t("delete")}
					</button>
					<Link
						className="flex h-9 w-24 items-center justify-center rounded-sm border-2 border-green-600 bg-stone-500 font-semibold shadow duration-300 hover:border-4 hover:shadow-lg hover:brightness-90"
						href={`${clip._id}/edit`}
					>
						{t("edit")}
					</Link>
				</div>
			)}
		</div>
	);
}
