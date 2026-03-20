import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const data = await req.json();
  await prisma.invoice.updateMany({
    where: { id, userId: user.id },
    data: {
      ...data,
      paidAt: data.status === "paid" ? new Date() : data.paidAt,
    },
  });
  const invoice = await prisma.invoice.findUnique({ where: { id }, include: { client: true } });
  return NextResponse.json(invoice);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.invoice.deleteMany({ where: { id, userId: user.id } });
  return NextResponse.json({ ok: true });
}
