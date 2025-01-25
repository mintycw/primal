import Link from "next/link";
import RemoveButton from "./buttons/RemoveButton";

interface Clip {
	_id: string;
	title: string;
	description: string;
}

const getClips = async (): Promise<Clip[]> => {
	try {
		const res = await fetch("http://localhost:3000/api/clips", {
			cache: "no-cache",
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

export default async function ClipList() {
	const clips = await getClips();

	return (
		<>
			{clips.map((c: Clip) => (
				<div key={c._id}>
					<div>
						<h2 className="mt-4 text-3xl font-bold">{c.title}</h2>
						<p>{c.description}</p>
					</div>
					<div>
						<RemoveButton id={c._id} />
						<Link
							className="rounded bg-green-500 px-4 py-2 text-white"
							href={`/edit-clip/${c._id}`}
						>
							EDIT
						</Link>
					</div>
				</div>
			))}
		</>
	);
}
