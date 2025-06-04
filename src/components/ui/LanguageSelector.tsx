"use client";

import React, { useState } from "react";
import { routing } from "@/i18n/routing";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { IoLanguage } from "react-icons/io5";

export default function LanguageSelector() {
	const t = useTranslations();

	const [openLanguageSelection, setOpenLanguageSelection] = useState(false);

	const params = useParams();
	const router = useRouter();
	const asPath = usePathname();

	function changeLanguage(newLocale: string) {
		const segments = asPath.split("/");
		segments[1] = newLocale;

		const newPath = segments.join("/") || "/";
		router.replace(newPath);

		setOpenLanguageSelection(false);
	}

	return (
		<>
			{openLanguageSelection && (
				<div
					onClick={() => {
						setOpenLanguageSelection(false);
					}}
					className="absolute inset-0 z-10 h-dvh w-screen bg-black opacity-50"
				></div>
			)}

			<div className="relative flex flex-row items-center justify-center gap-4">
				{/* Language */}
				<button
					onClick={() => {
						setOpenLanguageSelection(!openLanguageSelection);
					}}
					className="z-10 flex size-10 items-center justify-center rounded-sm bg-stone-500 p-1 font-semibold duration-300 ease-in-out hover:cursor-pointer hover:shadow-lg hover:brightness-90 active:scale-95 active:brightness-75"
				>
					<IoLanguage className="size-full" />
				</button>

				<div
					className={`absolute top-0 left-0 z-20 translate-y-14 flex-col overflow-hidden rounded-lg bg-white shadow ${
						openLanguageSelection ? "flex" : "hidden"
					}`}
				>
					{routing.locales.length > 0 &&
						routing.locales.map((language, index) => (
							<button
								key={index}
								onClick={() => changeLanguage(language)}
								className={`flex justify-center p-2 px-5 whitespace-nowrap text-black transition-all duration-300 hover:cursor-pointer hover:bg-blue-500 hover:text-white ${
									params?.locale === language ? "bg-blue-300" : ""
								}`}
							>
								<p>{t(`generic.languages.${language}`)}</p>
							</button>
						))}
				</div>
			</div>
		</>
	);
}
