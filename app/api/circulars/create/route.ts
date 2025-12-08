// app/api/circulars/create/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

const ADMIN_EMAILS = [
  "saisiddharthvooka@gmail.com",
  "kothaig2@srmist.edu.in",
];

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  // Check if user is admin
  if (!session || !session.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, content } = await req.json();

    // Validate input
    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    // Create circular
    const circular = await prisma.circular.create({
      data: {
        title,
        content,
        authorEmail: session.user.email,
      },
    });

    return NextResponse.json(circular);
  } catch (e) {
    console.error("Circular create error:", e);
    return NextResponse.json(
      { error: "Failed to create circular" },
      { status: 500 },
    );
  }
}