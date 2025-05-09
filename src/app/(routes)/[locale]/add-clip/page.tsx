"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { postClip } from "@/lib/clips/postClip";

export default function AddClip() {
	const router = useRouter();
	const MAX_FILE_SIZE = 500 * Math.pow(1024, 2); // 500 MB

	const [title, setTitle] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const [content, setContent] = useState<File | null>(null);

	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!title || !content) {
			alert("Title field and video clip is required");
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
					disabled={loading}
				/>
			</div>
			<div>
				<label htmlFor="description">Description:</label>
				<textarea
					id="description"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					disabled={loading}
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
					disabled={loading}
				/>
			</div>
			{error && <div style={{ color: "red" }}>{error}</div>}
			<button type="submit" disabled={loading}>
				{loading ? "Creating Clip..." : "Create Clip"}
			</button>
		</form>
	);
}
