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

  // ✅ Only admins can upload marks
  if (!session || !session.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
    return NextResponse.json({ error: "Unauthorized (not admin)" }, { status: 401 });
  }

  const body = await req.json();

  // 🧠 1. Try to detect the array of rows in the body
  let rows: Array<Record<string, any>> | undefined;

  if (Array.isArray(body)) {
    rows = body;
  } else {
    // look for FIRST value that is an array of objects
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

  // 🧠 2. Detect columns on a sample row
  const sample = rows[0];

  const lowerKeys = Object.keys(sample).reduce<Record<string, string>>((acc, key) => {
    acc[key.toLowerCase().trim()] = key;
    return acc;
  }, {});

  // detect register number column
  const registerKey =
    lowerKeys["register number"] ||
    lowerKeys["reg no"] ||
    lowerKeys["regno"] ||
    lowerKeys["registerno"] ||
    lowerKeys["register_no"];

  // detect name column (optional)
  const nameKey =
    lowerKeys["student name"] ||
    lowerKeys["name"] ||
    lowerKeys["student"];

  if (!registerKey) {
    return NextResponse.json(
      {
        error:
          "Could not detect 'register number' column. Make sure one column is called 'register number' or similar.",
        columns: Object.keys(sample),
      },
      { status: 400 },
    );
  }

  // everything else = subject column (e.g. maths, physics)
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
    const problems: string[] = [];

    for (const row of rows) {
      const regRaw = row[registerKey];
      const reg = regRaw ? String(regRaw).trim() : "";

      if (!reg) {
        problems.push("Row without register number, skipping.");
        continue;
      }

      const student = await prisma.student.findUnique({
        where: { registerNo: reg },
      });

      if (!student) {
        problems.push(`No student found for register number ${reg}, skipping.`);
        continue;
      }

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

        // defaults – tweak if you want
        const examType =
          typeof body.examType === "string" && body.examType.trim() !== ""
            ? body.examType
            : "Internal";

        const maxMarks =
          typeof body.maxMarks === "number" && !Number.isNaN(body.maxMarks)
            ? body.maxMarks
            : 100;

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

    return NextResponse.json({
      ok: true,
      createdCount,
      problems, // not an error; just info which rows were skipped
    });
  } catch (e) {
    console.error("Bulk upload marks error:", e);
    return NextResponse.json(
      { error: "Failed to upload marks (server error)" },
      { status: 500 },
    );
  }
}
