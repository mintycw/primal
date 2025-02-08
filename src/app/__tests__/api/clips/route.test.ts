// __tests__/api/clips/route.test.ts
import { createMocks } from "node-mocks-http";
import { GET, POST } from "@/app/api/clips/route";
import { Clip } from "@/models/Clip";
import { connectToDatabase } from "@/lib/db/mongodb";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { mockClient } from "aws-sdk-client-mock";
import fs from "fs";
import path from "path";

// Mock MongoDB connection and models
jest.mock("@/lib/db/mongodb", () => ({
	connectToDatabase: jest.fn(),
}));

jest.mock("@/models/Clip", () => ({
	find: jest.fn(),
	create: jest.fn(),
}));

// Mock AWS S3 client
const s3Mock = mockClient(s3);

describe("GET /api/clips", () => {
	it("should return a list of clips with dynamic URLs", async () => {
		// Mock database response
		const mockClips = [
			{
				_id: "1",
				title: "Clip 1",
				description: "Description 1",
				objectName: "clip1.mp4",
				createdAt: new Date(),
			},
			{
				_id: "2",
				title: "Clip 2",
				description: "Description 2",
				objectName: "clip2.mp4",
				createdAt: new Date(),
			},
		];
		(Clip.find as jest.Mock).mockResolvedValue(mockClips);

		// Mock environment variables
		process.env.S3_ENDPOINT = "https://s3.example.com";
		process.env.S3_BUCKET = "test-bucket";

		// Create mock request and response
		const { req, res } = createMocks({
			method: "GET",
		});

		// Call the GET handler
		await GET();

		// Parse the JSON response
		const responseData = JSON.parse(res._getData());

		// Assertions
		expect(responseData).toHaveLength(2);
		expect(responseData[0].videoUrl).toBe("https://s3.example.com/test-bucket/clip1.mp4");
		expect(responseData[1].videoUrl).toBe("https://s3.example.com/test-bucket/clip2.mp4");
		expect(res._getStatusCode()).toBe(200);
	});

	it("should handle errors and return a 500 status code", async () => {
		// Simulate a database error
		(Clip.find as jest.Mock).mockRejectedValue(new Error("Database error"));

		// Create mock request and response
		const { req, res } = createMocks({
			method: "GET",
		});

		// Call the GET handler
		await GET();

		// Parse the JSON response
		const responseData = JSON.parse(res._getData());

		// Assertions
		expect(responseData.error).toBe("Failed to fetch clips");
		expect(res._getStatusCode()).toBe(500);
	});
});

describe("POST /api/clips", () => {
	it("should upload a clip and return a signed URL", async () => {
		// Mock environment variables
		process.env.S3_BUCKET = "test-bucket";
		process.env.S3_ENDPOINT = "https://s3.example.com";
		process.env.VIDEO_COMPRESSION = "false";
		process.env.LOCAL_VIDEO_COMPRESSION = "false";

		// Mock AWS S3 behavior
		s3Mock.on(PutObjectCommand).resolves({});

		// Mock database behavior
		const mockClip = {
			_id: "1",
			title: "New Clip",
			description: "New Description",
			objectName: "new-clip.mp4",
		};
		(Clip.create as jest.Mock).mockResolvedValue(mockClip);

		// Create mock FormData
		const { FormData } = require("formdata-node");
		const formData = new FormData();
		formData.append("title", "New Clip");
		formData.append("description", "New Description");
		formData.append("content", new Blob(["video content"], { type: "video/mp4" }), "test.mp4");

		// Create mock request and response
		const { req, res } = createMocks({
			method: "POST",
			headers: { "Content-Type": "multipart/form-data" },
			body: formData,
		});

		// Call the POST handler
		await POST(req, res);

		// Parse the JSON response
		const responseData = JSON.parse(res._getData());

		// Assertions
		expect(responseData.message).toBe("Clip created successfully");
		expect(responseData.clipId).toBe("1");
		expect(responseData.uploadUrl).toBeDefined();
		expect(res._getStatusCode()).toBe(201);
	});

	it("should handle missing fields and return a 400 status code", async () => {
		// Create mock FormData with missing fields
		const { FormData } = require("formdata-node");
		const formData = new FormData();
		formData.append("title", "New Clip"); // Missing description and content

		// Create mock request and response
		const { req, res } = createMocks({
			method: "POST",
			headers: { "Content-Type": "multipart/form-data" },
			body: formData,
		});

		// Call the POST handler
		await POST(req);

		// Parse the JSON response
		const responseData = JSON.parse(res._GetData());

		// Assertions
		expect(responseData.error).toBe("All fields are required");
		expect(res._getStatusCode()).toBe(400);
	});

	it("should handle errors and return a 500 status code", async () => {
		// Simulate an error during file processing
		jest.spyOn(fs, "writeFileSync").mockImplementation(() => {
			throw new Error("File system error");
		});

		// Create mock FormData
		const { FormData } = require("formdata-node");
		const formData = new FormData();
		formData.append("title", "New Clip");
		formData.append("description", "New Description");
		formData.append("content", new Blob(["video content"], { type: "video/mp4" }), "test.mp4");

		// Create mock request and response
		const { req, res } = createMocks({
			method: "POST",
			headers: { "Content-Type": "multipart/form-data" },
			body: formData,
		});

		// Call the POST handler
		await POST(req, res);

		// Parse the JSON response
		const responseData = JSON.parse(res._GetData());

		// Assertions
		expect(responseData.error).toBe("Failed to create clip");
		expect(res._getStatusCode()).toBe(500);
	});
});
