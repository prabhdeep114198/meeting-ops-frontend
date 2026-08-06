import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Calendar, Users, FileText, ArrowRight, RefreshCw } from 'lucide-react';
import { apiService } from '../services/api';
import { StatusPill } from '../components/Common/StatusPill';

export const MeetingsList = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchMeetings = async () => {
    setLoading(true);
    const data = await apiService.getMeetings();
    setMeetings(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const filteredMeetings = meetings.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase()) ||
      (m.attendees && m.attendees.some(a => a.toLowerCase().includes(search.toLowerCase())));
    const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Meetings Workspace</h1>
          <p className="page-subtitle">
            Ingested meeting transcripts, automated item extraction, & review statuses
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={fetchMeetings}>
            <RefreshCw size={16} /> Refresh
          </button>
          <Link to="/meetings/new" className="btn btn-primary">
            <Plus size={18} /> Upload Transcript
          </Link>
        </div>
      </div>

      {/* Summary KPI Ribbon */}
      <div style={styles.summaryRibbon}>
        <div style={styles.summaryCard}>
          <span style={styles.summaryVal}>{meetings.length}</span>
          <span style={styles.summaryLbl}>Total Ingested</span>
        </div>
        <div style={styles.summaryCard}>
          <span style={{ ...styles.summaryVal, color: '#60a5fa' }}>
            {meetings.filter(m => m.status === 'PROCESSING').length}
          </span>
          <span style={styles.summaryLbl}>Processing Pipeline</span>
        </div>
        <div style={styles.summaryCard}>
          <span style={{ ...styles.summaryVal, color: '#fbbf24' }}>
            {meetings.filter(m => m.status === 'PENDING_REVIEW').length}
          </span>
          <span style={styles.summaryLbl}>Pending Review</span>
        </div>
        <div style={styles.summaryCard}>
          <span style={{ ...styles.summaryVal, color: '#34d399' }}>
            {meetings.reduce((acc, m) => acc + (m.itemCount || 0), 0)}
          </span>
          <span style={styles.summaryLbl}>Extracted Action Items</span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div style={styles.toolbar}>
        <div style={styles.searchBox}>
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search meetings by title or attendee name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.filterBox}>
          <Filter size={16} color="var(--text-muted)" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="ALL">All Statuses</option>
            <option value="PROCESSING">Processing</option>
            <option value="PENDING_REVIEW">Pending Review</option>
            <option value="REVIEWED">Reviewed</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
      </div>

      {/* Meetings List / Table */}
      {loading ? (
        <div style={styles.loadingState}>
          <RefreshCw size={24} style={{ animation: 'spin 1.5s linear infinite' }} />
          <p>Loading meeting records from API Gateway...</p>
        </div>
      ) : filteredMeetings.length === 0 ? (
        <div style={styles.emptyState}>
          <FileText size={40} color="var(--text-subtle)" />
          <h3>No meetings found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.25rem' }}>
            No meetings match your search query or filter selection.
          </p>
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredMeetings.map((meeting) => (
            <div key={meeting.id} className="card card-interactive" style={styles.cardContent}>
              <div style={styles.cardTop}>
                <StatusPill status={meeting.status} />
                <span style={styles.dateText}>
                  <Calendar size={13} />
                  {new Date(meeting.meetingDate).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              <h3 style={styles.meetingTitle}>{meeting.title}</h3>

              <div style={styles.attendeesList}>
                <Users size={14} color="var(--text-muted)" />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {meeting.attendees ? meeting.attendees.join(', ') : 'No attendees'}
                </span>
              </div>

              <div style={styles.cardFooter}>
                <div style={styles.counts}>
                  <span style={styles.countBadge}>{meeting.itemCount || 0} Items</span>
                  <span style={{ ...styles.countBadge, backgroundColor: 'rgba(139, 92, 246, 0.15)', color: 'var(--secondary)' }}>
                    {meeting.draftCount || 0} Drafts
                  </span>
                </div>

                <Link to={`/meetings/${meeting.id}`} className="btn btn-secondary btn-sm">
                  View Detail <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  summaryRibbon: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '1.75rem',
  },
  summaryCard: {
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
  },
  summaryVal: {
    fontSize: '1.8rem',
    fontWeight: 800,
    lineHeight: 1,
    marginBottom: '0.35rem',
  },
  summaryLbl: {
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
    fontWeight: 600,
  },
  toolbar: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
  },
  searchBox: {
    flex: 1,
    minWidth: '280px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    padding: '0.65rem 1rem',
  },
  searchInput: {
    background: 'none',
    border: 'none',
    outline: 'none',
    color: '#ffffff',
    fontSize: '0.88rem',
    width: '100%',
  },
  filterBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    padding: '0.65rem 1rem',
  },
  filterSelect: {
    background: 'none',
    border: 'none',
    color: '#ffffff',
    fontSize: '0.85rem',
    outline: 'none',
    cursor: 'pointer',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '1.25rem',
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '210px',
  },
  cardTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '0.85rem',
  },
  dateText: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
  },
  meetingTitle: {
    fontSize: '1.05rem',
    fontWeight: 700,
    lineHeight: 1.35,
    marginBottom: '0.75rem',
  },
  attendeesList: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    marginBottom: '1.25rem',
  },
  cardFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTop: '1px solid var(--border-subtle)',
    paddingTop: '0.85rem',
  },
  counts: {
    display: 'flex',
    gap: '0.4rem',
  },
  countBadge: {
    fontSize: '0.72rem',
    fontWeight: 700,
    padding: '0.2rem 0.5rem',
    borderRadius: '6px',
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    color: 'var(--primary)',
  },
  loadingState: {
    textAlign: 'center',
    padding: '4rem 2rem',
    color: 'var(--text-muted)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem 2rem',
    backgroundColor: 'var(--bg-surface)',
    border: '1px dashed var(--border-subtle)',
    borderRadius: 'var(--radius-lg)',
  }
};
