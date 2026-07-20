<script setup lang="ts">
const {
  value,
  title,
  disabled = false,
  level = 3,
} = defineProps<{
  value: string;
  title?: string;
  disabled?: boolean;
  level?: 2 | 3 | 4 | 5 | 6;
}>();

defineSlots<{
  default(): unknown;
  title(props: { open: boolean }): unknown;
  indicator(props: { open: boolean }): unknown;
}>();

const { isOpen, isLocked, toggle } = useAccordionItem();
const open = computed(() => isOpen(value));
const locked = computed(() => isLocked(value));

const uid = useId();
const triggerId = `${uid}-trigger`;
const panelId = `${uid}-panel`;
</script>

<template>
  <div data-part="accordion-item" :data-accordion-open="open || undefined">
    <component :is="`h${level}`" data-part="accordion-heading">
      <button
        :id="triggerId"
        type="button"
        data-part="accordion-trigger"
        :aria-expanded="open"
        :aria-controls="panelId"
        :aria-disabled="locked || undefined"
        :disabled="disabled"
        :data-accordion-open="open || undefined"
        @click="toggle(value)"
      >
        <span data-part="accordion-title">
          <slot name="title" :open="open">{{ title }}</slot>
        </span>
        <span data-part="accordion-indicator" aria-hidden="true">
          <slot name="indicator" :open="open" />
        </span>
      </button>
    </component>

    <div
      :id="panelId"
      role="region"
      :aria-labelledby="triggerId"
      data-part="accordion-panel"
      :data-accordion-open="open || undefined"
      :inert="!open || undefined"
    >
      <div data-part="accordion-clip">
        <div data-part="accordion-content">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 0fr → 1fr animates to the content's natural height without measuring it in JS.
   Collapsing is quicker than expanding — the user already knows what's leaving. */
[data-part="accordion-panel"] {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 160ms var(--ease-out);
}

[data-part="accordion-panel"][data-accordion-open] {
  grid-template-rows: 1fr;
  transition-duration: 220ms;
}

/* The grid item is kept padding-free on purpose: padding on a grid item counts
   toward the track's base size, so a padded item never collapses to 0fr. Consumer
   padding goes on `accordion-content` inside it. */
[data-part="accordion-clip"] {
  min-height: 0;
  overflow: hidden;
}

[data-accordion-open] > [data-part="accordion-clip"] {
  overflow: visible;
  transition: overflow 1ms 219ms allow-discrete;
}

[data-part="accordion-content"] {
  opacity: 0;
  transition: opacity 120ms var(--ease-out);
}

[data-part="accordion-panel"][data-accordion-open] [data-part="accordion-content"] {
  opacity: 1;
  transition-delay: 60ms;
}

@media (prefers-reduced-motion: reduce) {
  [data-part="accordion-panel"],
  [data-part="accordion-panel"][data-accordion-open] {
    transition: none;
  }
}
</style>
