// app/analytics/page.tsx
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const ADMIN_EMAILS = [
  "saisiddharthvooka@gmail.com",
  "kothaig2@srmist.edu.in",
];

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 font-semibold">Access denied: Admins only.</p>
      </div>
    );
  }

  const [studentCount, markCount, markAgg] = await Promise.all([
    prisma.student.count(),
    prisma.mark.count(),
    prisma.mark.aggregate({
      _avg: { scored: true },
    }),
  ]);

  const avgScore = markAgg._avg.scored;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Analytics</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-white shadow p-5">
          <p className="text-sm text-slate-500">Total Students</p>
          <p className="mt-2 text-3xl font-semibold">{studentCount}</p>
        </div>

        <div className="rounded-2xl bg-white shadow p-5">
          <p className="text-sm text-slate-500">Total Marks Records</p>
          <p className="mt-2 text-3xl font-semibold">{markCount}</p>
        </div>

        <div className="rounded-2xl bg-white shadow p-5">
          <p className="text-sm text-slate-500">Average Score</p>
          <p className="mt-2 text-3xl font-semibold">
            {avgScore !== null && avgScore !== undefined
              ? avgScore.toFixed(2)
              : "–"}
          </p>
        </div>
      </div>
    </div>
  );
}
