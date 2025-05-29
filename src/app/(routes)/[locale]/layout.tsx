import type { Metadata } from "next";
import "@/styles/globals.css";
import AuthContext from "@/context/AuthContext";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/ui/Header";
export const metadata: Metadata = {
	title: "Primal",
	description: "Share your clips with the world",
};

export default async function RootLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}>) {
	const { locale } = await params;
	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}
	return (
		<html lang={locale}>
			<body>
				<NextIntlClientProvider>
					<AuthContext>
						<Header />
						<main>{children}</main>
					</AuthContext>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
