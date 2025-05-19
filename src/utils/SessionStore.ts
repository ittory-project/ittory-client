const sesionStoredValues = ['loginRedirectUrl'] as const;

type StoreMethods<T extends readonly string[]> = {
  [K in T[number] as `get${Capitalize<K>}`]: () => string | null;
} & {
  [K in T[number] as `set${Capitalize<K>}`]: (_value: string) => void;
} & {
  [K in T[number] as `clear${Capitalize<K>}`]: () => void;
};

type SessionStoreType = StoreMethods<typeof sesionStoredValues>;

export const SessionStore = sesionStoredValues.reduce(
  (acc, field) => {
    const capitalized = field.charAt(0).toUpperCase() + field.slice(1);

    acc[`get${capitalized}`] = () => {
      return sessionStorage.getItem(field);
    };
    acc[`set${capitalized}`] = (value: string) => {
      sessionStorage.setItem(field, value);
    };
    acc[`clear${capitalized}`] = () => {
      sessionStorage.removeItem(field);
    };
    return acc;
  },
  {} as Record<string, unknown>,
) as SessionStoreType;
