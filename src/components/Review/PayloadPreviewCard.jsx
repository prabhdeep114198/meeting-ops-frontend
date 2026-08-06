import React, { useState } from 'react';
import { Code, CheckSquare, Calendar, Mail, Edit3, Save, Sparkles } from 'lucide-react';

export const PayloadPreviewCard = ({ draftAction, onPayloadChange, isEditable = true }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [jsonText, setJsonText] = useState(draftAction.payloadJson || '{}');
  const [jsonError, setJsonError] = useState(null);

  const getActionIcon = (type) => {
    switch (type) {
      case 'TASK': return <CheckSquare size={18} color="#60a5fa" />;
      case 'CALENDAR_REMINDER': return <Calendar size={18} color="#34d399" />;
      case 'EMAIL': return <Mail size={18} color="#ec4899" />;
      default: return <Code size={18} color="var(--primary)" />;
    }
  };

  const handleSave = () => {
    try {
      JSON.parse(jsonText);
      setJsonError(null);
      setIsEditing(false);
      if (onPayloadChange) {
        onPayloadChange(jsonText);
      }
    } catch (err) {
      setJsonError('Invalid JSON format. Please correct syntax errors.');
    }
  };

  return (
    <div style={styles.card}>
      {/* Header */}
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {getActionIcon(draftAction.actionType)}
          <div>
            <h3 style={styles.title}>
              FastMCP Payload Preview: {draftAction.actionType}
            </h3>
            <span style={styles.subtitle}>
              Target MCP Service Tool execution payload
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {draftAction.isAIGenerated && (
            <span style={styles.aiBadge}>
              <Sparkles size={12} /> AI-Generated
            </span>
          )}

          {isEditable && (
            isEditing ? (
              <button className="btn btn-primary btn-sm" onClick={handleSave}>
                <Save size={14} /> Save Changes
              </button>
            ) : (
              <button className="btn btn-secondary btn-sm" onClick={() => setIsEditing(true)}>
                <Edit3 size={14} /> Edit Payload
              </button>
            )
          )}
        </div>
      </div>

      {/* Code / Editor Area */}
      {isEditing ? (
        <div>
          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            style={styles.jsonTextarea}
            rows={10}
          />
          {jsonError && <p style={styles.errorText}>{jsonError}</p>}
        </div>
      ) : (
        <pre style={styles.jsonPre}>
          <code>{jsonText}</code>
        </pre>
      )}
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-lg)',
    padding: '1.5rem',
    marginBottom: '1.5rem',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1rem',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid var(--border-subtle)',
  },
  title: {
    fontSize: '0.95rem',
    fontWeight: 700,
  },
  subtitle: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
  },
  aiBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.3rem',
    fontSize: '0.7rem',
    fontWeight: 700,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    color: 'var(--secondary)',
    padding: '0.2rem 0.55rem',
    borderRadius: '9999px',
  },
  jsonPre: {
    backgroundColor: 'rgba(11, 15, 25, 0.8)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    padding: '1rem',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.83rem',
    color: '#34d399',
    overflowX: 'auto',
  },
  jsonTextarea: {
    width: '100%',
    backgroundColor: '#0b0f19',
    border: '1px solid var(--primary)',
    borderRadius: 'var(--radius-md)',
    padding: '1rem',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.83rem',
    color: '#ffffff',
    outline: 'none',
  },
  errorText: {
    color: '#f87171',
    fontSize: '0.8rem',
    marginTop: '0.5rem',
  }
};
