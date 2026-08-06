import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, Lock, Sliders, RefreshCw, Zap, Server } from 'lucide-react';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const AdminIntegrations = () => {
  const { role } = useAuth();
  const [integrations, setIntegrations] = useState(apiService.getIntegrations());

  // Safety Behavior Toggles
  const [mandatoryConflictReview, setMandatoryConflictReview] = useState(true); // Locked ON per SRS FR-6.5
  const [autoApproveHighConfidence, setAutoApproveHighConfidence] = useState(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.90);
  const [auditLogRetentionDays, setAuditLogRetentionDays] = useState(365);

  const [savedFeedback, setSavedFeedback] = useState(null);

  const toggleConnection = (id) => {
    if (role !== 'admin') {
      alert('Access restricted: Only Admin role can modify integration settings.');
      return;
    }
    setIntegrations(prev =>
      prev.map(item => {
        if (item.id === id) {
          const isConnected = item.status === 'Connected';
          return {
            ...item,
            status: isConnected ? 'Disconnected' : 'Connected',
            icon: isConnected ? 'XCircle' : 'CheckCircle2'
          };
        }
        return item;
      })
    );
  };

  const handleSaveSafetyPolicies = (e) => {
    e.preventDefault();
    if (role !== 'admin') {
      alert('Access restricted: Switch demo role to "Admin" in top bar.');
      return;
    }
    setSavedFeedback('Safety & Autopilot policy settings updated successfully.');
    setTimeout(() => setSavedFeedback(null), 3000);
  };

  return (
    <div className="page-container" style={{ maxWidth: '1100px' }}>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin: Integrations & Safety Policies</h1>
          <p className="page-subtitle">
            Configure FastMCP service tools (Jira/Calendar/Email) & default safety enforcement behaviors
          </p>
        </div>
      </div>

      {savedFeedback && (
        <div style={styles.successBanner}>
          <CheckCircle2 size={18} /> {savedFeedback}
        </div>
      )}

      {/* Section 1: Integration Connection Cards */}
      <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>
        FastMCP Execution Tool Connections
      </h2>

      <div style={styles.grid}>
        {integrations.map((int) => {
          const isConnected = int.status === 'Connected';
          return (
            <div key={int.id} className="card" style={styles.integrationCard}>
              <div style={styles.cardHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Server size={22} color="var(--primary)" />
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{int.name}</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{int.category}</span>
                  </div>
                </div>

                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '0.2rem 0.55rem',
                  borderRadius: '9999px',
                  backgroundColor: isConnected ? 'rgba(52, 211, 153, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  color: isConnected ? '#34d399' : '#f87171',
                }}>
                  {int.status}
                </span>
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                {int.details}
              </p>

              <div style={styles.cardFooter}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Last sync: {int.lastSync}</span>
                <button
                  className={`btn ${isConnected ? 'btn-danger' : 'btn-primary'} btn-sm`}
                  onClick={() => toggleConnection(int.id)}
                >
                  {isConnected ? 'Disconnect' : 'Connect Tool'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Section 2: Default Safety-Behavior Toggles (Locked ON requirement) */}
      <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '2rem 0 1rem' }}>
        Safety & Autopilot Policy Enforcement
      </h2>

      <form onSubmit={handleSaveSafetyPolicies} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Mandatory Conflict Review (LOCKED ON) */}
        <div style={styles.policyRow}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lock size={16} color="#f87171" />
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700 }}>Mandatory Conflict Review</h3>
              <span style={styles.lockedBadge}>LOCKED ON (Safety Rule FR-6.5)</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Requires explicit human review whenever vector grounding detects historical decision conflicts or schedule overrides. Cannot be disabled.
            </p>
          </div>

          <input
            type="checkbox"
            checked={mandatoryConflictReview}
            disabled={true} // Locked on per prompt requirement
            style={{ width: '20px', height: '20px', cursor: 'not-allowed' }}
          />
        </div>

        {/* Auto-Approve High Confidence */}
        <div style={styles.policyRow}>
          <div>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 700 }}>Auto-Approve Low-Risk Drafts</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Automatically approve items with 0 conflicts and confidence score above threshold.
            </p>
          </div>

          <input
            type="checkbox"
            checked={autoApproveHighConfidence}
            onChange={(e) => setAutoApproveHighConfidence(e.target.checked)}
            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
          />
        </div>

        {/* Confidence Threshold Slider */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontSize: '0.88rem', fontWeight: 700 }}>Minimum Confidence Threshold for Auto-Approve</label>
            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary)' }}>
              {(confidenceThreshold * 100).toFixed(0)}%
            </span>
          </div>
          <input
            type="range"
            min="0.75"
            max="0.99"
            step="0.01"
            value={confidenceThreshold}
            onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
            style={{ width: '100%', cursor: 'pointer' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
          <button type="submit" className="btn btn-primary btn-lg">
            Save Safety Policy Configuration
          </button>
        </div>
      </form>
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
    marginBottom: '1.5rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1.25rem',
  },
  integrationCard: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '180px',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '0.75rem',
  },
  cardFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTop: '1px solid var(--border-subtle)',
    paddingTop: '0.75rem',
  },
  policyRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '1.25rem',
    borderBottom: '1px solid var(--border-subtle)',
    gap: '1.5rem',
  },
  lockedBadge: {
    fontSize: '0.68rem',
    fontWeight: 800,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    color: '#f87171',
    padding: '0.15rem 0.5rem',
    borderRadius: '4px',
    letterSpacing: '0.04em',
  }
};
