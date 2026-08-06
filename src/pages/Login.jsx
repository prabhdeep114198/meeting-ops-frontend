import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Shield, ArrowRight, CheckCircle2, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const { role, setRole, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('••••••••••••');

  const handleLogin = (e) => {
    e.preventDefault();
    // Redirect to dashboard or meetings list based on role
    navigate(role === 'admin' ? '/dashboard' : '/meetings');
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginCard}>
        {/* Brand Header */}
        <div style={styles.brandHeader}>
          <div style={styles.logoBadge}>
            <Bot size={28} color="#ffffff" />
          </div>
          <h1 style={styles.brandTitle}>MeetingOps</h1>
          <p style={styles.brandSubtitle}>
            AI-Powered Meeting Action Item & Decision Follow-Through Platform
          </p>
        </div>

        {/* Demo Role Switcher Section (Required per SRS FR-1 & Prompt) */}
        <div style={styles.demoBox}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Shield size={16} color="var(--primary)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>
              DEMO ROLE SWITCHER (No Auth Required)
            </span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            Select a role to showcase role-based features without real authentication:
          </p>
          <div style={styles.roleGrid}>
            {[
              { id: 'participant', label: 'Participant', desc: 'Read-only transcript viewer' },
              { id: 'reviewer', label: 'Reviewer', desc: 'Approve & edit draft actions' },
              { id: 'admin', label: 'Admin', desc: 'Manage team & integrations' },
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                style={{
                  ...styles.roleCardBtn,
                  ...(role === r.id ? styles.roleCardActive : {})
                }}
                onClick={() => setRole(r.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{r.label}</span>
                  {role === r.id && <CheckCircle2 size={16} color="var(--primary)" />}
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'block' }}>
                  {r.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Sign In Form */}
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Corporate Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '0.5rem' }}>
            Sign In to Workspace <ArrowRight size={18} />
          </button>
        </form>

        <div style={styles.footerInfo}>
          <Lock size={12} color="var(--text-subtle)" />
          <span>Enterprise SSO & Human-in-the-Loop Safeguards Enforced</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    background: 'radial-gradient(circle at 50% 30%, rgba(99, 102, 241, 0.15) 0%, rgba(11, 15, 25, 1) 70%)',
  },
  loginCard: {
    width: '100%',
    maxWidth: '460px',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-xl)',
    padding: '2.5rem 2rem',
    boxShadow: 'var(--shadow-lg)',
  },
  brandHeader: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  logoBadge: {
    width: '54px',
    height: '54px',
    margin: '0 auto 1rem',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 20px rgba(99, 102, 241, 0.4)',
  },
  brandTitle: {
    fontSize: '2rem',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  brandSubtitle: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    marginTop: '0.4rem',
  },
  demoBox: {
    backgroundColor: 'rgba(17, 24, 39, 0.9)',
    border: '1px solid var(--border-glow)',
    borderRadius: 'var(--radius-lg)',
    padding: '1rem',
    marginBottom: '1.5rem',
  },
  roleGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  roleCardBtn: {
    textAlign: 'left',
    padding: '0.65rem 0.85rem',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-main)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  roleCardActive: {
    borderColor: 'var(--primary)',
    backgroundColor: 'var(--primary-light)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
  },
  label: {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: 'var(--text-muted)',
  },
  footerInfo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
    marginTop: '1.5rem',
    fontSize: '0.72rem',
    color: 'var(--text-subtle)',
  }
};
