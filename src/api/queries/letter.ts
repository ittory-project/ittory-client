import { inMillis } from '../../utils';
import { getElementsByLetterId } from '../service/ElementService';
import {
  getLetterDetailInfo,
  getLetterInfo,
  getLetterPartiList,
  getLetterStartInfo,
} from '../service/LetterService';
import { queryKeyNamespaces } from './_namespaces';

export const queryKeys = {
  byId: (letterId: number) => [queryKeyNamespaces.letter, letterId],
  infoById: (letterId: number) => [queryKeyNamespaces.letter, letterId, 'info'],
  startInfoById: (letterId: number) => [
    queryKeyNamespaces.letter,
    letterId,
    'startInfo',
  ],
  detailInfoById: (letterId: number) => [
    queryKeyNamespaces.letter,
    letterId,
    'detail',
  ],
  participantsById: (letterId: number) => [
    queryKeyNamespaces.letter,
    letterId,
    'participants',
  ],
  elementsById: (letterId: number) => [
    queryKeyNamespaces.letter,
    letterId,
    'elements',
  ],
};

export const participantsById = (letterId: number) => ({
  queryKey: queryKeys.participantsById(letterId),
  queryFn: () => getLetterPartiList(letterId),
  staleTime: inMillis().minutes(30).value(),
  cacheTime: inMillis().minutes(30).value(),
});

export const elementsById = (letterId: number) => ({
  queryKey: queryKeys.elementsById(letterId),
  queryFn: () => getElementsByLetterId(letterId),
  staleTime: inMillis().minutes(30).value(),
  cacheTime: inMillis().minutes(30).value(),
});

export const startInfoById = (letterId: number) => ({
  queryKey: queryKeys.startInfoById(letterId),
  queryFn: () => getLetterStartInfo(letterId),
  staleTime: inMillis().minutes(30).value(),
  cacheTime: inMillis().minutes(30).value(),
});

export const infoById = (letterId: number) => ({
  queryKey: queryKeys.infoById(letterId),
  queryFn: () => getLetterInfo(letterId),
  staleTime: inMillis().minutes(30).value(),
  cacheTime: inMillis().minutes(30).value(),
});

export const detailById = (letterId: number) => ({
  queryKey: queryKeys.detailInfoById(letterId),
  queryFn: () => getLetterDetailInfo(letterId),
  staleTime: inMillis().minutes(30).value(),
  cacheTime: inMillis().minutes(30).value(),
});
