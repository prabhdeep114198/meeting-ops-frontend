import {
  INITIAL_MEETINGS,
  INITIAL_EXTRACTED_ITEMS,
  INITIAL_DRAFT_ACTIONS,
  INITIAL_AUDIT_TRAIL,
  TEAM_MEMBERS,
  INTEGRATIONS,
  OPS_METRICS
} from './mockData';

// Helper to manage persistent state in browser local storage
const getStorage = (key, fallback) => {
  try {
    const item = localStorage.getItem(`meetingops_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
};

const setStorage = (key, value) => {
  try {
    localStorage.setItem(`meetingops_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error('Storage write error', e);
  }
};

export const apiService = {
  // Meetings API
  async getMeetings() {
    try {
      const res = await fetch('/api/v1/meetings');
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API Gateway offline or unreachable, using state fallback', e);
    }
    return getStorage('meetings', INITIAL_MEETINGS);
  },

  async getMeetingById(id) {
    try {
      const res = await fetch(`/api/v1/meetings/${id}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}
    const meetings = getStorage('meetings', INITIAL_MEETINGS);
    return meetings.find(m => m.id === id) || meetings[0];
  },

  async createMeeting(data) {
    let newMeeting;
    try {
      const res = await fetch('/api/v1/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}

    // Fallback simulation
    const meetings = getStorage('meetings', INITIAL_MEETINGS);
    newMeeting = {
      id: `m-${Date.now()}`,
      title: data.title || 'Untitled Meeting',
      meetingDate: data.meetingDate || new Date().toISOString(),
      attendees: data.attendees ? data.attendees.split(',').map(a => a.trim()) : ['Sarah Chen'],
      status: 'PROCESSING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      itemCount: 0,
      draftCount: 0,
      transcript: data.transcript || ''
    };
    meetings.unshift(newMeeting);
    setStorage('meetings', meetings);
    return newMeeting;
  },

  async getMeetingItems(id) {
    try {
      const res = await fetch(`/api/v1/meetings/${id}/items`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}
    const items = getStorage('extracted_items', INITIAL_EXTRACTED_ITEMS);
    return items.filter(item => item.meetingId === id);
  },

  // Review Queue & Draft Actions API
  async getReviewQueue(statusFilter) {
    try {
      const url = statusFilter ? `/api/v1/review-queue?status=${statusFilter}` : '/api/v1/review-queue';
      const res = await fetch(url);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}
    const drafts = getStorage('draft_actions', INITIAL_DRAFT_ACTIONS);
    if (statusFilter) {
      return drafts.filter(d => d.status === statusFilter);
    }
    return drafts;
  },

  async submitDecision(draftActionId, decision, rationale, editedPayload) {
    try {
      const res = await fetch(`/api/v1/draft-actions/${draftActionId}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision, rationale, editedPayload })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}

    // Local state fallback update
    const drafts = getStorage('draft_actions', INITIAL_DRAFT_ACTIONS);
    const index = drafts.findIndex(d => d.id === draftActionId);
    if (index !== -1) {
      drafts[index].status = decision === 'APPROVE' ? 'APPROVED' : decision === 'REJECT' ? 'REJECTED' : 'EDITED';
      if (editedPayload) drafts[index].payloadJson = editedPayload;
      setStorage('draft_actions', drafts);

      // Record audit entry
      const auditTrail = getStorage('audit_trail', INITIAL_AUDIT_TRAIL);
      if (!auditTrail[draftActionId]) auditTrail[draftActionId] = [];
      auditTrail[draftActionId].push({
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: 'Reviewer (Human)',
        action: `DECISION_${decision}`,
        detail: rationale || `Submitted review decision: ${decision}`
      });
      setStorage('audit_trail', auditTrail);
    }
    return { draftActionId, decision, status: drafts[index]?.status || 'APPROVED' };
  },

  async bulkApprove(draftActionIds) {
    try {
      const res = await fetch('/api/v1/review-queue/bulk-approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draftActionIds })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}

    const drafts = getStorage('draft_actions', INITIAL_DRAFT_ACTIONS);
    const updated = drafts.map(d => {
      if (draftActionIds.includes(d.id)) {
        return { ...d, status: 'APPROVED' };
      }
      return d;
    });
    setStorage('draft_actions', updated);
    return draftActionIds.map(id => ({ draftActionId: id, decision: 'APPROVE' }));
  },

  async getAuditTrail(draftActionId) {
    try {
      const res = await fetch(`/api/v1/draft-actions/${draftActionId}/audit-trail`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}
    const auditMap = getStorage('audit_trail', INITIAL_AUDIT_TRAIL);
    return auditMap[draftActionId] || [
      { id: "aud-default-1", timestamp: new Date().toISOString(), actor: "AI Pipeline Agent", action: "ITEM_EXTRACTED", detail: "Extracted from transcript segment" },
      { id: "aud-default-2", timestamp: new Date().toISOString(), actor: "Grounding Agent", action: "GROUNDED", detail: "Grounding classification processed" }
    ];
  },

  // Admin & Ops
  getTeamMembers() {
    return getStorage('team_members', TEAM_MEMBERS);
  },

  saveTeamMembers(members) {
    setStorage('team_members', members);
    return members;
  },

  getIntegrations() {
    return getStorage('integrations', INTEGRATIONS);
  },

  getOpsMetrics() {
    return getStorage('ops_metrics', OPS_METRICS);
  }
};
