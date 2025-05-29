import { TUser } from "@/types/user";

export const getUser = async (id: string): Promise<TUser | null> => {
	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/${id}`, {
			cache: "no-store",
			next: { revalidate: 0 },
		});

		if (!res.ok) {
			throw new Error("Failed to fetch clips");
		}
		return res.json();
	} catch (error) {
		console.error("Error fetching clips:", error);
		return null; // Return an empty user object on error
	}
};
