import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const projects = await prisma.project.findMany({
    where: { userId: user.id },
    include: { client: true, deliverables: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, description, clientId, status, deadline } = await req.json();
  const project = await prisma.project.create({
    data: {
      userId: user.id,
      clientId,
      title,
      description,
      status: status ?? "active",
      deadline: deadline ? new Date(deadline) : null,
    },
    include: { client: true },
  });
  return NextResponse.json(project, { status: 201 });
}
