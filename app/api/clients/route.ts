import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clients = await prisma.client.findMany({
    where: { userId: user.id },
    include: { projects: true, invoices: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(clients);
}

export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clientCount = await prisma.client.count({ where: { userId: user.id } });
  if (user.plan === "starter" && clientCount >= 3) {
    return NextResponse.json({ error: "Starter plan limited to 3 clients. Upgrade to Pro." }, { status: 403 });
  }

  const { name, email, company, phone } = await req.json();
  const client = await prisma.client.create({
    data: { userId: user.id, name, email, company, phone },
  });
  return NextResponse.json(client, { status: 201 });
}
