// __tests__/layout.test.tsx
import { render, screen } from "@testing-library/react";
import RootLayout from "@/app/layout";

describe("RootLayout", () => {
	it("renders the layout with correct HTML structure", () => {
		const mockChildren = <div data-testid="mock-children">Mock Children</div>;

		// Render the layout with mock children
		render(<RootLayout>{mockChildren}</RootLayout>);

		// Check if the HTML element has the correct lang attribute
		const htmlElement = document.querySelector("html");
		expect(htmlElement).toHaveAttribute("lang", "en");

		// Check if the body element has the correct font variables
		const bodyElement = document.querySelector("body");
		expect(bodyElement).toHaveClass("antialiased");

		// Check if the header element exists
		const headerElement = document.querySelector("header");
		expect(headerElement).toBeInTheDocument();

		// Check if the main element exists and contains the children
		const mainElement = document.querySelector("main");
		expect(mainElement).toBeInTheDocument();
		expect(screen.getByTestId("mock-children")).toBeInTheDocument();
		expect(screen.getByText(/mock children/i)).toBeInTheDocument();
	});
});
