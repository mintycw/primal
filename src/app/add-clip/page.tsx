"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddClip() {
	const [title, setTitle] = useState<string>("");
	const [description, setDescription] = useState<string>("");

	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!title || !description) {
			alert("Both title and description are required");
			return;
		}

		const newClip = {
			title,
			description,
			createdAt: new Date().toISOString(),
		};

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
			<button type="submit">Create Clip</button>
		</form>
	);
}
