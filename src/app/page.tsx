import Feed from "@/components/Feed";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "./api/auth/[...nextauth]/route";
import SignOut from "@/components/SignOut";

export const dynamic = "force-dynamic";

export default async function Home() {
	const session = await getServerSession(authOptions);

	return (
		<>
			<h1>Main</h1>
			{session ? (
				<>
					<Link href="/add-clip" className="rounded-sm bg-gray-500 px-4 py-2 text-white">
						Add Clip
					</Link>
					<Link
						href={`user/${session.user?._id}`}
						className="rounded-sm bg-gray-500 px-4 py-2 text-white"
					>
						My Profile
					</Link>
					<SignOut />
				</>
			) : (
				<Link href="/auth/login" className="rounded-sm bg-gray-500 px-4 py-2 text-white">
					Sign in
				</Link>
			)}
			<Feed />
		</>
	);
}
