import { getElementsByLetterId } from '../service/ElementService';

const queryKeyNamespaces = {
  letter: 'letter',
};

export const queryKeys = {
  elementsByLetterId: (letterId: number) => [
    queryKeyNamespaces.letter,
    letterId,
  ],
};

export const elementsByLetterIdQuery = (letterId: number) => ({
  queryKey: queryKeys.elementsByLetterId(letterId),
  queryFn: () => getElementsByLetterId(letterId),
});
