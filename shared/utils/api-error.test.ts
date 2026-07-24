import { describe, expect, it } from "bun:test";

import { fieldErrorsFrom, isValidationError, VALIDATION_ERROR_CODE } from "./api-error";

const ofetchError = (body: unknown) =>
  Object.assign(new Error("Validation failed"), { data: body });

describe("fieldErrorsFrom", () => {
  it("unwraps the ofetch → Nitro → handler nesting", () => {
    const error = ofetchError({
      data: { code: VALIDATION_ERROR_CODE, fields: { title: "Title is required" } },
    });

    expect(fieldErrorsFrom(error)).toEqual({ title: "Title is required" });
  });

  it("accepts fields one level up, as Nitro serializes them directly", () => {
    const error = ofetchError({ fields: { "address.city": "Unknown city" } });

    expect(fieldErrorsFrom(error)).toEqual({ "address.city": "Unknown city" });
  });

  it("drops non-string messages rather than rendering [object Object]", () => {
    const error = ofetchError({ data: { fields: { a: "bad", b: { nested: true }, c: 42 } } });

    expect(fieldErrorsFrom(error)).toEqual({ a: "bad" });
  });

  it("returns undefined when there is nothing usable", () => {
    expect(fieldErrorsFrom(new Error("boom"))).toBeUndefined();
    expect(fieldErrorsFrom(ofetchError({ data: { fields: {} } }))).toBeUndefined();
    expect(fieldErrorsFrom(ofetchError({ data: { fields: { a: 1 } } }))).toBeUndefined();
    expect(fieldErrorsFrom(undefined)).toBeUndefined();
    expect(fieldErrorsFrom("nope")).toBeUndefined();
  });
});

describe("isValidationError", () => {
  it("matches on the shared code", () => {
    expect(isValidationError(ofetchError({ data: { code: VALIDATION_ERROR_CODE } }))).toBe(true);
    expect(isValidationError(ofetchError({ data: { code: "SOMETHING_ELSE" } }))).toBe(false);
    expect(isValidationError(new Error("boom"))).toBe(false);
  });
});
