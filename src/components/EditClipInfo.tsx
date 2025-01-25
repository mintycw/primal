"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface EditClipProps {
	id: string;
	title: string;
	description: string;
}

export default function EditClipInfo({ id, title, description }: EditClipProps) {
	const [newTitle, setNewTitle] = useState(title);
	const [newDescription, setNewDescription] = useState(description);
	const router = useRouter();

	useEffect(() => {
		console.log(id, title, description);
	}, [id, title, description]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!newTitle || !newDescription) {
			alert("Both title and description are required");
			return;
		}

		const editClip = {
			newTitle,
			newDescription,
		};
		try {
			const res = await fetch(`http://localhost:3000/api/clips/${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(editClip),
			});

			if (res.ok) {
				router.push("/");
			} else {
				throw new Error("Failed to update clip");
			}

			const data = await res.json();
			console.log("Clip updated:", data);
		} catch (error) {
			console.error("Error updating clip:", error);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<div>
				<label htmlFor="title">Title:</label>
				<input
					id="title"
					type="text"
					value={newTitle}
					onChange={(e) => setNewTitle(e.target.value)}
					required
				/>
			</div>
			<div>
				<label htmlFor="description">Description:</label>
				<textarea
					id="description"
					value={newDescription}
					onChange={(e) => setNewDescription(e.target.value)}
					required
				/>
			</div>
			<button type="submit">Edit Clip</button>
		</form>
	);
}
