<script setup lang="ts">
const { interactive = false } = defineProps<{ interactive?: boolean }>();

const emit = defineEmits<{ click: [event: MouseEvent] }>();
</script>

<template>
  <tr
    data-part="row"
    :data-table-interactive="interactive || undefined"
    @click="interactive && emit('click', $event)"
  >
    <slot />
  </tr>
</template>

<style scoped>
[data-part="row"][data-table-interactive] {
  cursor: pointer;
}
</style>
