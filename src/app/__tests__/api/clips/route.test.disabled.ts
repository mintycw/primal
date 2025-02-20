import { GET } from "@/app/api/clips/route"; // Pas het pad aan naar waar je bestand zich bevindt
import { connectToDatabase } from "@/lib/db/mongodb";
import { Clip } from "@/models/Clip";

test.skip("this test will be skipped", () => {
	expect(true).toBe(false);
});

// Mock dependencies
jest.mock("@/lib/db/mongodb", () => ({
	connectToDatabase: jest.fn(),
}));

jest.mock("@/models/Clip", () => ({
	Clip: {
		find: jest.fn(),
	},
}));

jest.mock("next/server", () => ({
	NextResponse: {
		json: jest.fn((data, init) => ({
			status: init?.status || 200,
			json: async () => data,
		})),
	},
}));

describe("GET function", () => {
	it("should return a list of clips with video URLs", async () => {
		// Arrange
		const mockClips = [
			{
				_id: "1",
				user: "1",
				title: "Test Clip 1",
				description: "This is a test clip",
				objectName: "test-clip-1.mp4",
				createdAt: new Date(),
				toObject: jest.fn().mockReturnValue({
					_id: "1",
					user: "1",
					title: "Test Clip 1",
					description: "This is a test clip",
					objectName: "test-clip-1.mp4",
					createdAt: new Date(),
				}),
			},
		];

		(connectToDatabase as jest.Mock).mockResolvedValue(null);
		(Clip.find as jest.Mock).mockReturnValue({
			sort: jest.fn().mockResolvedValue(mockClips),
		});

		process.env.S3_ENDPOINT = "https://example.com";
		process.env.S3_BUCKET = "test-bucket";

		// Act
		const response = await GET();

		// Assert
		expect(response.status).toBe(200);
		const json = await response.json();
		expect(json).toHaveLength(1);
		expect(json[0].videoUrl).toBe("https://example.com/test-bucket/test-clip-1.mp4");
		expect(json[0].title).toBe("Test Clip 1");
		expect(json[0].description).toBe("This is a test clip");
	});

	it("should return a 500 error if something goes wrong", async () => {
		// Arrange
		(connectToDatabase as jest.Mock).mockRejectedValue(new Error("Database error"));

		// Act
		const response = await GET();

		// Assert
		expect(response.status).toBe(500);
		const json = await response.json();
		expect(json.error).toBe("Failed to fetch clips");
	});
});
