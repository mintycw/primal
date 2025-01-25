import EditClipInfo from "@/components/EditClipInfo";

interface EditClipProps {
	id: string;
	title: string;
	description: string;
}

const getClipById = async (id: string) => {
	try {
		const res = await fetch(`http://localhost:3000/api/clips/${id}`, {
			cache: "no-cache",
		});

		if (!res.ok) {
			throw new Error("Failed to fetch clip");
		}

		return res.json();
	} catch (error) {
		console.error("Error fetching clip:", error);
		return {};
	}
};

export default async function EditClip({ id }: EditClipProps) {
	const clip = await getClipById(id);
	const { title, description } = clip;
	return (
		<>
			<EditClipInfo id={id} title={title} description={description} />
		</>
	);
}
