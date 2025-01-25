import { IClip } from "@/models/Clip";

export default async function Feed() {
	const res = await fetch("http://localhost:3000/api/clips", { cache: "no-store" });
	const clips: IClip[] = await res.json();

	console.log(res);
	return (
		<>
			<p>Feed page</p>
			<div>
				{clips.map((clip) => (
					<div key={clip.id}>
						<h2>{clip.title}</h2>
						<p>{clip.description}</p>
						<p>Created: {clip.createdAt.toString()}</p>
					</div>
				))}
			</div>
		</>
	);
}
