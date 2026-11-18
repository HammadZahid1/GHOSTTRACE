import type { TimelineEvent } from "@/types";

export function sortEvents(events: TimelineEvent[], direction: "asc" | "desc" = "asc"): TimelineEvent[] {
  return [...events].sort((a, b) => {
    if (!a.date && !b.date) return a.id.localeCompare(b.id);
    if (!a.date) return 1;  // undated events never receive invented timestamps
    if (!b.date) return -1;
    const d = a.date.localeCompare(b.date);
    return direction === "asc" ? d : -d;
  });
}

export interface EventFilter {
  query?: string;
  category?: string;
  from?: string;
  to?: string;
  reviewed?: boolean;
}

export function filterEvents(events: TimelineEvent[], f: EventFilter): TimelineEvent[] {
  const q = f.query?.toLowerCase() ?? "";
  return events.filter((e) =>
    (!q || `${e.title} ${e.description}`.toLowerCase().includes(q)) &&
    (!f.category || f.category === "all" || e.category === f.category) &&
    (!f.from || (e.date !== null && e.date >= f.from)) &&
    (!f.to || (e.date !== null && e.date <= f.to)) &&
    (f.reviewed === undefined || (e.status === "verified") === f.reviewed),
  );
}

export function groupByMonth(events: TimelineEvent[]): Map<string, TimelineEvent[]> {
  const groups = new Map<string, TimelineEvent[]>();
  for (const e of events) {
    const key = e.date ? e.date.slice(0, 7) : "undated";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(e);
  }
  return groups;
}
