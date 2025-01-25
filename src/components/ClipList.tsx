import Link from "next/link";
import RemoveButton from "./buttons/RemoveButton";

export default function VideoList() {
	return (
		<>
			<div>
				<div>
					<h2 className="mt-4 text-3xl font-bold">Video Title</h2>
					<p>Video desc</p>
				</div>
				<div>
					<RemoveButton />
					<Link className="rounded bg-green-500 px-4 py-2 text-white" href={"/edit-clip"}>
						EDIT
					</Link>
				</div>
			</div>
			<br />
			<hr />
		</>
	);
}
