<script setup lang="ts">
import type { TooltipPlacement } from "~/types/components.type";

const { text, placement = "top" } = defineProps<{
  text?: string;
  placement?: TooltipPlacement;
}>();
</script>

<template>
  <div data-part="tooltip-root">
    <slot />
    <span
      v-if="text"
      data-part="tooltip"
      :data-tooltip-placement="placement"
      role="tooltip"
      aria-hidden="true"
    >
      {{ text }}
    </span>
  </div>
</template>

<style scoped>
/* Reveal behaviour, positioning and the pointer arrow only — no visual chrome.
   Style [data-part="tooltip"] (background, colour, padding, radius) yourself,
   and set --ui-tooltip-arrow to the tooltip's background so the arrow matches. */
[data-part="tooltip-root"] {
  position: relative;
  display: inline-flex;
}

[data-part="tooltip"] {
  position: absolute;
  left: 50%;
  z-index: 20;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition:
    opacity 140ms var(--ease-out),
    transform 140ms var(--ease-out);
}

[data-part="tooltip"]::after {
  content: "";
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
}

[data-part="tooltip"][data-tooltip-placement="top"] {
  bottom: calc(100% + 8px);
  transform: translateX(-50%) translateY(3px) scale(0.92);
  transform-origin: bottom center;
}

[data-part="tooltip"][data-tooltip-placement="top"]::after {
  top: 100%;
  border-top-color: var(--ui-tooltip-arrow, currentColor);
}

[data-part="tooltip"][data-tooltip-placement="bottom"] {
  top: calc(100% + 8px);
  transform: translateX(-50%) translateY(-3px) scale(0.92);
  transform-origin: top center;
}

[data-part="tooltip"][data-tooltip-placement="bottom"]::after {
  bottom: 100%;
  border-bottom-color: var(--ui-tooltip-arrow, currentColor);
}

[data-part="tooltip-root"]:focus-within [data-part="tooltip"] {
  opacity: 1;
  transform: translateX(-50%) translateY(0) scale(1);
  transition-delay: 250ms;
}

@media (hover: hover) and (pointer: fine) {
  [data-part="tooltip-root"]:hover [data-part="tooltip"] {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1);
    transition-delay: 250ms;
  }
}

@media (prefers-reduced-motion: reduce) {
  [data-part="tooltip"] {
    transition: opacity 140ms ease;
    transform: translateX(-50%);
  }
}
</style>
