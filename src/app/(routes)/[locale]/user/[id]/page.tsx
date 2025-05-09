import React from "react";
import UserDetails from "./UserClips";
import { RouteParams } from "@/types/param";

export default async function Page({ params }: RouteParams<{ id: string }>) {
	const { id } = await params;

	return (
		<div>
			<h1>USER PAGE</h1>
			<UserDetails id={id} />
		</div>
	);
}
