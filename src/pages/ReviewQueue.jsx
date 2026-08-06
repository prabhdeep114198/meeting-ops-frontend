import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, AlertTriangle, Sparkles, ArrowRight, ShieldAlert, Check, RefreshCw, Layers } from 'lucide-react';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { GroundingBadge } from '../components/Common/GroundingBadge';

export const ReviewQueue = () => {
  const { role } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ATTENTION'); // 'ATTENTION' vs 'READY'
  const [drafts, setDrafts] = useState([]);
  const [extractedItems, setExtractedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [actionSuccessMsg, setActionSuccessMsg] = useState(null);

  const loadQueue = async () => {
    setLoading(true);
    const dData = await apiService.getReviewQueue();
    const iData = await apiService.getMeetingItems('m-101'); // fetch all items
    setDrafts(dData.filter(d => d.status === 'DRAFTED'));
    setExtractedItems(iData);
    setLoading(false);
  };

  useEffect(() => {
    loadQueue();
  }, []);

  const needsAttentionDrafts = drafts.filter(d => d.conflictData && d.conflictData.hasConflict);
  const readyDrafts = drafts.filter(d => !d.conflictData || !d.conflictData.hasConflict);

  const displayedDrafts = activeTab === 'ATTENTION' ? needsAttentionDrafts : readyDrafts;

  const handleDecision = async (id, decision) => {
    if (role === 'participant') {
      alert('Demo restriction: Switch role to "Reviewer" or "Admin" in the top navbar to approve or reject actions.');
      return;
    }
    await apiService.submitDecision(id, decision, `Decision ${decision} submitted in Review Queue workspace`);
    setActionSuccessMsg(`Draft action successfully ${decision === 'APPROVE' ? 'approved' : 'rejected'}.`);
    setTimeout(() => setActionSuccessMsg(null), 3000);
    loadQueue();
  };

  const handleBulkApprove = async () => {
    if (role === 'participant') {
      alert('Demo restriction: Switch role to "Reviewer" or "Admin" in top bar to bulk approve.');
      return;
    }
    const targetIds = selectedIds.length > 0 ? selectedIds : readyDrafts.map(d => d.id);
    if (targetIds.length === 0) return;

    await apiService.bulkApprove(targetIds);
    setActionSuccessMsg(`Successfully bulk-approved ${targetIds.length} draft actions!`);
    setSelectedIds([]);
    setTimeout(() => setActionSuccessMsg(null), 3000);
    loadQueue();
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Human-in-the-Loop Review Queue</h1>
          <p className="page-subtitle">
            Core workspace to audit, edit, and approve AI-generated follow-through actions before execution
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={loadQueue}>
            <RefreshCw size={16} /> Refresh Queue
          </button>

          {activeTab === 'READY' && readyDrafts.length > 0 && (
            <button className="btn btn-primary" onClick={handleBulkApprove}>
              <CheckCircle2 size={18} /> Bulk-Approve {selectedIds.length > 0 ? `(${selectedIds.length})` : 'All Ready'}
            </button>
          )}
        </div>
      </div>

      {actionSuccessMsg && (
        <div style={styles.successBanner}>
          <CheckCircle2 size={18} /> {actionSuccessMsg}
        </div>
      )}

      {/* Workspace Tabs: "Needs your attention" vs "Ready to review" */}
      <div style={styles.tabHeader}>
        <button
          style={{
            ...styles.tabBtn,
            ...(activeTab === 'ATTENTION' ? styles.tabBtnActiveAttention : {})
          }}
          onClick={() => setActiveTab('ATTENTION')}
        >
          <ShieldAlert size={17} color={activeTab === 'ATTENTION' ? '#f87171' : 'var(--text-muted)'} />
          <span>Needs Your Attention</span>
          <span style={styles.tabBadgeRed}>{needsAttentionDrafts.length}</span>
        </button>

        <button
          style={{
            ...styles.tabBtn,
            ...(activeTab === 'READY' ? styles.tabBtnActiveReady : {})
          }}
          onClick={() => setActiveTab('READY')}
        >
          <CheckCircle2 size={17} color={activeTab === 'READY' ? '#34d399' : 'var(--text-muted)'} />
          <span>Ready to Review</span>
          <span style={styles.tabBadgeGreen}>{readyDrafts.length}</span>
        </button>
      </div>

      {/* Main Review Queue List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
          <RefreshCw size={24} style={{ animation: 'spin 1.5s linear infinite' }} />
          <p style={{ marginTop: '0.5rem' }}>Fetching review items from review-service...</p>
        </div>
      ) : displayedDrafts.length === 0 ? (
        /* Empty State Celebration (Prompt requirement) */
        <div className="card" style={styles.emptyStateCard}>
          <div style={styles.celebrateIcon}>
            <Sparkles size={40} color="var(--primary)" />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Queue Clear! All Caught Up</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0.5rem auto 1.5rem' }}>
            {activeTab === 'ATTENTION'
              ? 'No conflicts or clarification flags requiring human intervention.'
              : 'All standard low-risk draft follow-through items have been reviewed.'}
          </p>
          <button className="btn btn-secondary" onClick={() => navigate('/meetings')}>
            View Meetings Workspace
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {displayedDrafts.map((draft) => (
            <div key={draft.id} className="card card-interactive" style={styles.queueCard}>
              <div style={styles.queueLeft}>
                {activeTab === 'READY' && (
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(draft.id)}
                    onChange={() => toggleSelect(draft.id)}
                    style={styles.checkbox}
                  />
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={styles.actionTypeBadge}>{draft.actionType}</span>
                    {draft.conflictData?.hasConflict ? (
                      <GroundingBadge classification="CONFLICT_DETECTED" rationale="Historical decision conflict detected" />
                    ) : (
                      <GroundingBadge classification="NO_CONFLICT" rationale="High-confidence grounded item" />
                    )}
                  </div>

                  <h3 style={styles.itemTitle}>{draft.title || 'Follow-through Draft Action'}</h3>

                  {draft.conflictData?.hasConflict && (
                    <div style={styles.conflictExcerpt}>
                      <span style={{ fontWeight: 700, color: '#f87171' }}>Conflict Alert:</span>{' '}
                      {draft.conflictData.proposedDecision} (Overrides: "{draft.conflictData.historicalDecision}")
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={styles.queueRight}>
                <Link to={`/review-queue/${draft.id}`} className="btn btn-secondary btn-sm">
                  Single-Item Review <ArrowRight size={14} />
                </Link>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDecision(draft.id, 'REJECT')}
                >
                  <XCircle size={15} /> Reject
                </button>

                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleDecision(draft.id, 'APPROVE')}
                >
                  <Check size={15} /> Approve & Execute
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  successBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'rgba(52, 211, 153, 0.15)',
    border: '1px solid rgba(52, 211, 153, 0.3)',
    color: '#34d399',
    borderRadius: 'var(--radius-md)',
    padding: '0.85rem 1rem',
    fontSize: '0.88rem',
    marginBottom: '1.25rem',
  },
  tabHeader: {
    display: 'flex',
    gap: '1rem',
    borderBottom: '1px solid var(--border-subtle)',
    paddingBottom: '0.75rem',
    marginBottom: '1.5rem',
  },
  tabBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    padding: '0.65rem 1.25rem',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  tabBtnActiveAttention: {
    borderColor: 'rgba(239, 68, 68, 0.5)',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    color: '#ffffff',
    fontWeight: 800,
  },
  tabBtnActiveReady: {
    borderColor: 'rgba(52, 211, 153, 0.5)',
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
    color: '#ffffff',
    fontWeight: 800,
  },
  tabBadgeRed: {
    fontSize: '0.72rem',
    fontWeight: 800,
    backgroundColor: 'rgba(239, 68, 68, 0.25)',
    color: '#f87171',
    padding: '0.15rem 0.5rem',
    borderRadius: '9999px',
  },
  tabBadgeGreen: {
    fontSize: '0.72rem',
    fontWeight: 800,
    backgroundColor: 'rgba(52, 211, 153, 0.25)',
    color: '#34d399',
    padding: '0.15rem 0.5rem',
    borderRadius: '9999px',
  },
  emptyStateCard: {
    textAlign: 'center',
    padding: '4rem 2rem',
    backgroundColor: 'var(--bg-surface)',
    border: '1px dashed var(--border-glow)',
    borderRadius: 'var(--radius-xl)',
  },
  celebrateIcon: {
    width: '70px',
    height: '70px',
    margin: '0 auto 1rem',
    borderRadius: '50%',
    backgroundColor: 'var(--primary-light)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  queueCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1.5rem',
    flexWrap: 'wrap',
  },
  queueLeft: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    flex: 1,
    minWidth: '280px',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    marginTop: '0.2rem',
    cursor: 'pointer',
  },
  actionTypeBadge: {
    fontSize: '0.7rem',
    fontWeight: 800,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    color: 'var(--primary)',
    padding: '0.2rem 0.55rem',
    borderRadius: '4px',
  },
  itemTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#ffffff',
  },
  conflictExcerpt: {
    fontSize: '0.82rem',
    color: 'var(--text-muted)',
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderLeft: '3px solid #f87171',
    padding: '0.4rem 0.65rem',
    borderRadius: '4px',
  },
  queueRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    flexWrap: 'wrap',
  }
};
