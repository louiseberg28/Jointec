export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });
}

export function getDatabase(env) {
  return env.JOINTEC_DB || env.LEADS_DB || env.DB || null;
}

