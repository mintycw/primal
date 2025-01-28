import { TNewClip, TClip } from "@/types/clip";

export const postClip = async (newClip: TNewClip): Promise<TClip | null> => {
	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/clips`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newClip),
		});

		if (!res.ok) {
			throw new Error("Failed to create clip");
		}

		const createdClip: TClip = await res.json();
		return createdClip;
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
