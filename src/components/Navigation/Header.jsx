import React from 'react';
import { Search, Bell, Shield, User, ChevronDown, Activity } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Header = () => {
  const { role, setRole, user } = useAuth();

  return (
    <header style={styles.header}>
      {/* Left Search Bar */}
      <div style={styles.searchWrapper}>
        <Search size={17} color="var(--text-muted)" />
        <input
          type="text"
          placeholder="Search meetings, action items, or past decisions..."
          style={styles.searchInput}
        />
      </div>

      {/* Right Controls */}
      <div style={styles.rightSection}>
        {/* System Status Pill */}
        <div style={styles.statusBadge}>
          <Activity size={14} color="#34d399" />
          <span>Gateway: 8080</span>
        </div>

        {/* Demo Role Switcher (Required per FR-1) */}
        <div style={styles.roleSwitcherWrapper}>
          <Shield size={15} color="var(--primary)" />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Demo Role:</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={styles.roleSelect}
          >
            <option value="participant">Participant (Read-Only)</option>
            <option value="reviewer">Reviewer (Approve / Edit)</option>
            <option value="admin">Admin (Full Access)</option>
          </select>
        </div>

        {/* Notification Bell */}
        <button style={styles.iconBtn} title="Notifications">
          <Bell size={18} color="var(--text-muted)" />
          <span style={styles.notifDot}></span>
        </button>

        {/* User Profile */}
        <div style={styles.userProfile}>
          <img src={user.avatar} alt={user.name} style={styles.avatar} />
          <div style={styles.userInfo}>
            <span style={styles.userName}>{user.name}</span>
            <span style={styles.userRole}>{role.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

const styles = {
  header: {
    height: '68px',
    backgroundColor: 'var(--bg-surface)',
    borderBottom: '1px solid var(--border-subtle)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 2rem',
    gap: '1.5rem',
    flexShrink: 0,
  },
  searchWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    padding: '0.55rem 0.9rem',
    width: '400px',
  },
  searchInput: {
    background: 'none',
    border: 'none',
    outline: 'none',
    color: 'var(--text-main)',
    fontSize: '0.85rem',
    width: '100%',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.35rem 0.65rem',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.25)',
    borderRadius: '9999px',
    fontSize: '0.72rem',
    color: '#34d399',
    fontWeight: 600,
  },
  roleSwitcherWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'var(--bg-surface-elevated)',
    border: '1px solid var(--border-glow)',
    padding: '0.4rem 0.75rem',
    borderRadius: 'var(--radius-md)',
  },
  roleSelect: {
    background: 'none',
    border: 'none',
    color: '#ffffff',
    fontSize: '0.82rem',
    fontWeight: 700,
    outline: 'none',
    cursor: 'pointer',
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifDot: {
    position: 'absolute',
    top: '-2px',
    right: '-2px',
    width: '8px',
    height: '8px',
    backgroundColor: 'var(--accent)',
    borderRadius: '50%',
  },
  userProfile: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    paddingLeft: '0.5rem',
    borderLeft: '1px solid var(--border-subtle)',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid var(--primary)',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  userName: {
    fontSize: '0.85rem',
    fontWeight: 700,
    lineHeight: 1.2,
  },
  userRole: {
    fontSize: '0.68rem',
    color: 'var(--primary)',
    fontWeight: 800,
    letterSpacing: '0.04em',
  }
};
