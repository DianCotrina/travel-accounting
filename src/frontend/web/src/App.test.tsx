import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders the new landing page hero and pricing section", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", {
        name: /track foreign travel expenses without losing accounting clarity/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /pricing for solo travelers and finance-aware teams/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /start free trial/i })).toHaveLength(2);
    expect(
      screen.getByRole("link", { name: /get early access/i }),
    ).toBeInTheDocument();
  });
});
