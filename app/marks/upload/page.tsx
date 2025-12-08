'use client';

import React, { useState } from "react";
import Papa from "papaparse";

type Row = Record<string, any>;

export default function MarksUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [examType, setExamType] = useState("Internal");
  const [maxMarks, setMaxMarks] = useState(100);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState<Row[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setStatus(null);
    
    // Preview the CSV data
    if (f) {
      Papa.parse(f, {
        header: true,
        skipEmptyLines: true,
        // Remove the preview limitation to show all rows in preview
        complete: (results) => {
          setPreviewData(results.data as Row[]);
        }
      });
    } else {
      setPreviewData([]);
    }
  };

  const parseCsvFile = (file: File): Promise<Row[]> => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors && results.errors.length > 0) {
            reject(results.errors[0]);
          } else {
            resolve(results.data as Row[]);
          }
        },
        error: (err) => reject(err),
      });
    });
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus("Please select a CSV file first.");
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const rows = await parseCsvFile(file);

      const body = {
        rows, // will be picked by your API route
        examType,
        maxMarks,
      };

      const res = await fetch("/api/marks/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus(
          data?.error ||
            `Upload failed with status ${res.status}`,
        );
        return;
      }

      setStatus(
        `✅ Upload successful! Created: ${data.createdCount}, Updated: ${data.updatedCount}. Problems: ${data.problems?.length || 0}`,
      );
      
      // Clear the form after successful upload
      setFile(null);
      setPreviewData([]);
    } catch (err: any) {
      console.error(err);
      setStatus("❌ Unexpected error while uploading. Check console/logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '40px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '32px', marginBottom: '32px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '24px' }}>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                📤 Upload Marks
              </h1>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>
                Upload student marks via CSV file
              </p>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
              📄 CSV file (with headers)
            </label>
            <div style={{ 
              border: '2px dashed #d1d5db', 
              borderRadius: '8px', 
              padding: '24px', 
              textAlign: 'center', 
              backgroundColor: '#f9fafb',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#667eea'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#d1d5db'}>
              <input 
                type="file" 
                accept=".csv" 
                onChange={handleFileChange} 
                style={{ display: 'none' }} 
                id="file-upload"
              />
              <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>📁</div>
                <p style={{ marginBottom: '8px', color: '#374151' }}>
                  {file ? file.name : 'Click to select a CSV file'}
                </p>
                <p style={{ fontSize: '12px', color: '#6b7280' }}>
                  CSV should contain Register Number and subject columns
                </p>
              </label>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                🏷️ Exam type
              </label>
              <input
                type="text"
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '12px 16px', 
                  border: '2px solid #e5e7eb', 
                  borderRadius: '8px', 
                  fontSize: '14px',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                🎯 Max marks
              </label>
              <input
                type="number"
                value={maxMarks}
                onChange={(e) => setMaxMarks(Number(e.target.value))}
                style={{ 
                  width: '100%', 
                  padding: '12px 16px', 
                  border: '2px solid #e5e7eb', 
                  borderRadius: '8px', 
                  fontSize: '14px',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
          </div>

          <button
            onClick={handleUpload}
            disabled={loading}
            style={{ 
              width: '100%',
              padding: '14px', 
              background: loading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '12px', 
              fontSize: '16px', 
              fontWeight: '600', 
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                Uploading...
              </div>
            ) : (
              '📤 Upload Marks'
            )}
          </button>

          {status && (
            <div style={{ 
              marginTop: '20px',
              padding: '16px',
              borderRadius: '8px',
              backgroundColor: status.includes('✅') ? '#dcfce7' : status.includes('❌') ? '#fee2e2' : '#fffbeb',
              border: `1px solid ${status.includes('✅') ? '#bbf7d0' : status.includes('❌') ? '#fecaca' : '#fde68a'}`,
              color: status.includes('✅') ? '#166534' : status.includes('❌') ? '#991b1b' : '#854d0e'
            }}>
              {status}
            </div>
          )}
        </div>

        {/* Preview Section */}
        {previewData.length > 0 && (
          <div style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '32px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#111827' }}>📋 CSV Preview</h2>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
              Showing {previewData.length} rows from your uploaded file
            </p>
            
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f3f4f6', position: 'sticky', top: 0 }}>
                      {Object.keys(previewData[0]).map((header) => (
                        <th 
                          key={header} 
                          style={{ 
                            padding: '12px', 
                            textAlign: 'left', 
                            borderBottom: '2px solid #e5e7eb',
                            fontWeight: '600',
                            color: '#374151'
                          }}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, rowIndex) => (
                      <tr key={rowIndex} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        {Object.values(row).map((cell, cellIndex) => (
                          <td 
                            key={cellIndex} 
                            style={{ 
                              padding: '12px', 
                              color: '#374151'
                            }}
                          >
                            {String(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}