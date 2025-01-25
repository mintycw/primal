import VideoList from "@/components/ClipList";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
	return (
		<>
			<h1>Main</h1>
			<Link href="/add-clip" className="rounded bg-gray-500 px-4 py-2 text-white">
				Add Clip
			</Link>
			<VideoList />
		</>
	);
}
