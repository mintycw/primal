import { S3 } from "@aws-sdk/client-s3";

const s3Endpoint = process.env.S3_ENDPOINT;
if (!s3Endpoint) {
	throw new Error("S3_ENDPOINT is not defined in environment variables.");
}

const s3AccessKey = process.env.S3_ACCESS_KEY;
if (!s3AccessKey) {
	throw new Error("S3_ACCESS_KEY is not defined in the environment variables.");
}

const s3SecretKey = process.env.S3_SECRET_KEY;
if (!s3SecretKey) {
	throw new Error("S3_SECRET_KEY is not defined in the environment variables.");
}

// Use a default region if S3_REGION is not defined
const s3Region = process.env.S3_REGION || "eu-central-1";
if (!process.env.S3_REGION) {
	console.warn("S3_REGION is not defined. Defaulting to eu-central-1.");
}

const s3 = new S3({
	endpoint: s3Endpoint,
	region: s3Region,
	credentials: {
		accessKeyId: s3AccessKey,
		secretAccessKey: s3SecretKey,
	},
	forcePathStyle: true,
});

export default s3;
