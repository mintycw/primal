/**
 * @jest-environment node
 */

import { NextRequest, NextResponse } from "next/server";
import { POST } from "../reactions/route";
import { connectToDatabase } from "@/lib/db/mongodb";
import { getServerSession } from "next-auth";

// Mock the database connection
jest.mock("@/lib/db/mongodb", () => ({
	connectToDatabase: jest.fn(),
}));

// Mock next-auth
jest.mock("next-auth", () => ({
	getServerSession: jest.fn(),
}));

// Mock auth options
jest.mock("@/lib/auth/authOptions", () => ({
	authOptions: {},
}));

// Mock the constructor for Reaction
const mockReactionSave = jest.fn().mockResolvedValue({ _id: "newReaction" });
jest.mock(
	"@/models/Reaction",
	() => {
		// Create a mock constructor
		function MockReaction() {
			return { save: mockReactionSave };
		}

		// Add static methods
		MockReaction.find = jest.fn();
		MockReaction.findOne = jest.fn();
		MockReaction.findByIdAndDelete = jest.fn();

		return { Reaction: MockReaction };
	},
	{ virtual: true }
);

describe("Reactions API", () => {
	const mockSession = {
		user: {
			_id: "sjoerd",
			toString: () => "sjoerd",
		},
	};

	beforeEach(() => {
		jest.clearAllMocks();

		// Setup default mock implementations
		(connectToDatabase as jest.Mock).mockResolvedValue(undefined);
		(getServerSession as jest.Mock).mockResolvedValue(mockSession);
	});

	describe("POST /api/reactions", () => {
		test("adds a new reaction when it does not exist", async () => {
			// Import the mocked Reaction model
			const { Reaction } = require("@/models/Reaction");

			// Mock Reaction.findOne to return null (reaction doesn't exist)
			Reaction.findOne.mockResolvedValue(null);

			// Create mock request with body
			const req = new NextRequest("http://localhost/api/reactions", {
				method: "POST",
				body: JSON.stringify({ clipId: "clip123", emoji: "🔥" }),
			});

			// Call the API handler
			const response = await POST(req);
			const data = await response.json();

			// Check if the response indicates the reaction was added
			expect(data.action).toBe("added");
			expect(data.emoji).toBe("🔥");
			expect(response.status).toBe(201);
		});

		test("removes an existing reaction", async () => {
			// Import the mocked Reaction model
			const { Reaction } = require("@/models/Reaction");

			// Mock Reaction.findOne to return an existing reaction
			Reaction.findOne.mockResolvedValue({
				_id: "existingReaction",
				emoji: "❤️",
			});

			// Create mock request with body
			const req = new NextRequest("http://localhost/api/reactions", {
				method: "POST",
				body: JSON.stringify({ clipId: "clip123", emoji: "❤️" }),
			});

			// Call the API handler
			const response = await POST(req);
			const data = await response.json();

			// Check if the response indicates the reaction was removed
			expect(data.action).toBe("removed");
			expect(data.emoji).toBe("❤️");
			expect(Reaction.findByIdAndDelete).toHaveBeenCalledWith("existingReaction");
		});
	});
});
