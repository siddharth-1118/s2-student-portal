"use client";

import { useEffect, useState } from "react";

type Mark = {
  id: number;
  subject: string;
  examType: string;
  maxMarks: number;
  scored: number;
};

type StudentWithMarks = {
  id: number;
  name: string;
  registerNo: string;
  marks: Mark[];
};

export function MarksAdminTable() {
  const [students, setStudents] = useState<StudentWithMarks[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await fetch("/api/marks/list");
      const json = await res.json();
      setStudents(json);
      setLoading(false);
    };

    load();
  }, []);

  const updateScoredValue = (
    studentId: number,
    markId: number,
    value: number,
  ) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id !== studentId
          ? s
          : {
              ...s,
              marks: s.marks.map((m) =>
                m.id === markId ? { ...m, scored: value } : m,
              ),
            },
      ),
    );
  };

  const saveMark = async (markId: number, scored: number) => {
    try {
      setSavingId(markId);
      const res = await fetch("/api/marks/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markId, scored }),
      });
      if (!res.ok) throw new Error("Failed to save");
    } catch (e) {
      console.error(e);
      alert("Failed to update marks");
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return <p className="mt-4 text-sm text-slate-500">Loading marks…</p>;
  }

  return (
    <div className="mt-6 rounded-2xl bg-white shadow p-4">
      <h2 className="text-lg font-semibold mb-3">
        All Students &amp; Marks (Editable)
      </h2>

      <div className="overflow-x-auto max-h-[500px]">
        <table className="min-w-full text-xs">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-3 py-2 text-left">Reg No</th>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Subject</th>
              <th className="px-3 py-2 text-left">Exam</th>
              <th className="px-3 py-2 text-right">Scored</th>
              <th className="px-3 py-2 text-right">Max</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {students.flatMap((s) =>
              s.marks.map((m) => (
                <tr key={m.id} className="border-t">
                  <td className="px-3 py-2 font-mono">{s.registerNo}</td>
                  <td className="px-3 py-2">{s.name}</td>
                  <td className="px-3 py-2">{m.subject}</td>
                  <td className="px-3 py-2 text-slate-500">
                    {m.examType}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <input
                      type="number"
                      className="w-16 border rounded px-1 py-0.5 text-right"
                      value={m.scored}
                      onChange={(e) =>
                        updateScoredValue(
                          s.id,
                          m.id,
                          Number(e.target.value) || 0,
                        )
                      }
                    />
                  </td>
                  <td className="px-3 py-2 text-right">{m.maxMarks}</td>
                  <td className="px-3 py-2 text-right">
                    <button
                      onClick={() => saveMark(m.id, m.scored)}
                      disabled={savingId === m.id}
                      className="rounded bg-blue-600 px-2 py-1 text-[10px] text-white disabled:opacity-50"
                    >
                      {savingId === m.id ? "Saving…" : "Save"}
                    </button>
                  </td>
                </tr>
              )),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
