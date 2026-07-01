import { createSessionCookie, hasAdminConfig } from "../../_lib/auth.js";
import { json } from "../../_lib/http.js";

export async function onRequestPost({ request, env }) {
  if (!hasAdminConfig(env)) {
    return json({ error: "Admin login is not configured." }, 503);
  }

  const body = await request.json().catch(() => ({}));
  if (body.password !== env.ADMIN_PASSWORD) {
    return json({ error: "Wrong password." }, 401);
  }

  return json(
    { ok: true },
    200,
    {
      "Set-Cookie": await createSessionCookie(env),
    },
  );
}

