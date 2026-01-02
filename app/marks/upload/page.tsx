'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Student {
  id: number;
  registerNo: string;
  name: string;
}

interface StudentMark {
  registerNo: string;
  name: string;
  maxMarks: number;
  scoredMarks: number;
}

export default function MarksUploadPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [subject, setSubject] = useState('');
  const [examType, setExamType] = useState('Internal');
  const [defaultMaxMarks, setDefaultMaxMarks] = useState(100);
  const [marks, setMarks] = useState<StudentMark[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch all students on mount
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/students');
      if (!res.ok) throw new Error('Failed to fetch students');
      const data = await res.json();
      setStudents(data.students || []);
      
      // Initialize marks array
      const initialMarks = (data.students || []).map((s: Student) => ({
        registerNo: s.registerNo,
        name: s.name,
        maxMarks: defaultMaxMarks,
        scoredMarks: 0
      }));
      setMarks(initialMarks);
    } catch (error) {
      console.error('Error fetching students:', error);
      setMessage('Error loading students');
    } finally {
      setLoading(false);
    }
  };

  const updateMark = (registerNo: string, field: 'maxMarks' | 'scoredMarks', value: number) => {
    setMarks(prev => prev.map(m => 
      m.registerNo === registerNo ? { ...m, [field]: value } : m
    ));
  };

  const updateAllMaxMarks = (value: number) => {
    setDefaultMaxMarks(value);
    setMarks(prev => prev.map(m => ({ ...m, maxMarks: value })));
  };

  const handleSaveAllMarks = async () => {
    if (!subject.trim()) {
      setMessage('❌ Please enter subject name');
      return;
    }

    // Filter students who have marks entered (scored > 0)
    const studentsWithMarks = marks.filter(m => m.scoredMarks > 0);
    
    if (studentsWithMarks.length === 0) {
      setMessage('❌ Please enter marks for at least one student');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      // Format data as expected by API: array of objects with Register Number and subject columns
      const rows = studentsWithMarks.map(m => ({
        'Register Number': m.registerNo,
        'Student Name': m.name,
        [subject]: m.scoredMarks
      }));

      const response = await fetch('/api/marks/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rows,
          examType,
          maxMarks: defaultMaxMarks
        })
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(`✅ Successfully uploaded marks for ${studentsWithMarks.length} students!`);
        // Reset marks to 0
        setMarks(prev => prev.map(m => ({ ...m, scoredMarks: 0 })));
        setSubject('');
        
        // Redirect to marks terminal after 2 seconds
        setTimeout(() => {
          router.push('/admin/marks');
        }, 2000);
      } else {
        setMessage(`❌ Error: ${result.error || 'Failed to upload marks'}`);
      }
    } catch (error) {
      console.error('Error uploading marks:', error);
      setMessage('❌ Failed to upload marks. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Loading students...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h1 style={{ fontSize: '28px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          📝 Enter Marks
        </h1>
        <p style={{ color: '#666', marginBottom: '24px' }}>Manual entry for all students</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
              Subject Name
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Mathematics"
              style={{ width: '100%', padding: '10px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
              Exam Type
            </label>
            <select
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }}
            >
              <option value="Internal">Internal</option>
              <option value="CAT1">CAT 1</option>
              <option value="CAT2">CAT 2</option>
              <option value="Semester">Semester</option>
              <option value="Assignment">Assignment</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
              Default Max Marks
            </label>
            <input
              type="number"
              value={defaultMaxMarks}
              onChange={(e) => updateAllMaxMarks(Number(e.target.value))}
              style={{ width: '100%', padding: '10px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }}
            />
            <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Applies to all unless changed below</p>
          </div>
        </div>

        {message && (
          <div style={{
            padding: '12px',
            marginBottom: '16px',
            borderRadius: '8px',
            backgroundColor: message.includes('✅') ? '#d1fae5' : '#fee2e2',
            color: message.includes('✅') ? '#065f46' : '#991b1b',
            border: `1px solid ${message.includes('✅') ? '#6ee7b7' : '#fca5a5'}`
          }}>
            {message}
          </div>
        )}

        <div style={{ marginBottom: '16px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e5e7eb' }}>
            <thead>
              <tr style={{ backgroundColor: '#6366f1', color: 'white' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderRight: '1px solid #e5e7eb' }}>Register No</th>
                <th style={{ padding: '12px', textAlign: 'left', borderRight: '1px solid #e5e7eb' }}>Student Name</th>
                <th style={{ padding: '12px', textAlign: 'center', borderRight: '1px solid #e5e7eb', width: '150px' }}>Max Marks</th>
                <th style={{ padding: '12px', textAlign: 'center', width: '150px' }}>Scored Marks</th>
              </tr>
            </thead>
            <tbody>
              {marks.map((mark, index) => (
                <tr key={mark.registerNo} style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: index % 2 === 0 ? '#f9fafb' : 'white' }}>
                  <td style={{ padding: '12px', borderRight: '1px solid #e5e7eb', fontWeight: '500' }}>{mark.registerNo}</td>
                  <td style={{ padding: '12px', borderRight: '1px solid #e5e7eb' }}>{mark.name}</td>
                  <td style={{ padding: '8px', borderRight: '1px solid #e5e7eb' }}>
                    <input
                      type="number"
                      value={mark.maxMarks}
                      onChange={(e) => updateMark(mark.registerNo, 'maxMarks', Number(e.target.value))}
                      style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '8px' }}>
                    <input
                      type="number"
                      value={mark.scoredMarks}
                      onChange={(e) => updateMark(mark.registerNo, 'scoredMarks', Number(e.target.value))}
                      style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', textAlign: 'center' }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={handleSaveAllMarks}
          disabled={saving}
          style={{
            width: '100%',
            padding: '14px',
            background: saving ? '#9ca3af' : '#6366f1',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: saving ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          {saving ? '⏳ Saving...' : '🚀 Save All Marks'}
        </button>
      </div>
    </div>
  );
}
