import React from 'react';
import { CheckCircle2, Loader2, Circle, ArrowRight } from 'lucide-react';

export const PipelineIndicator = ({ currentStep = 1, isProcessing = false }) => {
  const steps = [
    { id: 1, name: 'Transcript Ingestion', desc: 'Ingesting transcript to Spring Boot API' },
    { id: 2, name: 'AI Extraction Agent', desc: 'Parsing Action Items & Decisions via LLM' },
    { id: 3, name: 'Grounding & RAG', desc: 'pgvector similarity search against history' },
    { id: 4, name: 'Validation Agent', desc: 'Confidence scoring & ambiguity checks' },
    { id: 5, name: 'MCP Draft Actions', desc: 'FastMCP tools generating draft payloads' },
  ];

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>AI Pipeline Processing Progress</h3>
      <div style={styles.stepsGrid}>
        {steps.map((step, idx) => {
          const isDone = step.id < currentStep || (!isProcessing && currentStep === 5);
          const isCurrent = isProcessing && step.id === currentStep;

          return (
            <div
              key={step.id}
              style={{
                ...styles.stepCard,
                ...(isCurrent ? styles.stepCardCurrent : {}),
                ...(isDone ? styles.stepCardDone : {})
              }}
            >
              <div style={styles.stepHeader}>
                <span style={styles.stepNumber}>Step {step.id}</span>
                {isDone ? (
                  <CheckCircle2 size={18} color="#34d399" />
                ) : isCurrent ? (
                  <Loader2 size={18} color="#60a5fa" style={{ animation: 'spin 1.5s linear infinite' }} />
                ) : (
                  <Circle size={18} color="var(--text-subtle)" />
                )}
              </div>
              <h4 style={styles.stepName}>{step.name}</h4>
              <p style={styles.stepDesc}>{step.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: 'rgba(17, 24, 39, 0.9)',
    border: '1px solid var(--border-glow)',
    borderRadius: 'var(--radius-lg)',
    padding: '1.5rem',
    marginTop: '1.5rem',
    boxShadow: 'var(--shadow-glow)',
  },
  title: {
    fontSize: '1rem',
    fontWeight: 700,
    marginBottom: '1rem',
    color: '#ffffff',
  },
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1rem',
  },
  stepCard: {
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    padding: '1rem',
    transition: 'all 0.3s ease',
  },
  stepCardCurrent: {
    borderColor: 'var(--primary)',
    boxShadow: '0 0 15px rgba(99, 102, 241, 0.3)',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  stepCardDone: {
    borderColor: 'rgba(52, 211, 153, 0.4)',
    backgroundColor: 'rgba(52, 211, 153, 0.05)',
  },
  stepHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
  },
  stepNumber: {
    fontSize: '0.72rem',
    fontWeight: 800,
    color: 'var(--text-subtle)',
    textTransform: 'uppercase',
  },
  stepName: {
    fontSize: '0.85rem',
    fontWeight: 700,
    marginBottom: '0.25rem',
  },
  stepDesc: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    lineHeight: 1.3,
  }
};
