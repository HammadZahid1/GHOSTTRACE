/** Shared domain types for GHOSTTRACE (all data is fictional). */

export type EntityCategory =
  | "person"
  | "organization"
  | "location"
  | "project"
  | "event"
  | "document";

export type RelationshipType =
  | "associated_with"
  | "member_of"
  | "located_at"
  | "authored"
  | "referenced"
  | "funded"
  | "communicated_with"
  | "participated_in";

export interface Entity {
  id: string;
  investigationId: string;
  name: string;
  category: EntityCategory;
  description: string;
  evidenceRefs: string[];
  extractionMethod: string;
  confidence: number; // reliability of extraction method, not guilt probability
  notes: string;
}

export interface Relationship {
  id: string;
  investigationId: string;
  source: string;
  target: string;
  type: RelationshipType;
  label: string;
  evidenceRefs: string[];
}

export interface TimelineEvent {
  id: string;
  investigationId: string;
  title: string;
  description: string;
  date: string | null;
  category: "document" | "meeting" | "transaction" | "communication" | "system" | "observation";
  evidenceRefs: string[];
  entityRefs: string[];
  source: string;
  status: "verified" | "review" | "unverified";
  ambiguousTime?: boolean;
}

export interface EvidenceDocument {
  id: string;
  investigationId: string;
  filename: string;
  type: "txt" | "csv" | "json" | "md";
  content: string;
  category: "memo" | "report" | "log" | "correspondence" | "registry" | "note";
  sourceType: "scenario" | "local";
  importedAt: string;
  wordCount: number;
}

export interface Investigation {
  id: string;
  title: string;
  description: string;
  status: "active" | "archived";
  category: string;
  createdAt: string;
  lastActivity: string;
  archived?: boolean;
  duplicatedFrom?: string;
}

export interface Scenario {
  investigation: Investigation;
  entities: Entity[];
  relationships: Relationship[];
  events: TimelineEvent[];
  evidence: EvidenceDocument[];
}
