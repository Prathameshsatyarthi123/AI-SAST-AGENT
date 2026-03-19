'use client'

import { useRef } from 'react';

interface CodeInputProps {
  codeContent: string;
  fileName: string;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAnalyzeCode: () => void;
  isAnalyzing: boolean;
}

export default function CodeInput({ codeContent, fileName, onFileUpload, onAnalyzeCode, isAnalyzing }: CodeInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const lineCount = codeContent ? codeContent.split('\n').length : 0;
  const charCount = codeContent.length;

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: '14px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      transition: 'border-color 0.2s',
    }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
    >
      {/* Panel header */}
      <div style={{
        padding: '14px 18px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--surface-2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: codeContent ? 'var(--secondary)' : 'var(--border-strong)',
            boxShadow: codeContent ? '0 0 6px var(--secondary)' : 'none',
            transition: 'all 0.3s',
          }} />
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            color: 'var(--foreground-muted)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            Source Input
          </span>
          {fileName && (
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--primary)',
              background: 'rgba(0,212,255,0.08)',
              border: '1px solid rgba(0,212,255,0.2)',
              padding: '2px 8px',
              borderRadius: '4px',
            }}>
              {fileName}
            </span>
          )}
        </div>
        {codeContent && (
          <div style={{ display: 'flex', gap: '16px' }}>
            {[
              { label: 'lines', value: lineCount },
              { label: 'chars', value: charCount },
            ].map(({ label, value }) => (
              <span key={label} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--foreground-muted)' }}>
                <span style={{ color: 'var(--foreground)' }}>{value.toLocaleString()}</span> {label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Code area */}
      <div style={{ flex: 1, position: 'relative', minHeight: '320px' }}>
        {!codeContent ? (
          /* Empty state */
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', gap: '16px',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,212,255,0.02)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <div style={{
              width: '56px', height: '56px', borderRadius: '12px',
              border: '1px dashed rgba(0,212,255,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 16V8M9 11l3-3 3 3" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
                <path d="M5 20h14" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
              </svg>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '14px', color: 'var(--foreground-muted)', margin: '0 0 4px' }}>
                Drop a Python file or click to browse
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(0,212,255,0.4)', margin: 0, letterSpacing: '0.08em' }}>
                .PY FILES ONLY
              </p>
            </div>
          </div>
        ) : (
          /* Code display */
          <div style={{ position: 'absolute', inset: 0, overflow: 'auto' }}>
            <pre style={{
              margin: 0, padding: '16px 18px',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              lineHeight: '1.7',
              color: 'var(--foreground)',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}>
              {codeContent}
            </pre>
          </div>
        )}
      </div>

      {/* Action bar */}
      <div style={{
        padding: '14px 18px',
        borderTop: '1px solid var(--border)',
        background: 'var(--surface-2)',
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
      }}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".py"
          onChange={onFileUpload}
          style={{ display: 'none' }}
        />

        {/* Upload button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            letterSpacing: '0.06em',
            color: 'var(--foreground-muted)',
            background: 'transparent',
            border: '1px solid var(--border-strong)',
            borderRadius: '8px',
            padding: '8px 16px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = 'var(--foreground)';
            e.currentTarget.style.borderColor = 'rgba(0,212,255,0.4)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'var(--foreground-muted)';
            e.currentTarget.style.borderColor = 'var(--border-strong)';
          }}
        >
          {codeContent ? '↑ Replace file' : '↑ Open .py file'}
        </button>

        {/* Analyze button */}
        <button
          onClick={onAnalyzeCode}
          disabled={!codeContent || isAnalyzing}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            letterSpacing: '0.08em',
            fontWeight: 700,
            color: (!codeContent || isAnalyzing) ? 'rgba(0,0,0,0.5)' : '#000',
            background: (!codeContent || isAnalyzing)
              ? 'rgba(0,212,255,0.2)'
              : 'linear-gradient(135deg, #00d4ff, #00ff9d)',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 20px',
            cursor: (!codeContent || isAnalyzing) ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            flex: 1,
          }}
        >
          {isAnalyzing ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <span style={{
                display: 'inline-block', width: '10px', height: '10px',
                border: '1.5px solid rgba(0,0,0,0.4)', borderTopColor: '#000',
                borderRadius: '50%', animation: 'spin 0.7s linear infinite',
              }} />
              SCANNING...
            </span>
          ) : '▶ RUN SCAN'}
        </button>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
