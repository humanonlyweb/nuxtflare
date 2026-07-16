<script setup lang="ts">
import type { NuxtError } from "#app";

const { error } = defineProps<{
  error: NuxtError;
}>();

const isNotFound = computed(() => error.status === 404);
const title = computed(() => (isNotFound.value ? "Page not found" : "Something went wrong"));
const message = computed(() =>
  isNotFound.value
    ? "The page you're looking for doesn't exist or may have moved."
    : error.statusText || "An unexpected error occurred. Please try again.",
);

useSeoMeta({ title: () => `${error.status} — ${title.value}` });

const goHome = () => clearError({ redirect: "/" });
</script>

<template>
  <NuxtLayout>
    <div :class="$style.wrap">
      <p :class="$style.code">{{ error.status }}</p>
      <h1 :class="$style.title">{{ title }}</h1>
      <p :class="$style.message">{{ message }}</p>
      <UiButton @click="goHome">Back to home</UiButton>
    </div>
  </NuxtLayout>
</template>

<style module>
.wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 3rem 1.25rem;
  text-align: center;
}

.code {
  font-size: clamp(3.5rem, 14vw, 6rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.03em;
  color: color-mix(in oklch, var(--text) 18%, transparent);
}

.title {
  margin-top: 0.5rem;
  font-size: clamp(1.5rem, 5vw, 2rem);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.message {
  max-width: 40ch;
  color: var(--text-muted);
}

.wrap :global(button) {
  margin-top: 1.25rem;
}
</style>
