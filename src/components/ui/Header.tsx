import { Link } from "@/i18n/navigation";
import { authOptions } from "@/lib/auth/authOptions";
import { getTranslations } from "next-intl/server";
import { getServerSession } from "next-auth";
import SignOut from "../SignOut";
import LanguageSelector from "./LanguageSelector";

export default async function Header() {
	const session = await getServerSession(authOptions);

	const t = await getTranslations("HeaderComponent");

	return (
		<div className="grid h-14 w-full grid-cols-3 bg-stone-400">
			<div className="ml-4 flex items-center justify-start">
				<LanguageSelector />
			</div>
			<div className="flex items-center justify-center">
				<h1>Primal</h1>
			</div>
			<div className="mx-4 flex items-center justify-end gap-4">
				{session ? (
					<>
						<Link
							href="/add-clip"
							className="flex h-10 w-24 items-center justify-center truncate rounded-sm bg-stone-500 font-semibold duration-300 ease-in-out hover:cursor-pointer hover:shadow-lg hover:brightness-90 active:scale-95 active:brightness-75"
						>
							<span className="w-full truncate px-1 text-center">
								{t("addClipButton")}
							</span>
						</Link>
						<Link
							href={`/user/${session.user?._id}`}
							className="flex h-10 w-24 items-center justify-start truncate rounded-sm bg-stone-500 font-semibold duration-300 ease-in-out hover:cursor-pointer hover:shadow-lg hover:brightness-90 active:scale-95 active:brightness-75"
						>
							<span className="w-full truncate px-1 text-center">
								{t("profileButton")}
							</span>
						</Link>
						<SignOut />
					</>
				) : (
					<Link
						href="/auth/login"
						className="flex h-10 w-24 items-center justify-start truncate rounded-sm bg-stone-500 font-semibold duration-300 ease-in-out hover:cursor-pointer hover:shadow-lg hover:brightness-90 active:scale-95 active:brightness-75"
					>
						<span className="w-full truncate text-center">{t("logInButton")}</span>
					</Link>
				)}
			</div>
		</div>
	);
}
