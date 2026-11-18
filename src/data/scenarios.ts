import type {
  Entity, EntityCategory, EvidenceDocument, Relationship, RelationshipType,
  Scenario, TimelineEvent,
} from "@/types";

/**
 * Fictional investigation scenarios.
 * All names, documents, and events below are invented for educational use.
 */

type EntityTuple = [string, EntityCategory, string];
type RelTuple = [string, string, RelationshipType, string];
type EventTuple = [string, string | null, string, string, TimelineEvent["status"]];

const ENTITY_TUPLES: EntityTuple[] = [
  ["e01", "person", "Director Elara Vance"],
  ["e02", "person", "Dr. Cassian Reed"],
  ["e03", "person", "Mira Solano"],
  ["e04", "person", "Jonah Petrov"],
  ["e05", "person", "Iris Kwon"],
  ["e06", "organization", "Meridian Group"],
  ["e07", "organization", "Northlight Institute"],
  ["e08", "organization", "Aperture Systems"],
  ["e09", "location", "Vault 14 Archive"],
  ["e10", "location", "Halcyon Campus"],
  ["e11", "project", "Project Nightfall"],
  ["e12", "document", "Nightfall Transfer Memo"],
];

const REL_TUPLES: RelTuple[] = [
  ["e01", "e06", "member_of", "Directorate member"],
  ["e02", "e07", "member_of", "Senior researcher"],
  ["e03", "e08", "member_of", "Systems liaison"],
  ["e04", "e06", "associated_with", "Contracted courier"],
  ["e05", "e07", "associated_with", "Archive clerk"],
  ["e01", "e02", "communicated_with", "Memo exchange"],
  ["e01", "e03", "communicated_with", "Briefing contact"],
  ["e02", "e05", "communicated_with", "Transfer handoff"],
  ["e03", "e04", "associated_with", "Shared access log"],
  ["e06", "e07", "funded", "Research grant"],
  ["e07", "e11", "associated_with", "Research sponsor"],
  ["e08", "e11", "associated_with", "Infrastructure provider"],
  ["e06", "e10", "located_at", "Registered office"],
  ["e07", "e09", "located_at", "Archive repository"],
  ["e01", "e12", "authored", "Memo author"],
  ["e12", "e11", "referenced", "Memo subject"],
  ["e04", "e10", "located_at", "Access recorded"],
  ["e05", "e12", "referenced", "Memo recipient"],
];

const EVENT_TUPLES: EventTuple[] = [
  ["ev01", "2019-02-11", "Research charter drafted", "e02"],
  ["ev02", "2019-06-03", "Meridian grant approved", "e06"],
  ["ev03", "2019-09-19", "Northlight program initiated", "e07"],
  ["ev04", "2020-01-14", "Vault 14 inventory recorded", "e09"],
  ["ev05", "2020-04-08", "Aperture systems contract", "e08"],
  ["ev06", "2020-07-22", "Staff access review", "e05"],
  ["ev07", "2021-01-10", "Nightfall workstream opened", "e11"],
  ["ev08", "2021-05-30", "Internal memo circulated", "e12"],
  ["ev09", "2021-08-16", "Campus briefing held", "e10"],
  ["ev10", "2022-02-04", "Transfer memo revised", "e12"],
  ["ev11", "2022-06-21", "Courier access logged", "e04"],
  ["ev12", "2022-11-09", "Second grant amendment", "e06"],
  ["ev13", "2023-03-17", "Archive reconciliation", "e09"],
  ["ev14", null, "Undated courier sighting", "e04"],
  ["ev15", "2023-10-05", "Final archive audit", "e07"],
  ["ev16", "2024-01-19", "Project status review", "e01"],
];

const EVIDENCE_TUPLES: [string, EvidenceDocument["type"], EvidenceDocument["category"], string][] = [
  ["d01", "md", "memo", "Nightfall Transfer Memo. Prepared for the Meridian Group directorate. Distribution limited to the research oversight circle. Reference: nightfall transfer memo."],
  ["d02", "txt", "report", "Northlight Institute quarterly research report. The Meridian Group funding amendment appears in section four. Project Nightfall milestones remain under review."],
  ["d03", "csv", "registry", "id,entity,role\ne01,Elara Vance,director\ne02,Cassian Reed,researcher\ne03,Mira Solano,liaison"],
  ["d04", "md", "log", "Vault 14 access log. Courier Jonah Petrov signed in at Halcyon Campus. The archive reconciliation followed the transfer memo."],
  ["d05", "json", "correspondence", JSON.stringify({ from: "elara.vance@meridian-io.example", to: "cassian.reed@northlight.example", subject: "Nightfall memo", date: "2021-05-30" })],
  ["d06", "txt", "note", "Undated note found near the archive desk. Mentions an unverified courier sighting; no precise time can be established."],
  ["d07", "md", "report", "Aperture Systems infrastructure review. Meridian Group, Northlight Institute and Project Nightfall share overlapping service windows."],
  ["d08", "csv", "log", "timestamp,event,entity\n2022-06-21,courier access,e04\n2023-03-17,reconciliation,e09\n2024-01-19,status review,e11"],
];

interface ScenarioSeed {
  id: string;
  title: string;
  description: string;
  category: string;
  createdAt: string;
  lastActivity: string;
  code: string;
  lead: string;
  org: string;
  place: string;
  project: string;
}

