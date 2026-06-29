import { Button } from './Button';

// Standalone shell — proves the remote runs on its own (npm start on :3001), independent of host.
export function App() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 40 }}>
      <h1>Remote app (standalone)</h1>
      <p>
        This same <code>&lt;Button /&gt;</code> is what the host loads at runtime.
      </p>
      <Button />
    </div>
  );
}
