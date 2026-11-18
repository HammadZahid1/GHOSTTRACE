import { describe, expect, it } from "vitest";
import { sortEvents, filterEvents, groupByMonth } from "@/engines/timeline";
import { detectPatterns } from "@/engines/pattern-detection";
import { buildReport, reportToMarkdown } from "@/engines/reports";
import { validateWorkspace } from "@/utils/workspace-io";
import { SCENARIOS } from "@/data/scenarios";

const scenario = SCENARIOS[0];

describe("timeline engines", () => {
  it("sorts dated events and keeps undated last", () => {
    const sorted = sortEvents(scenario.events);
    expect(sorted[sorted.length - 1].date).toBeNull();
    expect(sortEvents(sorted, "desc")[0].date).not.toBeNull();
  });

  it("filters by query, category and date range", () => {
    expect(filterEvents(scenario.events, { query: "memo" }).length).toBeGreaterThan(0);
    expect(filterEvents(scenario.events, { from: "2023-01-01" }).every((e) => e.date === null || e.date >= "2023-01-01")).toBe(true);
    expect(filterEvents(scenario.events, { category: "meeting" }).every((e) => e.category === "meeting")).toBe(true);
  });

  it("groups by month", () => {
    expect(groupByMonth(scenario.events).has("undated")).toBe(true);
  });
});

describe("pattern detection", () => {
  it("computes counts from the selected dataset", () => {
    const p = detectPatterns(scenario.evidence, scenario.entities, scenario.events, scenario.relationships);
    expect(p.repeatedTerms.length).toBeGreaterThan(0);
    expect(p.temporalClusters.length).toBeGreaterThan(0);
    expect(p.eventFrequency.reduce((n, e) => n + e.count, 0)).toBe(scenario.events.length);
    expect(p.explanations.cooccurrence).toContain("documents");
  });
});

describe("report generation", () => {
  it("builds a report with classified sections and exports Markdown", () => {
    const report = buildReport(scenario, "Test Report", ["overview", "entities", "unverified"], "hypothesis note");
    expect(report.sections).toHaveLength(3);
    expect(report.sections.find((s) => s.key === "unverified")?.kind).toBe("hypothesis");
    const md = reportToMarkdown(report);
    expect(md).toContain("# Test Report");
    expect(md).toContain("fictional");
  });
});

describe("workspace import validation", () => {
  it("rejects malformed bundles", () => {
    expect(() => validateWorkspace(null)).toThrow();
    expect(() => validateWorkspace({ format: "other", version: 1, data: {} })).toThrow();
    expect(() => validateWorkspace({ format: "ghosttrace-workspace", version: 1, data: { evil: {} } })).toThrow();
    expect(validateWorkspace({ format: "ghosttrace-workspace", version: 1, data: {} }).version).toBe(1);
  });
});
