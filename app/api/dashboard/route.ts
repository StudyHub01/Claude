import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [clients, projects, invoices] = await Promise.all([
    prisma.client.count({ where: { userId: user.id } }),
    prisma.project.findMany({
      where: { userId: user.id },
      include: { client: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.invoice.findMany({ where: { userId: user.id } }),
  ]);

  const totalRevenue = invoices.filter(i => i.status === "paid").reduce((s, i) => s + i.amount, 0);
  const pendingRevenue = invoices.filter(i => i.status === "sent").reduce((s, i) => s + i.amount, 0);
  const activeProjects = await prisma.project.count({ where: { userId: user.id, status: "active" } });

  return NextResponse.json({ clients, totalRevenue, pendingRevenue, activeProjects, recentProjects: projects });
}
