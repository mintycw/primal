"use client";

import Link from "next/link";
import { Flame } from "lucide-react";

export default function Header() {
	return (
		<header className="w-full bg-gradient-to-r from-orange-700 via-red-600 to-orange-500 text-white shadow-lg">
			<div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
				<Link href="/" className="flex items-center space-x-2">
					<Flame className="h-7 w-7 text-yellow-300" />
					<span className="text-xl font-bold tracking-wide">Primal</span>
				</Link>

				<nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
					<Link href="/" className="transition hover:text-yellow-300">
						Feed
					</Link>
					<Link href="/upload" className="transition hover:text-yellow-300">
						Upload
					</Link>
					<Link href="/profile" className="transition hover:text-yellow-300">
						Mijn profiel
					</Link>
				</nav>

				<Link
					href="/upload"
					className="ml-4 rounded-xl bg-yellow-400 px-4 py-2 text-sm font-semibold text-black transition-all hover:bg-yellow-300"
				>
					+ Clip uploaden
				</Link>
			</div>
		</header>
	);
}
