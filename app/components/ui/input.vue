<script setup lang="ts">
defineOptions({ inheritAttrs: false });

const {
  label,
  hint,
  error,
  prefix,
  suffix,
  optional = false,
  disabled = false,
  type = "text",
  size = "medium",
  formatter,
  id: idProp,
} = defineProps<{
  label?: string;
  hint?: string;
  error?: string | boolean;
  prefix?: string;
  suffix?: string;
  optional?: boolean;
  disabled?: boolean;
  type?: "text" | "email" | "search" | "url" | "tel" | "password" | "number" | "date";
  size?: "small" | "medium";
  formatter?: (value: string) => string;
  id?: string;
}>();

const model = defineModel<string | number>();

function reformat() {
  if (formatter && typeof model.value === "string") model.value = formatter(model.value);
}
function onBlur() {
  reformat();
}
function onPaste() {
  if (formatter) void nextTick(reformat);
}

const { id, hintId, errorId, isError, errorMessage, describedBy } = useField({
  error: () => error,
  hint: () => hint,
  id: () => idProp,
});

const inputRef = useTemplateRef("input");
defineExpose({ focus: () => inputRef.value?.focus() });
</script>

<template>
  <div data-part="field" :data-field-size="size" :data-field-error="isError || undefined">
    <label v-if="label" :for="id" data-part="field-label">
      {{ label }}<span v-if="optional" data-part="field-optional"> (optional)</span>
    </label>

    <div data-part="input-control">
      <span v-if="prefix" aria-hidden="true" data-part="input-prefix">{{ prefix }}</span>
      <input
        :id="id"
        ref="input"
        v-model="model"
        spellcheck="false"
        autocomplete="off"
        v-bind="$attrs"
        :type="type"
        :disabled="disabled"
        :aria-invalid="isError || undefined"
        :aria-describedby="describedBy"
        data-part="input"
        :data-input-has-prefix="prefix ? '' : undefined"
        :data-input-has-suffix="suffix ? '' : undefined"
        :data-input-error="isError || undefined"
        @blur="onBlur"
        @paste="onPaste"
      />
      <span v-if="suffix" aria-hidden="true" data-part="input-suffix">{{ suffix }}</span>
    </div>

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
