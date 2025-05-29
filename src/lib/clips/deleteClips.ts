type TDeleteClip = {
	id: string;
};

export default async function deleteClip({ id }: TDeleteClip): Promise<void> {
	if (!id) {
		throw new Error("Missing ID parameter");
	}

	const confirmed = confirm(
		"Are you sure you want to delete this clip? This action cannot be undone."
	);

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
}
