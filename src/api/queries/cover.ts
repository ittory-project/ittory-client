import { inMillis } from '../../utils';
import { getCoverTypes } from '../service/CoverService';
import { queryKeyNamespaces } from './_namespaces';

export const queryKeys = {
  all: () => [queryKeyNamespaces.cover, 'all'],
};

export const all = () => ({
  queryKey: queryKeys.all(),
  queryFn: () => getCoverTypes(),
  staleTime: inMillis().hours(1).value(),
  cacheTime: inMillis().hours(1).value(),
});
