"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function Page() {
	const { data: session } = useSession();

	const router = useRouter();

	useEffect(() => {
		if (session) {
			router.push(`/user/${session.user?._id}`);
		}
	});

	return session ? (
		<div>
			<h1>LOGGED IN AS {session.user?.name}</h1>
			<div>
				<button onClick={() => signOut()}>Sign out</button>
			</div>
			<Link href="/user/[id]" as={`/`}>
				Home
			</Link>
		</div>
	) : (
		<div className="flex flex-col gap-2">
			<h1>LOGIN</h1>
			<div className="flex flex-row gap-4">
				<button onClick={() => signIn("google")}>Sign in with Google</button>
				<button onClick={() => signIn("discord")}>Sign in with Discord</button>
			</div>
		</div>
	);
}

export default Page;
