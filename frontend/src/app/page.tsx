'use client'

import { useState } from 'react';
import { AnalysisResponse } from '@/types/security';
import CodeInput from '@/components/CodeInput';
import AnalysisResults from '@/components/AnalysisResults';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'development' && typeof window !== 'undefined' && window.location?.hostname === 'localhost'
    ? 'http://localhost:8000'
    : '');

export default function Home() {
  const [codeContent, setCodeContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [analysisResults, setAnalysisResults] = useState<AnalysisResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith('.py')) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCodeContent(content);
        setAnalysisResults(null);
        setError(null);
      };
      reader.readAsText(file);
    } else {
      alert('Please select a Python (.py) file');
    }
  };

  const handleAnalyzeCode = async () => {
    if (!codeContent) {
      alert('Please upload a Python file first');
      return;
    }
    setIsAnalyzing(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codeContent }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const results: AnalysisResponse = await response.json();
      setAnalysisResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ background: 'var(--background)' }}>

      {/* Grid background */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }} />

      <div className="max-w-7xl mx-auto relative" style={{ zIndex: 1 }}>

        {/* Header */}
        <header className="mb-10 pt-4">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
            {/* Logo mark */}
            <div style={{
              width: '44px', height: '44px', borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(0,255,157,0.1))',
              border: '1px solid rgba(0,212,255,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M11 2L3 6v5c0 4.4 3.4 8.5 8 9.5 4.6-1 8-5.1 8-9.5V6L11 2z" stroke="#00d4ff" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M8 11l2 2 4-4" stroke="#00ff9d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '26px',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: 'var(--foreground)',
                margin: 0,
                lineHeight: 1.1,
              }}>
                AI SAST{' '}
                <span style={{
                  background: 'linear-gradient(90deg, #00d4ff, #00ff9d)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  Code Scanning
                </span>{' '}
                Agent
              </h1>
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--foreground-muted)',
                margin: 0,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}>
                Static Analysis Security Testing · Python
              </p>
            </div>
          </div>

          {/* Status bar */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '24px',
            marginTop: '20px', paddingTop: '16px',
            borderTop: '1px solid var(--border)',
          }}>
            {[
              { label: 'Engine', value: 'Groq LLaMA 3.1' },
              { label: 'Mode', value: 'SAST Analysis' },
              { label: 'Target', value: 'Python 3.x' },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--foreground-muted)', letterSpacing: '0.08em' }}>
                  {label}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--primary)', letterSpacing: '0.05em' }}>
                  {value}
                </span>
              </div>
            ))}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: isAnalyzing ? 'var(--warning)' : 'var(--secondary)',
                boxShadow: isAnalyzing ? '0 0 8px var(--warning)' : '0 0 8px var(--secondary)',
                display: 'inline-block',
                animation: isAnalyzing ? 'pulse 1s infinite' : 'none',
              }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: isAnalyzing ? 'var(--warning)' : 'var(--secondary)', letterSpacing: '0.08em' }}>
                {isAnalyzing ? 'SCANNING' : 'READY'}
              </span>
            </div>
          </div>
        </header>

        {/* Main layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', minHeight: 'calc(100vh - 260px)' }}>
          <CodeInput
            codeContent={codeContent}
            fileName={fileName}
            onFileUpload={handleFileUpload}
            onAnalyzeCode={handleAnalyzeCode}
            isAnalyzing={isAnalyzing}
          />
          <AnalysisResults
            analysisResults={analysisResults}
            isAnalyzing={isAnalyzing}
            error={error}
          />
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
