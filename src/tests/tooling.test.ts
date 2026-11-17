import { describe, expect, it } from "vitest";

describe("tooling sanity", () => {
  it("vitest runs with the @ path alias resolved", async () => {
    const pkg = await import("../../package.json");
    expect(pkg.default.name).toBe("ghosttrace");
  });
});
