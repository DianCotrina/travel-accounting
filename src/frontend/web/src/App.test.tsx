import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders the new landing page hero and pricing section", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", {
        name: /record foreign travel expenses with accounting clarity built in/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /pricing for travelers and teams that care about clean records/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /start free trial/i })).toHaveLength(2);
    expect(
      screen.getByRole("link", { name: /get early access/i }),
    ).toBeInTheDocument();
  });
});
