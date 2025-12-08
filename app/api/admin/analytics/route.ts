// app/api/admin/analytics/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

const ADMIN_EMAILS = [
  "saisiddharthvooka@gmail.com",
  "kothaig2@srmist.edu.in",
];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is admin
    if (!session || !session.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch analytics data
    const [totalStudents, totalMarks, averageScoreResult] = await Promise.all([
      prisma.student.count(),
      prisma.mark.count(),
      prisma.mark.aggregate({
        _avg: { scored: true },
      }),
    ]);

    // Calculate pass rate (assuming passing score is 40)
    const passingMarks = await prisma.mark.count({
      where: {
        scored: {
          gte: 40,
        },
      },
    });
    
    const passRate = totalMarks > 0 ? Math.round((passingMarks / totalMarks) * 100) : 0;
    const averageScore = averageScoreResult._avg.scored ? parseFloat(averageScoreResult._avg.scored.toFixed(2)) : 0;

    // For top performer, we'll use a different approach
    const topPerformerData = await prisma.mark.groupBy({
      by: ['studentId'],
      _avg: {
        scored: true,
      },
      orderBy: {
        _avg: {
          scored: 'desc',
        },
      },
      take: 1,
    });

    let topPerformerName = "No data";
    if (topPerformerData.length > 0) {
      const topStudent = await prisma.student.findUnique({
        where: {
          id: topPerformerData[0].studentId,
        },
      });
      topPerformerName = topStudent ? topStudent.name : "Unknown";
    }

    return NextResponse.json({
      totalStudents,
      totalMarks,
      averageScore,
      passRate,
      topPerformer: topPerformerName,
    });
  } catch (err) {
    console.error("admin/analytics error:", err);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 },
    );
  }
}