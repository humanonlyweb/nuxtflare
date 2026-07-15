import { createError } from "evlog";

export const Errors = {
  badRequest: (message: string) => createError({ status: 400, message }),
  validation: (message: string, data?: { errors: Record<string, string> }) =>
    createError({ status: 400, message, internal: data }),
  unauthorized: (message = "Unauthorized") => createError({ status: 401, message }),
  forbidden: (message = "Forbidden") => createError({ status: 403, message }),
  notFound: (resource: string) => createError({ status: 404, message: `${resource} not found` }),
  conflict: (message: string) => createError({ status: 409, message }),
  internal: (message = "Something went wrong") => createError({ status: 500, message }),
};
