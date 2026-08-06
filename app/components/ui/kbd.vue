<script setup lang="ts">
const {
  keys,
  size = "medium",
  platform,
} = defineProps<{
  /** Chord written as "mod+k" or "shift enter". `mod` is ⌘ on Apple, Ctrl elsewhere. */
  keys?: string;
  size?: "small" | "medium";
  /** Forces a platform's caps; detected from the request when omitted. */
  platform?: "apple" | "pc";
}>();

const isApple = useApplePlatform();
const useAppleCaps = computed(() => (platform ? platform === "apple" : isApple.value));

const caps = computed(() => (keys ? parseChord(keys, useAppleCaps.value) : []));
const label = computed(() => caps.value.map((cap) => cap.label).join(" "));
</script>

<template>
  <kbd data-part="kbd" :data-kbd-size="size" :aria-label="keys ? label : undefined">
    <template v-if="caps.length">
      <kbd v-for="(cap, i) in caps" :key="`${cap.glyph}-${i}`" data-part="key" aria-hidden="true">
        {{ cap.glyph }}
      </kbd>
    </template>
    <kbd v-else data-part="key"><slot /></kbd>
  </kbd>
</template>
