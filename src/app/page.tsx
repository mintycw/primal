import Feed from "@/components/Feed";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function Home() {
	return (
		<>
			<h1>Main</h1>
			<Feed />
			<Link href="/add-clip" className="rounded bg-gray-500 px-4 py-2 text-white">
				Add Clip
			</Link>
		</>
	);
}
