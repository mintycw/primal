export default function EditClipInfo() {
    return (
        <div>
            <h1>Edit Video</h1>
            <form>
                <label htmlFor="title">Title</label>
                <input type="text" id="title" name="title" />
                <label htmlFor="description">Description</label>
                <input type="text" id="description" name="description" />
                {/* <label htmlFor="video">Video</label>
                <input type="file" id="video" name="video" /> */}
                <button>Update Clip</button>
            </form>
        </div>
    );
}