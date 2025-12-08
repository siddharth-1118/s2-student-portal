// app/marks/upload/route.ts
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

  // Only admins can upload marks
  if (!session || !session.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  // Expecting body.rows as array of objects, e.g.
  // { "register number": "RA2511026010906", "student name": "VOOKA SAI SIDDHARTH", "maths": 20, "physics": 18, ... }
  const rows = body.rows as Array<Record<string, any>> | undefined;

  if (!rows || rows.length === 0) {
    return NextResponse.json({ error: "No rows provided" }, { status: 400 });
  }

  // Take a sample row to detect subject columns
  const sample = rows[0];

  // Column names for registerNo and student name – adjust if your sheet uses slightly different text
  const registerKeys = ["register number", "reg no", "registerNo", "register_no"];
  const nameKeys = ["student name", "name"];

  const registerKey = Object.keys(sample).find((k) =>
    registerKeys.includes(k.trim().toLowerCase()),
  );
  const nameKey = Object.keys(sample).find((k) =>
    nameKeys.includes(k.trim().toLowerCase()),
  );

  if (!registerKey) {
    return NextResponse.json(
      { error: "Could not detect 'register number' column" },
      { status: 400 },
    );
  }

  // Everything except register/name is treated as a subject column
  const subjectKeys = Object.keys(sample).filter(
    (k) => k !== registerKey && k !== nameKey,
  );

  if (subjectKeys.length === 0) {
    return NextResponse.json(
      { error: "No subject columns detected in the sheet" },
      { status: 400 },
    );
  }

  try {
    let createdCount = 0;

    for (const row of rows) {
      const reg = String(row[registerKey]).trim();

      if (!reg) continue;

      const student = await prisma.student.findUnique({
        where: { registerNo: reg },
      });

      if (!student) {
        console.warn(`No student found for registerNo ${reg}, skipping.`);
        continue;
      }

      for (const subjectKey of subjectKeys) {
        const rawScore = row[subjectKey];
        if (rawScore === undefined || rawScore === null || rawScore === "") continue;

        const scored = Number(rawScore);
        if (Number.isNaN(scored)) continue;

        const subjectName = subjectKey.toString().trim();

        // Default values – you can customise these or pass from frontend
        const examType = body.examType || "Internal";
        const maxMarks =
          typeof body.maxMarks === "number" ? body.maxMarks : 100;

        await prisma.mark.create({
          data: {
            studentId: student.id,
            subject: subjectName,
            examType,
            maxMarks,
            scored,
          },
        });

        createdCount++;
      }
    }

    return NextResponse.json({ ok: true, createdCount });
  } catch (e) {
    console.error("Bulk upload marks error:", e);
    return NextResponse.json(
      { error: "Failed to upload marks" },
      { status: 500 },
    );
  }
}
