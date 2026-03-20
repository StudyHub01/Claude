import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await req.json();

  // Allow both authenticated freelancer and public client portal to update
  const user = await getSession();
  if (user) {
    await prisma.deliverable.update({ where: { id }, data });
  } else {
    // From client portal — only allow status + feedback
    await prisma.deliverable.update({
      where: { id },
      data: { status: data.status, feedback: data.feedback },
    });
  }

  const updated = await prisma.deliverable.findUnique({ where: { id } });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.deliverable.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
