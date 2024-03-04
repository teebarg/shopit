import "@testing-library/jest-dom";
import { render, screen, fireEvent, act } from "@testing-library/react";
import DeleteButton from "@/components/core/DeleteButton";

// Mock the HTTP module
jest.mock("@/lib/http", () => ({
    Http: jest.fn(() => Promise.resolve()),
}));

// Mock the action module
jest.mock("@/app/actions", () => ({
    action: jest.fn(() => Promise.resolve()),
}));

// Mock the Confirm component
jest.mock("@/components/core/Confirm", () => (props: any) => {
    const { onConfirm } = props;
    return (
        <div>
            <button onClick={onConfirm}>Confirm</button>
            <button>Close</button>
        </div>
    );
});

describe("DeleteButton", () => {
    const mockId = "1";
    const mockPath = "user";

    it("should render the button with children", () => {
        render(
            <DeleteButton path={mockPath} id={mockId}>
                Delete
            </DeleteButton>
        );
        const deleteButton = screen.getByText("Delete");
        expect(deleteButton).toBeInTheDocument();
    });

    it("should open the confirmation dialog when clicked", () => {
        render(
            <DeleteButton path={mockPath} id={mockId}>
                Delete
            </DeleteButton>
        );
        const deleteButton = screen.getByText("Delete");
        fireEvent.click(deleteButton);
        const confirmationDialog = screen.getByText("Confirm");
        expect(confirmationDialog).toBeInTheDocument();
    });

    it("should call the delete API and close the confirmation dialog when confirmed", async () => {
        render(
            <DeleteButton path={mockPath} id={mockId}>
                Delete
            </DeleteButton>
        );
        const deleteButton = screen.getByText("Delete");
        fireEvent.click(deleteButton);
        const confirmButton = screen.getByText("Confirm");
        await act(async () => {
            fireEvent.click(confirmButton);
        });

        // Now you can assert that your mocked functions were called as expected
        expect(jest.requireMock("@/lib/http").Http).toHaveBeenCalledWith(`/user/${mockId}`, "DELETE", {});
        expect(jest.requireMock("@/app/actions").action).toHaveBeenCalledWith("tags");

        expect(await screen.queryByText("Confirm")).not.toBeInTheDocument();
    });
});
