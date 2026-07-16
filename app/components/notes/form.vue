<script setup lang="ts">
import {
  createNoteSchema,
  type CreateNoteInput,
} from "#shared/utils/schema-validation/notes.schema";

const { pending = false } = defineProps<{ pending?: boolean }>();
const emit = defineEmits<{ submit: [input: CreateNoteInput] }>();

const formRef = useTemplateRef<HTMLElement>("formRef");

const { form, errors, submit, shouldDisableSubmit, reset } = useForm({
  validationSchema: createNoteSchema,
  initialValues: { title: "", body: "" },
  formRef,
  onSubmit: (values) => {
    emit("submit", values);
    reset();
  },
});
</script>

<template>
  <form ref="formRef" :class="$style.form" novalidate @submit="submit">
    <UiTextField
      v-model="form.title"
      name="title"
      label="Title"
      placeholder="A short title"
      required
      :error="errors.title"
    />
    <UiTextarea
      v-model="form.body"
      name="body"
      label="Note"
      placeholder="Write something…"
      :error="errors.body"
    />
    <UiButton type="submit" :loading="pending" :disabled="shouldDisableSubmit">Add note</UiButton>
  </form>
</template>

<style module>
.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}

.form :deep(button) {
  align-self: flex-start;
}
</style>
