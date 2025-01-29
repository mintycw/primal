type TDeleteClip = (id: string) => Promise<void>;

export const deleteClip: TDeleteClip = async (id) => {
	if (!id) {
		throw new Error("Missing ID parameter");
	}

	const confirmed = confirm("Are you sure you want to remove this clip?");

	if (!confirmed) {
		return;
	}

	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/clips/${id}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			throw new Error("Failed to delete clip");
		}

		window.location.href = "/";
	} catch (error) {
		console.error("Error deleting clip:", error);
	}
};
