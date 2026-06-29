import { Component, type ReactNode } from 'react';

type Props = { fallback: ReactNode; children: ReactNode };
type State = { hasError: boolean };

// If loading the remote fails (its deploy is down), show a fallback instead of crashing the shell.
export class RemoteErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error('Failed to load remote:', error);
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
