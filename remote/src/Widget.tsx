import { useState } from 'react';
import { styles } from './Widget.styles';

// Exposed via Module Federation, owned by another team; useState proves the shared React singleton.
export function Widget() {
  const [dismissed, setDismissed] = useState(false);

  return (
    <div style={{ ...styles.card, borderColor: dismissed ? '#e0e0e0' : '#6c5ce7' }}>
      <span style={styles.badge}>Promo · owned by the Growth team</span>
      {dismissed ? (
        <p style={{ margin: '12px 0 0' }}>
          <strong>Thanks!</strong> This banner lives in a separate app.
        </p>
      ) : (
        <>
          <h2 style={{ margin: '12px 0 4px' }}>Free shipping this week</h2>
          <p style={{ margin: '0 0 16px', color: '#555' }}>
            Shipped by the remote app and loaded into the shell at runtime — no host deploy needed.
          </p>
          <button onClick={() => setDismissed(true)} style={styles.cta}>
            Got it
          </button>
        </>
      )}
      <div style={styles.stamp}>
        remote v{__APP_VERSION__} · built {new Date(__BUILD_TIME__).toLocaleString()}
      </div>
    </div>
  );
}

export default Widget;
