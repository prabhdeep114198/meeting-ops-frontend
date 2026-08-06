import React, { useState, useEffect } from 'react';
import { Search, Calendar, History as HistoryIcon, Tag, GitMerge, AlertCircle, RefreshCw } from 'lucide-react';
import { apiService } from '../services/api';
import { StatusPill } from '../components/Common/StatusPill';

export const HistoryArchive = () => {
  const [viewMode, setViewMode] = useState('TOPIC'); // 'TOPIC' vs 'TIMELINE'
  const [searchTerm, setSearchTerm] = useState('');
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const data = await apiService.getMeetings();
      setMeetings(data);
    };
    fetchHistory();
  }, []);

  // Grouping by topic timeline (Screen #7 requirement)
  const topicGroups = [
    {
      topic: 'Database & Infrastructure Migration (pgvector)',
      icon: GitMerge,
      color: '#60a5fa',
      count: 4,
      timeline: [
        { date: '2026-08-06', meeting: 'Q3 Operations Sync', summary: 'Rescheduled maintenance window to Aug 17 04:00 UTC', status: 'CONFLICT_RESOLVED' },
        { date: '2026-07-28', meeting: 'Architecture Strategy Review', summary: 'Decided maintenance windows must be scheduled on Sunday mornings', status: 'HISTORICAL_BASELINE' },
      ]
    },
    {
      topic: 'SOC2 & MCP Security Audit Compliance',
      icon: Tag,
      color: '#34d399',
      count: 3,
      timeline: [
        { date: '2026-08-06', meeting: 'Q3 Operations Sync', summary: 'MCP tool log audit retention extended to 365 days', status: 'APPROVED' },
        { date: '2026-08-05', meeting: 'AI Pipeline Integration', summary: 'Configured tool invocation telemetry via FastMCP', status: 'APPROVED' },
      ]
    },
    {
      topic: 'Human Review Queue SLA & Auto-Approve Thresholds',
      icon: AlertCircle,
      color: '#fbbf24',
      count: 2,
      timeline: [
        { date: '2026-08-05', meeting: 'AI Pipeline Integration', summary: 'Grounding confidence threshold established at 0.92', status: 'IN_EFFECT' }
      ]
    }
  ];

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Meeting History & Cross-Meeting Timeline</h1>
          <p className="page-subtitle">
            Searchable historical archive with "By Topic" grouped timeline tracing recurring items & caught conflicts
          </p>
        </div>

        {/* View Toggle */}
        <div style={styles.toggleGroup}>
          <button
            style={{
              ...styles.toggleBtn,
              ...(viewMode === 'TOPIC' ? styles.toggleBtnActive : {})
            }}
            onClick={() => setViewMode('TOPIC')}
          >
            <Tag size={15} /> By Topic Timeline
          </button>
          <button
            style={{
              ...styles.toggleBtn,
              ...(viewMode === 'TIMELINE' ? styles.toggleBtnActive : {})
            }}
            onClick={() => setViewMode('TIMELINE')}
          >
            <Calendar size={15} /> All Meetings List
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div style={styles.searchBar}>
        <Search size={18} color="var(--text-muted)" />
        <input
          type="text"
          placeholder="Search past meetings, recurring topics, or caught conflicts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {/* View Content */}
      {viewMode === 'TOPIC' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {topicGroups.map((group, idx) => {
            const Icon = group.icon;
            return (
              <div key={idx} className="card">
                <div style={styles.topicHeader}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{ ...styles.topicIcon, backgroundColor: `${group.color}20` }}>
                      <Icon size={20} color={group.color} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{group.topic}</h3>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {group.count} related cross-meeting decisions
                      </span>
                    </div>
                  </div>
                </div>

                {/* Timeline Items */}
                <div style={styles.timelineList}>
                  {group.timeline.map((item, tIdx) => (
                    <div key={tIdx} style={styles.timelineCard}>
                      <div style={styles.timelineLeft}>
                        <span style={styles.timelineDate}>{item.date}</span>
                        <span style={styles.timelineMeeting}>{item.meeting}</span>
                      </div>

                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 600 }}>{item.summary}</p>
                      </div>

                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '0.2rem 0.55rem',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(99, 102, 241, 0.15)',
                        color: 'var(--primary)',
                      }}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {meetings.map((m) => (
            <div key={m.id} className="card card-interactive">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <StatusPill status={m.status} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {new Date(m.meetingDate).toLocaleDateString()}
                </span>
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{m.title}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {m.itemCount} Extracted items • {m.draftCount} Drafts
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  toggleGroup: {
    display: 'flex',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    padding: '0.25rem',
    gap: '0.25rem',
  },
  toggleBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.45rem 0.85rem',
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    backgroundColor: 'transparent',
    color: 'var(--text-muted)',
    fontSize: '0.82rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  toggleBtnActive: {
    backgroundColor: 'var(--primary-light)',
    color: '#ffffff',
    fontWeight: 700,
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    padding: '0.75rem 1rem',
    marginBottom: '1.5rem',
  },
  searchInput: {
    background: 'none',
    border: 'none',
    outline: 'none',
    color: '#ffffff',
    fontSize: '0.9rem',
    width: '100%',
  },
  topicHeader: {
    paddingBottom: '1rem',
    borderBottom: '1px solid var(--border-subtle)',
    marginBottom: '1rem',
  },
  topicIcon: {
    width: '42px',
    height: '42px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  timelineCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    backgroundColor: 'var(--bg-surface-elevated)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    padding: '0.85rem 1.25rem',
    flexWrap: 'wrap',
  },
  timelineLeft: {
    display: 'flex',
    flexDirection: 'column',
    width: '180px',
  },
  timelineDate: {
    fontSize: '0.75rem',
    fontWeight: 800,
    color: 'var(--primary)',
  },
  timelineMeeting: {
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
  }
};
