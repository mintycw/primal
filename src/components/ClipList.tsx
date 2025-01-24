import Link from "next/link";
import RemoveButton from "./buttons/RemoveButton";

export default function VideoList() {
    return (
        <>
            <div>
                <div>
                    <h2 className="text-3xl font-bold mt-4">Video Title</h2>
                    <p>Video desc</p>
                </div>
                <div>
                    <RemoveButton />
                    <Link className="bg-green-500 text-white px-4 py-2 rounded" href={"/edit-clip"}>EDIT</Link>
                </div>
            </div>
            <br />
            <hr />
        </>
    );
}