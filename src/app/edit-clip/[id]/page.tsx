import EditClipInfo from "@/components/EditClipInfo";

interface EditTopicProps {
	params: {
		id: string;
	};
}

interface EditClipProps {
	clip: {
		_id: string;
		title: string;
		description: string;
	};
}

const getClip = async (id: string): Promise<EditClipProps | undefined> => {
	try {
		const res = await fetch(`http://localhost:3000/api/clips/${id}`, {
			cache: "no-cache",
		});

		return res.json();
	} catch (e) {
		console.log(e);
		return undefined;
	}
};

export default async function EditClip({ params }: EditTopicProps) {
	const { id } = params;

	const clip = await getClip(id);

	console.log("clip object: ", clip);

	if (!clip) {
		return;
	}

	return (
		<>
			<EditClipInfo
				id={clip.clip._id}
				title={clip.clip.title}
				description={clip.clip.description}
			/>
		</>
	);
}
