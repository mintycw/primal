import { TClip, TClipUpdate } from "@/types/clip";

export const postClip = async (formData: FormData, content: File): Promise<TClip | null> => {
	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/clips`, {
			method: "POST",
			body: formData,
		});

		if (!res.ok) {
			throw new Error("Failed to create clip");
		}

		const data: TClip = await res.json();
		const uploadUrl = data.uploadUrl;

		// Upload the video to the signed URL
		const uploadRes = await fetch(uploadUrl, {
			method: "PUT",
			headers: {
				"Content-Type": content.type,
			},
			body: content, // Upload the file content
		});

		// Check if clip upload was successful
		if (!uploadRes.ok) {
			await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/clips/${data._id}`, {
				method: "DELETE", // Delete the clip from the database if upload fails
			});
			const errorText = await uploadRes.text();
			console.error("Upload response error:", uploadRes.status, errorText);
			throw new Error("Failed to upload clip to bulk database");
		}

		return data;
	} catch (error) {
		console.error("Error posting clip:", error);
		return null;
	}
};

export const putClip = async (id: string, editClip: TClipUpdate): Promise<TClip | null> => {
	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/clips/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(editClip),
		});

		if (!res.ok) {
			throw new Error("Failed to update clip");
		}

		const updatedClip: TClip = await res.json();
		return updatedClip;
	} catch (error) {
		console.error("Error updating clip:", error);
		return null;
	}
};
