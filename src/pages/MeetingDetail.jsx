import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  Calendar,
  Users,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Bot,
  UserCheck,
  Zap,
  Layers
} from 'lucide-react';
import { apiService } from '../services/api';
import { StatusPill } from '../components/Common/StatusPill';
import { GroundingBadge } from '../components/Common/GroundingBadge';
import { TranscriptDrawer } from '../components/Meeting/TranscriptDrawer';

export const MeetingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState(null);
  const [items, setItems] = useState([]);
  const [draftActions, setDraftActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const mData = await apiService.getMeetingById(id);
      const iData = await apiService.getMeetingItems(id);
      const dData = await apiService.getReviewQueue();
      const meetingDrafts = dData.filter(d => d.meetingId === id);

      setMeeting(mData);
      setItems(iData);
      setDraftActions(meetingDrafts);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading meeting details...</p>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="page-container">
        <h2>Meeting Not Found</h2>
        <button className="btn btn-secondary" onClick={() => navigate('/meetings')}>
          Return to Meetings
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <button className="btn btn-secondary btn-sm" onClick={() => navigate('/meetings')} style={{ marginBottom: '1rem' }}>
        <ArrowLeft size={16} /> Back to Meetings
      </button>

      {/* Header Banner */}
      <div className="card" style={styles.headerCard}>
        <div style={styles.headerTop}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <StatusPill status={meeting.status} />
            <span style={styles.headerDate}>
              <Calendar size={14} />
              {new Date(meeting.meetingDate).toLocaleString()}
            </span>
          </div>

          <button className="btn btn-primary btn-sm" onClick={() => setIsDrawerOpen(true)}>
            <FileText size={16} /> View Full Transcript Drawer
          </button>
        </div>

        <h1 style={styles.title}>{meeting.title}</h1>

        <div style={styles.metaRow}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Users size={15} color="var(--text-muted)" />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Attendees: {meeting.attendees ? meeting.attendees.join(', ') : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div style={styles.mainLayout}>
        {/* Left Column: Extracted Action Items & Decisions */}
        <div style={{ flex: 1 }}>
          <div style={styles.sectionHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={18} color="var(--primary)" />
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Extracted Items & Grounding</h2>
            </div>
            <span style={styles.itemCountBadge}>{items.length} Extracted Symbols</span>
          </div>

          {items.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                No items extracted for this meeting yet.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {items.map((item) => (
                <div key={item.id} className="card" style={styles.itemCard}>
                  <div style={styles.itemTop}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          backgroundColor: item.type === 'DECISION' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                          color: item.type === 'DECISION' ? 'var(--secondary)' : 'var(--primary)',
                        }}
                      >
                        {item.type}
                      </span>
                      <GroundingBadge classification={item.groundingResult} rationale={item.groundingRationale} />
                    </div>

                    <span style={styles.confidenceScore}>
                      Confidence: {(item.confidence * 100).toFixed(0)}%
                    </span>
                  </div>

                  <p style={styles.itemDesc}>{item.description}</p>

                  <div style={styles.excerptBox}>
                    <span style={{ fontWeight: 700, color: 'var(--text-subtle)', fontSize: '0.72rem' }}>TRANSCRIPT EXCERPT:</span>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', italic: 'true', marginTop: '0.25rem' }}>
                      "{item.supportingExcerpt}"
                    </p>
                  </div>

                  <div style={styles.itemMeta}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <UserCheck size={14} color="var(--primary)" />
                      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Owner: {item.owner || 'Unassigned'}</span>
                    </div>
                    {item.deadline && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Deadline: {item.deadline}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column Sidebar: Draft Actions */}
        <div style={{ width: '380px', flexShrink: 0 }}>
          <div style={styles.sectionHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={18} color="var(--secondary)" />
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Draft Actions Sidebar</h2>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              Follow-through payloads generated by FastMCP tools awaiting reviewer sign-off:
            </p>

            {draftActions.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', fontStyle: 'italic' }}>
                No draft follow-through actions pending for this meeting.
              </p>
            ) : (
              draftActions.map((draft) => (
                <div key={draft.id} style={styles.draftCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={styles.draftType}>{draft.actionType}</span>
                    <StatusPill status={draft.status} />
                  </div>

                  <h4 style={styles.draftTitle}>{draft.title || 'Follow-through Draft'}</h4>

                  <Link
                    to={`/review-queue/${draft.id}`}
                    className="btn btn-secondary btn-sm"
                    style={{ marginTop: '0.5rem', width: '100%' }}
                  >
                    Open Full Review <ExternalLink size={14} />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Transcript Drawer */}
      <TranscriptDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        meetingTitle={meeting.title}
        transcript={meeting.transcript}
      />
    </div>
  );
};

const styles = {
  headerCard: {
    marginBottom: '2rem',
    background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.9) 0%, rgba(31, 41, 55, 0.6) 100%)',
    border: '1px solid var(--border-subtle)',
  },
  headerTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  headerDate: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: 800,
    marginBottom: '0.75rem',
  },
  metaRow: {
    display: 'flex',
    gap: '1.5rem',
  },
  mainLayout: {
    display: 'flex',
    gap: '2rem',
    flexWrap: 'wrap',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.25rem',
  },
  itemCountBadge: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'var(--text-muted)',
    backgroundColor: 'var(--bg-surface-elevated)',
    padding: '0.2rem 0.6rem',
    borderRadius: '9999px',
  },
  itemCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  itemTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  confidenceScore: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'var(--text-muted)',
  },
  itemDesc: {
    fontSize: '0.95rem',
    fontWeight: 600,
    color: '#ffffff',
    lineHeight: 1.4,
  },
  excerptBox: {
    backgroundColor: 'rgba(11, 15, 25, 0.6)',
    borderLeft: '3px solid var(--primary)',
    padding: '0.65rem 0.85rem',
    borderRadius: '4px',
  },
  itemMeta: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTop: '1px solid var(--border-subtle)',
    paddingTop: '0.65rem',
  },
  draftCard: {
    backgroundColor: 'var(--bg-surface-elevated)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  draftType: {
    fontSize: '0.72rem',
    fontWeight: 800,
    color: 'var(--secondary)',
  },
  draftTitle: {
    fontSize: '0.9rem',
    fontWeight: 700,
  }
};
