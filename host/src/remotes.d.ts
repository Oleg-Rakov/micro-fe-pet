// 'remote/Widget' is resolved at runtime by Module Federation, so TS can't see it statically.
declare module 'remote/Widget' {
  import type { ComponentType } from 'react';
  const Widget: ComponentType;
  export default Widget;
}
