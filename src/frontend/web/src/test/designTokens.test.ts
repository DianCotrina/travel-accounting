import { describe, expect, it } from "vitest";

// Design-token guard (DESIGN.md): colors live only in src/tailwind.css as custom properties.
// Components must reference tokens (var(--copper), var(--graphite-surface), ...), never raw
// hex/rgb literals, so the palette stays unified and can change in one place.
const styles = import.meta.glob<string>("/src/**/*.css", { query: "?raw", import: "default", eager: true });
const scripts = import.meta.glob<string>(["/src/**/*.tsx", "/src/**/*.ts", "!/src/**/*.test.*"], {
  query: "?raw",
  import: "default",
  eager: true,
});

const TOKEN_SOURCE = "/src/tailwind.css";
// Third-party brand marks that must keep their official colors, and an unused vendor demo.
const ALLOWED = new Set(["/src/components/ui/SignInModal.tsx", "/src/components/ui/shooting-stars-demo.tsx"]);
const COLOR_LITERAL = /#[0-9a-f]{3,8}\b|rgba?\(\s*\d/gi;

function violations(files: Record<string, string>): string[] {
  return Object.entries(files)
    .filter(([file]) => file !== TOKEN_SOURCE && !ALLOWED.has(file))
    .flatMap(([file, source]) =>
      source.split("\n").flatMap((line, i) => {
        const hits = line.match(COLOR_LITERAL)?.filter((hit) => !/^#[0-9a-f]{3,8}$/i.test(hit) || !isIdSelector(line, hit));
        return hits?.length ? [`${file}:${i + 1} ${hits.join(", ")}`] : [];
      }),
    );
}

// `#root`, `#landing-main` and similar are selectors, not colors: only hex-looking ids could collide.
function isIdSelector(line: string, hit: string): boolean {
  return new RegExp(`${hit}[\\s,{:.\\[>]`).test(line) && !/:\s*[^;]*$/.test(line.split(hit)[0]);
}

describe("design tokens", () => {
  it("defines the DESIGN.md palette in the token source", () => {
    const tokens = styles[TOKEN_SOURCE];
    for (const name of ["--copper", "--graphite", "--graphite-surface", "--graphite-raised", "--ivory", "--stone", "--ash"]) {
      expect(tokens, `missing ${name}`).toMatch(new RegExp(`${name}:\\s*oklch\\(`));
    }
  });

  it("keeps raw color literals out of component styles", () => {
    expect(violations(styles)).toEqual([]);
  });

  it("keeps raw color literals out of components", () => {
    expect(violations(scripts)).toEqual([]);
  });
});
