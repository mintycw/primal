import { render, screen } from "@testing-library/react";

const MockRootLayout = ({ children }: { children: React.ReactNode }) => (
	<>
		<header></header>
		<main>{children}</main>
	</>
);

describe("RootLayout", () => {
	it("renders the layout with correct HTML structure", () => {
		const mockChildren = <div data-testid="mock-children">Mock Children</div>;

		render(<MockRootLayout>{mockChildren}</MockRootLayout>);

		// Check if header element exists
		expect(screen.getByRole("banner")).toBeInTheDocument(); // "header" als role

		// Checks if main element exists and contains the children
		const mainElement = screen.getByRole("main");
		expect(mainElement).toBeInTheDocument();
		expect(screen.getByTestId("mock-children")).toBeInTheDocument();
		expect(screen.getByText(/mock children/i)).toBeInTheDocument();
	});
});
