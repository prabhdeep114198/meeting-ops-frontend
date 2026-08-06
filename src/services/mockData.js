export const INITIAL_MEETINGS = [
  {
    id: "m-101",
    title: "Q3 Operations Sync & Infrastructure Roadmap",
    meetingDate: "2026-08-06T14:00:00Z",
    attendees: ["Sarah Chen (Lead Reviewer)", "David Kim (DevOps)", "Alex Rivera (Prod Ops)", "Elena Rostova (Compliance)"],
    status: "PENDING_REVIEW",
    createdAt: "2026-08-06T14:45:00Z",
    updatedAt: "2026-08-06T14:50:00Z",
    itemCount: 4,
    draftCount: 3,
    transcript: `[00:01] Sarah: Let's get started on the Q3 Ops Sync. First topic is PostgreSQL database migration to pgvector for vector search grounding.
[00:03] David: I have completed the preliminary benchmark. Migration is scheduled for next Tuesday, August 12. We will need a 30-minute maintenance window at 2:00 AM UTC.
[00:05] Alex: Wait, last week in the Architecture review, we decided all DB maintenance windows must be on Sunday at 4:00 AM UTC to minimize disruption for EU clients.
[00:07] Sarah: Good catch Alex. Let's resolve that conflict. David, please reschedule to Sunday Aug 17 at 4:00 AM UTC and update Jira ticket OPS-4092.
[00:10] Elena: Also, regarding SOC2 audit logging for MCP agent tool executions - we need mandatory approval retention set to 365 days instead of 90 days.
[00:12] Sarah: Agreed. I'll take the action to update the security policy documentation and notify the SecOps channel by Friday.
[00:15] Alex: I'll also send an email summary to the engineering team once David confirms the Sunday maintenance schedule.`
  },
  {
    id: "m-102",
    title: "AI Pipeline Integration & MCP Tooling Review",
    meetingDate: "2026-08-05T10:30:00Z",
    attendees: ["Sarah Chen", "Michael Zhang (Backend)", "Priya Sharma (AI Systems)"],
    status: "REVIEWED",
    createdAt: "2026-08-05T11:15:00Z",
    updatedAt: "2026-08-05T11:30:00Z",
    itemCount: 3,
    draftCount: 2,
    transcript: `[00:00] Michael: FastMCP server deployment is live on port 8084. Calendar, Email, and Task tracker execution tools are enabled.
[00:04] Priya: The grounding agent similarity search threshold is currently 0.78. Items below 0.85 will raise a clarification flag.
[00:08] Sarah: Let's auto-approve high-confidence items (>0.92) if there are no vector conflicts detected.
[00:11] Michael: Agreed. I will adjust the review threshold in backend review-service configuration today.`
  },
  {
    id: "m-103",
    title: "Weekly Product Strategy & Review Queue Triage",
    meetingDate: "2026-08-04T16:00:00Z",
    attendees: ["Sarah Chen", "Elena Rostova", "Marcus Vance (VP Product)"],
    status: "PROCESSING",
    createdAt: "2026-08-07T00:50:00Z",
    updatedAt: "2026-08-07T00:52:00Z",
    itemCount: 2,
    draftCount: 1,
    transcript: `[00:01] Marcus: We need to roll out the Human-in-the-loop review queue to 50 beta customer organizations next month.
[00:05] Sarah: Reviewers need full side-by-side conflict comparisons whenever historical context shows a conflicting agreement.
[00:09] Elena: Safety behavior defaults like mandatory conflict review must remain locked on for enterprise safety.`
  },
  {
    id: "m-104",
    title: "Emergency Security Incident Post-Mortem",
    meetingDate: "2026-08-02T09:00:00Z",
    attendees: ["David Kim", "Elena Rostova"],
    status: "FAILED",
    createdAt: "2026-08-02T09:45:00Z",
    updatedAt: "2026-08-02T09:46:00Z",
    itemCount: 0,
    draftCount: 0,
    transcript: `[00:00] [AUDIO CORRUPTED - Transcript parsing failed at line 14 due to invalid character encoding]`
  }
];

