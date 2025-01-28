"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddClip() {
	const [title, setTitle] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const [content, setContent] = useState<File | null>(null);

	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!title || !description || !content) {
			alert("All fields are required");
			return;
		}
		if (content.size > 1024 * 1024 * 1024) {
			// 1 GB size limit
			alert("File size exceeds the limit of 1 GB. Consider shortening the video.");
			return;
		}

		const formData = new FormData();
		formData.append("title", title);
		formData.append("description", description);
		formData.append("content", content);
		formData.append("createdAt", new Date().toISOString());

		try {
			const res = await fetch("http://localhost:3000/api/clips", {
				method: "POST",
				body: formData,
			});

			if (!res.ok) {
				throw new Error("Failed to create clip");
			}

			const data = await res.json();
			const uploadUrl = data.uploadUrl;

			// Upload the video to the signed URL
			const uploadRes = await fetch(uploadUrl, {
				method: "PUT",
				headers: {
					"Content-Type": content.type,
				},
				body: content, // Upload the file content
			});

			if (uploadRes.ok) {
				// upload successful
				router.push("/");
			} else {
				const errorText = await uploadRes.text();
				console.error("Upload response error:", uploadRes.status, errorText);
				throw new Error("Failed to upload video to bulk database");
			}

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
