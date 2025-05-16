import { inMillis } from '../../utils';
import { getAllFont, getFontById } from '../service/FontService';
import { queryKeyNamespaces } from './_namespaces';

export const queryKeys = {
  all: () => [queryKeyNamespaces.font, 'all'],
  byId: (fontId: number) => [queryKeyNamespaces.font, fontId],
};

export const all = () => ({
  queryKey: queryKeys.all(),
  queryFn: () => getAllFont(),
  staleTime: inMillis().hours(1).value(),
  cacheTime: inMillis().hours(1).value(),
});

export const byId = (fontId: number) => ({
  queryKey: queryKeys.byId(fontId),
  queryFn: () => getFontById(fontId),
  staleTime: inMillis().hours(1).value(),
  cacheTime: inMillis().hours(1).value(),
});
