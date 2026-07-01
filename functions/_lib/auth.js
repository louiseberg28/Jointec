import { json } from "./http.js";

const cookieName = "jointec_admin";
const maxAge = 60 * 60 * 12;

function textEncoder() {
  return new TextEncoder();
}

function toHex(buffer) {
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function sign(value, secret) {
  const key = await crypto.subtle.importKey(
    "raw",
    textEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, textEncoder().encode(value));
  return toHex(signature);
}

function getCookie(request, name) {
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : "";
}

export function hasAdminConfig(env) {
  return Boolean(env.ADMIN_PASSWORD && env.ADMIN_SESSION_SECRET);
}

export async function createSessionCookie(env) {
  const timestamp = Date.now().toString();
  const signature = await sign(timestamp, env.ADMIN_SESSION_SECRET);
  const value = `${timestamp}.${signature}`;

  return `${cookieName}=${encodeURIComponent(value)}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`;
}

export function clearSessionCookie() {
  return `${cookieName}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`;
}

export async function isAuthenticated(request, env) {
  if (!hasAdminConfig(env)) return false;

  const value = getCookie(request, cookieName);
  const [timestamp, signature] = value.split(".");
  if (!timestamp || !signature) return false;

  const age = Date.now() - Number(timestamp);
  if (!Number.isFinite(age) || age < 0 || age > maxAge * 1000) return false;

  const expected = await sign(timestamp, env.ADMIN_SESSION_SECRET);
  return signature === expected;
}

export async function requireAdmin(request, env) {
  if (await isAuthenticated(request, env)) return null;
  return json({ error: "Unauthorized" }, 401);
}

