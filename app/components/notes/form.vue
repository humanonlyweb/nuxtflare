<script setup lang="ts">
import { createNoteSchema, type CreateNoteInput } from "#shared/utils/notes.schema";

const { pending = false } = defineProps<{ pending?: boolean }>();
const emit = defineEmits<{ submit: [input: CreateNoteInput] }>();

const title = ref("");
const body = ref("");
const errors = ref<Record<string, string>>({});

function onSubmit() {
  const result = createNoteSchema.safeParse({ title: title.value, body: body.value });
  if (!result.success) {
    errors.value = Object.fromEntries(
      result.error.issues.map((issue) => [String(issue.path[0] ?? "title"), issue.message]),
    );
    return;
  }
  errors.value = {};
  emit("submit", result.data);
  title.value = "";
  body.value = "";
}
</script>

<template>
  <form :class="$style.form" @submit.prevent="onSubmit">
    <UiTextField
      v-model="title"
      label="Title"
      placeholder="A short title"
      required
      :error="errors.title"
    />
    <UiTextField
      v-model="body"
      label="Note"
      placeholder="Write something…"
      multiline
      :spellcheck="true"
      :error="errors.body"
    />
    <UiButton type="submit" :loading="pending">Add note</UiButton>
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
