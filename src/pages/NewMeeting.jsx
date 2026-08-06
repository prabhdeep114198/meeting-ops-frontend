import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Play, CheckCircle, ArrowLeft, Sparkles, AlertCircle } from 'lucide-react';
import { apiService } from '../services/api';
import { PipelineIndicator } from '../components/Common/PipelineIndicator';

export const NewMeeting = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [meetingDate, setMeetingDate] = useState(new Date().toISOString().slice(0, 16));
  const [attendees, setAttendees] = useState('Sarah Chen, David Kim, Alex Rivera');
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState(null);

  // Sample seed transcript filler button for easy demoing
  const loadSampleTranscript = () => {
    setTitle('Q3 Operations Sync & Infrastructure Roadmap');
    setAttendees('Sarah Chen, David Kim, Alex Rivera, Elena Rostova');
    setTranscript(`[00:01] Sarah: Let's get started on the Q3 Ops Sync. First topic is PostgreSQL database migration to pgvector for vector search grounding.
[00:03] David: I have completed the preliminary benchmark. Migration is scheduled for next Tuesday, August 12. We will need a 30-minute maintenance window at 2:00 AM UTC.
[00:05] Alex: Wait, last week in the Architecture review, we decided all DB maintenance windows must be on Sunday at 4:00 AM UTC to minimize disruption for EU clients.
[00:07] Sarah: Good catch Alex. Let's resolve that conflict. David, please reschedule to Sunday Aug 17 at 4:00 AM UTC and update Jira ticket OPS-4092.
[00:10] Elena: Also, regarding SOC2 audit logging for MCP agent tool executions - we need mandatory approval retention set to 365 days instead of 90 days.
[00:12] Sarah: Agreed. I'll take the action to update the security policy documentation and notify the SecOps channel by Friday.`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !transcript) {
      setErrorMsg('Please enter a meeting title and paste or upload transcript text.');
      return;
    }
    setErrorMsg(null);
    setIsProcessing(true);
    setPipelineStep(1);

    // Simulate multi-agent processing steps (Ingestion -> Extraction -> Grounding -> Validation -> MCP Draft)
    const stepInterval = setInterval(() => {
      setPipelineStep(prev => {
        if (prev >= 5) {
          clearInterval(stepInterval);
          return 5;
        }
        return prev + 1;
      });
    }, 900);

    try {
      const created = await apiService.createMeeting({
        title,
        meetingDate,
        attendees,
        transcript
      });

      setTimeout(() => {
        setIsProcessing(false);
        navigate(`/meetings/${created.id}`);
      }, 4600);
    } catch (err) {
      setIsProcessing(false);
      setErrorMsg('Failed to process transcript via API Gateway.');
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '900px' }}>
      <button className="btn btn-secondary btn-sm" onClick={() => navigate('/meetings')} style={{ marginBottom: '1rem' }}>
        <ArrowLeft size={16} /> Back to Meetings
      </button>

      <div className="page-header">
        <div>
          <h1 className="page-title">Ingest New Transcript</h1>
          <p className="page-subtitle">
            Upload meeting audio transcripts to trigger the AI Extraction & Grounding Agent Pipeline
          </p>
        </div>

        <button type="button" className="btn btn-secondary btn-sm" onClick={loadSampleTranscript}>
          <Sparkles size={14} color="var(--secondary)" /> Fill Sample Transcript
        </button>
      </div>

      {errorMsg && (
        <div style={styles.errorBanner}>
          <AlertCircle size={18} /> {errorMsg}
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={styles.formGrid}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Meeting Title</label>
            <input
              type="text"
              placeholder="e.g. Q3 Architecture & Vector Grounding Sync"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
              disabled={isProcessing}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Date & Time</label>
            <input
              type="datetime-local"
              value={meetingDate}
              onChange={(e) => setMeetingDate(e.target.value)}
              className="input"
              disabled={isProcessing}
            />
          </div>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Attendees (Comma separated)</label>
          <input
            type="text"
            placeholder="Sarah Chen, David Kim, Elena Rostova"
            value={attendees}
            onChange={(e) => setAttendees(e.target.value)}
            className="input"
            disabled={isProcessing}
          />
        </div>

        <div style={styles.inputGroup}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={styles.label}>Meeting Transcript Text</label>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
              Supports plain text, WebVTT, SRT, or Zoom/Teams exports
            </span>
          </div>
          <textarea
            placeholder="Paste raw transcript here with timestamps and speaker labels..."
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            className="textarea"
            disabled={isProcessing}
            rows={10}
            required
          />
        </div>

        {/* Processing State Pipeline Variant (Screen #3 requirement) */}
        {isProcessing && (
          <PipelineIndicator currentStep={pipelineStep} isProcessing={isProcessing} />
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.5rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/meetings')}
            disabled={isProcessing}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>Running Multi-Agent Pipeline...</>
            ) : (
              <>
                <Play size={18} /> Ingest & Execute AI Pipeline
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.25rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  label: {
    fontSize: '0.82rem',
    fontWeight: 700,
    color: 'var(--text-muted)',
  },
  errorBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#f87171',
    borderRadius: 'var(--radius-md)',
    padding: '0.85rem 1rem',
    fontSize: '0.88rem',
    marginBottom: '1rem',
  }
};
