import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: projectId } = await params;
  const { content, senderType, senderName } = await req.json();

  const user = await getSession();
  if (senderType === "freelancer" && !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const message = await prisma.message.create({
    data: { projectId, content, senderType, senderName },
  });
  return NextResponse.json(message, { status: 201 });
}
