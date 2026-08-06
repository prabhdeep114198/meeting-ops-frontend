import React from 'react';
import { AlertTriangle, Clock, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const ConflictComparisonCard = ({ conflictData }) => {
  if (!conflictData || !conflictData.hasConflict) {
    return (
      <div style={styles.noConflictCard}>
        <CheckCircle2 size={20} color="#34d399" />
        <div>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#34d399' }}>Grounded & Verified</h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            No historical conflicts detected across past meetings or organizational decisions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldAlert size={18} color="#f87171" />
          <h3 style={styles.title}>Historical Conflict Comparison ("Then vs. Now")</h3>
        </div>
        <span style={styles.badge}>{conflictData.conflictType}</span>
      </div>

      <div style={styles.comparisonGrid}>
        {/* Previous Decision (Then) */}
        <div style={styles.thenCol}>
          <div style={styles.colHeader}>
            <Clock size={14} color="var(--text-muted)" />
            <span>HISTORICAL DECISION ("THEN")</span>
          </div>
          <p style={styles.meetingSource}>{conflictData.historicalMeetingTitle}</p>
          <div style={styles.decisionBoxThen}>
            {conflictData.historicalDecision}
          </div>
        </div>

        <div style={styles.arrowCol}>
          <ArrowRight size={22} color="var(--accent)" />
        </div>

        {/* Proposed Decision (Now) */}
        <div style={styles.nowCol}>
          <div style={styles.colHeader}>
            <AlertTriangle size={14} color="#f87171" />
            <span>PROPOSED UPDATE ("NOW")</span>
          </div>
          <p style={styles.meetingSource}>Current Meeting Transcript</p>
          <div style={styles.decisionBoxNow}>
            {conflictData.proposedDecision}
          </div>
        </div>
      </div>

      <div style={styles.footerNote}>
        <span style={{ fontWeight: 700, color: 'var(--text-muted)' }}>Grounding Detection:</span>{' '}
        {conflictData.detectedBy}
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: 'var(--radius-lg)',
    padding: '1.5rem',
    marginBottom: '1.5rem',
  },
  noConflictCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    backgroundColor: 'rgba(52, 211, 153, 0.06)',
    border: '1px solid rgba(52, 211, 153, 0.25)',
    borderRadius: 'var(--radius-lg)',
    padding: '1.25rem',
    marginBottom: '1.5rem',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.25rem',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid rgba(239, 68, 68, 0.2)',
  },
  title: {
    fontSize: '1rem',
    fontWeight: 800,
    color: '#ffffff',
  },
  badge: {
    fontSize: '0.7rem',
    fontWeight: 800,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    color: '#f87171',
    padding: '0.2rem 0.6rem',
    borderRadius: '9999px',
    letterSpacing: '0.04em',
  },
  comparisonGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    gap: '1rem',
    alignItems: 'center',
  },
  colHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    fontSize: '0.72rem',
    fontWeight: 800,
    color: 'var(--text-muted)',
    marginBottom: '0.35rem',
    letterSpacing: '0.05em',
  },
  meetingSource: {
    fontSize: '0.78rem',
    color: 'var(--primary)',
    fontWeight: 600,
    marginBottom: '0.5rem',
  },
  thenCol: {
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    padding: '1rem',
  },
  nowCol: {
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid rgba(239, 68, 68, 0.4)',
    borderRadius: 'var(--radius-md)',
    padding: '1rem',
  },
  arrowCol: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  decisionBoxThen: {
    fontSize: '0.88rem',
    color: 'var(--text-muted)',
    lineHeight: 1.4,
    textDecoration: 'line-through',
  },
  decisionBoxNow: {
    fontSize: '0.88rem',
    color: '#ffffff',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  footerNote: {
    marginTop: '1rem',
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    borderTop: '1px dashed rgba(239, 68, 68, 0.2)',
    paddingTop: '0.75rem',
  }
};
