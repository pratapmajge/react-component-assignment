// import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import InputField from "./InputField";

describe("InputField", () => {
  it("renders with label", () => {
    render(<InputField label="Username" placeholder="Enter..." />);
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
  });

  it("shows error message when invalid", () => {
    render(<InputField label="Email" invalid errorMessage="Invalid email" />);
    expect(screen.getByText("Invalid email")).toBeInTheDocument();
  });

  it("clears input when clear button is clicked", () => {
    render(<InputField label="Search" clearable defaultValue="hello" />);
    const input = screen.getByLabelText("Search") as HTMLInputElement;
    fireEvent.click(screen.getByLabelText("Clear input"));
    expect(input.value).toBe("");
  });
});
