import { inMillis } from '../../utils';
import { getCoverTypes } from '../service/CoverService';
import { queryKeyNamespaces } from './_namespaces';

export const queryKeys = {
  allTypes: () => [queryKeyNamespaces.cover, 'types'],
};

export const allTypesQuery = () => ({
  queryKey: queryKeys.allTypes(),
  queryFn: () => getCoverTypes(),
  staleTime: inMillis().hours(1).value(),
  cacheTime: inMillis().hours(1).value(),
});
