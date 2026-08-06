<script setup lang="ts" generic="T extends string | number">
import type { CommandItem } from "~/types/components.type";

const {
  items = [],
  label = "Command palette",
  placeholder = "Type a command or search…",
  emptyText = "No matching commands",
  filter,
} = defineProps<{
  items?: CommandItem<T>[];
  label?: string;
  placeholder?: string;
  emptyText?: string;
  filter?: (item: CommandItem<T>, query: string) => boolean;
}>();

const open = defineModel<boolean>("open", { default: false });
const emit = defineEmits<{ select: [value: T] }>();

defineSlots<{
  item(props: { item: CommandItem<T>; active: boolean }): unknown;
  empty(props: { query: string }): unknown;
}>();

const uid = useId();
const listboxId = `${uid}-listbox`;
const optionId = (index: number) => `${uid}-option-${index}`;

const { query, matches, groups, activeIndex, setActive, select, onKeydown, reset } =
  useCommandPalette<T>({
    items: () => items,
    filter,
    onSelect: (item) => {
      emit("select", item.value);
      open.value = false;
    },
  });

const inputRef = useTemplateRef("input");
const listRef = useTemplateRef<HTMLElement>("list");

watch(open, async (isOpen) => {
  if (!isOpen) return;
  reset();
  await nextTick();
  inputRef.value?.focus();
});

// The active row is virtual, so nothing scrolls it into view on its own.
watch(activeIndex, async (index) => {
  await nextTick();
  listRef.value?.querySelector(`[id="${optionId(index)}"]`)?.scrollIntoView({ block: "nearest" });
});
</script>

<template>
  <UiDialog v-model:open="open" flush>
    <div data-part="palette">
      <div data-part="palette-search">
        <UiIcon name="search" />
        <input
          ref="input"
          v-model="query"
          type="text"
          role="combobox"
          data-part="palette-input"
          :placeholder="placeholder"
          :aria-label="label"
          :aria-controls="listboxId"
          :aria-activedescendant="matches.length ? optionId(activeIndex) : undefined"
          aria-autocomplete="list"
          aria-expanded="true"
          autocomplete="off"
          spellcheck="false"
          @keydown="onKeydown"
        />
        <UiKbd keys="esc" size="small" />
      </div>

      <div :id="listboxId" ref="list" role="listbox" :aria-label="label" data-part="palette-list">
        <div
          v-for="(group, i) in groups"
          :key="group.name ?? i"
          role="group"
          data-part="palette-group"
          :aria-label="group.name"
        >
          <div v-if="group.name" data-part="palette-group-label" aria-hidden="true">
            {{ group.name }}
          </div>

          <div
            v-for="entry in group.entries"
            :id="optionId(entry.index)"
            :key="entry.item.value"
            role="option"
            data-part="palette-option"
            :aria-selected="entry.index === activeIndex"
            :aria-disabled="entry.item.disabled || undefined"
            :data-palette-active="entry.index === activeIndex || undefined"
            @click="select(entry.item)"
            @pointermove="setActive(entry.index)"
            @pointerdown.prevent
          >
            <slot name="item" :item="entry.item" :active="entry.index === activeIndex">
              <UiIcon v-if="entry.item.icon" :name="entry.item.icon" />
              <span data-part="palette-label">{{ entry.item.label }}</span>
              <span v-if="entry.item.hint" data-part="palette-hint">{{ entry.item.hint }}</span>
              <UiKbd v-if="entry.item.keys" :keys="entry.item.keys" size="small" />
            </slot>
          </div>
        </div>

        <p v-if="!matches.length" data-part="palette-empty" role="status">
          <slot name="empty" :query="query">{{ emptyText }}</slot>
        </p>
      </div>

      <div data-part="palette-footer">
        <span><UiKbd keys="up" size="small" /><UiKbd keys="down" size="small" /> navigate</span>
        <span><UiKbd keys="enter" size="small" /> select</span>
      </div>
    </div>
  </UiDialog>
</template>
