import { QueryErrorResetBoundary } from '@tanstack/react-query';

import { ErrorFullScreen } from '../ErrorFullScreen';
import ErrorBoundary, { type ErrorBoundaryProps } from './ErrorBoundary';

type ApiErrorBoundaryProps = Omit<ErrorBoundaryProps, 'fallback'>;

const ApiErrorBoundary = ({
  onCatch,
  onReset,
  children,
}: ApiErrorBoundaryProps) => {
  return (
    <QueryErrorResetBoundary>
      {({ reset: resetErrorStateQueries }) => {
        const handleReset = () => {
          resetErrorStateQueries();
          onReset?.();
        };

        return (
          <ErrorBoundary
            fallback={ErrorFullScreen}
            onReset={handleReset}
            onCatch={onCatch}
          >
            {children}
          </ErrorBoundary>
        );
      }}
    </QueryErrorResetBoundary>
  );
};

export default ApiErrorBoundary;
