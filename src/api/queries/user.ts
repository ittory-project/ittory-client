import { inMillis } from '../../utils';
import {
  getLetterCounts,
  getMyPage,
  getParticipatedLetter,
  getReceivedLetter,
  getVisitUser,
} from '../service/MemberService';
import { queryKeyNamespaces } from './_namespaces';

export const queryKeys = {
  myInfo: () => [queryKeyNamespaces.user, 'my', 'info'],
  visitUser: () => [queryKeyNamespaces.user, 'my', 'visit'],
  letterCounts: () => [queryKeyNamespaces.user, 'letter', 'counts'],
  participatedLetter: () => [queryKeyNamespaces.user, 'letter', 'participated'],
  receivedLetter: () => [queryKeyNamespaces.user, 'letter', 'received'],
};

export const myInfoQuery = () => ({
  queryKey: queryKeys.myInfo(),
  queryFn: () => getMyPage(),
  staleTime: inMillis().hours(1).value(),
  cacheTime: inMillis().hours(1).value(),
});

export const visitUserQuery = () => ({
  queryKey: queryKeys.visitUser(),
  queryFn: () => getVisitUser(),
  staleTime: inMillis().seconds(30).value(),
  cacheTime: inMillis().seconds(30).value(),
});

export const letterCountsQuery = () => ({
  queryKey: queryKeys.letterCounts(),
  queryFn: () => getLetterCounts(),
  staleTime: inMillis().seconds(30).value(),
  cacheTime: inMillis().seconds(30).value(),
});

export const participatedLetterQuery = () => ({
  queryKey: queryKeys.participatedLetter(),
  queryFn: () => getParticipatedLetter(),
  staleTime: inMillis().seconds(30).value(),
  cacheTime: inMillis().seconds(30).value(),
});

export const receivedLetterQuery = () => ({
  queryKey: queryKeys.receivedLetter(),
  queryFn: () => getReceivedLetter(),
  staleTime: inMillis().seconds(30).value(),
  cacheTime: inMillis().seconds(30).value(),
});
