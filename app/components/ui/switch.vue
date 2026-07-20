<script setup lang="ts">
const {
  disabled = false,
  label,
  size = "medium",
} = defineProps<{
  disabled?: boolean;
  label?: string;
  size?: "small" | "medium";
}>();

const model = defineModel<boolean>({ default: false });
</script>

<template>
  <button
    type="button"
    role="switch"
    data-part="switch"
    :aria-checked="model"
    :disabled="disabled"
    :data-switch-size="size"
    :data-switch-checked="model || undefined"
    @click="model = !model"
  >
    <span data-part="track" aria-hidden="true">
      <span data-part="thumb" />
    </span>
    <span v-if="$slots.default || label" data-part="switch-label">
      <slot>{{ label }}</slot>
    </span>
  </button>
</template>

<style scoped>
[data-part="thumb"] {
  transition: transform 150ms var(--ease-out);
}

@media (prefers-reduced-motion: reduce) {
  [data-part="thumb"] {
    transition: none;
  }
}
</style>
