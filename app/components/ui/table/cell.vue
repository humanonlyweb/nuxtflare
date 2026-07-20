<script setup lang="ts">
import type { TdHTMLAttributes } from "vue";

const {
  as = "td",
  align,
  numeric = false,
  scope,
} = defineProps<{
  as?: "td" | "th";
  align?: TdHTMLAttributes["align"];
  numeric?: boolean;
  scope?: "col" | "row" | "colgroup" | "rowgroup";
}>();
</script>

<template>
  <component
    :is="as"
    data-part="cell"
    :scope="as === 'th' ? scope : undefined"
    :data-table-align="align || undefined"
    :data-table-numeric="numeric || undefined"
  >
    <slot />
  </component>
</template>
