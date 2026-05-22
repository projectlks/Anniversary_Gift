import { createHash } from "node:crypto";

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function hashPasscode(passcode: string): string {
  const pepper = process.env.PASSCODE_PEPPER ?? "";
  return createHash("sha256").update(`${passcode}:${pepper}`).digest("hex");
}

export function verifyPasscode(passcode: string, hash: string): boolean {
  return hashPasscode(passcode) === hash;
}
