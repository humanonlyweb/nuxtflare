import type { MaybeRefOrGetter } from "vue";

export interface FieldSource {
  id: MaybeRefOrGetter<string | undefined>;
  hint: MaybeRefOrGetter<string | undefined>;
  error: MaybeRefOrGetter<string | boolean | undefined>;
}

export function useField(source: FieldSource) {
  const uid = useId();
  const id = computed(() => toValue(source.id) ?? uid);
  const hintId = computed(() => `${id.value}-hint`);
  const errorId = computed(() => `${id.value}-error`);

  const isError = computed(() => Boolean(toValue(source.error)));
  const errorMessage = computed(() => {
    const error = toValue(source.error);
    return typeof error === "string" ? error : undefined;
  });

  const describedBy = computed(() => {
    if (errorMessage.value) return errorId.value;
    if (toValue(source.hint)) return hintId.value;
    return undefined;
  });

  return { id, hintId, errorId, isError, errorMessage, describedBy };
}
