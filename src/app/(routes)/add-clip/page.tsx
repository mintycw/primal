"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { postClip } from "@/lib/clips/postClip";
import { TNewClip } from "@/types/clip";

export default function AddClip() {
	const router = useRouter();
	const MAX_FILE_SIZE = Math.pow(1024, 3); // 1 GB

	const [title, setTitle] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const [content, setContent] = useState<File | null>(null);

	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!title || !description || !content) {
			alert("All fields are required");
			return;
		}
		if (content.size > MAX_FILE_SIZE) {
			alert("File size exceeds the limit of 1 GB. Consider shortening the video.");
			return;
		}

		const formData = new FormData();
		formData.append("title", title);
		formData.append("description", description);
		formData.append("content", content);

		setLoading(true);
		setError(null);

		const createdClip = await postClip(formData, content);
		if (!createdClip) {
			setError("Failed to create clip. Please try again.");
		} else {
			router.push(`/${createdClip.clipId}`);
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
			<div>
				<label htmlFor="upload">Upload Clip:</label>
				<input
					type="file"
					id="upload"
					accept="video/*"
					onChange={(e) => {
						if (e.target.files && e.target.files[0]) {
							const file = e.target.files[0];
							setContent(file);
						}
					}}
					required
				/>
			</div>
			<button type="submit">Create Clip</button>
		</form>
	);
}
