<script setup lang="ts">
defineOptions({ inheritAttrs: false });

const {
  label,
  hint,
  error,
  maxLength,
  optional = false,
  disabled = false,
  rows = 4,
  id: idProp,
} = defineProps<{
  hint?: string;
  label?: string;
  error?: string | boolean;
  maxLength?: number;
  optional?: boolean;
  disabled?: boolean;
  rows?: number;
  id?: string;
}>();

const model = defineModel<string>();

const { id, hintId, errorId, isError, errorMessage, describedBy } = useField({
  id: () => idProp,
  hint: () => hint,
  error: () => error,
});

const countId = computed(() => `${id.value}-count`);
const length = computed(() => model.value?.length ?? 0);
const isExceeded = computed(() => maxLength != null && length.value > maxLength);
const describedByAll = computed(() => {
  const ids = [describedBy.value, maxLength == null ? undefined : countId.value].filter(Boolean);
  return ids.length ? ids.join(" ") : undefined;
});

const textareaRef = useTemplateRef("textarea");
defineExpose({ focus: () => textareaRef.value?.focus() });
</script>

<template>
  <div data-part="field" :data-field-error="isError || undefined">
    <label v-if="label" :for="id" data-part="field-label">
      {{ label }}<span v-if="optional" data-part="field-optional"> (optional)</span>
    </label>

    <textarea
      :id="id"
      ref="textarea"
      v-model="model"
      :rows="rows"
      v-bind="$attrs"
      :disabled="disabled"
      :maxlength="maxLength"
      :aria-invalid="isError || isExceeded || undefined"
      :aria-describedby="describedByAll"
      data-part="textarea"
      :data-textarea-error="isError || undefined"
    />

    <div v-if="errorMessage || hint || maxLength != null" data-part="field-footer">
      <Transition name="field-message" mode="out-in">
        <p
          v-if="errorMessage"
          :id="errorId"
          key="error"
          role="alert"
          data-part="field-message"
          data-field-tone="error"
        >
          {{ errorMessage }}
        </p>
        <p
          v-else-if="hint"
          :id="hintId"
          key="hint"
          data-part="field-message"
          data-field-tone="hint"
        >
          {{ hint }}
        </p>
      </Transition>

      <!-- The visible "42/140" would be announced as "42 slash 140"; the label is
           what the field's description actually resolves to. -->
      <span
        v-if="maxLength != null"
        :id="countId"
        data-part="field-count"
        :data-field-count-exceeded="isExceeded || undefined"
        :aria-label="`${length} of ${maxLength} characters`"
      >
        {{ length }}/{{ maxLength }}
      </span>
    </div>
  </div>
</template>
