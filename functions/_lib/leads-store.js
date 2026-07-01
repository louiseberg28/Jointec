import { getDatabase } from "./http.js";

const tableSql = `
  CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    name TEXT NOT NULL,
    company TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    country TEXT NOT NULL,
    machine_interest TEXT NOT NULL,
    source_page TEXT NOT NULL,
    message TEXT,
    consent INTEGER NOT NULL DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'New lead',
    notes TEXT NOT NULL DEFAULT ''
  )
`;

export function missingDatabaseConfig(env) {
  return getDatabase(env) ? [] : ["JOINTEC_DB"];
}

export function hasDatabaseConfig(env) {
  return missingDatabaseConfig(env).length === 0;
}

export async function ensureLeadsTable(env) {
  const db = getDatabase(env);
  if (!db) throw new Error("Cloudflare D1 database binding JOINTEC_DB is not configured.");

  await db.prepare(tableSql).run();
  return db;
}

export function toPublicLead(row) {
  return {
    id: row.id,
    createdAt: row.created_at,
    name: row.name,
    company: row.company,
    email: row.email,
    phone: row.phone || "",
    country: row.country,
    machineInterest: row.machine_interest,
    sourcePage: row.source_page,
    message: row.message || "",
    consent: Boolean(row.consent),
    status: row.status || "New lead",
    notes: row.notes || "",
  };
}

export async function createLead(env, lead) {
  const db = await ensureLeadsTable(env);

  await db
    .prepare(
      `INSERT INTO leads (
        id, created_at, name, company, email, phone, country, machine_interest,
        source_page, message, consent, status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      lead.id,
      lead.createdAt,
      lead.name,
      lead.company,
      lead.email,
      lead.phone || "",
      lead.country,
      lead.machineInterest,
      lead.sourcePage,
      lead.message || "",
      lead.consent ? 1 : 0,
      lead.status || "New lead",
      lead.notes || "",
    )
    .run();
}

export async function listLeads(env) {
  const db = await ensureLeadsTable(env);
  const result = await db
    .prepare("SELECT * FROM leads ORDER BY created_at DESC")
    .all();

  return (result.results || []).map(toPublicLead);
}

export async function updateLead(env, id, patch) {
  const db = await ensureLeadsTable(env);

  await db
    .prepare("UPDATE leads SET status = COALESCE(?, status), notes = COALESCE(?, notes) WHERE id = ?")
    .bind(patch.status || null, typeof patch.notes === "string" ? patch.notes : null, id)
    .run();
}

