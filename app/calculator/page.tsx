'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Calculator() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [subjects, setSubjects] = useState([{ name: '', credits: 3, grade: 'O' }]);
  const [sgpa, setSgpa] = useState<number | null>(null);
  const [cgpa, setCgpa] = useState<number | null>(null);
  const [previousCredits, setPreviousCredits] = useState(0);
  const [previousGpa, setPreviousGpa] = useState(0);

  // Grade point mapping
  const gradePoints: Record<string, number> = {
    'O': 10,
    'A+': 9,
    'A': 8,
    'B+': 7,
    'B': 6,
    'C': 5,
    'U': 0,
    'SA': 0,
    'W': 0
  };

  const addSubject = () => {
    setSubjects([...subjects, { name: '', credits: 3, grade: 'O' }]);
  };

  const removeSubject = (index: number) => {
    if (subjects.length > 1) {
      const newSubjects = [...subjects];
      newSubjects.splice(index, 1);
      setSubjects(newSubjects);
    }
  };

  const updateSubject = (index: number, field: string, value: string | number) => {
    const newSubjects = [...subjects];
    newSubjects[index] = { ...newSubjects[index], [field]: value };
    setSubjects(newSubjects);
  };

  const calculateSGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;

    subjects.forEach(subject => {
      const points = gradePoints[subject.grade] || 0;
      totalPoints += points * subject.credits;
      totalCredits += subject.credits;
    });

    if (totalCredits > 0) {
      const calculatedSgpa = totalPoints / totalCredits;
      setSgpa(parseFloat(calculatedSgpa.toFixed(2)));
    } else {
      setSgpa(0);
    }
  };

  const calculateCGPA = () => {
    if (sgpa === null) {
      calculateSGPA();
    }

    const totalPreviousPoints = previousCredits * previousGpa;
    let totalCurrentPoints = 0;
    let totalCurrentCredits = 0;

    subjects.forEach(subject => {
      const points = gradePoints[subject.grade] || 0;
      totalCurrentPoints += points * subject.credits;
      totalCurrentCredits += subject.credits;
    });

    const totalPoints = totalPreviousPoints + totalCurrentPoints;
    const totalCredits = previousCredits + totalCurrentCredits;

    if (totalCredits > 0) {
      const calculatedCgpa = totalPoints / totalCredits;
      setCgpa(parseFloat(calculatedCgpa.toFixed(2)));
    } else {
      setCgpa(0);
    }
  };

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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '32px', marginBottom: '32px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                🧮 SGPA / CGPA Calculator
              </h1>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>
                Calculate your semester and cumulative GPA
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
          {/* SGPA Calculator */}
          <div style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '32px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: '#111827' }}>📚 SGPA Calculator</h2>
            
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#374151' }}>Subjects</h3>
                <button 
                  onClick={addSubject}
                  style={{ 
                    padding: '8px 16px', 
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '8px', 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    cursor: 'pointer' 
                  }}
                >
                  ➕ Add Subject
                </button>
              </div>
              
              <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '12px' }}>
                {subjects.map((subject, index) => (
                  <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '12px', alignItems: 'center', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '4px' }}>Subject Name</label>
                      <input
                        type="text"
                        value={subject.name}
                        onChange={(e) => updateSubject(index, 'name', e.target.value)}
                        placeholder="Enter subject name"
                        style={{ 
                          width: '100%', 
                          padding: '10px 12px', 
                          border: '1px solid #d1d5db', 
                          borderRadius: '6px', 
                          fontSize: '14px'
                        }}
                      />
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '4px' }}>Credits</label>
                      <select
                        value={subject.credits}
                        onChange={(e) => updateSubject(index, 'credits', parseInt(e.target.value))}
                        style={{ 
                          width: '100%', 
                          padding: '10px 12px', 
                          border: '1px solid #d1d5db', 
                          borderRadius: '6px', 
                          fontSize: '14px'
                        }}
                      >
                        {[1, 2, 3, 4, 5, 6].map(credit => (
                          <option key={credit} value={credit}>{credit}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '4px' }}>Grade</label>
                      <select
                        value={subject.grade}
                        onChange={(e) => updateSubject(index, 'grade', e.target.value)}
                        style={{ 
                          width: '100%', 
                          padding: '10px 12px', 
                          border: '1px solid #d1d5db', 
                          borderRadius: '6px', 
                          fontSize: '14px'
                        }}
                      >
                        {Object.keys(gradePoints).map(grade => (
                          <option key={grade} value={grade}>{grade}</option>
                        ))}
                      </select>
                    </div>
                    
                    <button
                      onClick={() => removeSubject(index)}
                      disabled={subjects.length <= 1}
                      style={{ 
                        padding: '10px 12px', 
                        background: subjects.length <= 1 ? '#d1d5db' : '#ef4444', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '6px', 
                        fontSize: '14px', 
                        cursor: subjects.length <= 1 ? 'not-allowed' : 'pointer',
                        height: 'fit-content',
                        marginTop: '20px'
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              onClick={calculateSGPA}
              style={{ 
                width: '100%',
                padding: '14px', 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                color: 'white', 
                border: 'none', 
                borderRadius: '12px', 
                fontSize: '16px', 
                fontWeight: '600', 
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
              }}
            >
              🧮 Calculate SGPA
            </button>
            
            {sgpa !== null && (
              <div style={{ 
                marginTop: '24px',
                padding: '20px',
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                borderRadius: '12px',
                textAlign: 'center',
                color: 'white'
              }}>
                <p style={{ fontSize: '16px', marginBottom: '8px' }}>Your SGPA:</p>
                <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{sgpa.toFixed(2)}</p>
              </div>
            )}
          </div>
          
          {/* CGPA Calculator */}
          <div style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '32px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: '#111827' }}>📊 CGPA Calculator</h2>
            
            <div style={{ marginBottom: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Previous Semester Credits</label>
                <input
                  type="number"
                  value={previousCredits}
                  onChange={(e) => setPreviousCredits(parseInt(e.target.value) || 0)}
                  min="0"
                  style={{ 
                    width: '100%', 
                    padding: '12px 16px', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '8px', 
                    fontSize: '14px'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Previous CGPA</label>
                <input
                  type="number"
                  value={previousGpa}
                  onChange={(e) => setPreviousGpa(parseFloat(e.target.value) || 0)}
                  min="0"
                  max="10"
                  step="0.01"
                  style={{ 
                    width: '100%', 
                    padding: '12px 16px', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '8px', 
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>
            
            <button 
              onClick={calculateCGPA}
              style={{ 
                width: '100%',
                padding: '14px', 
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
                color: 'white', 
                border: 'none', 
                borderRadius: '12px', 
                fontSize: '16px', 
                fontWeight: '600', 
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(240, 147, 251, 0.4)'
              }}
            >
              📈 Calculate CGPA
            </button>
            
            {cgpa !== null && (
              <div style={{ 
                marginTop: '24px',
                padding: '20px',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                borderRadius: '12px',
                textAlign: 'center',
                color: 'white'
              }}>
                <p style={{ fontSize: '16px', marginBottom: '8px' }}>Your CGPA:</p>
                <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{cgpa.toFixed(2)}</p>
              </div>
            )}
            
            {/* Grade Point Reference */}
            <div style={{ 
              marginTop: '24px',
              padding: '20px',
              background: '#f9fafb',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>Grade Point Reference</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {Object.entries(gradePoints).map(([grade, points]) => (
                  <div key={grade} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span>{grade}:</span>
                    <span style={{ fontWeight: '600' }}>{points}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}