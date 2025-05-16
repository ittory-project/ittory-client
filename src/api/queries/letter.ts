import { inMillis } from '../../utils';
import { getElementsByLetterId } from '../service/ElementService';
import {
  getLetterDetailInfo,
  getLetterInfo,
  getLetterPartiList,
  getLetterStartInfo,
} from '../service/LetterService';

const queryKeyNamespaces = {
  letter: 'letter',
};

export const queryKeys = {
  byLetterId: (letterId: number) => [queryKeyNamespaces.letter, letterId],
  infoByLetterId: (letterId: number) => [
    queryKeyNamespaces.letter,
    letterId,
    'info',
  ],
  startInfoByLetterId: (letterId: number) => [
    queryKeyNamespaces.letter,
    letterId,
    'startInfo',
  ],
  detailInfoByLetterId: (letterId: number) => [
    queryKeyNamespaces.letter,
    letterId,
    'detail',
  ],
  participantsByLetterId: (letterId: number) => [
    queryKeyNamespaces.letter,
    letterId,
    'participants',
  ],
  elementsByLetterId: (letterId: number) => [
    queryKeyNamespaces.letter,
    letterId,
    'elements',
  ],
};

export const participantsByLetterIdQuery = (letterId: number) => ({
  queryKey: queryKeys.participantsByLetterId(letterId),
  queryFn: () => getLetterPartiList(letterId),
  staleTime: inMillis().minutes(30).value(),
  cacheTime: inMillis().minutes(30).value(),
});

export const elementsByLetterIdQuery = (letterId: number) => ({
  queryKey: queryKeys.elementsByLetterId(letterId),
  queryFn: () => getElementsByLetterId(letterId),
  staleTime: inMillis().minutes(30).value(),
  cacheTime: inMillis().minutes(30).value(),
});

export const startInfoByLetterIdQuery = (letterId: number) => ({
  queryKey: queryKeys.startInfoByLetterId(letterId),
  queryFn: () => getLetterStartInfo(letterId),
  staleTime: inMillis().minutes(30).value(),
  cacheTime: inMillis().minutes(30).value(),
});

export const infoByLetterIdQuery = (letterId: number) => ({
  queryKey: queryKeys.infoByLetterId(letterId),
  queryFn: () => getLetterInfo(letterId),
  staleTime: inMillis().minutes(30).value(),
  cacheTime: inMillis().minutes(30).value(),
});

export const detailByLetterIdQuery = (letterId: number) => ({
  queryKey: queryKeys.detailInfoByLetterId(letterId),
  queryFn: () => getLetterDetailInfo(letterId),
  staleTime: inMillis().minutes(30).value(),
  cacheTime: inMillis().minutes(30).value(),
});
