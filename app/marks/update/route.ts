// app/api/marks/update/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const ADMIN_EMAILS = [
  "saisiddharthvooka@gmail.com",
  "kothaig2@srmist.edu.in",
];

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { markId, scored } = body as { markId: number; scored: number };

  try {
    const updated = await prisma.mark.update({
      where: { id: markId },
      data: { scored },
    });

    return NextResponse.json(updated);
  } catch (e) {
    console.error("Mark update error:", e);
    return NextResponse.json(
      { error: "Failed to update mark" },
      { status: 500 },
    );
  }
}
