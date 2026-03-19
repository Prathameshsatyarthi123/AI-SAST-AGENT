'use client'

import { useState } from 'react';
import { AnalysisResponse, SecurityIssue } from '@/types/security';

interface AnalysisResultsProps {
  analysisResults: AnalysisResponse | null;
  isAnalyzing: boolean;
  error: string | null;
}

const SEVERITY_CONFIG: Record<string, {
  color: string; bg: string; border: string; label: string;
}> = {
  critical: { color: '#ff4444', bg: 'rgba(255,68,68,0.08)',   border: 'rgba(255,68,68,0.28)',   label: 'CRIT' },
  high:     { color: '#ff8800', bg: 'rgba(255,136,0,0.08)',   border: 'rgba(255,136,0,0.28)',   label: 'HIGH' },
  medium:   { color: '#ffaa00', bg: 'rgba(255,170,0,0.08)',   border: 'rgba(255,170,0,0.28)',   label: 'MED'  },
  low:      { color: '#00d4ff', bg: 'rgba(0,212,255,0.07)',   border: 'rgba(0,212,255,0.22)',   label: 'LOW'  },
};

function getSev(severity: string) {
  return SEVERITY_CONFIG[severity?.toLowerCase()] ?? SEVERITY_CONFIG.low;
}

function CvssBar({ score, color }: { score: number; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{
        flex: 1, height: '3px',
        background: 'rgba(255,255,255,0.06)',
        borderRadius: '2px', overflow: 'hidden',
      }}>
        <div style={{
          width: `${(score / 10) * 100}%`,
          height: '100%',
          background: color,
          borderRadius: '2px',
          transition: 'width 0.5s ease',
        }} />
      </div>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color, minWidth: '28px' }}>
        {score.toFixed(1)}
      </span>
    </div>
  );
}

