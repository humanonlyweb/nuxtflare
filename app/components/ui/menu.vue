<script setup lang="ts" generic="T extends string | number">
import type { SelectOption } from "~/types/components.type";

const {
  items = [],
  label = "Menu",
  disabled = false,
  maxHeight = 320,
} = defineProps<{
  items?: SelectOption<T>[];
  label?: string;
  disabled?: boolean;
  maxHeight?: number;
}>();

const emit = defineEmits<{ select: [value: T] }>();

defineSlots<{
  trigger(props: { isOpen: boolean }): unknown;
  item(props: { item: SelectOption<T>; active: boolean }): unknown;
}>();

const triggerId = useId();
const menuId = useId();

const listConstraints = computed(() => ({ maxHeight: `min(${maxHeight}px, 50vh)` }));

const {
  isOpen,
  dropUp,
  activeIndex,
  panelStyle,
  toggle,
  setActive,
  activate,
  onTriggerKeydown,
  onMenuKeydown,
} = useMenu({
  itemCount: toRef(() => items.length),
  isDisabled: (i) => Boolean(items[i]?.disabled),
  onActivate: (i) => emit("select", items[i]!.value),
});
</script>

<template>
  <div data-part="menu">
    <button
      :id="triggerId"
      ref="menu-trigger"
      type="button"
      data-part="menu-trigger"
      aria-haspopup="menu"
      :aria-controls="menuId"
      :aria-expanded="isOpen"
      :data-menu-open="isOpen || undefined"
      :disabled="disabled"
      @click="toggle"
      @keydown="onTriggerKeydown"
    >
      <slot name="trigger" :is-open="isOpen">{{ label }}</slot>
    </button>

    <Teleport to="body">
      <Transition name="ui-menu-pop">
        <div
          v-if="isOpen"
          :id="menuId"
          ref="menu-panel"
          role="menu"
          popover="manual"
          data-part="menu-list"
          :style="[panelStyle, listConstraints]"
          :data-menu-drop-up="dropUp"
          :aria-labelledby="triggerId"
          @keydown="onMenuKeydown"
        >
          <button
            v-for="(item, i) in items"
            :key="item.value"
            3
            type="button"
            role="menuitem"
            data-part="menu-item"
            tabindex="-1"
            :disabled="item.disabled"
            :data-menu-active="i === activeIndex || undefined"
            @click="activate(i)"
            @mousemove="!item.disabled && setActive(i)"
          >
            <slot name="item" :item="item" :active="i === activeIndex">{{ item.label }}</slot>
          </button>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* Positioning, popover reset and motion only — style the trigger, list and items
   via their data-part hooks. */
[data-part="menu"] {
  position: relative;
  display: inline-flex;
}

[data-part="menu-list"] {
  position: fixed;
  inset: auto;
  margin: 0;
  z-index: 30;
  overflow-y: auto;
  overscroll-behavior: contain;
}

[data-part="menu-list"][data-menu-drop-up="false"] {
  transform-origin: top center;
}

[data-part="menu-list"][data-menu-drop-up="true"] {
  transform-origin: bottom center;
}

.ui-menu-pop-enter-active {
  transition:
    opacity 160ms var(--ease-out),
    transform 160ms var(--ease-out);
}

.ui-menu-pop-leave-active {
  transition:
    opacity 120ms var(--ease-out),
    transform 120ms var(--ease-out);
}

.ui-menu-pop-enter-from,
.ui-menu-pop-leave-to {
  opacity: 0;
  transform: scale(0.96);
}

@media (prefers-reduced-motion: reduce) {
  .ui-menu-pop-enter-from,
  .ui-menu-pop-leave-to {
    transform: none;
  }
}
</style>
