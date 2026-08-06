<script setup lang="ts">
import type { AvatarSize } from "~/types/components.type";

const {
  name,
  src,
  size = "medium",
} = defineProps<{
  name: string;
  src?: string;
  size?: AvatarSize;
}>();

const failed = ref(false);
watch(
  () => src,
  () => (failed.value = false),
);

const showImage = computed(() => Boolean(src) && !failed.value);

const initials = computed(() => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "";
  const letters = words.length === 1 ? [words[0]!] : [words[0]!, words.at(-1)!];
  return letters.map((w) => [...w][0]!.toUpperCase()).join("");
});
</script>

<template>
  <span data-part="avatar" :data-avatar-size="size" role="img" :aria-label="name">
    <img v-if="showImage" :src="src" alt="" data-part="avatar-image" @error="failed = true" />
    <template v-else>{{ initials }}</template>
  </span>
</template>
