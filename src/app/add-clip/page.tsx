export default function AddClip() {
  return (
    <div>
      <h1>Add Video</h1>
      <form>
        <label htmlFor="title">Title</label>
        <input type="text" id="title" name="title" />
        <label htmlFor="description">Description</label>
        <input type="text" id="description" name="description" />
        <label htmlFor="video">Video</label>
        <input type="file" id="video" name="video" />
        <button>Submit</button>
      </form>
    </div>
  );
}