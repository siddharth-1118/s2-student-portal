// app/api/timetable/create/route.ts
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
  const { day, period, subject, room } = body as {
    day: string;
    period: number;
    subject: string;
    room?: string | null;
  };

  // Validate input
  if (!day || !subject || period <= 0) {
    return NextResponse.json(
      { error: "Day, period, and subject are required. Period must be greater than 0." },
      { status: 400 }
    );
  }

  try {
    const newEntry = await prisma.timetableEntry.create({
      data: {
        day,
        period,
        subject,
        room: room || null,
      },
    });

    return NextResponse.json(newEntry);
  } catch (e) {
    console.error("Timetable create error:", e);
    return NextResponse.json(
      { error: "Failed to create timetable entry" },
      { status: 500 },
    );
  }
}