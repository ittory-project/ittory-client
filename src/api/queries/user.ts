import { inMillis } from '../../utils';
import { getMyPage } from '../service/MemberService';

const queryKeyNamespaces = {
  user: 'user',
};

export const queryKeys = {
  myInfo: () => [queryKeyNamespaces.user, 'my', 'info'],
};

export const myInfoQuery = () => ({
  queryKey: queryKeys.myInfo(),
  queryFn: () => getMyPage(),
  staleTime: inMillis().hours(1).value(),
  cacheTime: inMillis().hours(1).value(),
});
