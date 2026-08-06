import React, { useState } from 'react';
import { UserPlus, Shield, Mail, CheckCircle2, UserCheck, X } from 'lucide-react';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const AdminTeam = () => {
  const { role } = useAuth();
  const [members, setMembers] = useState(apiService.getTeamMembers());
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState('Reviewer');
  const [successMsg, setSuccessMsg] = useState(null);

  const handleRoleChange = (memberId, newRole) => {
    if (role !== 'admin') {
      alert('Access restricted: Only Admin role can change team member roles.');
      return;
    }
    const updated = members.map(m => m.id === memberId ? { ...m, role: newRole } : m);
    setMembers(updated);
    apiService.saveTeamMembers(updated);
  };

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (role !== 'admin') {
      alert('Access restricted: Switch demo role to "Admin" in top bar to send invites.');
      return;
    }

    const newMember = {
      id: `usr-${Date.now()}`,
      name: inviteName || inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      status: 'Pending Invite',
      lastActive: 'Never',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
    };

    const updated = [...members, newMember];
    setMembers(updated);
    apiService.saveTeamMembers(updated);
    setIsInviteOpen(false);
    setInviteEmail('');
    setInviteName('');
    setSuccessMsg(`Invitation sent to ${newMember.email}!`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin: Team Management</h1>
          <p className="page-subtitle">
            Manage organization members, review queue permissions, & team invitations
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setIsInviteOpen(true)}>
          <UserPlus size={18} /> Invite Team Member
        </button>
      </div>

      {successMsg && (
        <div style={styles.successBanner}>
          <CheckCircle2 size={18} /> {successMsg}
        </div>
      )}

      {/* Member Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thRow}>
              <th style={styles.th}>Member</th>
              <th style={styles.th}>Corporate Email</th>
              <th style={styles.th}>Reviewer Permission Role</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Last Active</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} style={styles.tr}>
                <td style={styles.td}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img src={member.avatar} alt={member.name} style={styles.avatar} />
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{member.name}</span>
                  </div>
                </td>

                <td style={{ ...styles.td, color: 'var(--text-muted)' }}>{member.email}</td>

                <td style={styles.td}>
                  <select
                    value={member.role}
                    onChange={(e) => handleRoleChange(member.id, e.target.value)}
                    style={styles.roleSelect}
                  >
                    <option value="Participant">Participant (Read-Only)</option>
                    <option value="Reviewer">Reviewer (Approve / Edit)</option>
                    <option value="Admin">Admin (Full Control)</option>
                  </select>
                </td>

                <td style={styles.td}>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.55rem',
                    borderRadius: '9999px',
                    backgroundColor: member.status === 'Active' ? 'rgba(52, 211, 153, 0.15)' : 'rgba(251, 191, 36, 0.15)',
                    color: member.status === 'Active' ? '#34d399' : '#fbbf24',
                  }}>
                    {member.status}
                  </span>
                </td>

                <td style={{ ...styles.td, color: 'var(--text-subtle)', fontSize: '0.82rem' }}>
                  {member.lastActive}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invite Flow Modal */}
      {isInviteOpen && (
        <>
          <div className="drawer-backdrop" onClick={() => setIsInviteOpen(false)} />
          <div className="card" style={styles.modalCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Invite Team Member</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setIsInviteOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={styles.label}>Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Jordan Lee"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="input"
                  required
                />
              </div>

              <div>
                <label style={styles.label}>Work Email Address</label>
                <input
                  type="email"
                  placeholder="jordan.lee@acme.corp"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="input"
                  required
                />
              </div>

              <div>
                <label style={styles.label}>Role Permission Level</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="select"
                >
                  <option value="Participant">Participant (Read-Only)</option>
                  <option value="Reviewer">Reviewer (Approve / Edit)</option>
                  <option value="Admin">Admin (Full Control)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsInviteOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Mail size={16} /> Send Email Invite
                </button>
              </div>
            </form>
          </div>
        </>
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
    marginBottom: '1.5rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  thRow: {
    backgroundColor: 'rgba(17, 24, 39, 0.9)',
    borderBottom: '1px solid var(--border-subtle)',
  },
  th: {
    padding: '0.9rem 1.25rem',
    textAlign: 'left',
    fontSize: '0.75rem',
    fontWeight: 800,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  tr: {
    borderBottom: '1px solid var(--border-subtle)',
    transition: 'background 0.15s ease',
  },
  td: {
    padding: '1rem 1.25rem',
    fontSize: '0.88rem',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  roleSelect: {
    backgroundColor: 'var(--bg-surface-elevated)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    color: '#ffffff',
    padding: '0.35rem 0.65rem',
    fontSize: '0.82rem',
    outline: 'none',
    cursor: 'pointer',
  },
  modalCard: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '440px',
    maxWidth: '90vw',
    zIndex: 100,
    boxShadow: 'var(--shadow-lg)',
  },
  label: {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: 'var(--text-muted)',
    marginBottom: '0.35rem',
    display: 'block',
  }
};
