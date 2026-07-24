export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const prop = (value: unknown, key: string): unknown =>
  isRecord(value) ? value[key] : undefined;
