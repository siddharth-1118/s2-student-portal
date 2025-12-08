'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const ADMIN_EMAILS = ['saisiddharthvooka@gmail.com', 'kothaig2@srmist.edu.in'];

export default function Timetable() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [timetableData, setTimetableData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const res = await fetch('/timetable/get');
      const data = await res.json();
      
      if (res.ok) {
        // Group timetable entries by day
        const groupedTimetable: any = {};
        data.forEach((entry: any) => {
          if (!groupedTimetable[entry.day]) {
            groupedTimetable[entry.day] = [];
          }
          groupedTimetable[entry.day].push(entry);
        });
        
        // Sort entries by period
        Object.keys(groupedTimetable).forEach(day => {
          groupedTimetable[day].sort((a: any, b: any) => a.period - b.period);
        });
        
        setTimetableData(groupedTimetable);
      } else {
        console.error('Failed to fetch timetable:', data.error);
      }
    } catch (error) {
      console.error('Error fetching timetable:', error);
    } finally {
      setLoading(false);
    }
  };

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

  // Days of the week in order
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

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
                {isAdmin ? 'Manage class schedules' : 'View your weekly class schedule'}
              </p>
            </div>
            <button onClick={() => router.push('/')} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
              ← Back
            </button>
          </div>
        </div>

        {isAdmin && (
          <div style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '32px', marginBottom: '32px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#111827' }}>⚙️ Manage Timetable</h2>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '20px' }}>Go to the admin panel to manage timetable entries</p>
            <button 
              onClick={() => router.push('/timetable/admin')} 
              style={{ 
                padding: '12px 24px', 
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                fontSize: '14px', 
                fontWeight: '600', 
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(79, 172, 254, 0.4)'
              }}
            >
              🛠️ Go to Admin Panel
            </button>
          </div>
        )}

        <div style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '32px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: '#111827' }}>📚 Weekly Schedule</h2>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ width: '40px', height: '40px', margin: '0 auto 20px', border: '4px solid rgba(79, 172, 254, 0.3)', borderTop: '4px solid #4facfe', borderRadius: '50%' }}></div>
              <p>Loading timetable...</p>
            </div>
          ) : timetableData && Object.keys(timetableData).length > 0 ? (
            daysOfWeek.map((day) => (
              timetableData[day] && timetableData[day].length > 0 && (
                <div key={day} style={{ marginBottom: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ width: '4px', height: '24px', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', borderRadius: '2px' }}></div>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827' }}>{day}</h3>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
                    {timetableData[day].map((slot: any, slotIdx: number) => (
                      <div key={slotIdx} className="slot-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '12px', padding: '20px', color: 'white', boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)' }}>
                        <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '8px', fontWeight: '600' }}>🕐 Period {slot.period}</div>
                        <h4 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>{slot.subject}</h4>
                        <p style={{ fontSize: '13px', opacity: 0.9 }}>📍 {slot.room || 'TBA'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>📅</div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '12px' }}>No Timetable Available</h3>
              <p style={{ fontSize: '16px', color: '#6b7280' }}>
                {isAdmin 
                  ? 'Add timetable entries in the admin panel to display them here.' 
                  : 'Your timetable will be available once added by administrators.'}
              </p>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '32px' }}>
          <QuickStat icon="📚" label="Total Classes" value={timetableData ? Object.values(timetableData).reduce((acc: any, day: any) => acc + day.length, 0) : 0} />
          <QuickStat icon="🕐" label="Days/Week" value={timetableData ? Object.keys(timetableData).length : 0} />
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