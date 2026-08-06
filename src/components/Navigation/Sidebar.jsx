import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Video,
  PlusCircle,
  CheckSquare,
  History,
  ShieldCheck,
  Users,
  Zap,
  Bot
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = () => {
  const { role } = useAuth();

  const navItems = [
    { label: 'Ops Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['participant', 'reviewer', 'admin'] },
    { label: 'Meetings List', path: '/meetings', icon: Video, roles: ['participant', 'reviewer', 'admin'] },
    { label: 'New Meeting', path: '/meetings/new', icon: PlusCircle, roles: ['participant', 'reviewer', 'admin'] },
    { label: 'Review Queue', path: '/review-queue', icon: CheckSquare, badge: 'Needs Attention', roles: ['reviewer', 'admin'] },
    { label: 'History & Archive', path: '/history', icon: History, roles: ['participant', 'reviewer', 'admin'] },
    { label: 'Admin Integrations', path: '/admin/integrations', icon: ShieldCheck, roles: ['admin'] },
    { label: 'Team Management', path: '/admin/team', icon: Users, roles: ['admin'] },
  ];

  return (
    <aside style={styles.sidebar}>
      {/* Brand Header */}
      <div style={styles.brand}>
        <div style={styles.logoIcon}>
          <Bot size={24} color="#ffffff" />
        </div>
        <div>
          <h2 style={styles.brandTitle}>MeetingOps</h2>
          <span style={styles.brandSubtitle}>AI Follow-Through</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={styles.nav}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isAllowed = item.roles.includes(role);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                ...styles.navLink,
                ...(isActive ? styles.navLinkActive : {}),
                ...(!isAllowed ? styles.navLinkDisabled : {})
              })}
              onClick={(e) => {
                if (!isAllowed) {
                  e.preventDefault();
                  alert(`Access restricted: Switch your demo role to "${item.roles.join(' or ')}" in the top bar to view this screen.`);
                }
              }}
            >
              <Icon size={19} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && <span style={styles.badge}>{item.badge}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Safety & Status Info */}
      <div style={styles.footerCard}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Zap size={16} color="#34d399" />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#34d399' }}>Human-in-the-Loop</span>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
          Safety behavior locked. Conflict resolution requires explicit human review.
        </p>
      </div>
    </aside>
  );
};

const styles = {
  sidebar: {
    width: '260px',
    backgroundColor: 'var(--bg-surface)',
    borderRight: '1px solid var(--border-subtle)',
    display: 'flex',
    flexDirection: 'column',
    padding: '1.5rem 1rem',
    flexShrink: 0,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    paddingBottom: '1.5rem',
    marginBottom: '1rem',
    borderBottom: '1px solid var(--border-subtle)',
  },
  logoIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
  },
  brandTitle: {
    fontSize: '1.2rem',
    fontWeight: 800,
    lineHeight: 1.1,
  },
  brandSubtitle: {
    fontSize: '0.72rem',
    color: 'var(--text-muted)',
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
    flex: 1,
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
    padding: '0.75rem 0.9rem',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-muted)',
    textDecoration: 'none',
    fontSize: '0.88rem',
    fontWeight: 500,
    transition: 'all 0.2s ease',
  },
  navLinkActive: {
    backgroundColor: 'var(--primary-light)',
    color: '#ffffff',
    fontWeight: 700,
    borderLeft: '3px solid var(--primary)',
  },
  navLinkDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
  badge: {
    fontSize: '0.65rem',
    fontWeight: 700,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    color: '#f87171',
    padding: '0.15rem 0.45rem',
    borderRadius: '9999px',
  },
  footerCard: {
    marginTop: 'auto',
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    padding: '0.85rem',
  }
};
