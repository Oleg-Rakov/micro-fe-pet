// 'remote/Button' is resolved at runtime by Module Federation, so TS can't see it statically.
declare module 'remote/Button' {
  import type { ComponentType } from 'react';
  const Button: ComponentType;
  export default Button;
}
