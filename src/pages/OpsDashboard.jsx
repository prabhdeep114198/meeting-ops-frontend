import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Video,
  Clock,
  ShieldAlert,
  CheckCircle2,
  TrendingUp,
  ArrowUpRight,
  ArrowRight,
  Layers,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { apiService } from '../services/api';

export const OpsDashboard = () => {
  const [metrics, setMetrics] = useState(apiService.getOpsMetrics());

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">MeetingOps Operational Dashboard</h1>
          <p className="page-subtitle">
            Real-time analytics, AI extraction throughput, conflict grounding, & reviewer performance KPIs
          </p>
        </div>

        <Link to="/meetings/new" className="btn btn-primary">
          <Sparkles size={16} /> Ingest Transcript
        </Link>
      </div>

      {/* KPI Cards Grid (Screen #10 requirement) */}
      <div style={styles.kpiGrid}>
        {/* KPI 1 */}
        <div className="card" style={styles.kpiCard}>
          <div style={styles.kpiTop}>
            <div style={{ ...styles.kpiIcon, backgroundColor: 'rgba(99, 102, 241, 0.15)' }}>
              <Video size={20} color="var(--primary)" />
            </div>
            <span style={styles.kpiTrend}>
              <TrendingUp size={14} /> +12% this week
            </span>
          </div>
          <h3 style={styles.kpiVal}>{metrics.meetingsProcessed}</h3>
          <span style={styles.kpiLbl}>Total Meetings Processed</span>
        </div>

        {/* KPI 2 */}
        <div className="card" style={styles.kpiCard}>
          <div style={styles.kpiTop}>
            <div style={{ ...styles.kpiIcon, backgroundColor: 'rgba(96, 165, 250, 0.15)' }}>
              <Clock size={20} color="#60a5fa" />
            </div>
            <span style={styles.kpiTrend}>
              <TrendingUp size={14} /> -0.4 mins faster
            </span>
          </div>
          <h3 style={{ ...styles.kpiVal, color: '#60a5fa' }}>{metrics.avgReviewTime}</h3>
          <span style={styles.kpiLbl}>Avg. Reviewer SLA Time</span>
        </div>

        {/* KPI 3 */}
        <div className="card" style={styles.kpiCard}>
          <div style={styles.kpiTop}>
            <div style={{ ...styles.kpiIcon, backgroundColor: 'rgba(239, 68, 68, 0.15)' }}>
              <ShieldAlert size={20} color="#f87171" />
            </div>
            <span style={{ ...styles.kpiTrend, color: '#f87171' }}>
              High Accuracy Grounding
            </span>
          </div>
          <h3 style={{ ...styles.kpiVal, color: '#f87171' }}>{metrics.conflictsCaught}</h3>
          <span style={styles.kpiLbl}>Historical Conflicts Caught</span>
        </div>

        {/* KPI 4 */}
        <div className="card" style={styles.kpiCard}>
          <div style={styles.kpiTop}>
            <div style={{ ...styles.kpiIcon, backgroundColor: 'rgba(52, 211, 153, 0.15)' }}>
              <CheckCircle2 size={20} color="#34d399" />
            </div>
            <span style={styles.kpiTrend}>
              <TrendingUp size={14} /> High Precision
            </span>
          </div>
          <h3 style={{ ...styles.kpiVal, color: '#34d399' }}>{metrics.approvalRate}</h3>
          <span style={styles.kpiLbl}>Draft Action Approval Rate</span>
        </div>
      </div>

      {/* Analytics Charts & Grounding Distribution */}
      <div style={styles.chartsRow}>
        {/* Trend Bar Chart Visualization */}
        <div className="card" style={{ flex: 1, minWidth: '320px' }}>
          <div style={styles.chartHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart3 size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Weekly Ingestion Throughput</h3>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Last 7 Days</span>
          </div>

          <div style={styles.chartBody}>
            {[
              { day: 'Mon', count: 14, val: '50%' },
              { day: 'Tue', count: 22, val: '75%' },
              { day: 'Wed', count: 31, val: '95%' },
              { day: 'Thu', count: 28, val: '88%' },
              { day: 'Fri', count: 26, val: '82%' },
              { day: 'Sat', count: 9,  val: '30%' },
              { day: 'Sun', count: 12, val: '40%' },
            ].map((bar, bIdx) => (
              <div key={bIdx} style={styles.barCol}>
                <div style={{ ...styles.barFill, height: bar.val }} title={`${bar.count} Meetings`} />
                <span style={styles.barLabel}>{bar.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Classification Breakdown */}
        <div className="card" style={{ width: '380px', flexShrink: 0 }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1rem' }}>
            Grounding Classification Breakdown
          </h3>

          <div style={styles.breakdownList}>
            {[
              { label: 'Grounded: No Conflict', pct: '62%', color: '#34d399', count: '88 items' },
              { label: 'Recurring Item Updated', pct: '21%', color: '#60a5fa', count: '30 items' },
              { label: 'Conflict Detected', pct: '12%', color: '#f87171', count: '17 items' },
              { label: 'Needs Clarification', pct: '5%', color: '#fbbf24', count: '7 items' },
            ].map((item, idx) => (
              <div key={idx} style={styles.breakdownItem}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>{item.label}</span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{item.pct} ({item.count})</span>
                </div>
                <div style={styles.progressTrack}>
                  <div style={{ ...styles.progressBar, width: item.pct, backgroundColor: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Conflicts List (Screen #10 requirement) */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldAlert size={18} color="#f87171" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Recent Caught Conflicts</h3>
          </div>

          <Link to="/review-queue" className="btn btn-secondary btn-sm">
            View Review Queue <ArrowRight size={14} />
          </Link>
        </div>

        <div style={styles.conflictList}>
          {metrics.recentConflicts.map((c) => (
            <div key={c.id} style={styles.conflictRow}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>{c.meeting} ({c.date})</span>
                <p style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 600, marginTop: '0.2rem' }}>
                  {c.description}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '0.2rem 0.55rem',
                  borderRadius: '9999px',
                  backgroundColor: c.resolved ? 'rgba(52, 211, 153, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  color: c.resolved ? '#34d399' : '#f87171',
                }}>
                  {c.resolved ? 'Resolved' : 'Requires Review'}
                </span>

                <Link to="/review-queue" className="btn btn-secondary btn-sm">
                  Resolve <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
    gap: '1.25rem',
    marginBottom: '1.75rem',
  },
  kpiCard: {
    display: 'flex',
    flexDirection: 'column',
  },
  kpiTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '0.85rem',
  },
  kpiIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiTrend: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    fontSize: '0.72rem',
    fontWeight: 700,
    color: '#34d399',
  },
  kpiVal: {
    fontSize: '2.1rem',
    fontWeight: 800,
    lineHeight: 1,
    marginBottom: '0.35rem',
  },
  kpiLbl: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    fontWeight: 600,
  },
  chartsRow: {
    display: 'flex',
    gap: '1.5rem',
    flexWrap: 'wrap',
  },
  chartHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.5rem',
  },
  chartBody: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: '180px',
    paddingTop: '1rem',
    borderBottom: '1px solid var(--border-subtle)',
  },
  barCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
    width: '32px',
  },
  barFill: {
    width: '100%',
    background: 'linear-gradient(180deg, var(--primary) 0%, var(--secondary) 100%)',
    borderRadius: '6px 6px 0 0',
    transition: 'height 0.4s ease',
  },
  barLabel: {
    fontSize: '0.72rem',
    color: 'var(--text-muted)',
    marginTop: '0.5rem',
  },
  breakdownList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  breakdownItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  progressTrack: {
    height: '8px',
    backgroundColor: 'var(--bg-surface-elevated)',
    borderRadius: '9999px',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: '9999px',
  },
  conflictList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  conflictRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'var(--bg-surface-elevated)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    padding: '0.85rem 1.25rem',
    flexWrap: 'wrap',
    gap: '1rem',
  }
};
