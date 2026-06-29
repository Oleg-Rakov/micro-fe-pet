import { lazy, Suspense } from 'react';
import { RemoteErrorBoundary } from './RemoteErrorBoundary';

// Runtime import — the Button's code arrives over the network from remoteEntry.js, not bundled in.
const RemoteButton = lazy(() => import('remote/Button'));

function LocalFallbackButton() {
  return (
    <button disabled style={{ padding: '10px 20px', fontSize: 16, borderRadius: 8 }}>
      Remote unavailable — local fallback
    </button>
  );
}

export function App() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 40 }}>
      <h1>Host app (shell)</h1>
      <p>
        Below is a component loaded from <strong>remote</strong> at runtime:
      </p>
      <RemoteErrorBoundary fallback={<LocalFallbackButton />}>
        <Suspense fallback={<span>Loading remote…</span>}>
          <RemoteButton />
        </Suspense>
      </RemoteErrorBoundary>
    </div>
  );
}