function IssueCard({ issue, index }: { issue: SecurityIssue; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = getSev(issue.severity);

  return (
    <div style={{
      border: `1px solid ${expanded ? cfg.border : 'var(--border)'}`,
      borderRadius: '10px',
      background: expanded ? cfg.bg : 'var(--surface-2)',
      overflow: 'hidden',
      transition: 'all 0.2s',
      marginBottom: '8px',
    }}>
      {/* Row */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%', textAlign: 'left',
          background: 'transparent', border: 'none',
          cursor: 'pointer', padding: '11px 14px',
          display: 'flex', alignItems: 'center', gap: '10px',
        }}
      >
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--foreground-muted)', minWidth: '18px' }}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
          color: cfg.color,
          background: cfg.bg,
          border: `1px solid ${cfg.border}`,
          padding: '2px 6px', borderRadius: '4px',
          letterSpacing: '0.08em', minWidth: '38px', textAlign: 'center',
        }}>
          {cfg.label}
        </span>
        <span style={{
          fontFamily: 'var(--font-display)', fontSize: '13px',
          color: 'var(--foreground)', flex: 1, fontWeight: 600,
        }}>
          {issue.title}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: cfg.color, minWidth: '30px', textAlign: 'right' }}>
          {issue.cvss_score.toFixed(1)}
        </span>
        <span style={{
          color: 'var(--foreground-muted)', fontSize: '11px',
          transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s', display: 'inline-block', marginLeft: '4px',
        }}>▼</span>
      </button>

      {/* CVSS bar */}
      <div style={{ padding: '0 14px 10px', paddingLeft: '46px' }}>
        <CvssBar score={issue.cvss_score} color={cfg.color} />
      </div>

      {/* Expanded body */}
      {expanded && (
        <div style={{
          padding: '14px',
          borderTop: `1px solid ${cfg.border}`,
          display: 'flex', flexDirection: 'column', gap: '12px',
        }}>
          <p style={{
            fontFamily: 'var(--font-display)', fontSize: '13px',
            color: 'var(--foreground-muted)', lineHeight: 1.65, margin: 0,
          }}>
            {issue.description}
          </p>

          {issue.code && (
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#ff4444', letterSpacing: '0.1em', marginBottom: '6px' }}>
                ✗ VULNERABLE CODE
              </div>
              <pre style={{
                background: 'rgba(255,68,68,0.05)',
                border: '1px solid rgba(255,68,68,0.15)',
                borderRadius: '6px', padding: '10px 12px',
                fontFamily: 'var(--font-mono)', fontSize: '11px',
                color: 'var(--foreground)', lineHeight: 1.6,
                margin: 0, overflowX: 'auto',
                whiteSpace: 'pre-wrap', wordBreak: 'break-word',
              }}>
                {issue.code}
              </pre>
            </div>
          )}

          {issue.fix && (
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--secondary)', letterSpacing: '0.1em', marginBottom: '6px' }}>
                ✓ RECOMMENDED FIX
              </div>
              <pre style={{
                background: 'rgba(0,255,157,0.04)',
                border: '1px solid rgba(0,255,157,0.15)',
                borderRadius: '6px', padding: '10px 12px',
                fontFamily: 'var(--font-mono)', fontSize: '11px',
                color: 'var(--foreground)', lineHeight: 1.6,
                margin: 0, overflowX: 'auto',
                whiteSpace: 'pre-wrap', wordBreak: 'break-word',
              }}>
                {issue.fix}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AnalysisResults({ analysisResults, isAnalyzing, error }: AnalysisResultsProps) {
  const counts = analysisResults ? {
    critical: analysisResults.issues.filter(i => i.severity?.toLowerCase() === 'critical').length,
    high:     analysisResults.issues.filter(i => i.severity?.toLowerCase() === 'high').length,
    medium:   analysisResults.issues.filter(i => i.severity?.toLowerCase() === 'medium').length,
    low:      analysisResults.issues.filter(i => i.severity?.toLowerCase() === 'low').length,
  } : null;

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: '14px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--surface-2)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            width: '7px', height: '7px', borderRadius: '50%',
            background: analysisResults ? 'var(--secondary)' : isAnalyzing ? 'var(--warning)' : 'var(--border-strong)',
            boxShadow: analysisResults ? '0 0 6px var(--secondary)' : isAnalyzing ? '0 0 6px var(--warning)' : 'none',
            display: 'inline-block',
            animation: isAnalyzing ? 'resultPulse 1s infinite' : 'none',
          }} />
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '11px',
            color: 'var(--foreground-muted)', letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>
            Scan Results
          </span>
        </div>
        {analysisResults && (
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '11px',
            color: 'var(--secondary)',
            background: 'rgba(0,255,157,0.08)',
            border: '1px solid rgba(0,255,157,0.2)',
            padding: '2px 8px', borderRadius: '4px',
          }}>
            {analysisResults.issues.length} issue{analysisResults.issues.length !== 1 ? 's' : ''} found
          </span>
        )}
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflow: 'auto', padding: '14px' }}>

        {/* Loading */}
        {isAnalyzing && (
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '80px 0', gap: '16px',
          }}>
            <div style={{
              width: '44px', height: '44px',
              border: '2px solid var(--border)',
              borderTopColor: 'var(--primary)',
              borderRadius: '50%',
              animation: 'spinResult 0.8s linear infinite',
            }} />
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--primary)', margin: '0 0 4px', letterSpacing: '0.1em' }}>
                ANALYZING CODE...
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--foreground-muted)', margin: 0 }}>
                Running SAST checks
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && !isAnalyzing && (
          <div style={{
            background: 'rgba(255,68,68,0.06)',
            border: '1px solid rgba(255,68,68,0.2)',
            borderRadius: '10px', padding: '16px',
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#ff4444', letterSpacing: '0.1em', marginBottom: '6px' }}>
              ✗ SCAN ERROR
            </div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '13px', color: 'var(--foreground-muted)', margin: 0 }}>
              {error}
            </p>
          </div>
        )}

        {/* Empty */}
        {!isAnalyzing && !error && !analysisResults && (
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '80px 0', gap: '12px', opacity: 0.45,
          }}>
            <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
              <rect x="1" y="1" width="38" height="38" rx="8" stroke="rgba(0,212,255,0.4)" strokeWidth="1"/>
              <path d="M13 20h14M13 14h14M13 26h8" stroke="rgba(0,212,255,0.5)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--foreground-muted)', margin: 0, letterSpacing: '0.08em' }}>
              Awaiting scan input
            </p>
          </div>
        )}

        {/* Results */}
        {analysisResults && !isAnalyzing && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

            {/* Summary */}
            <div style={{
              background: 'var(--surface-3)',
              border: '1px solid var(--border)',
              borderRadius: '10px', padding: '14px 16px',
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--primary)', letterSpacing: '0.12em', marginBottom: '8px' }}>
                EXECUTIVE SUMMARY
              </div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '13px', color: 'var(--foreground-muted)', lineHeight: 1.65, margin: 0 }}>
                {analysisResults.summary}
              </p>
            </div>

            {/* Severity counts */}
            {counts && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {(
                  [
                    { key: 'critical', displayLabel: 'Critical', count: counts.critical, ...SEVERITY_CONFIG.critical },
                    { key: 'high',     displayLabel: 'High',     count: counts.high,     ...SEVERITY_CONFIG.high     },
                    { key: 'medium',   displayLabel: 'Medium',   count: counts.medium,   ...SEVERITY_CONFIG.medium   },
                    { key: 'low',      displayLabel: 'Low',      count: counts.low,      ...SEVERITY_CONFIG.low      },
                  ]
                ).map(({ key, displayLabel, count, color, bg, border }) => (
                  <div key={key} style={{
                    background: bg,
                    border: `1px solid ${border}`,
                    borderRadius: '8px', padding: '10px 12px', textAlign: 'center',
                  }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', fontWeight: 700, color, lineHeight: 1 }}>
                      {count}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color, opacity: 0.7, marginTop: '4px', letterSpacing: '0.08em' }}>
                      {displayLabel.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Issue list */}
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--foreground-muted)', letterSpacing: '0.12em', marginBottom: '10px' }}>
                VULNERABILITIES ({analysisResults.issues.length})
              </div>
              {analysisResults.issues.map((issue, i) => (
                <IssueCard key={i} issue={issue} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spinResult   { to { transform: rotate(360deg); } }
        @keyframes resultPulse  { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
    </div>
  );
}
