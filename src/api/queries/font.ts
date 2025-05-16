import { inMillis } from '../../utils';
import { getAllFont, getFontById } from '../service/FontService';

const queryKeyNamespaces = {
  font: 'font',
};

export const queryKeys = {
  allFonts: () => [queryKeyNamespaces.font],
  fontById: (fontId: number) => [queryKeyNamespaces.font, fontId],
};

export const allFontsQuery = () => ({
  queryKey: queryKeys.allFonts(),
  queryFn: () => getAllFont(),
  staleTime: inMillis().hours(1).value(),
  cacheTime: inMillis().hours(1).value(),
});

export const fontByIdQuery = (fontId: number) => ({
  queryKey: queryKeys.fontById(fontId),
  queryFn: () => getFontById(fontId),
  staleTime: inMillis().hours(1).value(),
  cacheTime: inMillis().hours(1).value(),
});
