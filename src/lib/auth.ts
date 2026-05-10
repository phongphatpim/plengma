import type { NextRequest } from "next/server";

export const ADMIN_SESSION_COOKIE = "plengma_admin_session";
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function getAdminPassword(): string | null {
  const password = process.env.ADMIN_PASSWORD?.trim();
  return password ? password : null;
}

async function buildSessionToken(): Promise<string | null> {
  const password = getAdminPassword();
  if (!password) return null;
  return sha256Hex(`plengma-admin:${password}`);
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const savedPassword = getAdminPassword();
  if (!savedPassword) return false;
  return password.trim() === savedPassword;
}

export async function createAdminSession(): Promise<string | null> {
  return buildSessionToken();
}

export async function verifyAdminSessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const expected = await buildSessionToken();
  if (!expected) return false;
  return token === expected;
}

export async function getAdminSessionFromRequest(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  return verifyAdminSessionToken(token);
}
