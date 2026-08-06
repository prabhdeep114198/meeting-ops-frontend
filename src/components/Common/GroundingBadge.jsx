import React from 'react';
import { AlertCircle, CheckCircle, RefreshCw, HelpCircle } from 'lucide-react';

export const GroundingBadge = ({ classification, rationale }) => {
  const config = {
    NO_CONFLICT: {
      label: 'Grounded: No Conflict',
      icon: CheckCircle,
      color: '#34d399',
      bg: 'rgba(52, 211, 153, 0.12)'
    },
    RECURRING_UPDATED: {
      label: 'Recurring Item Updated',
      icon: RefreshCw,
      color: '#60a5fa',
      bg: 'rgba(96, 165, 250, 0.12)'
    },
    CONFLICT_DETECTED: {
      label: 'Conflict Detected',
      icon: AlertCircle,
      color: '#f87171',
      bg: 'rgba(248, 113, 113, 0.15)'
    },
    NEEDS_CLARIFICATION: {
      label: 'Needs Clarification',
      icon: HelpCircle,
      color: '#fbbf24',
      bg: 'rgba(251, 191, 36, 0.15)'
    }
  };

  const item = config[classification] || {
    label: classification || 'Unchecked',
    icon: HelpCircle,
    color: '#9ca3af',
    bg: 'rgba(156, 163, 175, 0.1)'
  };

  const Icon = item.icon;

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '0.2rem' }}>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          padding: '0.3rem 0.6rem',
          borderRadius: '6px',
          fontSize: '0.74rem',
          fontWeight: 700,
          backgroundColor: item.bg,
          color: item.color,
          border: `1px solid ${item.color}40`
        }}
        title={rationale}
      >
        <Icon size={13} />
        {item.label}
      </span>
    </div>
  );
};
