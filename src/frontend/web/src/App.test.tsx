import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import App from "./App";

afterEach(cleanup);

describe("Landing page", () => {
  it("leads with the product promise and a labeled sample trip as proof", () => {
    render(<App />);

    expect(screen.getByRole("heading", { level: 1, name: /travel expenses with accounting clarity/i })).toBeInTheDocument();
    const sample = screen.getByRole("figure", { name: /sample trip/i });
    expect(within(sample).getByText("Sample trip")).toBeInTheDocument();
    expect(within(sample).getByText("Not converted")).toBeInTheDocument();
  });

  it("never presents invented proof", () => {
    render(<App />);

    expect(screen.queryByText(/trusted by/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/12,480|1\.8M/)).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /testimonials/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/most popular/i)).not.toBeInTheDocument();
  });

  it("uses one CTA label everywhere, and every CTA opens the preview sign-in", () => {
    render(<App />);

    const ctas = screen.getAllByRole("button", { name: "Try the preview" });
    expect(ctas.length).toBeGreaterThanOrEqual(4);
    expect(screen.queryByText(/start free trial|get early access|contact sales/i)).not.toBeInTheDocument();

    for (const cta of ctas) {
      fireEvent.click(cta);
      const dialog = screen.getByRole("dialog", { name: "Try the preview" });
      fireEvent.click(within(dialog).getByRole("button", { name: "Close" }));
    }
  });

  it("marks the Team plan as coming soon instead of linking nowhere", () => {
    render(<App />);
    const team = screen.getByText("Team").closest("article");
    expect(team).not.toBeNull();
    expect(within(team as HTMLElement).getByText("Coming soon")).toBeInTheDocument();
    expect(within(team as HTMLElement).queryByRole("button")).not.toBeInTheDocument();
  });

  it("offers only working sign-in options and says it's a preview", () => {
    render(<App />);
    fireEvent.click(screen.getAllByRole("button", { name: "Try the preview" })[0]);
    const dialog = screen.getByRole("dialog", { name: "Try the preview" });

    expect(within(dialog).getByText(/sacatucuenta is in preview/i)).toBeInTheDocument();
    expect(within(dialog).getByLabelText("Email")).toBeInTheDocument();
    expect(within(dialog).getByLabelText("Password")).toBeInTheDocument();
    expect(within(dialog).queryByRole("button", { name: /gmail|google|phone|icloud|passkey|sign-in link/i })).not.toBeInTheDocument();
    expect(within(dialog).queryByRole("link")).not.toBeInTheDocument();
  });

  it("has exactly one main landmark", () => {
    render(<App />);
    expect(screen.getAllByRole("main")).toHaveLength(1);
  });
});
