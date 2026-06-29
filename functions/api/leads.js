const requiredFields = ["name", "company", "email", "country", "machineInterest", "sourcePage"];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const graphRoot = "https://graph.microsoft.com/v1.0";
const graphEnv = ["MS_CLIENT_ID", "MS_CLIENT_SECRET", "MS_LIST_ID"];
const graphAliases = {
  MS_TENANT_ID: ["MS_TENANT_ID", "AZURE_TENANT_ID", "TENANT_ID", "MICROSOFT_TENANT_ID"],
  MS_CLIENT_ID: ["MS_CLIENT_ID", "AZURE_CLIENT_ID", "CLIENT_ID", "MICROSOFT_CLIENT_ID"],
  MS_CLIENT_SECRET: ["MS_CLIENT_SECRET", "AZURE_CLIENT_SECRET", "CLIENT_SECRET", "MICROSOFT_CLIENT_SECRET"],
  MS_SITE_ID: ["MS_SITE_ID", "SHAREPOINT_SITE_ID", "SITE_ID", "MICROSOFT_SITE_ID"],
  MS_LIST_ID: ["MS_LIST_ID", "SHAREPOINT_LIST_ID", "LIST_ID", "MICROSOFT_LIST_ID"],
  MS_SITE_SEARCH: ["MS_SITE_SEARCH", "SHAREPOINT_SITE_SEARCH"],
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function missingGraphConfig(env) {
  const graphConfig = getGraphConfig(env);
  return graphEnv.filter((name) => !graphConfig[name]);
}

function hasGraphConfig(env) {
  return missingGraphConfig(env).length === 0;
}

function firstEnv(env, names) {
  return names.map((name) => env[name]).find((value) => String(value || "").trim()) || "";
}

function getGraphConfig(env) {
  return Object.fromEntries(
    Object.entries(graphAliases).map(([key, aliases]) => [key, firstEnv(env, aliases)]),
  );
}

function toMicrosoftFields(record) {
  return {
    Title: record.name,
    Company: record.company,
    Email: record.email,
    Phone: record.phone || "",
    Country: record.country,
    MachineInterest: record.machineInterest,
    SourcePage: record.sourcePage,
    LeadStatus: record.status || "New lead",
    Message: record.message || "",
    Notes: record.notes || "",
    Consent: record.consent ? "Yes" : "No",
    CreatedDate: record.createdAt || new Date().toISOString(),
  };
}

async function getAccessToken(env) {
  const graphConfig = getGraphConfig(env);
  const tenantId = graphConfig.MS_TENANT_ID || "organizations";
  const tokenResponse = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: graphConfig.MS_CLIENT_ID,
      client_secret: graphConfig.MS_CLIENT_SECRET,
      scope: "https://graph.microsoft.com/.default",
      grant_type: "client_credentials",
    }),
  });

  if (!tokenResponse.ok) {
    const text = await tokenResponse.text();
    throw new Error(`Microsoft token request failed with ${tokenResponse.status}: ${text}`);
  }

  const data = await tokenResponse.json();
  return data.access_token;
}

async function graphFetch(path, accessToken, options = {}) {
  const response = await fetch(`${graphRoot}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Microsoft Graph request failed with ${response.status}: ${text}`);
  }

  return response;
}

async function resolveSiteId(env, accessToken) {
  const graphConfig = getGraphConfig(env);
  if (graphConfig.MS_SITE_ID) return graphConfig.MS_SITE_ID;

  const query = encodeURIComponent(graphConfig.MS_SITE_SEARCH || "Jointec");
  const sitesResponse = await graphFetch(`/sites?search=${query}`, accessToken);
  const sitesData = await sitesResponse.json();
  const sites = Array.isArray(sitesData.value) ? sitesData.value : [];

  for (const site of sites) {
    if (!site.id) continue;

    try {
      await graphFetch(`/sites/${site.id}/lists/${graphConfig.MS_LIST_ID}`, accessToken);
      return site.id;
    } catch {
      // Keep searching; this site does not contain the configured list.
    }
  }

  throw new Error(
    "SharePoint site could not be resolved. Set MS_SITE_ID or SHAREPOINT_SITE_ID in Cloudflare Pages.",
  );
}

async function createLeadItem(env, record) {
  const graphConfig = getGraphConfig(env);
  const accessToken = await getAccessToken(env);
  const siteId = await resolveSiteId(env, accessToken);
  const response = await fetch(`${graphRoot}/sites/${siteId}/lists/${graphConfig.MS_LIST_ID}/items`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fields: toMicrosoftFields(record) }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Microsoft Graph request failed with ${response.status}: ${text}`);
  }
}

export async function onRequestPost({ request, env }) {
  let lead;

  try {
    lead = await request.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const missing = requiredFields.filter((field) => !String(lead[field] || "").trim());
  if (missing.length || !emailPattern.test(String(lead.email || "")) || lead.consent !== true) {
    return json({ error: "Invalid lead submission" }, 400);
  }

  const record = {
    ...lead,
    createdAt: lead.createdAt || new Date().toISOString(),
    status: lead.status || "New lead",
    notes: lead.notes || "",
  };

  if (!hasGraphConfig(env)) {
    return json(
      {
        error: "Lead database is not configured in Cloudflare Pages.",
        missingMicrosoftEnv: missingGraphConfig(env),
      },
      501,
    );
  }

  try {
    await createLeadItem(env, record);
    return json({ ok: true }, 201);
  } catch (error) {
    return json(
      {
        error: "Lead integration failed.",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
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
