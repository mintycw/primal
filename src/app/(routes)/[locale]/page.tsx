import Feed from "@/components/Feed";

export const dynamic = "force-dynamic";

export default async function Home() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-start gap-4 p-4">
			<Feed />
		</div>
	);
}
