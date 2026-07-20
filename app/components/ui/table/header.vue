<script setup lang="ts">
const { sticky = false, srOnly = false } = defineProps<{ sticky?: boolean; srOnly?: boolean }>();
</script>

<template>
  <thead
    data-part="table-header"
    :data-table-sticky="sticky || undefined"
    :data-table-sr-only="srOnly || undefined"
  >
    <slot />
  </thead>
</template>

<style scoped>
/* Functional only: sticky positioning and a11y visually-hidden header. */
[data-part="table-header"][data-table-sticky] {
  position: sticky;
  top: 0;
  z-index: 1;
}

[data-part="table-header"][data-table-sr-only] {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}
</style>
