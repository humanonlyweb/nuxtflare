<script setup lang="ts">
const { note } = defineProps<{
  note: { id: string; title: string; body: string; createdAt: string | number | Date };
}>();

defineEmits<{ delete: [id: string] }>();

const created = computed(() => shortDate(new Date(note.createdAt)));
</script>

<template>
  <article :class="$style.card">
    <header>
      <h3>{{ note.title }}</h3>
      <time :datetime="new Date(note.createdAt).toISOString()">{{ created }}</time>
    </header>
    <p v-if="note.body">{{ note.body }}</p>
    <UiButton variant="danger" aria-label="Delete note" @click="$emit('delete', note.id)">
      Delete
    </UiButton>
  </article>
</template>

<style module>
.card {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 1.1rem 1.25rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}

.card header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
}

.card h3 {
  font-size: 1.05rem;
  font-weight: 600;
}

.card time {
  flex-shrink: 0;
  font-size: 0.8rem;
  color: var(--text-muted);
}

.card p {
  color: var(--text-muted);
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.card :deep(button) {
  align-self: flex-start;
}
</style>
