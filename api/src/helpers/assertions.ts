export function assertNotUndefined<T>(
  value: T | undefined,
  message?: string,
): asserts value is T {
  assert(value !== undefined, message ?? 'Unexpected "undefined" value');
}

export function assert(
  condition: boolean,
  message?: string,
): asserts condition {
  if (!condition) {
    const err = new Error(
      'Assertion failed. ' + (message ?? 'Unexpected false condition'),
    );

    throw err;
  }
}
