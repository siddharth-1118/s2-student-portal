'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function CircularsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [circulars, setCirculars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching circulars
    setTimeout(() => {
      // This is a temporary solution - in a real app, this would fetch from the database
      const sampleCirculars = [
        {
          id: 1,
          title: "Important Exam Schedule Update",
          content: "Dear Students, please note that the midterm exams scheduled for next week have been postponed by 2 days. New dates will be communicated shortly.",
          authorEmail: "kothaig2@srmist.edu.in",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 2,
          title: "Library Hours Extended",
          content: "The library will remain open until 11 PM during exam weeks starting from next month. This is to accommodate students who need extra study time.",
          authorEmail: "saisiddharthvooka@gmail.com",
          createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
          updatedAt: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      setCirculars(sampleCirculars);
      setLoading(false);
    }, 1000);
  }, []);

  if (status === 'loading') {
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

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '32px', marginBottom: '32px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                📢 Announcements
              </h1>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>
                Latest circulars and announcements
              </p>
            </div>
            <button 
              onClick={() => router.push('/')} 
              style={{ 
                padding: '12px 24px', 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                color: 'white', 
                border: 'none', 
                borderRadius: '12px', 
                fontSize: '14px', 
                fontWeight: '600', 
                cursor: 'pointer' 
              }}
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '32px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
            <div style={{ width: '40px', height: '40px', margin: '0 auto 20px', border: '4px solid rgba(102, 126, 234, 0.3)', borderTop: '4px solid #667eea', borderRadius: '50%' }}></div>
            <p>Loading announcements...</p>
          </div>
        ) : circulars.length === 0 ? (
          <div style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '32px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>📢</div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '12px' }}>
              No Announcements Yet
            </h2>
            <p style={{ fontSize: '16px', color: '#6b7280' }}>
              Check back later for important updates and announcements.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {circulars.map((circular) => (
              <div key={circular.id} style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '32px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{circular.title}</h2>
                  <span style={{ fontSize: '12px', color: '#6b7280', backgroundColor: '#f3f4f6', padding: '4px 8px', borderRadius: '4px' }}>
                    {new Date(circular.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p style={{ fontSize: '16px', color: '#374151', lineHeight: '1.6', marginBottom: '16px' }}>
                  {circular.content}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>
                    Published by: {circular.authorEmail}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}