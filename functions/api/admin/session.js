import { hasAdminConfig, isAuthenticated } from "../../_lib/auth.js";
import { json } from "../../_lib/http.js";
import { hasDatabaseConfig, missingDatabaseConfig } from "../../_lib/leads-store.js";

export async function onRequestGet({ request, env }) {
  return json({
    authenticated: await isAuthenticated(request, env),
    adminConfigured: hasAdminConfig(env),
    databaseConfigured: hasDatabaseConfig(env),
    missingDatabaseEnv: missingDatabaseConfig(env),
    emailConfigured: Boolean(env.RESEND_API_KEY),
  });
}

