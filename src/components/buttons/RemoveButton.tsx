"use client";

import { useRouter } from "next/navigation";
interface RemoveButtonProps {
	id: string;
}

export default function RemoveButton({ id }: RemoveButtonProps) {
	const router = useRouter();
	const removeClip = async () => {
		const confirmed = confirm("Are you sure you want to remove this clip?");

		if (confirmed) {
			const res = await fetch(`http://localhost:3000/api/clips?id=${id}`, {
				method: "DELETE",
			});
			if (res.ok) {
				router.refresh();
			}
		}
	};
	return (
		<button className="rounded bg-red-500 px-4 py-2 text-white" onClick={removeClip}>
			Remove
		</button>
	);
}
