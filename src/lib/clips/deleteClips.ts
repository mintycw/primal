type TDeleteClip = (id: string, t: any) => Promise<void>;

export const deleteClip: TDeleteClip = async (id, t) => {
	if (!id) {
		throw new Error("Missing ID parameter");
	}

	const confirmed = confirm(t("confirmDelete"));

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
