<script setup lang="ts">
const {
  title,
  description,
  size = "md",
  dismissible = true,
  closeOnBackdrop = true,
  showCloseButton = true,
} = defineProps<{
  title?: string;
  description?: string;
  dismissible?: boolean;
  size?: "sm" | "md" | "lg";
  closeOnBackdrop?: boolean;
  showCloseButton?: boolean;
}>();

const emit = defineEmits<{ close: [] }>();

const open = defineModel<boolean>("open", { default: false });

const dialogRef = useTemplateRef("dialogRef");
const panelRef = useTemplateRef("panelRef");
const titleId = useId();
const descId = useId();

onClickOutside(panelRef, () => {
  if (closeOnBackdrop && dialogRef.value?.open) close();
});

// Lazy-mount the body: dialogs render closed on page load, and their slot can
// be an entire form. Mount it on first open (not v-if="open" — that would
// unmount mid-close-animation) and keep it after, so reopening is instant.
const everOpened = ref(open.value);

watch(open, (isOpen) => {
  if (isOpen) everOpened.value = true;
  const el = dialogRef.value;
  if (!el) return;
  if (isOpen && !el.open) el.showModal();
  else if (!isOpen && el.open) el.close();
});

onMounted(() => {
  if (open.value) dialogRef.value?.showModal();
});

onBeforeUnmount(() => {
  if (dialogRef.value?.open) dialogRef.value.close();
});

function close() {
  if (dismissible) open.value = false;
}

function onClose() {
  if (open.value) open.value = false;
  emit("close");
}

function onCancel(event: Event) {
  if (!dismissible) event.preventDefault();
}
</script>

<template>
  <dialog
    ref="dialogRef"
    data-part="dialog"
    :data-dialog-size="size"
    :aria-labelledby="title ? titleId : undefined"
    :aria-describedby="description ? descId : undefined"
    @close="onClose"
    @cancel="onCancel"
  >
    <div ref="panelRef" data-part="panel">
      <header v-if="title || $slots.header" data-part="header">
        <slot name="header">
          <div data-part="header-text">
            <h2 :id="titleId" data-part="title">{{ title }}</h2>
            <p v-if="description" :id="descId" data-part="description">{{ description }}</p>
          </div>
        </slot>

        <button
          v-if="showCloseButton"
          type="button"
          data-part="close"
          aria-label="Close"
          @click="close"
        >
          <slot name="close-icon">✕</slot>
        </button>
      </header>

      <div v-if="everOpened" data-part="body">
        <slot :close="close" />
      </div>

      <footer v-if="$slots.footer" data-part="footer">
        <slot name="footer" :close="close" />
      </footer>
    </div>
  </dialog>
</template>

<style scoped>
/* Motion + open/close display only. Style the dialog surface, panel, header,
   body and footer parts (background, size, padding, radius…) in your own CSS. */
[data-part="dialog"] {
  display: none;
  /* Restore the UA centering that the global `* { margin: 0 }` reset strips. */
  margin: auto;
  opacity: 0;
  transform: scale(0.96);
  transform-origin: center;
  transition:
    opacity 150ms var(--ease-out),
    transform 150ms var(--ease-out),
    overlay 150ms var(--ease-out) allow-discrete,
    display 150ms var(--ease-out) allow-discrete;
}

[data-part="dialog"][open] {
  display: flex;
  flex-direction: column;
  opacity: 1;
  transform: scale(1);
  transition:
    opacity 200ms var(--ease-out),
    transform 200ms var(--ease-out),
    overlay 200ms var(--ease-out) allow-discrete,
    display 200ms var(--ease-out) allow-discrete;
}

@starting-style {
  [data-part="dialog"][open] {
    opacity: 0;
    transform: scale(0.96);
  }
}

[data-part="dialog"]::backdrop {
  opacity: 0;
  transition:
    opacity 150ms var(--ease-out),
    overlay 150ms var(--ease-out) allow-discrete,
    display 150ms var(--ease-out) allow-discrete;
}

[data-part="dialog"][open]::backdrop {
  opacity: 1;
  transition:
    opacity 200ms var(--ease-out),
    overlay 200ms var(--ease-out) allow-discrete,
    display 200ms var(--ease-out) allow-discrete;
}

@starting-style {
  [data-part="dialog"][open]::backdrop {
    opacity: 0;
  }
}

[data-part="panel"] {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

@media (prefers-reduced-motion: reduce) {
  [data-part="dialog"],
  [data-part="dialog"][open] {
    transform: none;
  }

  @starting-style {
    [data-part="dialog"][open] {
      transform: none;
    }
  }
}
</style>
