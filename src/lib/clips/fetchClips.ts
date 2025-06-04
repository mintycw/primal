import { TClip } from "@/types/clip";

export const getClips = async (): Promise<TClip[]> => {
	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/clips`, {
			cache: "no-store",
			next: { revalidate: 0 },
		});

		if (!res.ok) {
			throw new Error("Failed to fetch clips");
		}
		return res.json();
	} catch (error) {
		console.error("Error fetching clips:", error);
		return [];
	}
};

export const getClip = async (id: string): Promise<TClip | null> => {
	try {
		if (!id) {
			throw new Error("Missing ID parameter");
		}

		const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/clips/${id}`, {
			cache: "no-store",
			next: { revalidate: 0 },
		});

		if (!res.ok) {
			throw new Error("Failed to fetch clip");
		}

		const data = await res.json();
		return data.clip;
	} catch (error) {
		console.error("Error fetching clip:", error);
		return null;
	}
};

export const getUserClips = async (id: string): Promise<TClip[]> => {
	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/clips/user/${id}`, {
			cache: "no-store",
			next: { revalidate: 0 },
		});

		if (!res.ok) {
			throw new Error("Failed to fetch clips");
		}
		return res.json();
	} catch (error) {
		console.error("Error fetching clips:", error);
		return [];
	}
};
