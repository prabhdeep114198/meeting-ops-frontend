import React, { useState } from 'react';
import { X, Search, FileText, Download, Copy, Check } from 'lucide-react';

export const TranscriptDrawer = ({ isOpen, onClose, meetingTitle, transcript }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const lines = (transcript || '').split('\n').filter(Boolean);
  const filteredLines = lines.filter(line =>
    line.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <div className="drawer-content">
        {/* Drawer Header */}
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <FileText size={20} color="var(--primary)" />
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Full Transcript Drawer</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{meetingTitle}</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button className="btn btn-secondary btn-sm" onClick={handleCopy}>
              {copied ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button className="btn btn-secondary btn-sm" onClick={onClose}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Search Line */}
        <div style={styles.searchBar}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search transcript by keyword or speaker..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {/* Transcript Content with line numbers */}
        <div style={styles.content}>
          {filteredLines.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem' }}>
              No lines found matching "{searchTerm}"
            </p>
          ) : (
            filteredLines.map((line, idx) => (
              <div key={idx} style={styles.lineRow}>
                <span style={styles.lineNo}>{idx + 1}</span>
                <span style={styles.lineText}>{line}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

const styles = {
  header: {
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid var(--border-subtle)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: 'rgba(17, 24, 39, 0.6)',
    borderBottom: '1px solid var(--border-subtle)',
  },
  searchInput: {
    background: 'none',
    border: 'none',
    outline: 'none',
    color: '#ffffff',
    fontSize: '0.85rem',
    width: '100%',
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '1.5rem',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.85rem',
    lineHeight: 1.6,
  },
  lineRow: {
    display: 'flex',
    gap: '1rem',
    padding: '0.35rem 0.5rem',
    borderRadius: '4px',
    transition: 'background 0.15s ease',
  },
  lineNo: {
    color: 'var(--text-subtle)',
    userSelect: 'none',
    width: '30px',
    textAlign: 'right',
    flexShrink: 0,
    fontSize: '0.75rem',
  },
  lineText: {
    color: 'var(--text-main)',
    whiteSpace: 'pre-wrap',
  }
};
