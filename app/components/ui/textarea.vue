<script setup lang="ts">
const {
  label,
  name,
  placeholder,
  required = false,
  error,
  spellcheck = true,
  rows = 3,
} = defineProps<{
  label: string;
  name?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  spellcheck?: boolean;
  rows?: number;
}>();

const model = defineModel<string>({ default: "" });

const id = useId();
const errorId = computed(() => (error ? `${id}-error` : undefined));
</script>

<template>
  <div :class="$style.field">
    <label :for="id">{{ label }}</label>

    <textarea
      :id="id"
      v-model="model"
      :name="name"
      :placeholder="placeholder"
      :required="required"
      :rows="rows"
      :spellcheck="spellcheck"
      :aria-invalid="!!error"
      :aria-describedby="errorId"
    />

    <p v-if="error" :id="errorId" :class="$style.error" role="alert">{{ error }}</p>
  </div>
</template>

<style module>
.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-muted);
}

.field textarea {
  width: 100%;
  padding: 0.6rem 0.75rem;
  font: inherit;
  font-size: max(1rem, 16px);
  color: var(--text);
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  resize: vertical;
  min-height: 4.5rem;
  transition:
    border-color 0.12s ease,
    box-shadow 0.12s ease;
}

.field textarea:focus-visible {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--ring);
}

.field textarea[aria-invalid="true"] {
  border-color: var(--danger);
}

.error {
  font-size: 0.8rem;
  color: var(--danger);
}
</style>
