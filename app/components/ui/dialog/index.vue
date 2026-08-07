<script setup lang="ts">
const {
  title,
  description,
  size = "md",
  flush = false,
  dismissible = true,
  closeOnBackdrop = true,
  showCloseButton = true,
} = defineProps<{
  title?: string;
  description?: string;
  dismissible?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  flush?: boolean;
  closeOnBackdrop?: boolean;
  showCloseButton?: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const open = defineModel<boolean>("open", {
  default: false,
});

const teleportReady = useTeleportReady();
const dialogRef = useTemplateRef("dialogRef");

const titleId = useId();
const descId = useId();

const hasOpened = ref(open.value);

watch(
  [open, teleportReady],
  async ([isOpen, ready]) => {
    if (!ready) return;

    if (isOpen) {
      hasOpened.value = true;
    }

    await nextTick();

    const dialog = dialogRef.value;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
      return;
    }

    if (!isOpen && dialog.open) {
      dialog.close();
    }
  },
  {
    immediate: true,
  },
);

onBeforeUnmount(() => {
  const dialog = dialogRef.value;

  if (dialog?.open) {
    dialog.close();
  }
});

function dismiss() {
  if (!dismissible) return;

  open.value = false;
}

function onDialogClick(event: MouseEvent) {
  if (!closeOnBackdrop) return;
  if (event.target === dialogRef.value) {
    dismiss();
  }
}

function onClose() {
  if (open.value) {
    open.value = false;
  }
  emit("close");
}

function onCancel(event: Event) {
  if (!dismissible) {
    event.preventDefault();
  }
}
</script>

<template>
  <Teleport v-if="teleportReady" to="body">
    <dialog
      ref="dialogRef"
      data-part="dialog"
      :data-dialog-size="size"
      :data-dialog-flush="flush || undefined"
      :aria-labelledby="title ? titleId : undefined"
      :aria-describedby="description ? descId : undefined"
      @click="onDialogClick"
      @close="onClose"
      @cancel="onCancel"
    >
      <div data-part="panel">
        <header v-if="title || $slots.header" data-part="header">
          <slot name="header">
            <div data-part="header-text">
              <h2 :id="titleId" data-part="title">
                {{ title }}
              </h2>

              <p v-if="description" :id="descId" data-part="description">
                {{ description }}
              </p>
            </div>
          </slot>

          <button
            v-if="showCloseButton"
            type="button"
            data-part="close"
            aria-label="Close"
            @click="dismiss"
          >
            <slot name="close-icon">
              <UiIcon name="x" />
            </slot>
          </button>
        </header>

        <div v-if="hasOpened" data-part="body">
          <slot :close="dismiss" />
        </div>

        <footer v-if="$slots.footer" data-part="footer">
          <slot name="footer" :close="dismiss" />
        </footer>
      </div>
    </dialog>
  </Teleport>
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
