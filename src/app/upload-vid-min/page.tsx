"use client";

import { useState } from "react";

export default function UploadClipTest() {
	const [file, setFile] = useState<File | null>(null);

	const handleUpload = async () => {
		if (!file) return;

		// Get signed URL from API
		const res = await fetch("http://localhost:3000/api/upload", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				name: file.name,
				fileType: file.type,
			}),
		});

		const { url } = await res.json();

		// Upload file to S3 using the signed URL
		await fetch(url, {
			method: "PUT",
			body: file,
			headers: { "Content-Type": file.type },
		});

		alert("File uploaded successfully!");
	};

	return (
		<div>
			<input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
			<button onClick={handleUpload} disabled={!file}>
				Upload to S3
			</button>
		</div>
	);
}
