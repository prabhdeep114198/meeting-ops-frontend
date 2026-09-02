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

  // Mode toggle: 'MANUAL' (v1.0) vs 'BOT_CAPTURE' (Week 3 / Phase 2)
  const [ingestionMode, setIngestionMode] = useState('BOT_CAPTURE');

  // Bot Capture specific states
  const [meetingUrl, setMeetingUrl] = useState('https://meet.google.com/qxr-bopt-jks');
  const [platform, setPlatform] = useState('MEET');
  const [organizerEmail, setOrganizerEmail] = useState('alex.mercer@acme.com');
  const [consentPolicy, setConsentPolicyState] = useState(apiService.getConsentPolicy());
  const [attendeeConsentList, setAttendeeConsentList] = useState([
    { email: 'alex.mercer@acme.com', name: 'Alex Mercer', consentStatus: 'GRANTED' },
    { email: 'priya.sharma@acme.com', name: 'Priya Sharma', consentStatus: 'GRANTED' },
    { email: 'david.kim@acme.com', name: 'David Kim', consentStatus: 'GRANTED' }
  ]);
  const [botStatusState, setBotStatusState] = useState(null);
  const [abortDetails, setAbortDetails] = useState(null);

  // Toggle single attendee consent for demonstrating PRIV-2 hard abort
  const toggleAttendeeConsent = (index) => {
    setAttendeeConsentList(prev => {
      const copy = [...prev];
      copy[index].consentStatus = copy[index].consentStatus === 'GRANTED' ? 'DECLINED' : 'GRANTED';
      return copy;
    });
  };

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

  const handleBotDispatch = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setAbortDetails(null);
    setIsProcessing(true);
    setPipelineStep(1);

    // Step 1: Pre-join consent check
    setBotStatusState({ step: 1, label: 'Evaluating Pre-Join Consent Policy (' + consentPolicy + ')...' });

    const botResponse = await apiService.dispatchBot({
      meetingUrl,
      platform,
      title: title || 'Live ' + platform + ' Capture Sync',
      organizerEmail,
      organizerOptIn: true,
      attendees: attendeeConsentList
    });

    if (botResponse.status === 'ABORTED_NO_CONSENT') {
      setIsProcessing(false);
      setAbortDetails(botResponse);
      return;
    }

    // Step 2: Bot joining
    setTimeout(() => {
      setPipelineStep(2);
      setBotStatusState({ step: 2, label: 'Bot joined call as "MeetingOps Recording Bot (AI Analysis)"' });
    }, 1200);

    // Step 3: In-call broadcast notice
    setTimeout(() => {
      setPipelineStep(3);
      setBotStatusState({ step: 3, label: 'Broadcasting in-call chat recording & analytics disclaimer (FR-1.4)' });
    }, 2400);

    // Step 4: Ephemeral audio capture
    setTimeout(() => {
      setPipelineStep(4);
      setBotStatusState({ step: 4, label: 'Streaming AES-256 encrypted audio chunks to MinIO S3 (24h auto-purge TTL)' });
    }, 3600);

    // Step 5: Call finish & Kafka meeting.captured
    setTimeout(async () => {
      setPipelineStep(5);
      setBotStatusState({ step: 5, label: 'Call ended. Published meeting.captured event to Kafka (FR-1.6)!' });

      const created = await apiService.createMeeting({
        title: title || ('Live ' + platform + ' Conference'),
        meetingDate: new Date().toISOString(),
        attendees: attendeeConsentList.map(a => a.name).join(', '),
        transcript: `[00:00] Alex Mercer: Thanks everyone for joining the recorded session.
[00:04] Priya Sharma: I reviewed the S3 retention policy. All ephemeral audio chunks are purged at 24 hours.
[00:09] David Kim: Action item for me: verify the Kafka topic partitions for meeting.captured and meeting.transcribed by EOD tomorrow.`
      });

      setTimeout(() => {
        setIsProcessing(false);
        navigate(`/meetings/${created.id}`);
      }, 1500);
    }, 5000);
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
    <div className="page-container" style={{ maxWidth: '950px' }}>
      <button className="btn btn-secondary btn-sm" onClick={() => navigate('/meetings')} style={{ marginBottom: '1rem' }}>
        <ArrowLeft size={16} /> Back to Meetings
      </button>

      <div className="page-header">
        <div>
          <h1 className="page-title">Meeting Capture & Ingestion</h1>
          <p className="page-subtitle">
            Capture meetings via autonomous conferencing bot (Week 3) or upload raw transcript text
          </p>
        </div>

        {ingestionMode === 'MANUAL' && (
          <button type="button" className="btn btn-secondary btn-sm" onClick={loadSampleTranscript}>
            <Sparkles size={14} color="var(--secondary)" /> Fill Sample Transcript
          </button>
        )}
      </div>

      {/* Mode Switcher Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <button
          type="button"
          className={`btn ${ingestionMode === 'BOT_CAPTURE' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => { setIngestionMode('BOT_CAPTURE'); setAbortDetails(null); }}
        >
          <Play size={16} /> Live Bot Join (Week 3 — Auto Capture)
        </button>
        <button
          type="button"
          className={`btn ${ingestionMode === 'MANUAL' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => { setIngestionMode('MANUAL'); setAbortDetails(null); }}
        >
          <FileText size={16} /> Paste Transcript (v1.0 Manual Ingestion)
        </button>
      </div>

      {errorMsg && (
        <div style={styles.errorBanner}>
          <AlertCircle size={18} /> {errorMsg}
        </div>
      )}

      {/* Abort Banner (PRIV-2 verification) */}
      {abortDetails && (
        <div style={styles.abortBanner}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1rem' }}>
            <AlertCircle size={20} color="#ef4444" />
            CRITICAL SAFETY GATE ACTIVATED: BOT JOIN ABORTED (PRIV-2)
          </div>
          <p style={{ marginTop: '0.4rem', fontSize: '0.86rem', color: 'var(--text-main)' }}>
            <strong>Reason:</strong> {abortDetails.consentEvaluation?.reason || abortDetails.message}
          </p>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginTop: '0.4rem' }}>
            Per SRS Section 8.2 & PRIV-2: The system shall not silently degrade a declined-consent scenario into partial or stealth capture.
          </div>
        </div>
      )}

      {/* Mode 1: Live Bot Capture (Week 3 Scope) */}
      {ingestionMode === 'BOT_CAPTURE' ? (
        <form onSubmit={handleBotDispatch} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Dispatch MeetingOps Recording Bot (FR-1.1)</h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              Bot will verify consent, enter the video conference, display a visible badge, and broadcast chat disclosures.
            </p>
          </div>

          <div style={styles.formGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Conference Call URL</label>
              <input
                type="url"
                placeholder="https://meet.google.com/xxx or https://zoom.us/j/..."
                value={meetingUrl}
                onChange={(e) => setMeetingUrl(e.target.value)}
                className="input"
                disabled={isProcessing}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Platform</label>
              <select
                className="input"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                disabled={isProcessing}
              >
                <option value="MEET">Google Meet</option>
                <option value="ZOOM">Zoom Meetings</option>
                <option value="TEAMS">Microsoft Teams</option>
              </select>
            </div>
          </div>

          <div style={styles.formGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Meeting Title (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Q3 Architecture & Vector Grounding Sync"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input"
                disabled={isProcessing}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Organizer Email</label>
              <input
                type="email"
                value={organizerEmail}
                onChange={(e) => setOrganizerEmail(e.target.value)}
                className="input"
                disabled={isProcessing}
                required
              />
            </div>
          </div>

          {/* Consent Policy & Attendee Consent Roster (FR-1.3, PRIV-1, PRIV-2 Demo) */}
          <div style={{ backgroundColor: 'var(--surface-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
              <label style={styles.label}>Organization Consent Mode Policy (PRIV-1)</label>
              <select
                className="input"
                style={{ width: '220px', padding: '0.3rem 0.6rem' }}
                value={consentPolicy}
                onChange={(e) => {
                  setConsentPolicyState(e.target.value);
                  apiService.setConsentPolicy(e.target.value);
                }}
                disabled={isProcessing}
              >
                <option value="NOTIFY_ONLY">NOTIFY_ONLY (Notice in call)</option>
                <option value="MEETING_OPT_IN">MEETING_OPT_IN (Organizer opt-in)</option>
                <option value="PARTICIPANT_OPT_IN">PARTICIPANT_OPT_IN (All must consent)</option>
              </select>
            </div>

            <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', marginBottom: '0.75rem' }}>
              Test PRIV-2 by clicking on attendee consent status below to switch to DECLINED and observe immediate pre-join abort.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {attendeeConsentList.map((att, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--surface)', padding: '0.5rem 0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.84rem' }}><strong>{att.name}</strong> ({att.email})</span>
                  <button
                    type="button"
                    className={`btn btn-sm ${att.consentStatus === 'GRANTED' ? 'btn-secondary' : 'btn-danger'}`}
                    style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}
                    onClick={() => toggleAttendeeConsent(idx)}
                    disabled={isProcessing}
                  >
                    Consent: {att.consentStatus}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Bot Progress */}
          {isProcessing && botStatusState && (
            <div style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--primary)', fontWeight: 700 }}>
                <Play size={18} /> Step {botStatusState.step}/5: {botStatusState.label}
              </div>
            </div>
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
              <Play size={18} /> {isProcessing ? 'Capturing Conference Audio...' : 'Dispatch Bot & Start Capture'}
            </button>
          </div>
        </form>
      ) : (
        /* Mode 2: Manual Transcript Paste (v1.0 fallback) */
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
              <Play size={18} /> {isProcessing ? 'Running Multi-Agent Pipeline...' : 'Ingest & Execute AI Pipeline'}
            </button>
          </div>
        </form>
      )}
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
  },
  abortBanner: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '2px solid #ef4444',
    borderRadius: 'var(--radius-md)',
    padding: '1rem 1.25rem',
    marginBottom: '1.25rem',
  }
};
