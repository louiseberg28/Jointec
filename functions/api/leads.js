import { sendLeadEmails } from "../_lib/email.js";
import { json } from "../_lib/http.js";
import { createLead, hasDatabaseConfig, missingDatabaseConfig } from "../_lib/leads-store.js";

const requiredFields = ["name", "company", "email", "country", "machineInterest", "sourcePage"];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value) {
  return String(value || "").trim();
}

function normalizeLead(lead) {
  return {
    id: clean(lead.id) || crypto.randomUUID(),
    name: clean(lead.name),
    company: clean(lead.company),
    email: clean(lead.email).toLowerCase(),
    phone: clean(lead.phone),
    country: clean(lead.country),
    machineInterest: clean(lead.machineInterest),
    sourcePage: clean(lead.sourcePage),
    message: clean(lead.message),
    consent: lead.consent === true,
    createdAt: clean(lead.createdAt) || new Date().toISOString(),
    status: clean(lead.status) || "New lead",
    notes: clean(lead.notes),
  };
}

export async function onRequestPost({ request, env }) {
  let lead;

  try {
    lead = normalizeLead(await request.json());
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const missing = requiredFields.filter((field) => !lead[field]);
  if (missing.length || !emailPattern.test(lead.email) || lead.consent !== true) {
    return json({ error: "Invalid lead submission" }, 400);
  }

  if (!hasDatabaseConfig(env)) {
    return json(
      {
        error: "Lead database is not configured in Cloudflare Pages.",
        missingEnv: missingDatabaseConfig(env),
      },
      501,
    );
  }

  try {
    await createLead(env, lead);
  } catch (error) {
    return json(
      {
        error: "Lead database write failed.",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }

  const emailResults = await sendLeadEmails(env, lead);
  const emailSent = emailResults.every((result) => result.status === "fulfilled");

  return json({ ok: true, emailSent }, 201);
}

export function onRequestOptions() {
  return new Response(null, { status: 204 });
}

export function onRequestGet() {
  return json({ error: "Method not allowed" }, 405);
}

export function onRequestPut() {
  return json({ error: "Method not allowed" }, 405);
}

export function onRequestPatch() {
  return json({ error: "Method not allowed" }, 405);
}

export function onRequestDelete() {
  return json({ error: "Method not allowed" }, 405);
}

