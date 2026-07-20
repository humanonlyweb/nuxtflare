<script setup lang="ts">
const { multiple = false, collapsible = true } = defineProps<{
  multiple?: boolean;
  collapsible?: boolean;
}>();

const model = defineModel<string | string[]>();

const openValues = computed(() => {
  if (Array.isArray(model.value)) return model.value;
  return model.value == null ? [] : [model.value];
});

function toggle(value: string) {
  const isOpen = openValues.value.includes(value);
  if (multiple) {
    model.value = isOpen
      ? openValues.value.filter((v) => v !== value)
      : [...openValues.value, value];
    return;
  }
  if (isOpen && !collapsible) return;
  model.value = isOpen ? undefined : value;
}

provide(accordionKey, {
  isOpen: (value) => openValues.value.includes(value),
  isLocked: (value) => !multiple && !collapsible && openValues.value.includes(value),
  toggle,
});

const root = useTemplateRef<HTMLElement>("root");

// Arrow keys move between headers (APG). Delegating from the root beats a child
// registry: the DOM already holds the triggers in document order.
function onKeydown(event: KeyboardEvent) {
  const target = event.target as HTMLElement;
  if (target.dataset.part !== "accordion-trigger") return;

  const triggers = [
    ...(root.value?.querySelectorAll<HTMLButtonElement>('[data-part="accordion-trigger"]') ?? []),
  ].filter((trigger) => !trigger.disabled);
  const current = triggers.indexOf(target as HTMLButtonElement);
  if (current < 0) return;

  const last = triggers.length - 1;
  const next = {
    ArrowDown: current === last ? 0 : current + 1,
    ArrowUp: current === 0 ? last : current - 1,
    Home: 0,
    End: last,
  }[event.key];
  if (next === undefined) return;

  event.preventDefault();
  triggers[next]?.focus();
}
</script>

<template>
  <div ref="root" data-part="accordion" @keydown="onKeydown">
    <slot />
  </div>
</template>
