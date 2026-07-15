<script setup lang="ts">
const {
  variant = "primary",
  type = "button",
  loading = false,
  disabled = false,
} = defineProps<{
  variant?: "primary" | "ghost" | "danger";
  type?: "button" | "submit" | "reset";
  loading?: boolean;
  disabled?: boolean;
}>();
</script>

<template>
  <button
    :class="$style.button"
    :type="type"
    :data-variant="variant"
    :disabled="disabled || loading"
    :aria-busy="loading"
  >
    <slot />
  </button>
</template>

<style module>
.button {
  --_bg: var(--accent);
  --_fg: var(--accent-contrast);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5ch;
  padding: 0.6rem 1rem;
  font: inherit;
  font-weight: 600;
  line-height: 1;
  color: var(--_fg);
  background: var(--_bg);
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
  user-select: none;
  transition:
    transform 0.12s ease,
    background-color 0.12s ease,
    opacity 0.12s ease;
}

.button[data-variant="ghost"] {
  --_bg: transparent;
  --_fg: var(--text);
  border-color: var(--border);
}

.button[data-variant="danger"] {
  --_bg: transparent;
  --_fg: var(--danger);
  border-color: color-mix(in oklch, var(--danger) 40%, transparent);
}

@media (hover: hover) {
  .button:hover:not(:disabled) {
    background: color-mix(in oklch, var(--_bg) 88%, black);
  }

  .button[data-variant="ghost"]:hover:not(:disabled),
  .button[data-variant="danger"]:hover:not(:disabled) {
    background: color-mix(in oklch, var(--_fg) 10%, transparent);
  }
}

.button:active:not(:disabled) {
  transform: scale(0.97);
}

.button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}
</style>
