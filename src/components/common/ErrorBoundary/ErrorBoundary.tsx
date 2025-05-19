import { Component, ComponentType, PropsWithChildren } from 'react';

import { ErrorFullScreen } from '../ErrorFullScreen';

export interface ErrorBoundaryProps extends PropsWithChildren {
  errorMessage?: string;
  onReset?: () => void;
  onCatch?: (error: unknown) => void;
  fallback?: ComponentType<{
    errorMessage?: string | null;
    onReset?: () => void;
  }>;
}

interface State {
  error: unknown;
  isError: boolean;
}

const defaultState = {
  error: undefined,
  isError: false,
};

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  State
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = defaultState;

    this.resetErrorState = this.resetErrorState.bind(this);
  }

  resetErrorState() {
    this.props.onReset?.();
    this.setState(defaultState);
  }

  componentDidCatch(error: unknown) {
    this.props.onCatch?.(error);
    this.setState({ error, isError: true });
  }

  render() {
    const { isError } = this.state;
    const {
      errorMessage,
      children,
      fallback: Fallback = ErrorFullScreen,
    } = this.props;

    if (!isError) {
      return children;
    }

    return (
      <Fallback errorMessage={errorMessage} onReset={this.resetErrorState} />
    );
  }
}
