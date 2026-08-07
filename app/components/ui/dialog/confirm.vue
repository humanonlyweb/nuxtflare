<script setup lang="ts">
const {
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  danger = false,
  dismissible = true,
  pending = false,
} = defineProps<{
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  dismissible?: boolean;
  pending?: boolean;
}>();

const emit = defineEmits<{
  confirm: [];
  cancel: [];
  close: [];
}>();

const open = defineModel<boolean>("open", {
  default: false,
});

function confirm() {
  if (pending) return;

  emit("confirm");
}

function cancel() {
  if (!dismissible || pending) return;

  open.value = false;
  emit("cancel");
}

function onClose() {
  emit("close");
}
</script>

<template>
  <UiDialog
    v-model:open="open"
    :title="title"
    :description="description"
    :dismissible="dismissible && !pending"
    @close="onClose"
  >
    <slot />

    <template #footer>
      <UiButton variant="ghost" :disabled="pending" @click="cancel">
        {{ cancelText }}
      </UiButton>

      <UiButton
        :variant="danger ? 'danger' : 'primary'"
        :loading="pending"
        :disabled="pending"
        :autofocus="!danger"
        @click="confirm"
      >
        {{ confirmText }}
      </UiButton>
    </template>
  </UiDialog>
</template>
