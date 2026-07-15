import { klona } from "klona";
import type { Ref } from "vue";
import type { z, ZodType } from "zod";

export type FormValues = Record<string, unknown>;
type FieldErrors<T> = Partial<Record<keyof T, string>>;

export interface UseFormOptions<Schema extends ZodType<FormValues, FormValues>> {
  onSubmit: (values: z.output<Schema>) => void | Promise<void>;
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
  formRef,
}: UseFormOptions<Schema>) {
  type Values = z.input<Schema>;

  const baseline = shallowRef<Values>(clone(initialValues));
  const form = reactive(clone(initialValues));
  const touched = reactive(new Set<string>());
  const processing = ref(false);
  const submitted = ref(false);

  const fieldErrors = computed<Record<string, string>>(() => {
    const result = validationSchema.safeParse(form);

    if (result.success) return {};

    const next: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !(key in next)) next[key] = issue.message;
    }
    return next;
  });

  const errors = computed<FieldErrors<Values>>(() => {
    const visible: Record<string, string> = {};
    for (const [key, message] of Object.entries(fieldErrors.value)) {
      if (submitted.value || touched.has(key)) visible[key] = message;
    }
    // Zod issue paths are strings, and always name a real field of the schema.
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    return visible as FieldErrors<Values>;
  });

  const isValid = computed(() => Object.keys(fieldErrors.value).length === 0);
  const isDirty = computed(() => JSON.stringify(form) !== JSON.stringify(baseline.value));
  const shouldDisableSubmit = computed(() => processing.value || !isValid.value);

  function validateField(field: keyof Values) {
    touched.add(String(field));
  }

  function onFieldEvent(event: Event) {
    const target = event.target;
    if (
      (target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement) &&
      target.name &&
      target.name in form
    ) {
      touched.add(target.name);
    }
  }

  if (formRef && validateOn !== "submit") {
    useEventListener(formRef, validateOn === "input" ? "input" : "focusout", onFieldEvent);
  }

  function setValues(values: Partial<Values>) {
    Object.assign(form, values);
    baseline.value = clone(form);
    touched.clear();
    submitted.value = false;
  }

  function reset() {
    Object.assign(form, clone(baseline.value));
    touched.clear();
    submitted.value = false;
    processing.value = false;
  }

  async function submit(event?: Event) {
    event?.preventDefault();
    submitted.value = true;

    if (!isValid.value) return;

    processing.value = true;

    try {
      await onSubmit(validationSchema.parse(form));
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
    setValues,
    isValid,
    isDirty,
    submit,
    reset,
  };
}