export const INITIAL_EXTRACTED_ITEMS = [
  {
    id: "ex-201",
    meetingId: "m-101",
    type: "ACTION_ITEM",
    description: "Reschedule pgvector database maintenance window to Sunday Aug 17 at 4:00 AM UTC and update Jira ticket OPS-4092.",
    owner: "David Kim",
    deadline: "2026-08-17T04:00:00Z",
    supportingExcerpt: "David, please reschedule to Sunday Aug 17 at 4:00 AM UTC and update Jira ticket OPS-4092.",
    confidence: 0.94,
    status: "PENDING_HUMAN_REVIEW",
    groundingResult: "CONFLICT_DETECTED",
    groundingRationale: "Conflicts with decision from Arch Review (2026-07-28) specifying Tuesday maintenance. Grounding agent detected schedule override.",
    createdAt: "2026-08-06T14:48:00Z"
  },
  {
    id: "ex-202",
    meetingId: "m-101",
    type: "DECISION",
    description: "SOC2 audit logging for MCP agent tool executions retention window updated to 365 days.",
    owner: "Elena Rostova",
    deadline: "2026-08-14T23:59:59Z",
    supportingExcerpt: "Regarding SOC2 audit logging for MCP agent tool executions - we need mandatory approval retention set to 365 days instead of 90 days.",
    confidence: 0.98,
    status: "PENDING_HUMAN_REVIEW",
    groundingResult: "NO_CONFLICT",
    groundingRationale: "Matches policy compliance guidelines. Grounded with 98% vector similarity.",
    createdAt: "2026-08-06T14:48:30Z"
  },
  {
    id: "ex-203",
    meetingId: "m-101",
    type: "ACTION_ITEM",
    description: "Send email summary of updated DB maintenance schedule to engineering team.",
    owner: "Alex Rivera",
    deadline: "2026-08-11T17:00:00Z",
    supportingExcerpt: "I'll also send an email summary to the engineering team once David confirms the Sunday maintenance schedule.",
    confidence: 0.88,
    status: "PENDING_HUMAN_REVIEW",
    groundingResult: "RECURRING_UPDATED",
    groundingRationale: "Updates recurring weekly engineering notification cadence.",
    createdAt: "2026-08-06T14:49:00Z"
  },
  {
    id: "ex-204",
    meetingId: "m-102",
    type: "ACTION_ITEM",
    description: "Adjust review threshold settings in review-service configuration.",
    owner: "Michael Zhang",
    deadline: "2026-08-08T18:00:00Z",
    supportingExcerpt: "I will adjust the review threshold in backend review-service configuration today.",
    confidence: 0.82,
    status: "APPROVED",
    groundingResult: "NEEDS_CLARIFICATION",
    groundingRationale: "Target threshold value exact float parameter requires verification (0.92 confirmed in text).",
    createdAt: "2026-08-05T11:20:00Z"
  }
];

export const INITIAL_DRAFT_ACTIONS = [
  {
    id: "da-301",
    extractedItemId: "ex-201",
    meetingId: "m-101",
    actionType: "TASK",
    title: "Reschedule DB Migration (OPS-4092)",
    payloadJson: JSON.stringify({
      tracker: "JIRA",
      issueKey: "OPS-4092",
      summary: "Reschedule pgvector DB maintenance to Sunday Aug 17, 04:00 UTC",
      assignee: "david.kim@acme.corp",
      priority: "HIGH",
      dueDate: "2026-08-17"
    }, null, 2),
    status: "DRAFTED",
    isAIGenerated: true,
    createdAt: "2026-08-06T14:48:10Z",
    conflictData: {
      hasConflict: true,
      conflictType: "SCHEDULE_OVERRIDE",
      historicalMeetingTitle: "Architecture Strategy Review (Jul 28)",
      historicalDecision: "All DB maintenance must occur on Tuesday 2:00 AM UTC",
      proposedDecision: "Rescheduled to Sunday Aug 17 4:00 AM UTC per EU client SLA impact",
      detectedBy: "GroundingAgent pgvector similarity search (score: 0.91)"
    }
  },
  {
    id: "da-302",
    extractedItemId: "ex-202",
    meetingId: "m-101",
    actionType: "CALENDAR_REMINDER",
    title: "Update SOC2 MCP Audit Policy",
    payloadJson: JSON.stringify({
      calendar: "Google Calendar",
      eventTitle: "SOC2 Audit Policy Doc Update",
      attendees: ["sarah.chen@acme.corp", "elena.rostova@acme.corp"],
      startTime: "2026-08-14T15:00:00Z",
      durationMinutes: 45,
      description: "Update retention policy for MCP agent logs to 365 days."
    }, null, 2),
    status: "DRAFTED",
    isAIGenerated: true,
    createdAt: "2026-08-06T14:48:40Z",
    conflictData: null
  },
  {
    id: "da-303",
    extractedItemId: "ex-203",
    meetingId: "m-101",
    actionType: "EMAIL",
    title: "Engineering Notice: DB Maintenance Window Update",
    payloadJson: JSON.stringify({
      recipient: "eng-team@acme.corp",
      subject: "[Notice] Rescheduled Database Maintenance Window - Aug 17",
      body: "Hi Engineering Team,\n\nPlease note that the pgvector DB maintenance window has been moved to Sunday, August 17 at 04:00 UTC. Expect 30 mins downtime for staging vector indexes.\n\nBest,\nAlex Rivera"
    }, null, 2),
    status: "DRAFTED",
    isAIGenerated: true,
    createdAt: "2026-08-06T14:49:10Z",
    conflictData: null
  }
];

