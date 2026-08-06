<script setup lang="ts" generic="T extends string | number">
import type { SelectOption } from "~/types/components.type";

const {
  options = [],
  label,
  size = "medium",
  iconOnly = false,
  disabled = false,
} = defineProps<{
  options?: SelectOption<T>[];
  size?: "small" | "medium";
  iconOnly?: boolean;
  disabled?: boolean;
  label?: string;
}>();

const model = defineModel<T>();

defineSlots<{ option(props: { option: SelectOption<T>; checked: boolean }): unknown }>();

const root = useTemplateRef("root");
const segments = useTemplateRef("segments");

const { isTabStop, select, onKeydown } = useRovingSelection({
  items: () => options,
  elements: () => segments.value ?? undefined,
  disabled: () => disabled,
  model,
});

const { style, isMeasured, canAnimate } = useSlideIndicator({
  container: root,
  items: () => segments.value ?? undefined,
  activeIndex: () => options.findIndex((option) => option.value === model.value),
});
</script>

<template>
  <div
    ref="root"
    role="radiogroup"
    data-part="segmented"
    :data-segmented-size="size"
    :data-segmented-icon-only="iconOnly || undefined"
    :data-segmented-sliding="isMeasured || undefined"
    :data-segmented-animate="canAnimate || undefined"
    :aria-label="label"
    :aria-disabled="disabled || undefined"
    @keydown="onKeydown"
  >
    <!-- Falls back to a per-segment fill until measured, so the selection is
         still visible before hydration. -->
    <span v-show="isMeasured" data-part="segmented-indicator" :style="style" aria-hidden="true" />

    <button
      v-for="(option, i) in options"
      ref="segments"
      :key="option.value"
      type="button"
      role="radio"
      data-part="segment"
      :aria-checked="option.value === model"
      :aria-label="iconOnly ? option.label : undefined"
      :tabindex="isTabStop(option, i) ? 0 : -1"
      :disabled="disabled || option.disabled"
      :data-segment-checked="option.value === model || undefined"
      @click="select(option)"
    >
      <slot name="option" :option="option" :checked="option.value === model">
        {{ iconOnly ? "" : option.label }}
      </slot>
    </button>
  </div>
</template>
