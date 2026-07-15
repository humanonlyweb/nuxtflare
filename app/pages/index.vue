<script setup lang="ts">
const { notes, pending, creating, create, remove } = useNotes();

useSeoMeta({
  title: "Notes — humanonlyweb starter",
  description: "A Nuxt 4 + Cloudflare fullstack starter template.",
});
</script>

<template>
  <div class="page">
    <section class="intro">
      <h1>Notes</h1>
      <p>
        A demo feature wired end to end — shared Zod schema → route → controller → service → Drizzle
        on D1. Delete the <code>notes</code> feature when you start your own.
      </p>
    </section>

    <NotesForm :pending="creating" @submit="create" />

    <section class="list" aria-live="polite">
      <p v-if="pending && !notes.length" class="state">Loading…</p>

      <p v-else-if="!notes.length" class="state empty">No notes yet. Add your first one above.</p>

      <NotesCard v-for="note in notes" v-else :key="note.id" :note="note" @delete="remove" />
    </section>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.intro h1 {
  font-size: clamp(1.75rem, 5vw, 2.5rem);
  font-weight: 800;
  letter-spacing: -0.02em;
}

.intro p {
  margin-top: 0.5rem;
  color: var(--text-muted);
  max-width: 44ch;
}

code {
  padding: 0.1em 0.35em;
  font-size: 0.9em;
  background: color-mix(in oklch, var(--text) 8%, transparent);
  border-radius: 6px;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.state {
  padding: 2rem 1.25rem;
  color: var(--text-muted);
  text-align: center;
}

.empty {
  border: 1px dashed var(--border);
  border-radius: var(--radius);
}
</style>
