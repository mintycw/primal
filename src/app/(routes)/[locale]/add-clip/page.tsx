import { authOptions } from "@/lib/auth/authOptions";
import { getServerSession } from "next-auth";
import React from "react";
import PostClipForm from "./PostClipForm";

export default async function CreateClip() {
	const session = await getServerSession(authOptions);

	return (
		<div className="flex min-h-screen flex-col items-center justify-start gap-4 p-4">
			<PostClipForm session={session} />;
		</div>
	);

	// return (
	// 	<form
	// 		onSubmit={handleSubmit}
	// 		className="flex min-h-screen flex-col items-center justify-center gap-4 p-4"
	// 	>
	// 		<div className="mb-4 rounded bg-stone-500 p-2 shadow-lg duration-300 ease-in-out last:mb-0 hover:shadow-xl">
	// 			<div className="">
	// 				<label htmlFor="title">Title:</label>
	// 				<input
	// 					id="title"
	// 					type="text"
	// 					value={title}
	// 					onChange={(e) => setTitle(e.target.value)}
	// 					required
	// 					disabled={loading}
	// 				/>
	// 			</div>
	// 			<div>
	// 				<label htmlFor="description">Description:</label>
	// 				<textarea
	// 					id="description"
	// 					value={description}
	// 					onChange={(e) => setDescription(e.target.value)}
	// 					disabled={loading}
	// 				/>
	// 			</div>
	// 			<div>
	// 				<label htmlFor="upload">Upload Clip:</label>
	// 				<input
	// 					type="file"
	// 					id="upload"
	// 					accept="video/*"
	// 					onChange={(e) => {
	// 						if (e.target.files && e.target.files[0]) {
	// 							const file = e.target.files[0];
	// 							setContent(file);
	// 						}
	// 					}}
	// 					required
	// 					disabled={loading}
	// 				/>
	// 			</div>
	// 			{error && <div style={{ color: "red" }}>{error}</div>}
	// 			<button type="submit" disabled={loading}>
	// 				{loading ? "Creating Clip..." : "Create Clip"}
	// 			</button>
	// 		</div>
	// 	</form>
	// );
}
