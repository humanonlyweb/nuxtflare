<script setup lang="ts">
import type { SelectValue } from "~/types/components.type";

defineOptions({ inheritAttrs: false });

const {
  label,
  disabled = false,
  indeterminate = false,
  value,
  id: idProp,
} = defineProps<{
  label?: string;
  disabled?: boolean;
  indeterminate?: boolean;
  value?: SelectValue;
  id?: string;
}>();

// Boolean for a single checkbox, or an array for a checkbox group (native
// `v-model` on a checkbox adds/removes `value` from the array automatically).
const model = defineModel<boolean | SelectValue[]>();

defineSlots<{ default(): unknown; indicator(): unknown }>();

const uid = useId();
const id = computed(() => idProp ?? uid);

const inputRef = useTemplateRef<HTMLInputElement>("input");
// `indeterminate` is a DOM property, not an attribute — reflect the prop onto the
// element whenever either changes.
watchEffect(() => {
  if (inputRef.value) inputRef.value.indeterminate = indeterminate;
});
</script>

<template>
  <label data-part="checkbox" :data-checkbox-disabled="disabled || undefined">
    <input
      :id="id"
      ref="input"
      v-model="model"
      type="checkbox"
      data-part="checkbox-input"
      :value="value"
      :disabled="disabled"
      v-bind="$attrs"
    />
    <span data-part="checkbox-control" aria-hidden="true"><slot name="indicator" /></span>
    <span v-if="$slots.default || label" data-part="checkbox-label"
      ><slot>{{ label }}</slot></span
    >
  </label>
</template>
