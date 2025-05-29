import { PropsWithChildren } from 'react';

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import { QUERY_OPTIONS } from './constants';

// TODO: implement
const noticeUserOnServerError = (error: unknown) => {
  console.error(error);
};

// TODO: implement
const logQueryError = (error: unknown) => {
  console.error(error);
};

// TODO: implement
const logMutationError = (error: unknown) => {
  console.error(error);
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_OPTIONS.STALE_TIME,
      gcTime: QUERY_OPTIONS.GC_TIME,
      retry: QUERY_OPTIONS.RETRY_COUNT,
      refetchOnWindowFocus: 'always', // NOTE: true가 기본값인데, stale한 쿼리만 재요청
    },
    mutations: {
      onError: noticeUserOnServerError,
    },
  },
  queryCache: new QueryCache({
    onError: logQueryError,
  }),
  mutationCache: new MutationCache({
    onError: logMutationError,
  }),
});

export const ReactQueryClientProvider = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
