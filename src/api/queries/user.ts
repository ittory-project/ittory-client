import { inMillis } from '../../utils';
import { getLetterCounts, getMyPage } from '../service/MemberService';

const queryKeyNamespaces = {
  user: 'user',
};

export const queryKeys = {
  myInfo: () => [queryKeyNamespaces.user, 'my', 'info'],
  letterCounts: () => [queryKeyNamespaces.user, 'letter', 'counts'],
};

export const myInfoQuery = () => ({
  queryKey: queryKeys.myInfo(),
  queryFn: () => getMyPage(),
  staleTime: inMillis().hours(1).value(),
  cacheTime: inMillis().hours(1).value(),
});

export const letterCountsQuery = () => ({
  queryKey: queryKeys.letterCounts(),
  queryFn: () => getLetterCounts(),
  staleTime: inMillis().seconds(30).value(),
  cacheTime: inMillis().seconds(30).value(),
});
