export const filters = {
  isNotUndefined: <T>(value: T | undefined): value is T => value !== undefined,
};
