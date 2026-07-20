<script setup lang="ts">
const { items, dismiss } = useToast();
</script>

<template>
  <Teleport to="body">
    <TransitionGroup tag="div" data-part="toast-viewport" name="ui-toast">
      <UiToastItem v-for="toast in items" :key="toast.id" :toast="toast" @dismiss="dismiss">
        <template #icon><slot name="icon" /></template>
        <template #close-icon><slot name="close-icon" /></template>
      </UiToastItem>
    </TransitionGroup>
  </Teleport>
</template>

<style scoped>
[data-part="toast-viewport"] {
  position: fixed;
  inset-block-end: 20px;
  inset-inline-end: 20px;
  z-index: 60;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
}

[data-part="toast-viewport"] > * {
  pointer-events: auto;
}

.ui-toast-enter-active {
  transition:
    opacity 260ms var(--ease-out),
    transform 260ms var(--ease-out);
}

.ui-toast-leave-active {
  position: absolute;
  right: 0;
  transition:
    opacity 160ms var(--ease-out),
    transform 160ms var(--ease-out);
}

.ui-toast-enter-from {
  opacity: 0;
  transform: translateY(16px) scale(0.96);
}

.ui-toast-leave-to {
  opacity: 0;
  transform: translateX(24px) scale(0.98);
}

.ui-toast-move {
  transition: transform 260ms var(--ease-out);
}

@media (prefers-reduced-motion: reduce) {
  .ui-toast-enter-active,
  .ui-toast-leave-active,
  .ui-toast-move {
    transition:
      opacity 200ms ease,
      transform 0ms;
  }

  .ui-toast-enter-from,
  .ui-toast-leave-to {
    transform: none;
  }
}
</style>
