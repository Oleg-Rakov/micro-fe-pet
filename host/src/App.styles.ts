import type { CSSProperties } from 'react';

export const styles: Record<string, CSSProperties> = {
  page: { fontFamily: 'system-ui, sans-serif', padding: 40, maxWidth: 640, margin: '0 auto' },
  header: { marginBottom: 24 },
  title: { margin: '0 0 4px' },
  team: { fontSize: 13, color: '#888' },
  fallback: {
    padding: 24,
    border: '2px dashed #e0a0a0',
    borderRadius: 12,
    color: '#a33',
    maxWidth: 480,
  },
  stamp: { marginTop: 32, fontSize: 12, color: '#999' },
};
