// app/timetable/admin/page.tsx
"use client";

import { useEffect, useState } from "react";

type TimetableEntry = {
  id: number;
  day: string;
  period: number;
  subject: string;
  room: string | null;
};

export default function TimetableAdminPage() {
  const [data, setData] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch("/timetable/get");
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error(e);
        setError("Failed to load timetable");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const updateField = (
    id: number,
    key: keyof TimetableEntry,
    value: string | number,
  ) => {
    setData((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, [key]: value as any } : row,
      ),
    );
  };

  const saveRow = async (row: TimetableEntry) => {
    try {
      setSavingId(row.id);
      setError(null);
      const res = await fetch("/api/timetable/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(row),
      });
      if (!res.ok) throw new Error("Failed to save");
    } catch (e) {
      console.error(e);
      setError("Failed to save row");
    } finally {
      setSavingId(null);
    }
  };

  if (loading) return <div className="p-6">Loading timetable…</div>;

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Timetable Admin</h1>
      {error && <p className="mb-2 text-red-500 text-sm">{error}</p>}

      <div className="overflow-x-auto rounded-2xl bg-white shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-3 py-2 text-left">Day</th>
              <th className="px-3 py-2 text-left">Period</th>
              <th className="px-3 py-2 text-left">Subject</th>
              <th className="px-3 py-2 text-left">Room</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="border-t">
                <td className="px-3 py-2">
                  <input
                    className="w-full border rounded px-2 py-1 text-xs"
                    value={row.day}
                    onChange={(e) =>
                      updateField(row.id, "day", e.target.value)
                    }
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    className="w-full border rounded px-2 py-1 text-xs"
                    value={row.period}
                    onChange={(e) =>
                      updateField(row.id, "period", Number(e.target.value))
                    }
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    className="w-full border rounded px-2 py-1 text-xs"
                    value={row.subject}
                    onChange={(e) =>
                      updateField(row.id, "subject", e.target.value)
                    }
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    className="w-full border rounded px-2 py-1 text-xs"
                    value={row.room ?? ""}
                    onChange={(e) =>
                      updateField(row.id, "room", e.target.value)
                    }
                  />
                </td>
                <td className="px-3 py-2 text-right">
                  <button
                    onClick={() => saveRow(row)}
                    disabled={savingId === row.id}
                    className="rounded bg-blue-600 px-3 py-1 text-xs text-white disabled:opacity-50"
                  >
                    {savingId === row.id ? "Saving…" : "Save"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
