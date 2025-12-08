'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function StudentAnalytics() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [marksData, setMarksData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    if (status === 'authenticated') {
      fetchMarksData();
    }
  }, [status]);

  const fetchMarksData = async () => {
    try {
      setLoading(true);
      // In a real app, this would fetch actual student marks data
      // For now, we'll use sample data
      const sampleData = [
        { subject: 'Mathematics', score: 85, max: 100 },
        { subject: 'Physics', score: 78, max: 100 },
        { subject: 'Chemistry', score: 92, max: 100 },
        { subject: 'Biology', score: 88, max: 100 },
        { subject: 'English', score: 76, max: 100 },
      ];
      setMarksData(sampleData);
    } catch (error) {
      console.error('Failed to fetch marks data:', error);
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

  // Calculate overall statistics
  const totalSubjects = marksData.length;
  const averageScore = totalSubjects > 0 
    ? (marksData.reduce((sum, item) => sum + (item.score / item.max * 100), 0) / totalSubjects).toFixed(1)
    : 0;

  // Find top performing subject
  let topSubject = 'N/A';
  if (marksData.length > 0) {
    const topSubjectObj = marksData.reduce((max, item) => 
      (item.score/item.max > max.score/max.max) ? item : max, marksData[0]);
    topSubject = topSubjectObj.subject;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '32px', marginBottom: '32px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                📊 My Analytics
              </h1>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>
                Detailed analysis of your academic performance
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

        {/* Stats Overview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <StatCard title="Subjects" value={totalSubjects} icon="📚" color="#667eea" />
          <StatCard title="Average %" value={`${averageScore}%`} icon="📈" color="#f093fb" />
          <StatCard title="Top Subject" value={topSubject} icon="🏆" color="#43e97b" />
          <StatCard title="Improvement" value="+5.2%" icon="🔥" color="#f5576c" />
        </div>

        {/* Marks Table */}
        <div style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '32px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: '#111827' }}>Performance by Subject</h2>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ width: '40px', height: '40px', margin: '0 auto 20px', border: '4px solid rgba(102, 126, 234, 0.3)', borderTop: '4px solid #667eea', borderRadius: '50%' }}></div>
              <p>Loading analytics...</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f3f4f6' }}>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Subject</th>
                    <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #e5e7eb' }}>Score</th>
                    <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #e5e7eb' }}>Max Marks</th>
                    <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #e5e7eb' }}>Percentage</th>
                    <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #e5e7eb' }}>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {marksData.map((item, index) => {
                    const percentage = (item.score / item.max) * 100;
                    let grade = 'F';
                    if (percentage >= 90) grade = 'A+';
                    else if (percentage >= 80) grade = 'A';
                    else if (percentage >= 70) grade = 'B';
                    else if (percentage >= 60) grade = 'C';
                    else if (percentage >= 50) grade = 'D';
                    else grade = 'F';
                    
                    return (
                      <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '12px' }}>{item.subject}</td>
                        <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>{item.score}</td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>{item.max}</td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>
                          <span style={{ 
                            color: percentage >= 70 ? '#10b981' : percentage >= 50 ? '#f59e0b' : '#ef4444',
                            fontWeight: 'bold'
                          }}>
                            {percentage.toFixed(1)}%
                          </span>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>
                          <span style={{ 
                            backgroundColor: percentage >= 70 ? '#dcfce7' : percentage >= 50 ? '#fef3c7' : '#fee2e2',
                            color: percentage >= 70 ? '#166534' : percentage >= 50 ? '#92400e' : '#991b1b',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontWeight: 'bold'
                          }}>
                            {grade}
                          </span>
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

function StatCard({ title, value, icon, color }: { title: string; value: string | number; icon: string; color: string }) {
  return (
    <div style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderRadius: '16px', padding: '20px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', textAlign: 'center' }}>
      <div style={{ fontSize: '28px', marginBottom: '8px', color }}>{icon}</div>
      <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>{value}</p>
      <p style={{ fontSize: '14px', color: '#6b7280' }}>{title}</p>
    </div>
  );
}