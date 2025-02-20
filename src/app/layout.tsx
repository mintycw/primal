import type { Metadata } from "next";
import "../styles/globals.css";
import AuthContext from "@/context/AuthContext";

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
			<body>
				<AuthContext>
					<header></header>
					<main>{children}</main>
				</AuthContext>
			</body>
		</html>
	);
}
