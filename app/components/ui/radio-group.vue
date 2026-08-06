<script setup lang="ts" generic="T extends string | number">
import type { SelectOption } from "~/types/components.type";

const {
  options = [],
  label,
  hint,
  error,
  disabled = false,
  orientation = "vertical",
  id: idProp,
} = defineProps<{
  options?: SelectOption<T>[];
  label?: string;
  hint?: string;
  error?: string | boolean;
  disabled?: boolean;
  orientation?: "vertical" | "horizontal";
  id?: string;
}>();

const model = defineModel<T>();

defineSlots<{ option(props: { option: SelectOption<T>; checked: boolean }): unknown }>();

const { id, hintId, errorId, isError, errorMessage, describedBy } = useField({
  id: () => idProp,
  hint: () => hint,
  error: () => error,
});
const labelId = computed(() => `${id.value}-label`);

const radios = useTemplateRef("radios");

const { isTabStop, select, onKeydown } = useRovingSelection({
  items: () => options,
  elements: () => radios.value ?? undefined,
  disabled: () => disabled,
  model,
});
</script>

<template>
  <div data-part="field" :data-field-error="isError || undefined">
    <span v-if="label" :id="labelId" data-part="field-label">{{ label }}</span>

    <div
      role="radiogroup"
      data-part="radio-group"
      :data-orientation="orientation"
      :aria-labelledby="label ? labelId : undefined"
      :aria-describedby="describedBy"
      :aria-invalid="isError || undefined"
      @keydown="onKeydown"
    >
      <button
        v-for="(opt, i) in options"
        ref="radios"
        :key="opt.value"
        type="button"
        role="radio"
        data-part="radio"
        :aria-checked="opt.value === model"
        :tabindex="isTabStop(opt, i) ? 0 : -1"
        :disabled="disabled || opt.disabled"
        :data-radio-checked="opt.value === model || undefined"
        @click="select(opt)"
      >
        <slot name="option" :option="opt" :checked="opt.value === model">
          <span data-part="radio-control" aria-hidden="true" />
          <span data-part="radio-label">{{ opt.label }}</span>
        </slot>
      </button>
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
