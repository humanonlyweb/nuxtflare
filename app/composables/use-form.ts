import { dequal } from "dequal";
import { klona } from "klona";
import type { Ref } from "vue";
import type { z, ZodType } from "zod";

import { fieldErrorsFrom, type FieldErrors as ServerFieldErrors } from "#shared/utils/api-error";

export type FormValues = Record<string, unknown>;
type FieldErrors<T> = Partial<Record<keyof T, string>>;

export interface UseFormOptions<Schema extends ZodType<FormValues, FormValues>> {
  onSubmit: (values: z.output<Schema>) => void | Promise<void>;
  onError?: (error: unknown) => void;
  formRef?: Readonly<Ref<HTMLElement | null>>;
  validateOn?: "blur" | "input" | "submit";
  initialValues: z.input<Schema>;
  validationSchema: Schema;
}

const clone = <T extends FormValues>(values: T): T => klona(toRaw(values));

export function useForm<Schema extends ZodType<FormValues, FormValues>>({
  validateOn = "blur",
  validationSchema,
  initialValues,
  onSubmit,
  onError,
  formRef,
}: UseFormOptions<Schema>) {
  type Values = z.input<Schema>;

  const baseline = shallowRef<Values>(clone(initialValues));
  const form = reactive(clone(initialValues));
  const touched = reactive(new Set<string>());
  const serverErrors = ref<ServerFieldErrors>({});
  const processing = ref(false);
  const submitted = ref(false);

  const validationErrors = computed(() => {
    const result = validationSchema.safeParse(form);

    if (result.success) return { byField: {}, byPath: {} };

    const byField: Record<string, string> = {};
    const byPath: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0];
      if (typeof key !== "string") continue;
      if (!(key in byField)) byField[key] = issue.message;

      const path = issue.path.join(".");
      if (!(path in byPath)) byPath[path] = issue.message;
    }
    return { byField, byPath };
  });
  const fieldErrors = computed<Record<string, string>>(() => validationErrors.value.byField);

  const errors = computed<FieldErrors<Values>>(() => {
    const visible: Record<string, string> = {};
    for (const [key, message] of Object.entries(fieldErrors.value)) {
      if (submitted.value || touched.has(key)) visible[key] = message;
    }
    // Zod issue paths are strings, and always name a real field of the schema.
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    return { ...visible, ...serverErrors.value } as FieldErrors<Values>;
  });

  const isValid = computed(() => Object.keys(fieldErrors.value).length === 0);
  const isDirty = computed(() => !dequal(klona(form), baseline.value));
  const shouldDisableSubmit = computed(() => processing.value);

  function fieldNameOf(event: Event): string | undefined {
    const target = event.target;
    const isControl =
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement;

    return isControl && target.name && target.name in form ? target.name : undefined;
  }

  function clearServerError(field: string) {
    if (!(field in serverErrors.value)) return;
    const { [field]: _removed, ...rest } = serverErrors.value;
    serverErrors.value = rest;
  }

  if (formRef) {
    useEventListener(formRef, "input", (event: Event) => {
      const field = fieldNameOf(event);
      if (!field) return;
      clearServerError(field);
      if (validateOn === "input") touched.add(field);
    });

    if (validateOn === "blur") {
      useEventListener(formRef, "focusout", (event: Event) => {
        const field = fieldNameOf(event);
        if (field) touched.add(field);
      });
    }
  }

  async function focusFirstError() {
    await nextTick();
    formRef?.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }

  function setErrors(fields: ServerFieldErrors) {
    serverErrors.value = { ...fields };
    submitted.value = true;
  }

  function validateField(field: keyof Values) {
    touched.add(String(field));
  }

  function errorAt(...path: Array<string | number>): string | undefined {
    const field = path[0];
    if (typeof field !== "string" || (!submitted.value && !touched.has(field))) return undefined;
    return validationErrors.value.byPath[path.join(".")];
  }

  function setValues(values: Partial<Values>) {
    Object.assign(form, values);
    baseline.value = clone(form);
    touched.clear();
    serverErrors.value = {};
    submitted.value = false;
  }

  function reset() {
    Object.assign(form, clone(baseline.value));
    touched.clear();
    serverErrors.value = {};
    submitted.value = false;
    processing.value = false;
  }

  async function submit(event?: Event) {
    event?.preventDefault();
    submitted.value = true;
    serverErrors.value = {};

    if (!isValid.value) {
      await focusFirstError();
      return;
    }

    processing.value = true;

    try {
      await onSubmit(validationSchema.parse(form));
    } catch (error) {
      const fields = fieldErrorsFrom(error);
      if (fields) {
        setErrors(fields);
        await focusFirstError();
      }

      if (onError) onError(error);
      else if (!fields) throw error;
    } finally {
      processing.value = false;
    }
  }

  return {
    form,
    errors,
    processing,
    shouldDisableSubmit,
    validateField,
    errorAt,
    setErrors,
    setValues,
    isValid,
    isDirty,
    submit,
    reset,
  };
}
