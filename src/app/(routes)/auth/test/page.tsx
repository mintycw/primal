import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import Button from "@/app/(routes)/auth/test/Button";
export default async function Dashboard() {
	const session = await getServerSession(authOptions);

	console.log(session);

	if (!session) {
		return <p>You must be logged in</p>;
	}

	return (
		<p className="flex h-screen flex-col items-center justify-center">
			Welcome{" "}
			{Object.entries(session?.user).map((item) => {
				if (item[0] === "image") {
					return <img src={item[1] ?? ""} alt="user" />;
				}

				return <span>{item[1]}</span>;
			})}
			<Button />
		</p>
	);
}
