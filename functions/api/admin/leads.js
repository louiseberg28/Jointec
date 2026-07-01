import { requireAdmin } from "../../_lib/auth.js";
import { json } from "../../_lib/http.js";
import { hasDatabaseConfig, listLeads, missingDatabaseConfig, updateLead } from "../../_lib/leads-store.js";

export async function onRequestGet({ request, env }) {
  const unauthorized = await requireAdmin(request, env);
  if (unauthorized) return unauthorized;

  if (!hasDatabaseConfig(env)) {
    return json({ error: "Lead database is not configured.", missingEnv: missingDatabaseConfig(env) }, 503);
  }

  return json({ leads: await listLeads(env) });
}

export async function onRequestPatch({ request, env }) {
  const unauthorized = await requireAdmin(request, env);
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => ({}));
  if (!body.id) return json({ error: "Lead id is required." }, 400);

  await updateLead(env, body.id, {
    status: body.status,
    notes: body.notes,
  });

  return json({ ok: true });
}

