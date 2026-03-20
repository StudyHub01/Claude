import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";
import { prisma } from "./prisma";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  plan: string;
}

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET environment variable is not set");
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function createSessionToken(userId: string): string {
  const payload = Buffer.from(
    JSON.stringify({ userId, expires: Date.now() + 30 * 24 * 60 * 60 * 1000 })
  ).toString("base64url");
  const sig = sign(payload);
  return `${payload}.${sig}`;
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;
  if (!sessionToken) return null;

  try {
    const [payload, sig] = sessionToken.split(".");
    if (!payload || !sig) return null;

    const expectedSig = sign(payload);
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) return null;

    const { userId, expires } = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"));
    if (Date.now() > expires) return null;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, plan: true },
    });
    return user;
  } catch {
    return null;
  }
}
