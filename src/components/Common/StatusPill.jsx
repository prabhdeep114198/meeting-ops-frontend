import React from 'react';
import { Loader2, Clock, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

export const StatusPill = ({ status }) => {
  const config = {
    PROCESSING: {
      label: 'Processing Pipeline',
      icon: Loader2,
      bg: 'var(--status-processing-bg)',
      color: 'var(--status-processing)',
      animate: true
    },
    PENDING_REVIEW: {
      label: 'Pending Review',
      icon: Clock,
      bg: 'var(--status-pending-bg)',
      color: 'var(--status-pending)'
    },
    DRAFTED: {
      label: 'Draft Action Ready',
      icon: FileText,
      bg: 'var(--status-pending-bg)',
      color: 'var(--status-pending)'
    },
    REVIEWED: {
      label: 'Reviewed & Executed',
      icon: CheckCircle2,
      bg: 'var(--status-reviewed-bg)',
      color: 'var(--status-reviewed)'
    },
    APPROVED: {
      label: 'Approved',
      icon: CheckCircle2,
      bg: 'var(--status-reviewed-bg)',
      color: 'var(--status-reviewed)'
    },
    FAILED: {
      label: 'Processing Failed',
      icon: AlertTriangle,
      bg: 'var(--status-failed-bg)',
      color: 'var(--status-failed)'
    },
    REJECTED: {
      label: 'Rejected',
      icon: AlertTriangle,
      bg: 'var(--status-failed-bg)',
      color: 'var(--status-failed)'
    }
  };

  const item = config[status] || {
    label: status,
    icon: Clock,
    bg: 'rgba(255, 255, 255, 0.1)',
    color: 'var(--text-muted)'
  };

  const Icon = item.icon;

  return (
    <span
      className="badge"
      style={{
        backgroundColor: item.bg,
        color: item.color,
        border: `1px solid ${item.color}33`
      }}
    >
      <Icon
        size={13}
        style={item.animate ? { animation: 'spin 1.5s linear infinite' } : {}}
      />
      {item.label}
    </span>
  );
};
