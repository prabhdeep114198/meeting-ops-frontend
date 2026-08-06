import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  FileText,
  Save,
  Bot,
  UserCheck,
  Send
} from 'lucide-react';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ConflictComparisonCard } from '../components/Review/ConflictComparisonCard';
import { PayloadPreviewCard } from '../components/Review/PayloadPreviewCard';
import { StatusPill } from '../components/Common/StatusPill';

export const DraftActionDetail = () => {
  const { draftActionId } = useParams();
  const navigate = useNavigate();
  const { role } = useAuth();

  const [draft, setDraft] = useState(null);
  const [auditTrail, setAuditTrail] = useState([]);
  const [payloadText, setPayloadText] = useState('');
  const [rationale, setRationale] = useState('');
  const [loading, setLoading] = useState(true);
  const [decisionFeedback, setDecisionFeedback] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const queue = await apiService.getReviewQueue();
      const target = queue.find(d => d.id === draftActionId) || queue[0];
      const audit = await apiService.getAuditTrail(draftActionId);

      if (target) {
        setDraft(target);
        setPayloadText(target.payloadJson || '');
        setAuditTrail(audit);
      }
      setLoading(false);
    };

    fetchData();
  }, [draftActionId]);

  const handleSubmitDecision = async (decision) => {
    if (role === 'participant') {
      alert('Demo restriction: Switch role to "Reviewer" or "Admin" in top bar to execute decisions.');
      return;
    }

    await apiService.submitDecision(draftActionId, decision, rationale || `Reviewed as ${decision}`, payloadText);
    setDecisionFeedback(`Decision submitted: ${decision}. Action state transitioned.`);
    setTimeout(() => {
      navigate('/review-queue');
    }, 1500);
  };

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading draft action details...</p>
      </div>
    );
  }

  if (!draft) {
    return (
      <div className="page-container">
        <h2>Draft Action Not Found</h2>
        <button className="btn btn-secondary" onClick={() => navigate('/review-queue')}>
          Return to Review Queue
        </button>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: '1100px' }}>
      <button className="btn btn-secondary btn-sm" onClick={() => navigate('/review-queue')} style={{ marginBottom: '1rem' }}>
        <ArrowLeft size={16} /> Back to Review Queue
      </button>

      {/* Header Banner */}
      <div className="card" style={styles.headerCard}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <StatusPill status={draft.status} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: {draft.id}</span>
          </div>

          <span style={styles.actionTypeBadge}>{draft.actionType}</span>
        </div>

        <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{draft.title || 'Single-Item Action Review'}</h1>
      </div>

      {decisionFeedback && (
        <div style={styles.feedbackBanner}>
          <CheckCircle2 size={18} /> {decisionFeedback}
        </div>
      )}

      {/* 1. "Then vs Now" Conflict Comparison Card (Screen #6 requirement) */}
      <ConflictComparisonCard conflictData={draft.conflictData} />

      {/* 2. Evidence Excerpt Card */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={styles.sectionTitle}>Supporting Evidence Excerpt</h3>
        <div style={styles.evidenceBox}>
          <FileText size={16} color="var(--primary)" />
          <p style={{ fontSize: '0.88rem', color: '#ffffff', fontStyle: 'italic' }}>
            "David, please reschedule to Sunday Aug 17 at 4:00 AM UTC and update Jira ticket OPS-4092."
          </p>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', display: 'block' }}>
          Extracted from Q3 Operations Sync transcript (Speaker: Sarah Chen)
        </span>
      </div>

      {/* 3. FastMCP Draft Payload Preview (Task/Calendar/Email editor) */}
      <PayloadPreviewCard
        draftAction={draft}
        onPayloadChange={(newPayload) => setPayloadText(newPayload)}
        isEditable={role !== 'participant'}
      />

      {/* 4. Activity & Audit Timeline (Screen #6 requirement) */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={styles.sectionTitle}>Audit & Activity Timeline</h3>
        <div style={styles.timelineList}>
          {auditTrail.map((entry, idx) => (
            <div key={entry.id || idx} style={styles.timelineItem}>
              <div style={styles.timelineDot} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={styles.actorName}>{entry.actor}</span>
                  <span style={styles.timestamp}>{new Date(entry.timestamp).toLocaleString()}</span>
                </div>
                <p style={styles.actionDetail}>{entry.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decision Rationale & Action Controls */}
      <div className="card" style={{ backgroundColor: 'var(--bg-surface-elevated)' }}>
        <h3 style={styles.sectionTitle}>Submit Reviewer Decision</h3>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
            Decision Rationale / Audit Notes (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Schedule override confirmed with lead architect David Kim"
            value={rationale}
            onChange={(e) => setRationale(e.target.value)}
            className="input"
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            className="btn btn-danger btn-lg"
            onClick={() => handleSubmitDecision('REJECT')}
          >
            <XCircle size={18} /> Reject & Archive
          </button>

          <button
            className="btn btn-primary btn-lg"
            onClick={() => handleSubmitDecision('APPROVE')}
          >
            <CheckCircle2 size={18} /> Approve & Trigger FastMCP Tool
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  headerCard: {
    marginBottom: '1.5rem',
  },
  actionTypeBadge: {
    fontSize: '0.75rem',
    fontWeight: 800,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    color: 'var(--primary)',
    padding: '0.25rem 0.6rem',
    borderRadius: '4px',
  },
  feedbackBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'rgba(52, 211, 153, 0.15)',
    border: '1px solid rgba(52, 211, 153, 0.3)',
    color: '#34d399',
    borderRadius: 'var(--radius-md)',
    padding: '1rem',
    marginBottom: '1.5rem',
    fontSize: '0.9rem',
    fontWeight: 700,
  },
  sectionTitle: {
    fontSize: '1rem',
    fontWeight: 800,
    marginBottom: '0.85rem',
  },
  evidenceBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    backgroundColor: 'rgba(11, 15, 25, 0.7)',
    borderLeft: '4px solid var(--primary)',
    padding: '1rem',
    borderRadius: 'var(--radius-md)',
  },
  timelineList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    position: 'relative',
    paddingLeft: '0.5rem',
  },
  timelineItem: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-start',
  },
  timelineDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary)',
    marginTop: '0.3rem',
    boxShadow: '0 0 8px var(--primary)',
  },
  actorName: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: '#ffffff',
  },
  timestamp: {
    fontSize: '0.75rem',
    color: 'var(--text-subtle)',
  },
  actionDetail: {
    fontSize: '0.82rem',
    color: 'var(--text-muted)',
    marginTop: '0.2rem',
  }
};
