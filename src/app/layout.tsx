import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import AuthContext from "@/context/AuthContext";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Primal",
	description: "Share your clips with the world",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<AuthContext>
					<header></header>
					<main>{children}</main>
				</AuthContext>
			</body>
		</html>
	);
}
