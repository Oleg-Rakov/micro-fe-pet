import { useState } from 'react';

// Exposed via ModuleFederationPlugin. useState here proves remote shares the host's React (singleton).
export function Button() {
  const [count, setCount] = useState(0);
  return (
    <button
      onClick={() => setCount((c) => c + 1)}
      style={{
        padding: '10px 20px',
        fontSize: 16,
        borderRadius: 8,
        border: 'none',
        background: '#6c5ce7',
        color: 'white',
        cursor: 'pointer',
      }}
    >
      Button from remote · clicked {count}
    </button>
  );
}

export default Button;
