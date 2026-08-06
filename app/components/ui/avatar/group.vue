<script setup lang="ts">
import type { AvatarItem, AvatarSize } from "~/types/components.type";

const {
  items = [],
  max,
  size = "medium",
  entity = "more",
} = defineProps<{
  items?: AvatarItem[];
  max?: number;
  size?: AvatarSize;
  /** Names what is being counted, e.g. "recipients" → "+3 recipients". */
  entity?: string;
}>();

defineSlots<{ overflow(props: { count: number; entity: string }): unknown }>();

const isCapped = computed(() => max != null && items.length > max);
const visible = computed(() => (isCapped.value ? items.slice(0, max! - 1) : items));
const overflow = computed(() => items.length - visible.value.length);
</script>

<template>
  <div data-part="avatar-group" :data-avatar-size="size">
    <UiAvatar
      v-for="(item, i) in visible"
      :key="item.id ?? `${item.name}-${i}`"
      :name="item.name"
      :src="item.src"
      :size="size"
    />

    <span
      v-if="overflow > 0"
      data-part="avatar"
      data-avatar-overflow
      :data-avatar-size="size"
      role="img"
      :aria-label="`${overflow} ${entity}`"
    >
      <slot name="overflow" :count="overflow" :entity="entity">+{{ overflow }}</slot>
    </span>
  </div>
</template>
