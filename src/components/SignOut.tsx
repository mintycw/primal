"use client";

import React from "react";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";

export default function SignOut() {
	const t = useTranslations("HeaderComponent");

	return (
		<button
			onClick={() => signOut()}
			className="flex h-10 w-24 items-center justify-center truncate rounded-sm bg-stone-500 font-semibold duration-300 ease-in-out hover:cursor-pointer hover:shadow-lg hover:brightness-90 active:scale-95 active:brightness-75"
		>
			<span className="w-full truncate px-1 text-center">{t("logOutButton")}</span>
		</button>
	);
}
