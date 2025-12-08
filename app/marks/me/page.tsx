// app/marks/me/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NotificationSetup } from "../NotificationSetup";

export default async function MyMarksPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">
          Please sign in with your SRM Google account to view your marks.
        </p>
      </div>
    );
  }

  const registerNo = (session.user as any).registerNo as string | undefined;

  if (!registerNo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">
          No register number found in your session. Please contact your admin.
        </p>
      </div>
    );
  }

  // ✅ NOW we find the student by registerNo, not email
  const student = await prisma.student.findUnique({
    where: { registerNo },
    include: { marks: true },
  });

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">
          No student record found for register number {registerNo}. Please contact your admin.
        </p>
      </div>
    );
  }

  const marks = student.marks;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <header>
          <h1 className="text-3xl font-bold mb-1">My Marks</h1>
          <p className="text-slate-600">
            {student.name} • Reg No:{" "}
            <span className="font-mono">{student.registerNo}</span>
          </p>
        </header>

        <section className="rounded-2xl bg-white shadow p-4">
          {marks.length === 0 ? (
            <p className="text-slate-500 text-sm">
              No marks uploaded yet. Please check again later.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">
                      Subject
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">
                      Exam Type
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-slate-600">
                      Scored
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-slate-600">
                      Max Marks
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-slate-600">
                      %
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {marks.map((m) => {
                    const percent =
                      m.maxMarks > 0 ? (m.scored / m.maxMarks) * 100 : 0;

                    return (
                      <tr key={m.id} className="border-t">
                        <td className="px-3 py-2">{m.subject}</td>
                        <td className="px-3 py-2 text-slate-500">
                          {m.examType}
                        </td>
                        <td className="px-3 py-2 text-right font-semibold">
                          {m.scored}
                        </td>
                        <td className="px-3 py-2 text-right">
                          {m.maxMarks}
                        </td>
                        <td className="px-3 py-2 text-right">
                          {percent.toFixed(1)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Notifications setup */}
          <NotificationSetup />
        </section>
      </div>
    </div>
  );
}
