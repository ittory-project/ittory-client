import { inMillis } from '../../utils';
import { getCoverTypes } from '../service/CoverService';

const queryKeyNamespaces = {
  cover: 'cover',
};

export const queryKeys = {
  allTypes: () => [queryKeyNamespaces.cover, 'types'],
};

export const allTypesQuery = () => ({
  queryKey: queryKeys.allTypes(),
  queryFn: () => getCoverTypes(),
  staleTime: inMillis().hours(1).value(),
  cacheTime: inMillis().hours(1).value(),
});
