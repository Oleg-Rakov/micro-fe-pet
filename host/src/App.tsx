import { lazy, Suspense } from 'react';
import { RemoteErrorBoundary } from './RemoteErrorBoundary';
import { styles } from './App.styles';

// Runtime import — the widget's code arrives over the network from remoteEntry.js, not bundled in.
const RemoteWidget = lazy(() => import('remote/Widget'));

function Fallback() {
  return <div style={styles.fallback}>Promo unavailable — the remote app is down.</div>;
}

export function App() {
  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>Acme Store</h1>
        <span style={styles.team}>host shell · owned by the Platform team</span>
      </header>

      <RemoteErrorBoundary fallback={<Fallback />}>
        <Suspense fallback={<span>Loading promo…</span>}>
          <RemoteWidget />
        </Suspense>
      </RemoteErrorBoundary>

      <footer style={styles.stamp}>
        host v{__APP_VERSION__} · built {new Date(__BUILD_TIME__).toLocaleString()}
      </footer>
    </div>
  );
}
