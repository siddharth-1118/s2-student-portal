'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const ADMIN_EMAILS = ['saisiddharthvooka@gmail.com', 'kothaig2@srmist.edu.in'];

export default function Timetable() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [timetableUrl, setTimetableUrl] = useState('');
  const [timetableData, setTimetableData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (status === 'loading' || !mounted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div style={{ width: '60px', height: '60px', border: '6px solid rgba(255,255,255,0.3)', borderTop: '6px solid white', borderRadius: '50%' }}></div>
      </div>
    );
  }

  if (!session) {
    router.push('/');
    return null;
  }

  const isAdmin = ADMIN_EMAILS.includes(session.user?.email || '');

  const handleAnalyzeTimetable = async () => {
    if (!timetableUrl.trim()) {
      alert('⚠️ Please enter a timetable Google Sheets link');
      return;
    }
    
    if (!isAdmin) {
      alert('⚠️ Only admins can analyze timetables');
      return;
    }
    
    alert('AI Timetable feature coming soon! For now, showing sample timetable.');
  };

  const sampleTimetable = {
    schedule: [
      { day: 'Monday', slots: [
        { time: '9:00-10:00', subject: 'Mathematics', faculty: 'Dr. Smith', room: 'A101' },
        { time: '10:00-11:00', subject: 'Physics', faculty: 'Dr. Johnson', room: 'B202' },
        { time: '11:00-12:00', subject: 'Chemistry', faculty: 'Dr. Williams', room: 'C303' },
        { time: '1:00-2:00', subject: 'Programming', faculty: 'Dr. Brown', room: 'Lab 1' },
      ]},
      { day: 'Tuesday', slots: [
        { time: '9:00-10:00', subject: 'Data Structures', faculty: 'Dr. Davis', room: 'A102' },
        { time: '10:00-11:00', subject: 'Algorithms', faculty: 'Dr. Miller', room: 'B203' },
        { time: '11:00-12:00', subject: 'DBMS', faculty: 'Dr. Wilson', room: 'C304' },
        { time: '1:00-2:00', subject: 'Lab Session', faculty: 'Dr. Moore', room: 'Lab 2' },
      ]},
      { day: 'Wednesday', slots: [
        { time: '9:00-10:00', subject: 'Operating Systems', faculty: 'Dr. Taylor', room: 'A103' },
        { time: '10:00-11:00', subject: 'Computer Networks', faculty: 'Dr. Anderson', room: 'B204' },
        { time: '11:00-12:00', subject: 'Software Engineering', faculty: 'Dr. Thomas', room: 'C305' },
        { time: '1:00-2:00', subject: 'Project Work', faculty: 'Dr. Jackson', room: 'Lab 3' },
      ]},
      { day: 'Thursday', slots: [
        { time: '9:00-10:00', subject: 'Machine Learning', faculty: 'Dr. White', room: 'A104' },
        { time: '10:00-11:00', subject: 'AI', faculty: 'Dr. Harris', room: 'B205' },
        { time: '11:00-12:00', subject: 'Cloud Computing', faculty: 'Dr. Martin', room: 'C306' },
        { time: '1:00-2:00', subject: 'Workshop', faculty: 'Dr. Thompson', room: 'Lab 4' },
      ]},
      { day: 'Friday', slots: [
        { time: '9:00-10:00', subject: 'Web Development', faculty: 'Dr. Garcia', room: 'A105' },
        { time: '10:00-11:00', subject: 'Mobile Apps', faculty: 'Dr. Martinez', room: 'B206' },
        { time: '11:00-12:00', subject: 'Cyber Security', faculty: 'Dr. Robinson', room: 'C307' },
        { time: '1:00-2:00', subject: 'Seminar', faculty: 'Guest Speaker', room: 'Auditorium' },
      ]},
    ]
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', padding: '40px 20px' }}>
      <style jsx>{`
        @keyframes slideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        .slot-card { transition: all 0.3s; animation: slideIn 0.5s ease-out; }
        .slot-card:hover { transform: scale(1.05); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); }
      `}</style>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '32px', marginBottom: '32px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                📅 {isAdmin ? 'Manage' : 'Your'} Timetable
              </h1>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>
                {isAdmin ? 'Upload and manage class schedules with AI' : 'View your weekly class schedule'}
              </p>
            </div>
            <button onClick={() => router.push('/')} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
              ← Back
            </button>
          </div>
        </div>

        {isAdmin && (
          <div style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '32px', marginBottom: '32px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#111827' }}>🤖 AI Timetable Analyzer</h2>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '20px' }}>Paste your timetable Google Sheets link, and AI will extract the schedule</p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <input type="url" value={timetableUrl} onChange={(e) => setTimetableUrl(e.target.value)} placeholder="https://docs.google.com/spreadsheets/..." style={{ flex: 1, minWidth: '250px', padding: '12px 16px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
              <button onClick={handleAnalyzeTimetable} disabled={loading} style={{ padding: '12px 32px', background: loading ? '#9ca3af' : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 12px rgba(79, 172, 254, 0.4)', whiteSpace: 'nowrap' }}>
                {loading ? '🔄 Analyzing...' : '🤖 Analyze'}
              </button>
            </div>
          </div>
        )}

        <div style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '32px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: '#111827' }}>📚 Weekly Schedule</h2>
          {sampleTimetable.schedule.map((day: any, dayIdx: number) => (
            <div key={dayIdx} style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '4px', height: '24px', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', borderRadius: '2px' }}></div>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827' }}>{day.day}</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
                {day.slots.map((slot: any, slotIdx: number) => (
                  <div key={slotIdx} className="slot-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '12px', padding: '20px', color: 'white', boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)' }}>
                    <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '8px', fontWeight: '600' }}>🕐 {slot.time}</div>
                    <h4 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>{slot.subject}</h4>
                    <p style={{ fontSize: '13px', opacity: 0.9, marginBottom: '4px' }}>👨‍🏫 {slot.faculty}</p>
                    <p style={{ fontSize: '13px', opacity: 0.9 }}>📍 {slot.room}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '32px' }}>
          <QuickStat icon="📚" label="Total Classes" value="20" />
          <QuickStat icon="🕐" label="Hours/Week" value="20" />
          <QuickStat icon="👨‍🏫" label="Faculty" value="15" />
          <QuickStat icon="🏫" label="Labs" value="4" />
        </div>
      </div>
    </div>
  );
}

function QuickStat({ icon, label, value }: any) {
  return (
    <div style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
      <div style={{ fontSize: '32px', marginBottom: '8px' }}>{icon}</div>
      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>{value}</div>
      <div style={{ fontSize: '14px', color: '#6b7280' }}>{label}</div>
    </div>
  );
}