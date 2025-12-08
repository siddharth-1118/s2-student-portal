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

  if (!session || !session.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
    return NextResponse.json({ error: "Unauthorized (not admin)" }, { status: 401 });
  }

  const body = await req.json();

  let rows: Array<Record<string, any>> | undefined;

  if (Array.isArray(body)) {
    rows = body;
  } else {
    for (const value of Object.values(body)) {
      if (
        Array.isArray(value) &&
        value.length > 0 &&
        typeof value[0] === "object" &&
        value[0] !== null
      ) {
        rows = value as Array<Record<string, any>>;
        break;
      }
    }
  }

  if (!rows || rows.length === 0) {
    return NextResponse.json(
      {
        error: "No rows provided to upload",
        receivedKeys: Object.keys(body || {}),
      },
      { status: 400 },
    );
  }

  const sample = rows[0];

  const lowerKeys = Object.keys(sample).reduce<Record<string, string>>(
    (acc, key) => {
      acc[key.toLowerCase().trim()] = key;
      return acc;
    },
    {},
  );

  const registerKey =
    lowerKeys["register number"] ||
    lowerKeys["reg no"] ||
    lowerKeys["regno"] ||
    lowerKeys["register_no"] ||
    lowerKeys["registernumber"];

  const nameKey =
    lowerKeys["student name"] ||
    lowerKeys["name"] ||
    lowerKeys["student"];

  if (!registerKey) {
    return NextResponse.json(
      {
        error:
          "Could not detect 'register number' column. Make sure one column is named like 'register number' or 'reg no'.",
        columns: Object.keys(sample),
      },
      { status: 400 },
    );
  }

  const subjectKeys = Object.keys(sample).filter(
    (k) => k !== registerKey && k !== nameKey,
  );

  if (subjectKeys.length === 0) {
    return NextResponse.json(
      {
        error:
          "No subject columns detected. There should be at least one column with marks (e.g. 'maths').",
        columns: Object.keys(sample),
      },
      { status: 400 },
    );
  }

  try {
    let createdCount = 0;
    let updatedCount = 0;
    const problems: string[] = [];

    for (const row of rows) {
      const regRaw = row[registerKey];
      const reg = regRaw ? String(regRaw).trim() : "";

      if (!reg) {
        problems.push("Row without register number, skipping.");
        continue;
      }

      const nameRaw = nameKey ? row[nameKey] : null;
      const name = nameRaw ? String(nameRaw).trim() : "Unknown";

      // Check if this is the current user's register number and link email if so
      let studentData: { registerNo: string; name: string; email?: string } = {
        registerNo: reg,
        name,
      };

      // If this is the current user's register number, link their email
      const currentUserEmail = session.user.email;
      const currentUserStudent = await prisma.student.findFirst({
        where: { email: currentUserEmail },
      });

      if (currentUserStudent && currentUserStudent.registerNo === reg) {
        studentData.email = currentUserEmail;
      }

      const student = await prisma.student.upsert({
        where: { registerNo: reg },
        update: { name },
        create: studentData,
      });

      for (const subjectKey of subjectKeys) {
        const rawScore = row[subjectKey];

        if (
          rawScore === undefined ||
          rawScore === null ||
          rawScore === "" ||
          Number.isNaN(Number(rawScore))
        ) {
          continue;
        }

        const scored = Number(rawScore);
        const subjectName = subjectKey.toString().trim();

        const examType =
          typeof body.examType === "string" && body.examType.trim() !== ""
            ? body.examType
            : "Internal";

        const maxMarks =
          typeof body.maxMarks === "number" && !Number.isNaN(body.maxMarks)
            ? body.maxMarks
            : 100;

        const existing = await prisma.mark.findFirst({
          where: {
            studentId: student.id,
            subject: subjectName,
            examType,
          },
        });

        if (existing) {
          await prisma.mark.update({
            where: { id: existing.id },
            data: { scored, maxMarks },
          });
          updatedCount++;
        } else {
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
    }

    return NextResponse.json({
      ok: true,
      createdCount,
      updatedCount,
      problems,
    });
  } catch (e) {
    console.error("Bulk upload marks error:", e);
    return NextResponse.json(
      { error: "Failed to upload marks (server error)" },
      { status: 500 },
    );
  }
}