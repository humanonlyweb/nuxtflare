<script setup lang="ts">
import type { IconName } from "~/types/components.type";

const { name, size, label } = defineProps<{
  name: IconName;
  size?: `${number}px`;
  label?: string;
}>();

const href = computed(() => `/assets/icon-sprite.svg#i-${name}`);
</script>

<template>
  <svg
    :style="size ? { '--icon-size': size } : undefined"
    :aria-hidden="label ? undefined : true"
    :aria-label="label"
    :role="label ? 'img' : undefined"
    fill="currentColor"
    focusable="false"
    data-part="icon"
  >
    <use :href.attr="href" />
  </svg>
</template>
