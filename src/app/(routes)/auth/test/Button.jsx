"use client";

import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";

function Button() {
	return <button onClick={() => signOut()}>Sign out</button>;
}

export default Button;
