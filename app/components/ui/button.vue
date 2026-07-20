<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router";

import { NuxtLink } from "#components";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "link";

type BaseButtonProps = {
  variant?: ButtonVariant;
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
};

type NormalButtonProps = BaseButtonProps & {
  type?: "button" | "submit" | "reset";
  href?: never;
  to?: never;
};

type RouterLinkButtonProps = BaseButtonProps & {
  to: RouteLocationRaw;
  href?: never;
  type?: never;
};

type AnchorButtonProps = BaseButtonProps & {
  target?: "_blank" | "_self" | "_parent" | "_top";
  href: string;
  type?: never;
  to?: never;
};

type ButtonProps = NormalButtonProps | RouterLinkButtonProps | AnchorButtonProps;

const props = defineProps<ButtonProps>();

const isLink = computed(() => Boolean(props.to || props.href));
const isDisabled = computed(() => Boolean(props.disabled || props.loading));

const isComponent = computed(() => {
  if (props.to) return NuxtLink;
  if (props.href) return "a";
  return "button";
});

const linkProps = computed(() => {
  if (isDisabled.value) return {};
  if (props.to) return { to: props.to };
  if (props.href) return { href: props.href, target: props.target };
  return {};
});

const buttonProps = computed(() => {
  if (isLink.value) {
    return isDisabled.value ? { "aria-disabled": "true", tabindex: -1 } : {};
  }
  return { type: props.type ?? "button", disabled: isDisabled.value };
});
</script>

<template>
  <component
    :is="isComponent"
    :data-button-full-width="fullWidth || undefined"
    :data-button-disabled="isDisabled || undefined"
    :data-button-variant="variant ?? 'primary'"
    :data-button-loading="loading || undefined"
    v-bind="{ ...linkProps, ...buttonProps }"
    :data-button-size="size ?? 'medium'"
    :aria-busy="loading || undefined"
    data-part="button"
  >
    <slot name="leading" />
    <span v-if="loading" data-part="button-spinner" aria-hidden="true">
      <slot name="spinner" />
    </span>
    <span v-if="$slots.default" data-part="button-label"><slot /></span>
    <slot name="trailing" />
  </component>
</template>

<style scoped>
[data-part="button"] {
  transition: transform 160ms var(--ease-out);
}

[data-part="button"]:active:not([data-button-disabled]) {
  transform: scale(0.98);
}

[data-part="button"][data-button-full-width]:active:not([data-button-disabled]) {
  transform: scale(0.995);
}

@media (prefers-reduced-motion: reduce) {
  [data-part="button"] {
    transition: none;
  }

  [data-part="button"]:active {
    transform: none;
  }
}
</style>
