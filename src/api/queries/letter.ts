import { inMillis } from '../../utils';
import { getElementsByLetterId } from '../service/ElementService';
import {
  getLetterPartiList,
  getLetterStartInfo,
} from '../service/LetterService';

const queryKeyNamespaces = {
  letter: 'letter',
};

export const queryKeys = {
  byLetterId: (letterId: number) => [queryKeyNamespaces.letter, letterId],
  startInfoByLetterId: (letterId: number) => [
    queryKeyNamespaces.letter,
    letterId,
    'startInfo',
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