export const INITIAL_AUDIT_TRAIL = {
  "da-301": [
    { id: "aud-1", timestamp: "2026-08-06T14:48:00Z", actor: "AI Pipeline Extraction Agent", action: "EXTRACTED_ITEM", detail: "Extracted action item from transcript line 00:07 (Confidence: 94%)" },
    { id: "aud-2", timestamp: "2026-08-06T14:48:05Z", actor: "Grounding Agent (pgvector)", action: "CONFLICT_FLAGGED", detail: "Flagged CONFLICT_DETECTED against Arch Review decision from 2026-07-28" },
    { id: "aud-3", timestamp: "2026-08-06T14:48:10Z", actor: "Drafting Agent (MCP Service)", action: "DRAFT_GENERATED", detail: "Generated Jira Task draft via FastMCP tool payload" }
  ]
};

export const TEAM_MEMBERS = [
  { id: "usr-1", name: "Sarah Chen", email: "sarah.chen@acme.corp", role: "Reviewer", status: "Active", lastActive: "Just now", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" },
  { id: "usr-2", name: "David Kim", email: "david.kim@acme.corp", role: "Participant", status: "Active", lastActive: "15 mins ago", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" },
  { id: "usr-3", name: "Elena Rostova", email: "elena.rostova@acme.corp", role: "Admin", status: "Active", lastActive: "1 hour ago", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" },
  { id: "usr-4", name: "Michael Zhang", email: "michael.zhang@acme.corp", role: "Reviewer", status: "Active", lastActive: "3 hours ago", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150" }
];

export const INTEGRATIONS = [
  { id: "int-1", name: "Jira Software", category: "Task Tracker", status: "Connected", icon: "CheckCircle", lastSync: "2 mins ago", details: "Instance: acme.atlassian.net" },
  { id: "int-2", name: "Google Calendar", category: "Calendar", status: "Connected", icon: "CheckCircle", lastSync: "5 mins ago", details: "Account: ops-bot@acme.corp" },
  { id: "int-3", name: "Gmail API", category: "Email", status: "Connected", icon: "CheckCircle", lastSync: "1 min ago", details: "Domain: acme.corp" },
  { id: "int-4", name: "Linear App", category: "Task Tracker", status: "Disconnected", icon: "XCircle", lastSync: "Never", details: "Click to connect workspace" }
];

export const OPS_METRICS = {
  meetingsProcessed: 142,
  avgReviewTime: "1.8 mins",
  conflictsCaught: 38,
  approvalRate: "94.2%",
  recentConflicts: [
    { id: "c-1", meeting: "Q3 Operations Sync", date: "Aug 6", description: "DB Maintenance window schedule override", resolved: false },
    { id: "c-2", meeting: "EU Security Alignment", date: "Aug 3", description: "Conflicting data retention duration", resolved: true },
    { id: "c-3", meeting: "Sprint Planning 42", date: "Jul 30", description: "Resource allocation double booking", resolved: true }
  ]
};
