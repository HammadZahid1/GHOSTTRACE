import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { NAV_COMMANDS, NAV_GROUPS } from "@/config/navigation";

const expected = [
  "workspace", "investigations", "evidence", "analyzer", "entities", "graph",
  "timeline", "patterns", "canvas", "reports", "monitor", "settings",
];

describe("application routes", () => {
  it("maps every navigation command to an existing route file", () => {
    const hrefs = NAV_COMMANDS.map((c) => c.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    for (const href of hrefs) {
      const segment = href.replace(/^\//, "");
      const path = resolve(process.cwd(), "src/app/(workspace)", segment, "page.tsx");
      expect(existsSync(path), `${href} -> ${path}`).toBe(true);
    }
  });

  it("covers all required application modules", () => {
    for (const segment of expected) {
      expect(NAV_COMMANDS.some((c) => c.href === `/${segment}`), `/${segment}`).toBe(true);
    }
  });

  it("organizes navigation into four labeled groups", () => {
    expect(NAV_GROUPS.map((g) => g.group)).toEqual(["Intelligence", "Analysis", "Workspace", "System"]);
  });
});
