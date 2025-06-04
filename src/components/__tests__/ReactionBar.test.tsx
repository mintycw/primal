import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useSession } from "next-auth/react";
import ReactionBar from "../ReactionBar";
import { fetchReactions, toggleReaction } from "@/lib/reactions/fetchReactions";

// Mock the next-auth useSession hook
jest.mock("next-auth/react", () => ({
	useSession: jest.fn(),
}));

// Mock the fetchReactions and toggleReaction functions
jest.mock("@/lib/reactions/fetchReactions", () => ({
	fetchReactions: jest.fn(),
	toggleReaction: jest.fn(),
}));

describe("ReactionBar Component", () => {
	const mockSession = {
		data: {
			user: {
				_id: "sjoerd",
				toString: () => "sjoerd",
			},
		},
		status: "authenticated",
	};

	const mockInitialReactions = [
		{
			emoji: "🔥",
			count: 2,
			users: ["henk", "ahmed"],
			hasReacted: false,
		},
		{
			emoji: "❤️",
			count: 1,
			users: ["sjoerd"],
			hasReacted: true,
		},
	];

	beforeEach(() => {
		// Reset mocks
		jest.clearAllMocks();

		// Setup default mock implementations
		(useSession as jest.Mock).mockReturnValue(mockSession);
		(fetchReactions as jest.Mock).mockResolvedValue(mockInitialReactions);
		(toggleReaction as jest.Mock).mockResolvedValue({ action: "added", emoji: "🔥" });
	});

	test("renders reactions correctly", () => {
		render(<ReactionBar clipId="clip123" initialReactions={mockInitialReactions} />);

		// Check if both reactions are rendered
		expect(screen.getByText("🔥")).toBeInTheDocument();
		expect(screen.getByText("❤️")).toBeInTheDocument();

		// Check if counts are displayed
		expect(screen.getByText("2")).toBeInTheDocument();
		expect(screen.getByText("1")).toBeInTheDocument();

		// Check if the user's reaction has the correct styling (blue background)
		const heartButton = screen.getByText("❤️").closest("button");
		expect(heartButton).toHaveClass("bg-stone-700");

		// Check if the non-reacted emoji has the correct styling
		const fireButton = screen.getByText("🔥").closest("button");
		expect(fireButton).toHaveClass("bg-stone-800");
	});

	test("toggles reaction when clicked", async () => {
		render(<ReactionBar clipId="clip123" initialReactions={mockInitialReactions} />);

		// Click on the fire emoji
		const fireButton = screen.getByText("🔥").closest("button");
		fireEvent.click(fireButton!);

		// Check if toggleReaction was called with the correct parameters
		expect(toggleReaction).toHaveBeenCalledWith("clip123", "🔥");

		// Wait for the UI to update
		await waitFor(() => {
			// Since we mocked toggleReaction to return 'added', the button should now have the blue background
			expect(fireButton).toHaveClass("bg-stone-700");
		});
	});

	test("loads reactions if none provided", async () => {
		// Render without initial reactions
		render(<ReactionBar clipId="clip123" />);

		// Check if fetchReactions was called
		expect(fetchReactions).toHaveBeenCalledWith("clip123");

		// Wait for loading to complete
		await waitFor(() => {
			expect(screen.queryByText("Loading reactions...")).not.toBeInTheDocument();
		});

		// Check if reactions were loaded and displayed
		expect(screen.getByText("🔥")).toBeInTheDocument();
		expect(screen.getByText("❤️")).toBeInTheDocument();
	});
});
