<script setup lang="ts">
const { toast, duration = 4500 } = defineProps<{ toast: Toast; duration?: number }>();
const emit = defineEmits<{ dismiss: [id: number] }>();

const { start, stop } = useTimeoutFn(
  () => emit("dismiss", toast.id),
  () => duration,
);

const visibility = useDocumentVisibility();
watch(visibility, (state) => (state === "hidden" ? stop() : start()));

const role = computed(() => (toast.tone === "danger" ? "alert" : "status"));
</script>

<template>
  <div
    data-part="toast"
    :data-toast-tone="toast.tone"
    :role="role"
    @pointerenter="stop"
    @pointerleave="start"
  >
    <span
      v-if="$slots.icon"
      data-part="toast-icon"
      :data-toast-tone="toast.tone"
      aria-hidden="true"
    >
      <slot name="icon" />
    </span>
    <p data-part="toast-message">{{ toast.message }}</p>
    <button
      type="button"
      data-part="toast-close"
      aria-label="Dismiss"
      @click="emit('dismiss', toast.id)"
    >
      <slot name="close-icon">✕</slot>
    </button>
  </div>
</template>
