<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router";

import type {
  ButtonShape,
  ButtonSize,
  ButtonType,
  ButtonVariant,
  LinkTarget,
} from "~/types/components.type";

type BaseIconButtonProps = {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  loading?: boolean;
  disabled?: boolean;
};

const { label, variant, loading, shape, ...rest } = defineProps<
  | (BaseIconButtonProps & {
      type?: ButtonType;
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
      target?: LinkTarget;
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
    :data-button-shape="shape"
    data-button-icon-only
  >
    <template v-if="!loading" #leading><slot /></template>
    <template #spinner><slot name="spinner" /></template>
  </UiButton>
</template>
