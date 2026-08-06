<script setup lang="ts">
import type { ButtonSize, ButtonVariant } from "~/types/components.type";

const {
  menuLabel,
  triggerAttrs,
  expanded = false,
  variant = "secondary",
  size = "medium",
  shape = "rounded",
  disabled = false,
  actionDisabled = false,
  loading = false,
} = defineProps<{
  menuLabel: string;
  triggerAttrs?: Record<string, unknown>;
  expanded?: boolean;
  variant?: Extract<ButtonVariant, "primary" | "secondary" | "solid" | "ghost" | "danger">;
  size?: Extract<ButtonSize, "small" | "medium">;
  shape?: "rounded" | "pill";
  disabled?: boolean;
  actionDisabled?: boolean;
  loading?: boolean;
}>();

const emit = defineEmits<{ action: []; toggle: [] }>();

const slots = defineSlots<{
  default?: () => unknown;
  leading?: () => unknown;
}>();

const isSplit = computed(() => Boolean(slots.default));

const isOpen = computed(() =>
  triggerAttrs && "aria-expanded" in triggerAttrs
    ? triggerAttrs["aria-expanded"] === true || triggerAttrs["aria-expanded"] === "true"
    : expanded,
);

const chrome = computed(() => ({
  "data-part": "button",
  "data-button-variant": variant,
  "data-button-size": size,
  "data-button-disabled": disabled || undefined,
}));
</script>

<template>
  <div
    data-part="split-button"
    :data-split-shape="shape"
    :data-split-variant="variant"
    :data-split="isSplit || undefined"
  >
    <button
      v-if="isSplit"
      v-bind="chrome"
      type="button"
      data-split-part="action"
      :disabled="disabled || actionDisabled || loading"
      :aria-busy="loading || undefined"
      @click="emit('action')"
    >
      <slot name="leading" />
      <span v-if="loading" data-part="button-spinner" aria-hidden="true" />
      <span data-part="button-label"><slot /></span>
    </button>

    <button
      v-bind="{ ...chrome, ...triggerAttrs }"
      type="button"
      data-split-part="toggle"
      :disabled="disabled"
      :aria-label="menuLabel"
      @click="emit('toggle')"
    >
      <slot v-if="!isSplit" name="leading" />
      <UiIcon name="chevron-down" data-split-part="caret" :data-split-open="isOpen || undefined" />
    </button>
  </div>
</template>

<style scoped>
[data-part="split-button"] {
  display: inline-flex;
  align-items: stretch;
}

[data-part="split-button"][data-split] [data-split-part="action"] {
  border-start-end-radius: 0;
  border-end-end-radius: 0;
  border-inline-end: 0;
}

[data-part="split-button"][data-split] [data-split-part="toggle"] {
  border-start-start-radius: 0;
  border-end-start-radius: 0;
}

[data-part="split-button"][data-split-shape="pill"] [data-split-part="action"] {
  border-start-start-radius: var(--radius-pill);
  border-end-start-radius: var(--radius-pill);
}

[data-part="split-button"][data-split-shape="pill"] [data-split-part="toggle"] {
  border-start-end-radius: var(--radius-pill);
  border-end-end-radius: var(--radius-pill);
}

[data-part="split-button"]:not([data-split])[data-split-shape="pill"] [data-split-part="toggle"] {
  border-radius: var(--radius-pill);
}

[data-part="split-button"][data-split] [data-split-part="toggle"] {
  border-inline-start: 1px solid var(--split-seam, var(--color-hairline));
}

[data-part="split-button"]:is(
  [data-split-variant="primary"],
  [data-split-variant="solid"],
  [data-split-variant="danger"]
) {
  --split-seam: color-mix(in oklch, var(--color-surface) 28%, transparent);
}

[data-split-part]:focus-visible {
  position: relative;
  z-index: 1;
}

[data-split-part="caret"] {
  transition: transform var(--dur-base) var(--ease-out);
}

[data-split-part="caret"][data-split-open] {
  transform: rotate(180deg);
}

@media (prefers-reduced-motion: reduce) {
  [data-split-part="caret"] {
    transition: none;
  }
}
</style>
