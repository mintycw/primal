import { TNewClip, TClip } from "@/types/clip";

// TODO: return is set to any for now, change to TClip
export const postClip = async (formData: any, content: any): Promise<any> => {
	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/clips`, {
			method: "POST",
			body: formData,
		});

		if (!res.ok) {
			throw new Error("Failed to create clip");
		}

		// TODO: Make sure to return object that fits the TClip type
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
			return data;
		} else {
			const errorText = await uploadRes.text();
			console.error("Upload response error:", uploadRes.status, errorText);
			throw new Error("Failed to upload video to bulk database");
		}
	} catch (error) {
		console.error("Error creating clip:", error);
		return null;
	}
};

export const putClip = async (id: string, editClip: TNewClip): Promise<TClip | null> => {
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
