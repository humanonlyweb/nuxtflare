<script setup lang="ts" generic="T extends string | number">
import type { SelectOption } from "~/types/components.type";

const {
  items = [],
  label,
  disabled = false,
} = defineProps<{
  items?: SelectOption<T>[];
  label?: string;
  disabled?: boolean;
}>();

const model = defineModel<T>();

defineSlots<{
  default(props: { value: T | undefined }): unknown;
  tab(props: { item: SelectOption<T>; selected: boolean }): unknown;
}>();

const uid = useId();
const panelId = `${uid}-panel`;
const tabId = (index: number) => `${uid}-tab-${index}`;

const activeIndex = computed(() => items.findIndex((item) => item.value === model.value));
const activeTabId = computed(() => (activeIndex.value < 0 ? undefined : tabId(activeIndex.value)));

const tablist = useTemplateRef("tablist");
const tabs = useTemplateRef("tabs");

const { isTabStop, select, onKeydown } = useRovingSelection({
  items: () => items,
  elements: () => tabs.value ?? undefined,
  disabled: () => disabled,
  model,
});

const { style, isMeasured, canAnimate } = useSlideIndicator({
  container: tablist,
  items: () => tabs.value ?? undefined,
  activeIndex: () => activeIndex.value,
});
</script>

<template>
  <div data-part="tabs">
    <div
      ref="tablist"
      role="tablist"
      data-part="tablist"
      :data-tabs-sliding="isMeasured || undefined"
      :data-tabs-animate="canAnimate || undefined"
      :aria-label="label"
      @keydown="onKeydown"
    >
      <span v-show="isMeasured" data-part="tab-indicator" :style="style" aria-hidden="true" />

      <button
        v-for="(item, i) in items"
        :id="tabId(i)"
        ref="tabs"
        :key="item.value"
        type="button"
        role="tab"
        data-part="tab"
        :aria-selected="item.value === model"
        :aria-controls="panelId"
        :tabindex="isTabStop(item, i) ? 0 : -1"
        :disabled="disabled || item.disabled"
        :data-tab-selected="item.value === model || undefined"
        @click="select(item)"
      >
        <slot name="tab" :item="item" :selected="item.value === model">{{ item.label }}</slot>
      </button>
    </div>

    <div
      :id="panelId"
      role="tabpanel"
      data-part="tabpanel"
      tabindex="0"
      :aria-labelledby="activeTabId"
    >
      <slot :value="model" />
    </div>
  </div>
</template>
