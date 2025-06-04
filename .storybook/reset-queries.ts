// NOTE: 스토리 전환 시 QueryCache를 초기화
import { useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';

// @see https://github.com/mswjs/msw-storybook-addon/issues/82#issuecomment-2265807052
export const ResetQueries = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    return () => {
      queryClient.resetQueries();
    };
  }, []);

  return null;
};
