import { S3 } from "@aws-sdk/client-s3";

const s3 = new S3({
	endpoint: process.env.MINIO_ENDPOINT || "",
	region: process.env.MINIO_REGION || "eu-central-1",
	credentials: {
		accessKeyId: process.env.MINIO_ACCESS_KEY || "",
		secretAccessKey: process.env.MINIO_SECRET_KEY || "",
	},
	forcePathStyle: true,
});

export default s3;
