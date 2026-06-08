import { randomUUID } from "node:crypto";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

export type LeadKind = "consulting_proposal" | "consulting_meeting" | "roi_report";

export type LeadRecord = {
  readonly id: string;
  readonly kind: LeadKind;
  readonly source: "autohub-ai";
  readonly createdAt: string;
  readonly payload: Readonly<Record<string, unknown>>;
};

// Serverless runtimes (Vercel lambda) have a read-only filesystem except /tmp
const defaultLeadsDir = process.env.VERCEL ? "/tmp/autohub-leads" : path.join(process.cwd(), "data");
const leadsDirectory = process.env.LEADS_DIR ?? defaultLeadsDir;
const leadsFile = process.env.LEADS_FILE ?? path.join(leadsDirectory, "leads.jsonl");

function isSupabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY);
}

async function saveToSupabase(record: LeadRecord): Promise<void> {
  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
  );

  const { error } = await supabase.from("leads").insert({
    id: record.id,
    kind: record.kind,
    source: record.source,
    created_at: record.createdAt,
    payload: record.payload,
  });

  if (error) {
    throw new Error(`Supabase insert 실패: ${error.message}`);
  }
}

async function saveToFile(record: LeadRecord): Promise<void> {
  await mkdir(path.dirname(leadsFile), { recursive: true });
  await appendFile(leadsFile, `${JSON.stringify(record)}\n`, "utf8");
}

export async function saveLead(
  kind: LeadKind,
  payload: Readonly<Record<string, unknown>>,
): Promise<LeadRecord> {
  const record: LeadRecord = {
    id: randomUUID(),
    kind,
    source: "autohub-ai",
    createdAt: new Date().toISOString(),
    payload,
  };

  if (isSupabaseConfigured()) {
    try {
      await saveToSupabase(record);
    } catch (err) {
      console.error("[LeadStore] Supabase 저장 실패, JSONL 폴백:", err);
      await saveToFile(record);
    }
  } else {
    await saveToFile(record);
  }

  return record;
}

export function getLeadStoragePath(): string {
  return leadsFile;
}
