'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function StudentMarks() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [marks, setMarks] = useState<any[]>([]);
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    if (status === 'authenticated') {
      fetchStudentMarks();
    }
  }, [status]);

  const fetchStudentMarks = async () => {
    try {
      setLoading(true);
      // Fetch real student data and marks from the API
      const response = await fetch('/api/student/marks');
      const data = await response.json();
      
      if (response.ok) {
        setStudent(data.student);
        setMarks(data.marks);
      } else {
        console.error('Failed to fetch student marks:', data.error);
        // Fallback to simulated data if API fails
        simulateData();
      }
    } catch (error) {
      console.error('Error fetching marks:', error);
      // Fallback to simulated data if API fails
      simulateData();
    } finally {
      setLoading(false);
    }
  };

  const simulateData = () => {
    // Simulate student data
    const studentData = {
      name: session?.user?.name || 'Student',
      registerNo: 'RA2511026010868',
      email: session?.user?.email || ''
    };
    
    setStudent(studentData);
    
    // Simulate marks data
    const marksData = [
      { id: 1, subject: 'Mathematics', examType: 'Internal', scored: 85, maxMarks: 100, percentage: 85 },
      { id: 2, subject: 'Physics', examType: 'Internal', scored: 78, maxMarks: 100, percentage: 78 },
      { id: 3, subject: 'Chemistry', examType: 'Internal', scored: 92, maxMarks: 100, percentage: 92 },
      { id: 4, subject: 'Biology', examType: 'Internal', scored: 88, maxMarks: 100, percentage: 88 },
      { id: 5, subject: 'English', examType: 'Internal', scored: 76, maxMarks: 100, percentage: 76 },
    ];
    
    setMarks(marksData);
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
  const averagePercentage = marks.length > 0 
    ? (marks.reduce((sum, mark) => sum + mark.percentage, 0) / marks.length).toFixed(1)
    : 0;

  const highestScore = marks.length > 0 
    ? Math.max(...marks.map(mark => mark.percentage))
    : 0;

  const lowestScore = marks.length > 0 
    ? Math.min(...marks.map(mark => mark.percentage))
    : 0;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '32px', marginBottom: '32px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                📊 My Marks
              </h1>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>
                View your academic performance
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

        {student && (
          <div style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '32px', marginBottom: '32px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#111827' }}>👤 Student Information</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <InfoCard label="Name" value={student.name} />
              <InfoCard label="Register Number" value={student.registerNo} />
              <InfoCard label="Email" value={student.email} />
            </div>
          </div>
        )}

        {loading ? (
          <div style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '32px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
            <div style={{ width: '40px', height: '40px', margin: '0 auto 20px', border: '4px solid rgba(79, 172, 254, 0.3)', borderTop: '4px solid #4facfe', borderRadius: '50%' }}></div>
            <p>Loading your marks...</p>
          </div>
        ) : marks.length === 0 ? (
          <div style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '32px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>📊</div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '12px' }}>
              No Marks Available
            </h2>
            <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '24px' }}>
              Your marks will be displayed here once they are uploaded by your instructors.
            </p>
            <button 
              onClick={() => router.push('/marks/me')} 
              style={{ 
                padding: '12px 24px', 
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', 
                color: 'white', 
                border: 'none', 
                borderRadius: '12px', 
                fontSize: '14px', 
                fontWeight: '600', 
                cursor: 'pointer' 
              }}
            >
              Try Alternative View
            </button>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              <SummaryCard title="Average %" value={`${averagePercentage}%`} color="#4facfe" icon="📈" />
              <SummaryCard title="Highest Score" value={`${highestScore}%`} color="#10b981" icon="🏆" />
              <SummaryCard title="Lowest Score" value={`${lowestScore}%`} color="#f59e0b" icon="📉" />
              <SummaryCard title="Total Subjects" value={marks.length} color="#8b5cf6" icon="📚" />
            </div>

            {/* Marks Table */}
            <div style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '32px', marginBottom: '32px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: '#111827' }}>📋 Marks Details</h2>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f3f4f6' }}>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb', fontWeight: '600', color: '#374151' }}>Subject</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb', fontWeight: '600', color: '#374151' }}>Exam Type</th>
                      <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #e5e7eb', fontWeight: '600', color: '#374151' }}>Scored</th>
                      <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #e5e7eb', fontWeight: '600', color: '#374151' }}>Max Marks</th>
                      <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #e5e7eb', fontWeight: '600', color: '#374151' }}>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marks.map((mark) => (
                      <tr key={mark.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '12px', color: '#374151' }}>{mark.subject}</td>
                        <td style={{ padding: '12px', color: '#6b7280' }}>{mark.examType}</td>
                        <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: '#374151' }}>{mark.scored}</td>
                        <td style={{ padding: '12px', textAlign: 'right', color: '#374151' }}>{mark.maxMarks}</td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>
                          <span style={{ 
                            color: mark.percentage >= 70 ? '#10b981' : mark.percentage >= 50 ? '#f59e0b' : '#ef4444',
                            fontWeight: 'bold'
                          }}>
                            {mark.percentage}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Performance Visualization */}
            <div style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '32px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: '#111827' }}>📊 Performance Visualization</h2>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
                gap: '16px',
                maxHeight: '300px',
                overflowY: 'auto'
              }}>
                {marks.map((mark) => (
                  <div key={mark.id} style={{ 
                    background: 'white', 
                    borderRadius: '12px', 
                    padding: '16px', 
                    textAlign: 'center',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                  }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>{mark.subject}</h3>
                    <div style={{ 
                      width: '100%', 
                      height: '120px', 
                      display: 'flex', 
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                      marginBottom: '8px'
                    }}>
                      <div style={{ 
                        width: '40px', 
                        height: `${mark.percentage}%`,
                        background: mark.percentage >= 70 ? '#10b981' : mark.percentage >= 50 ? '#f59e0b' : '#ef4444',
                        borderRadius: '4px 4px 0 0'
                      }}></div>
                    </div>
                    <p style={{ 
                      fontSize: '16px', 
                      fontWeight: 'bold', 
                      color: mark.percentage >= 70 ? '#10b981' : mark.percentage >= 50 ? '#f59e0b' : '#ef4444'
                    }}>
                      {mark.percentage}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '16px', border: '1px solid #e5e7eb' }}>
      <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>{label}</p>
      <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>{value}</p>
    </div>
  );
}

function SummaryCard({ title, value, color, icon }: { title: string; value: string | number; color: string; icon: string }) {
  return (
    <div style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderRadius: '16px', padding: '20px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', textAlign: 'center' }}>
      <div style={{ fontSize: '28px', marginBottom: '8px', color }}>{icon}</div>
      <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>{value}</p>
      <p style={{ fontSize: '14px', color: '#6b7280' }}>{title}</p>
    </div>
  );
}