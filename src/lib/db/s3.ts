import { S3 } from "@aws-sdk/client-s3";

const s3 = new S3({
	endpoint: process.env.S3_ENDPOINT || "",
	region: process.env.S3_REGION || "eu-central-1",
	credentials: {
		accessKeyId: process.env.S3_ACCESS_KEY || "",
		secretAccessKey: process.env.S3_SECRET_KEY || "",
	},
	forcePathStyle: true,
});

export default s3;
