<script setup lang="ts">
defineOptions({ inheritAttrs: false });

const {
  label,
  hint,
  error,
  optional = false,
  disabled = false,
  rows = 4,
  id: idProp,
} = defineProps<{
  label?: string;
  hint?: string;
  error?: string | boolean;
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
      :aria-invalid="isError || undefined"
      :aria-describedby="describedBy"
      data-part="textarea"
      :data-textarea-error="isError || undefined"
    />

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
      <p v-else-if="hint" :id="hintId" key="hint" data-part="field-message" data-field-tone="hint">
        {{ hint }}
      </p>
    </Transition>
  </div>
</template>
