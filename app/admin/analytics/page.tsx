'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const ADMIN_EMAILS = ['saisiddharthvooka@gmail.com', 'kothaig2@srmist.edu.in'];

export default function AdminAnalytics() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      if (!ADMIN_EMAILS.includes(session?.user?.email || '')) {
        router.push('/');
      } else {
        fetchAnalytics();
      }
    }
  }, [status, session, router]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics');
      const data = await response.json();
      if (response.ok) {
        setAnalytics(data);
      } else {
        console.error('Failed to fetch analytics:', data.error);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div style={{ width: '60px', height: '60px', border: '6px solid rgba(255,255,255,0.3)', borderTop: '6px solid white', borderRadius: '50%' }}></div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '32px', marginBottom: '32px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>📈 Class Analytics</h1>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>AI-powered performance analysis for all students</p>
            </div>
            <button onClick={() => router.push('/')} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>← Back to Dashboard</button>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          <StatCard 
            title="Total Students" 
            value={analytics?.totalStudents || 0} 
            icon="👥" 
            gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
          />
          <StatCard 
            title="Average Score" 
            value={`${analytics?.averageScore || 0}%`} 
            icon="📊" 
            gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" 
          />
          <StatCard 
            title="Pass Rate" 
            value={`${analytics?.passRate || 0}%`} 
            icon="✅" 
            gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" 
          />
          <StatCard 
            title="Top Performer" 
            value={analytics?.topPerformer || "No data"} 
            icon="🏆" 
            gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)" 
          />
        </div>

        {/* Charts Section */}
        <div style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '32px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: '#111827' }}>📉 Performance Distribution</h2>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Marks distribution visualization will appear here in a future update.</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, gradient }: { title: string; value: string | number; icon: string; gradient: string }) {
  return (
    <div style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderRadius: '16px', padding: '24px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
      <div style={{ fontSize: '32px', marginBottom: '12px' }}>{icon}</div>
      <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>{title}</p>
      <p style={{ fontSize: '28px', fontWeight: 'bold', background: gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{value}</p>
    </div>
  );
}