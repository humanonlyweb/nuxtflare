import type { CreateNoteInput } from "#shared/utils/notes.schema";

export function useNotes() {
  const { data, pending, error, refresh } = useFetch("/api/notes", {
    default: () => [],
  });

  const creating = ref(false);

  async function create(input: CreateNoteInput) {
    creating.value = true;
    try {
      const note = await $fetch("/api/notes", { method: "POST", body: input });
      data.value = [note, ...data.value];
      return note;
    } finally {
      creating.value = false;
    }
  }

  async function remove(id: string) {
    const previous = data.value;
    data.value = previous.filter((note) => note.id !== id);
    try {
      await $fetch(`/api/notes/${id}`, { method: "DELETE" });
    } catch (err) {
      data.value = previous;
      throw err;
    }
  }

  return { notes: data, pending, error, creating, create, remove, refresh };
}
