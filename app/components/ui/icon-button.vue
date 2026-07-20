<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router";

type BaseIconButtonProps = {
  label: string;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "link";
  size?: "small" | "medium" | "large";
  loading?: boolean;
  disabled?: boolean;
};

const { label, variant, loading, ...rest } = defineProps<
  | (BaseIconButtonProps & {
      type?: "button" | "submit" | "reset";
      href?: never;
      to?: never;
    })
  | (BaseIconButtonProps & {
      to: RouteLocationRaw;
      href?: never;
      type?: never;
    })
  | (BaseIconButtonProps & {
      href: string;
      target?: "_blank" | "_self" | "_parent" | "_top";
      to?: never;
      type?: never;
    })
>();
</script>

<template>
  <UiButton
    v-bind="rest"
    :variant="variant ?? 'ghost'"
    :loading="loading"
    :aria-label="label"
    data-button-icon-only
  >
    <template v-if="!loading" #leading><slot /></template>
    <template #spinner><slot name="spinner" /></template>
  </UiButton>
</template>
