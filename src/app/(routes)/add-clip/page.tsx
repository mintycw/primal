"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { postClip } from "@/lib/clips/postClip";
import { TNewClip } from "@/types/clip";

export default function AddClip() {
	const router = useRouter();

	const [title, setTitle] = useState<string>("");
	const [description, setDescription] = useState<string>("");

	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!title || !description) {
			alert("Both title and description are required");
			return;
		}

		const newClip: TNewClip = { title, description };

		setLoading(true);
		setError(null);

		const createdClip = await postClip(newClip);

		if (!createdClip) {
			setError("Failed to create clip. Please try again.");
		} else {
			router.push(`/${createdClip._id}`);
		}

		setLoading(false);

		try {
			const res = await fetch("http://localhost:3000/api/clips", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(newClip),
			});

			if (res.ok) {
				router.push("/");
			} else {
				throw new Error("Failed to create clip");
			}

			const data = await res.json();
			console.log("Clip created:", data);
		} catch (error) {
			console.error("Error creating clip:", error);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<div>
				<label htmlFor="title">Title:</label>
				<input
					id="title"
					type="text"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					required
				/>
			</div>
			<div>
				<label htmlFor="description">Description:</label>
				<textarea
					id="description"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					required
				/>
			</div>
			{error && <p className="text-red-500">{error}</p>}
			<button type="submit" disabled={loading}>
				{loading ? "Creating..." : "Create Clip"}
			</button>
		</form>
	);
}
