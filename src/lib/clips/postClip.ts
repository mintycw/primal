import { TClip, TClipUpdate } from "@/types/clip";

export const postClip = async (formData: FormData, content: File): Promise<TClip | null> => {
	try {
		// Add the file to the form data
		formData.append("content", content);

		const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/clips`, {
			method: "POST",
			body: formData,
		});

		if (!res.ok) {
			const errorText = await res.text();
			console.error("API response error:", res.status, errorText);
			throw new Error("Failed to create and upload clip");
		}

		const data: TClip = await res.json();
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
