<script setup lang="ts">
const {
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  danger = false,
} = defineProps<{
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}>();

const open = defineModel<boolean>("open", { default: false });
const emit = defineEmits<{ confirm: []; cancel: [] }>();

let decided = false;

function confirm() {
  decided = true;
  emit("confirm");
  open.value = false;
}

function cancel() {
  decided = true;
  emit("cancel");
  open.value = false;
}

function onClose() {
  if (!decided) emit("cancel");
  decided = false;
}
</script>

<template>
  <UiDialog
    v-model:open="open"
    :title="title"
    :description="description"
    :close-on-backdrop="false"
    :show-close-button="false"
    @close="onClose"
  >
    <slot />

    <template #footer>
      <UiButton variant="ghost" @click="cancel">{{ cancelText }}</UiButton>
      <UiButton :variant="danger ? 'danger' : 'primary'" :autofocus="!danger" @click="confirm">
        {{ confirmText }}
      </UiButton>
    </template>
  </UiDialog>
</template>
