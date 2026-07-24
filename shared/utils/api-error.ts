import { parseError } from "evlog";

import { isRecord, prop } from "#shared/utils/guards";

export const VALIDATION_ERROR_CODE = "VALIDATION_FAILED";

export type FieldErrors = Record<string, string>;

export function fieldErrorsFrom(error: unknown): FieldErrors | undefined {
  const data = prop(error, "data");
  const fields = prop(prop(data, "data"), "fields") ?? prop(data, "fields");
  if (!isRecord(fields)) return undefined;

  const result: FieldErrors = {};
  for (const [key, message] of Object.entries(fields)) {
    if (typeof message === "string") result[key] = message;
  }

  return Object.keys(result).length > 0 ? result : undefined;
}

export const isValidationError = (error: unknown): boolean =>
  parseError(error).code === VALIDATION_ERROR_CODE;