const SEEDS: ScenarioSeed[] = [
  {
    id: "INV-001", title: "Project Nightfall",
    description: "A fictional technology research archive with interconnected memoranda, funding records, and access logs.",
    category: "Research Archive", createdAt: "2024-01-12", lastActivity: "2024-02-03", code: "NIGHTFALL",
    lead: "Director Elara Vance", org: "Meridian Group", place: "Vault 14 Archive", project: "Project Nightfall",
  },
  {
    id: "INV-002", title: "The Meridian Archive",
    description: "A fictional historical records investigation involving dated transfers, organizational relationships, and contested chronology.",
    category: "Historical Records", createdAt: "2024-02-18", lastActivity: "2024-03-11", code: "MERIDIAN",
    lead: "Mira Solano", org: "Northlight Institute", place: "Halcyon Campus", project: "Archive Restoration",
  },
  {
    id: "INV-003", title: "Echo Protocol",
    description: "A fictional communications analysis scenario centered on repeated phrases, message cadence, and event timelines.",
    category: "Communications", createdAt: "2024-04-02", lastActivity: "2024-04-29", code: "ECHO",
    lead: "Iris Kwon", org: "Aperture Systems", place: "Relay Station 7", project: "Echo Protocol",
  },
  {
    id: "INV-004", title: "Glass Horizon",
    description: "A fictional corporate research scenario involving project reports, shared vendors, and financial relationships.",
    category: "Corporate Research", createdAt: "2024-05-20", lastActivity: "2024-06-14", code: "GLASS",
    lead: "Dr. Cassian Reed", org: "Meridian Group", place: "Glass Tower Annex", project: "Glass Horizon",
  },
];

function buildScenario(seed: ScenarioSeed): Scenario {
  const custom = (s: string) =>
    s.replaceAll("Nightfall", seed.code).replaceAll("Meridian Group", seed.org)
      .replaceAll("Northlight Institute", "Northlight Institute")
      .replaceAll("Vault 14 Archive", seed.place)
      .replaceAll("Halcyon Campus", seed.place)
      .replaceAll("Project Nightfall", seed.project);

  const entities: Entity[] = ENTITY_TUPLES.map(([suffix, category, base]) => ({
    id: `${seed.id}-${suffix}`,
    investigationId: seed.id,
    name: custom(base),
    category,
    description: custom(`${base} — referenced across the ${seed.category.toLowerCase()} case file.`),
    evidenceRefs: [`${seed.id}-d01`, `${seed.id}-d04`],
    extractionMethod: "explicit fictional dataset",
    confidence: 0.95,
    notes: "",
  }));

  const relationships: Relationship[] = REL_TUPLES.map(([a, b, type, label], i) => ({
    id: `${seed.id}-r${String(i + 1).padStart(2, "0")}`,
    investigationId: seed.id,
    source: `${seed.id}-${a}`,
    target: `${seed.id}-${b}`,
    type,
    label,
    evidenceRefs: [`${seed.id}-d0${(i % 8) + 1}`],
  }));

  const events: TimelineEvent[] = EVENT_TUPLES.map(([suffix, date, title, refs, status], i) => ({
    id: `${seed.id}-${suffix}`,
    investigationId: seed.id,
    title: custom(title),
    description: custom(`${title} recorded in the ${seed.category.toLowerCase()} case file.`),
    date,
    category: (["document", "meeting", "transaction", "communication", "system", "observation"] as const)[i % 6],
    evidenceRefs: [`${seed.id}-d0${(i % 8) + 1}`],
    entityRefs: [`${seed.id}-${refs}`],
    source: `${seed.id}-d0${(i % 8) + 1}`,
    status,
    ambiguousTime: date === null,
  }));

  const evidence: EvidenceDocument[] = EVIDENCE_TUPLES.map(([suffix, type, category, content]) => ({
    id: `${seed.id}-${suffix}`,
    investigationId: seed.id,
    filename: `${seed.code.toLowerCase()}-${suffix}.${type}`,
    type,
    category,
    content: custom(content),
    sourceType: "scenario",
    importedAt: seed.createdAt,
    wordCount: custom(content).split(/\s+/).length,
  }));

  return {
    investigation: {
      id: seed.id, title: seed.title, description: seed.description,
      status: "active", category: seed.category,
      createdAt: seed.createdAt, lastActivity: seed.lastActivity,
    },
    entities, relationships, events, evidence,
  };
}

export const SCENARIOS: Scenario[] = SEEDS.map(buildScenario);

/** Flat views used across modules. */
export const INVESTIGATIONS = SCENARIOS.map((s) => s.investigation);
export const ENTITIES = SCENARIOS.flatMap((s) => s.entities);
export const RELATIONSHIPS = SCENARIOS.flatMap((s) => s.relationships);
export const EVENTS = SCENARIOS.flatMap((s) => s.events);
export const EVIDENCE = SCENARIOS.flatMap((s) => s.evidence);

export function getScenario(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.investigation.id === id);
}

/** Validate referential integrity of a dataset (used by tests). */
export function validateScenario(s: Scenario): string[] {
  const errors: string[] = [];
  const entityIds = new Set(s.entities.map((e) => e.id));
  const evidenceIds = new Set(s.evidence.map((e) => e.id));
  for (const r of s.relationships) {
    if (!entityIds.has(r.source) || !entityIds.has(r.target)) errors.push(`bad relationship ${r.id}`);
    if (r.evidenceRefs.some((ref) => !evidenceIds.has(ref))) errors.push(`bad relationship evidence ${r.id}`);
  }
  for (const e of s.events) {
    if (e.entityRefs.some((ref) => !entityIds.has(ref))) errors.push(`bad event entity ${e.id}`);
    if (e.evidenceRefs.some((ref) => !evidenceIds.has(ref))) errors.push(`bad event evidence ${e.id}`);
  }
  return errors;
}
