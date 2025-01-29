import express from "express";
import fileUpload from "express-fileupload";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";

const app = express();
app.use(fileUpload());

app.post("/compress", (req, res) => {
	if (!req.files || !req.files.video) {
		return res.status(400).send("No video file uploaded.");
	}

	const video = req.files.video;
	const tempInputPath = path.join("/tmp", video.name);
	const tempOutputPath = path.join("/tmp", `compressed-${video.name}`);

	// Save uploaded file to temp location
	fs.writeFileSync(tempInputPath, video.data);

	// Compress video using GPU
	ffmpeg(tempInputPath)
		.output(tempOutputPath)
		.videoCodec("h264_nvenc") // Use NVIDIA GPU for compression
		.size("1280x720") // Resize to 720p
		.on("end", () => {
			// Send compressed video back
			res.download(tempOutputPath, `compressed-${video.name}`, () => {
				// Clean up temp files
				fs.unlinkSync(tempInputPath);
				fs.unlinkSync(tempOutputPath);
			});
		})
		.on("error", (err) => {
			console.error("Error compressing video:", err);
			res.status(500).send("Failed to compress video.");
		})
		.run();
});

app.listen(3000, () => {
	console.log("Compression service running on port 3000");
});
