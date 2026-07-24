import { createError, EvlogError } from "evlog";

import { VALIDATION_ERROR_CODE, type FieldErrors } from "#shared/utils/api-error";

class FieldError extends EvlogError {
  readonly fields?: FieldErrors;

  constructor(options: ConstructorParameters<typeof EvlogError>[0] & { fields?: FieldErrors }) {
    super(options);
    this.fields = typeof options === "string" ? undefined : options.fields;
  }

  override get data() {
    const base = super.data;
    if (!base && !this.fields) return undefined;

    return { ...base, ...(this.fields && { fields: this.fields }) };
  }
}

export const Errors = {
  badRequest: (message: string) => createError({ status: 400, code: "BAD_REQUEST", message }),
  validation: (message: string, fields?: FieldErrors) =>
    new FieldError({ status: 400, code: VALIDATION_ERROR_CODE, message, fields }),
  unauthorized: (message = "Unauthorized") =>
    createError({ status: 401, code: "UNAUTHORIZED", message }),
  forbidden: (message = "Forbidden") => createError({ status: 403, code: "FORBIDDEN", message }),
  notFound: (resource: string) =>
    createError({ status: 404, code: "NOT_FOUND", message: `${resource} not found` }),
  conflict: (message: string, fields?: FieldErrors) =>
    new FieldError({ status: 409, code: "CONFLICT", message, fields }),
  tooLarge: (message: string, fields?: FieldErrors) =>
    new FieldError({ status: 413, code: "PAYLOAD_TOO_LARGE", message, fields }),
  tooManyRequests: (message = "Too many requests — try again shortly.") =>
    createError({ status: 429, code: "TOO_MANY_REQUESTS", message }),
  internal: (message = "Something went wrong") =>
    createError({ status: 500, code: "INTERNAL_ERROR", message }),
};
