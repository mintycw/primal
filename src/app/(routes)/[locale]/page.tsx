import Header from "@/components/Header";
import Feed from "@/components/Feed";
import { getServerSession } from "next-auth";
import { Link } from "@/i18n/navigation";
import { authOptions } from "@/lib/auth/authOptions";
import SignOut from "@/components/SignOut";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

export default async function Home() {
	const session = await getServerSession(authOptions);

	const t = await getTranslations("HomePage");

	return (
		<>
			<Header />
			<h1>{t("main")}</h1>
			{session ? (
				<>
					<Link href="/add-clip" className="rounded-sm bg-gray-500 px-4 py-2 text-white">
						Add Clip
					</Link>
					<Link
						href={`user/${session.user?._id}`}
						className="rounded-sm bg-gray-500 px-4 py-2 text-white"
					>
						My Profile
					</Link>
					<SignOut />
				</>
			) : (
				<Link href="/auth/login" className="rounded-sm bg-gray-500 px-4 py-2 text-white">
					Sign in
				</Link>
			)}
			<Feed />
		</>
	);
}
