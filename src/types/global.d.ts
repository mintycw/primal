declare namespace NodeJS {
	interface ProcessEnv {
		NEXT_PUBLIC_API_BASE_URL: string | undefined;
		MONGODB_URI: string | null;
		S3_ENDPOINT: string | null;
		S3_BUCKET: string | undefined;
		S3_REGION: string | null;
		S3_ACCESS_KEY: string | null;
		S3_SECRET_KEY: string | null;
		VIDEO_COMPRESSION: string | null;
		VIDEO_COMPRESSION_ENDPOINT: string | null;
		LOCAL_VIDEO_COMPRESSION: string | null;
		LOCAL_VIDEO_ENCODER: string | null;
	}
}
