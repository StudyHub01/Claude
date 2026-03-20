import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const invoices = await prisma.invoice.findMany({
    where: { userId: user.id },
    include: { client: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(invoices);
}

export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { clientId, amount, description, dueDate } = await req.json();
  const invoice = await prisma.invoice.create({
    data: {
      userId: user.id,
      clientId,
      amount: parseFloat(amount),
      description,
      dueDate: dueDate ? new Date(dueDate) : null,
    },
    include: { client: true },
  });
  return NextResponse.json(invoice, { status: 201 });
}
