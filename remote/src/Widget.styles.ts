import type { CSSProperties } from 'react';

export const styles: Record<string, CSSProperties> = {
  card: { border: '2px solid #e0e0e0', borderRadius: 12, padding: 24, maxWidth: 480 },
  badge: {
    fontSize: 12,
    fontWeight: 600,
    color: '#6c5ce7',
    background: '#efeaff',
    padding: '4px 10px',
    borderRadius: 999,
  },
  cta: {
    padding: '10px 20px',
    fontSize: 16,
    borderRadius: 8,
    border: 'none',
    background: '#6c5ce7',
    color: 'white',
    cursor: 'pointer',
  },
  stamp: { marginTop: 16, fontSize: 12, color: '#999' },
};
