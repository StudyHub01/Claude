import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  plan: string;
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;
  if (!sessionToken) return null;

  try {
    const decoded = Buffer.from(sessionToken, "base64").toString("utf-8");
    const { userId, expires } = JSON.parse(decoded);
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

export function createSessionToken(userId: string): string {
  const data = JSON.stringify({ userId, expires: Date.now() + 30 * 24 * 60 * 60 * 1000 });
  return Buffer.from(data).toString("base64");
}
