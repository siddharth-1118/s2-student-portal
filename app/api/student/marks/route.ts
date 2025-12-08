// app/api/student/marks/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    console.log("Fetching marks for user:", session.user.email);

    // Find the student linked to this email
    const student = await prisma.student.findFirst({
      where: { email: session.user.email },
      include: { marks: true },
    });

    if (!student) {
      console.log("No student found for email:", session.user.email);
      return NextResponse.json({ error: "No student record found for this email" }, { status: 404 });
    }

    console.log(`Found student ${student.name} with ${student.marks.length} marks`);

    // Calculate percentage for each mark
    const marksWithPercentage = student.marks.map(mark => ({
      ...mark,
      percentage: mark.maxMarks > 0 ? Math.round((mark.scored / mark.maxMarks) * 1000) / 10 : 0
    }));

    return NextResponse.json({
      student: {
        id: student.id,
        name: student.name,
        registerNo: student.registerNo,
        email: student.email
      },
      marks: marksWithPercentage
    });
  } catch (error) {
    console.error("Error fetching student marks:", error);
    return NextResponse.json({ error: "Failed to fetch student marks" }, { status: 500 });
  }
}