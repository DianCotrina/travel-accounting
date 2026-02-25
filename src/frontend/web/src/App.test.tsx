import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders a blank landing page canvas", () => {
    render(<App />);

    expect(
      screen.getByLabelText(/blank landing page/i),
    ).toBeInTheDocument();
  });
});
