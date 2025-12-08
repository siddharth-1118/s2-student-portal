// app/timetable/admin/page.tsx
'use client';

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
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState({
    day: '',
    period: 1,
    subject: '',
    room: ''
  });

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
      
      // Refresh the data
      const updatedRes = await fetch("/timetable/get");
      const updatedJson = await updatedRes.json();
      setData(updatedJson);
    } catch (e) {
      console.error(e);
      setError("Failed to save row");
    } finally {
      setSavingId(null);
    }
  };

  const handleAddNew = () => {
    setNewEntry({
      day: '',
      period: 1,
      subject: '',
      room: ''
    });
    setShowAddForm(true);
  };

  const handleCreateEntry = async () => {
    try {
      setError(null);
      const res = await fetch("/api/timetable/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEntry),
      });
      
      if (!res.ok) throw new Error("Failed to create");
      
      // Refresh the data
      const updatedRes = await fetch("/timetable/get");
      const updatedJson = await updatedRes.json();
      setData(updatedJson);
      
      // Reset form
      setShowAddForm(false);
      setNewEntry({
        day: '',
        period: 1,
        subject: '',
        room: ''
      });
    } catch (e) {
      console.error(e);
      setError("Failed to create entry");
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div style={{ width: '60px', height: '60px', border: '6px solid rgba(255,255,255,0.3)', borderTop: '6px solid white', borderRadius: '50%' }}></div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '32px', marginBottom: '32px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '24px' }}>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                📅 Timetable Management
              </h1>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>
                Edit and manage class schedules
              </p>
            </div>
            <button 
              onClick={handleAddNew}
              style={{ 
                padding: '12px 24px', 
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', 
                color: 'white', 
                border: 'none', 
                borderRadius: '12px', 
                fontSize: '14px', 
                fontWeight: '600', 
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(79, 172, 254, 0.4)'
              }}
            >
              ➕ Add New Entry
            </button>
          </div>

          {error && (
            <div style={{ 
              padding: '16px',
              borderRadius: '8px',
              backgroundColor: '#fee2e2',
              border: '1px solid #fecaca',
              color: '#991b1b',
              marginBottom: '24px'
            }}>
              ❌ {error}
            </div>
          )}

          {/* Add Form */}
          {showAddForm && (
            <div style={{ 
              background: 'rgba(249, 250, 251, 0.9)', 
              borderRadius: '12px', 
              padding: '24px', 
              marginBottom: '24px',
              border: '1px solid #e5e7eb'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#111827' }}>➕ Add New Timetable Entry</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>Day</label>
                  <select
                    value={newEntry.day}
                    onChange={(e) => setNewEntry({...newEntry, day: e.target.value})}
                    style={{ 
                      width: '100%', 
                      padding: '12px 16px', 
                      border: '2px solid #e5e7eb', 
                      borderRadius: '8px', 
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  >
                    <option value="">Select Day</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>Period</label>
                  <input
                    type="number"
                    min="1"
                    value={newEntry.period}
                    onChange={(e) => setNewEntry({...newEntry, period: parseInt(e.target.value) || 1})}
                    style={{ 
                      width: '100%', 
                      padding: '12px 16px', 
                      border: '2px solid #e5e7eb', 
                      borderRadius: '8px', 
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>Subject</label>
                  <input
                    type="text"
                    value={newEntry.subject}
                    onChange={(e) => setNewEntry({...newEntry, subject: e.target.value})}
                    style={{ 
                      width: '100%', 
                      padding: '12px 16px', 
                      border: '2px solid #e5e7eb', 
                      borderRadius: '8px', 
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>Room</label>
                  <input
                    type="text"
                    value={newEntry.room}
                    onChange={(e) => setNewEntry({...newEntry, room: e.target.value})}
                    style={{ 
                      width: '100%', 
                      padding: '12px 16px', 
                      border: '2px solid #e5e7eb', 
                      borderRadius: '8px', 
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={handleCreateEntry}
                  style={{ 
                    padding: '10px 20px', 
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '8px', 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    cursor: 'pointer'
                  }}
                >
                  ✅ Create Entry
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  style={{ 
                    padding: '10px 20px', 
                    background: '#ef4444', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '8px', 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    cursor: 'pointer'
                  }}
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          )}

          <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                  <th style={{ padding: '16px', textAlign: 'left' }}>Day</th>
                  <th style={{ padding: '16px', textAlign: 'left' }}>Period</th>
                  <th style={{ padding: '16px', textAlign: 'left' }}>Subject</th>
                  <th style={{ padding: '16px', textAlign: 'left' }}>Room</th>
                  <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>
                      No timetable entries found. Add your first entry using the "Add New Entry" button above.
                    </td>
                  </tr>
                ) : (
                  data.map((row) => (
                    <tr key={row.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '16px' }}>
                        <input
                          style={{ 
                            width: '100%', 
                            padding: '8px 12px', 
                            border: '1px solid #d1d5db', 
                            borderRadius: '6px', 
                            fontSize: '14px'
                          }}
                          value={row.day}
                          onChange={(e) =>
                            updateField(row.id, "day", e.target.value)
                          }
                        />
                      </td>
                      <td style={{ padding: '16px' }}>
                        <input
                          type="number"
                          style={{ 
                            width: '100%', 
                            padding: '8px 12px', 
                            border: '1px solid #d1d5db', 
                            borderRadius: '6px', 
                            fontSize: '14px'
                          }}
                          value={row.period}
                          onChange={(e) =>
                            updateField(row.id, "period", Number(e.target.value))
                          }
                        />
                      </td>
                      <td style={{ padding: '16px' }}>
                        <input
                          style={{ 
                            width: '100%', 
                            padding: '8px 12px', 
                            border: '1px solid #d1d5db', 
                            borderRadius: '6px', 
                            fontSize: '14px'
                          }}
                          value={row.subject}
                          onChange={(e) =>
                            updateField(row.id, "subject", e.target.value)
                          }
                        />
                      </td>
                      <td style={{ padding: '16px' }}>
                        <input
                          style={{ 
                            width: '100%', 
                            padding: '8px 12px', 
                            border: '1px solid #d1d5db', 
                            borderRadius: '6px', 
                            fontSize: '14px'
                          }}
                          value={row.room ?? ""}
                          onChange={(e) =>
                            updateField(row.id, "room", e.target.value)
                          }
                        />
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <button
                          onClick={() => saveRow(row)}
                          disabled={savingId === row.id}
                          style={{ 
                            padding: '8px 16px', 
                            background: savingId === row.id ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '6px', 
                            fontSize: '13px', 
                            fontWeight: '600', 
                            cursor: savingId === row.id ? 'not-allowed' : 'pointer'
                          }}
                        >
                          {savingId === row.id ? "💾 Saving…" : "💾 Save"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}