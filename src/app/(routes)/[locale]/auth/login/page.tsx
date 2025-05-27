"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Link } from "@/i18n/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTranslations } from "next-intl";

function Page() {
	const { data: session } = useSession();

	const router = useRouter();
	const t = useTranslations("LoginPage");

	useEffect(() => {
		if (session) {
			router.push(`/user/${session.user?._id}`);
		}
	}, [router, session]);

	return session ? (
		<div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
			<div className="mb-4 rounded bg-stone-500 p-2 shadow-lg duration-300 ease-in-out last:mb-0 hover:shadow-xl">
				<div className="items-star flext mb-4 justify-center">
					<h1>
						{session.user?.name
							? t("loggedInAs", { name: session.user.name })
							: t("errorLoggingIn")}
					</h1>{" "}
				</div>
				<div className="flex flex-row gap-4">
					<Link
						href="/user/[id]"
						as={`/`}
						className="flex h-9 w-48 items-center justify-center rounded-sm border-2 border-stone-600 bg-stone-500 font-semibold shadow duration-300 hover:border-4 hover:shadow-lg hover:brightness-90"
					>
						{t("home")}
					</Link>
					<button
						onClick={() => signOut()}
						className="flex h-9 w-48 items-center justify-center rounded-sm border-2 border-stone-600 bg-stone-500 font-semibold shadow duration-300 hover:border-4 hover:shadow-lg hover:brightness-90"
					>
						{t("logoutButton")}
					</button>
				</div>
			</div>
		</div>
	) : (
		<div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
			<div className="mb-4 rounded bg-stone-500 p-2 shadow-lg duration-300 ease-in-out last:mb-0 hover:shadow-xl">
				<div className="flext mb-4 items-start justify-center">
					<h1>{t("login")}</h1>
				</div>
				<div className="flex flex-row gap-4">
					<button
						onClick={() => signIn("google")}
						className="flex h-9 w-48 items-center justify-center rounded-sm border-2 border-stone-600 bg-stone-500 font-semibold shadow duration-300 hover:border-4 hover:shadow-lg hover:brightness-90"
					>
						{t("signInWithGoogle")}
					</button>
					<button
						onClick={() => signIn("discord")}
						className="flex h-9 w-48 items-center justify-center rounded-sm border-2 border-stone-600 bg-stone-500 font-semibold shadow duration-300 hover:border-4 hover:shadow-lg hover:brightness-90"
					>
						{t("signInWithDiscord")}
					</button>
				</div>
			</div>
		</div>
	);
}

export default Page;
