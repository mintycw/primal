import express from "express";
import fileUpload from "express-fileupload";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";

const app = express();

// Increase payload size limits for Express
app.use(express.json({ limit: "1gb" }));
app.use(express.urlencoded({ limit: "1gb", extended: true }));

// Configure file upload with proper size limits (1GB)
app.use(
	fileUpload({
		limits: {
			fileSize: 1024 * 1024 * 1024, // 1GB limit
			files: 1, // Only allow 1 file at a time
		},
		useTempFiles: true,
		tempFileDir: "/tmp/",
		createParentPath: true,
		abortOnLimit: false, // Don't abort on limit, let us handle the error
		responseOnLimit: "File size limit exceeded. Maximum file size is 1GB.",
		uploadTimeout: 0, // No timeout for uploads
	})
);

// Add CORS headers
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	if (req.method === "OPTIONS") {
		res.sendStatus(200);
	} else {
		next();
	}
});

const COMPRESSION_SETTINGS = {
	codec: "hevc_nvenc",
	preset: "p5", // Balanced preset
	constantQuality: 32, // Constant quality (lower = better quality, larger files)
	maxResolution: "1920:1080",
	format: "mp4",
	audioCodec: "aac",
	audioBitrate: "128k",
};

app.post("/compress", (req, res) => {
	if (!req.files || !req.files.video) {
		return res.status(400).send("No video file uploaded.");
	}

	const video = req.files.video;
	const tempInputPath = path.join("/tmp", video.name);
	const tempOutputPath = path.join(
		"/tmp",
		`compressed-${path.basename(video.name, path.extname(video.name))}.mp4`
	);

	// Save uploaded file to temp location
	fs.copyFileSync(video.tempFilePath, tempInputPath);

	console.log("video.data length:", video.data?.length);
	console.log("video.tempFilePath:", video.tempFilePath);

	// Compress video using GPU
	ffmpeg(tempInputPath)
		.output(tempOutputPath)
		.videoCodec(COMPRESSION_SETTINGS.codec)
		.audioCodec(COMPRESSION_SETTINGS.audioCodec)
		.audioBitrate(COMPRESSION_SETTINGS.audioBitrate)
		.outputOptions([
			`-preset ${COMPRESSION_SETTINGS.preset}`,
			`-cq ${COMPRESSION_SETTINGS.constantQuality}`,
			`-vf scale=${COMPRESSION_SETTINGS.maxResolution}:force_original_aspect_ratio=decrease`,
			`-f ${COMPRESSION_SETTINGS.format}`,
		])
		.on("progress", (progress) => {
			console.log(`Processing: ${Math.round(progress.percent ?? 0)}% done`);
		})
		.on("end", () => {
			// Send compressed video back
			res.download(tempOutputPath, `compressed-${video.name}`, () => {
				// Clean up temp files
				fs.unlinkSync(tempInputPath);
				fs.unlinkSync(tempOutputPath);
			});
		})
		.on("error", (err, stdout, stderr) => {
			console.error(`Error compressing video: ${err}\nFFmpeg stderr: ${stderr}`);
			res.status(500).send("Failed to compress video.");
		})
		.run();
});

app.listen(3000, () => {
	console.log("Compression service running on port 3000");
});
