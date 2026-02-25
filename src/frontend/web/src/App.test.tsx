import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders the landing page hero and preview section", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", {
        name: /record expenses abroad and understand the impact/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /show the workflow in a short demo video/i,
      }),
    ).toBeInTheDocument();
  });
});
