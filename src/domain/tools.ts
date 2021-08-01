export async function asyncCatch<T>(fn: Thenable<T> | Promise<T>): Promise<[T, any]> {
  try {
    const data = await fn;
    return [data, null];
  } catch (error) {
    return [null as unknown as T, error];
  }
}

