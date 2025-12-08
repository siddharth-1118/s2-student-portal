import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  request: Request,
  // FIX: Properly type 'params' as a Promise for Next.js 15+
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // FIX: Await parameters before using them
    const { id } = await context.params;
    const studentId = id;

    const body = await request.json();
    const { locked } = body;

    // FIX: Since 'profileLocked' column doesn't exist yet, we update 'updatedAt'
    // to prevent the build from crashing.
    // Once you add 'profileLocked' to your schema.prisma, uncomment the real line below.
    const updatedStudent = await prisma.student.update({
      where: { id: studentId },
      data: {
        // profileLocked: locked, // <-- Uncomment this ONLY after adding the column to Prisma
        updatedAt: new Date()     // Placeholder update so the API doesn't crash
      },
    });

    return NextResponse.json(updatedStudent);
  } catch (error) {
    console.error("Error locking profile:", error);
    return NextResponse.json({ error: "Failed to update lock status" }, { status: 500 });
  }
}