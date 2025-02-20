"use client";

import React from "react";
import { signOut } from "next-auth/react";

export default function SignOut() {
	return (
		<button onClick={() => signOut()} className="rounded-sm bg-gray-500 px-4 py-2 text-white">
			Sign out
		</button>
	);
}
