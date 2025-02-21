"use client";

import { putClip } from "@/lib/clips/postClip";
import { TClipUpdate } from "@/types/clip";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface EditClipProps {
	id: string;
	title: string;
	description: string;
}

export default function EditClipInfo({ id, title, description }: EditClipProps) {
	const router = useRouter();

	const [newTitle, setNewTitle] = useState(title);
	const [newDescription, setNewDescription] = useState(description);

	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!newTitle || !newDescription) {
			alert("Both title and description are required");
			return;
		}

		const editClip: TClipUpdate = {
			title: newTitle,
			description: newDescription,
		};

		setLoading(true);
		setError(null);

		const editedClip = await putClip(id, editClip);

		if (!editedClip) {
			alert("Failed to update clip. Please try again.");
		} else {
			router.push(`/${editedClip._id}`);
		}

		setLoading(false);
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
			{error && <p className="text-red-500">{error}</p>}
			<button type="submit" disabled={loading}>
				{loading ? "Editing..." : "Edit Clip"}
			</button>
		</form>
	);
}
