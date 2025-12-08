// app/marks/me/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export default async function MyMarksPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600">Please sign in to view your marks.</p>
      </div>
    );
  }

  // Find student using email (adjust if you link via registerNo instead)
  const student = await prisma.student.findFirst({
    where: { email: session.user.email },
    include: { marks: true },
  });

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600">
          No student record linked to this email.
        </p>
      </div>
    );
  }

  const marks = student.marks;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">My Marks</h1>
        <p className="text-slate-600 mb-6">
          {student.name} • Reg No:{" "}
          <span className="font-mono">{student.registerNo}</span>
        </p>

        <div className="rounded-2xl bg-white shadow p-4">
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
                      Max
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-slate-600">
                      %
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {marks.map((m) => {
                    const percent = (m.scored / m.maxMarks) * 100;
                    return (
                      <tr key={m.id} className="border-t">
                        <td className="px-3 py-2">{m.subject}</td>
                        <td className="px-3 py-2 text-slate-500">
                          {m.examType}
                        </td>
                        <td className="px-3 py-2 text-right font-semibold">
                          {m.scored}
                        </td>
                        <td className="px-3 py-2 text-right">{m.maxMarks}</td>
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
        </div>
      </div>
    </div>
  );
}
