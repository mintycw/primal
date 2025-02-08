// __tests__/Button.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "@/components/ButtonExample";

describe("Button Component", () => {
	it("renders the button with the correct text", () => {
		render(<Button label="Click Me" />);
		const buttonElement = screen.getByText(/click me/i);
		expect(buttonElement).toBeInTheDocument();
	});

	it("calls the onClick handler when clicked", async () => {
		const handleClick = jest.fn();
		render(<Button label="Click Me" onClick={handleClick} />);
		const buttonElement = screen.getByTestId("button");
		await userEvent.click(buttonElement);
		expect(handleClick).toHaveBeenCalledTimes(1);
	});
});
