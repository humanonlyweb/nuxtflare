<script setup lang="ts" generic="T extends string | number">
import type { SelectOption } from "~/types/components.type";

defineOptions({ inheritAttrs: false });

const {
  label,
  hint,
  error,
  options = [],
  maxHeight = 288,
  multiple = false,
  disabled = false,
  placeholder = "Select an option",
  id: idProp,
} = defineProps<{
  options?: SelectOption<T>[];
  error?: string | boolean;
  placeholder?: string;
  multiple?: boolean;
  disabled?: boolean;
  maxHeight?: number;
  label?: string;
  hint?: string;
  id?: string;
}>();

const model = defineModel<T | T[]>();

defineSlots<{
  value(props: { selected: SelectOption<T>[]; placeholder: string }): unknown;
  option(props: {
    option: SelectOption<T>;
    selected: boolean;
    active: boolean;
    index: number;
  }): unknown;
  chevron(): unknown;
  check(props: { selected: boolean }): unknown;
}>();

const listConstraints = computed(() => ({
  maxHeight: `min(${maxHeight}px, 40vh)`,
}));

const { id, hintId, errorId, isError, errorMessage, describedBy } = useField({
  error: () => error,
  id: () => idProp,
  hint: () => hint,
});
const labelId = computed(() => `${id.value}-label`);
const listboxId = computed(() => `${id.value}-listbox`);

const {
  isOpen,
  dropUp,
  optionId,
  activeId,
  selectAt,
  setActive,
  isSelected,
  panelStyle,
  activeIndex,
  selectedOptions,
  onTriggerKeydown,
  onTriggerPointerdown,
} = useSelect({
  maxHeight: toRef(() => maxHeight),
  disabled: toRef(() => disabled),
  multiple: toRef(() => multiple),
  options: toRef(() => options),
  baseId: id,
  model,
});

const displayLabel = computed(() => {
  const picked = selectedOptions.value;
  if (!picked.length) return placeholder;
  const [first, ...rest] = picked;
  return rest.length ? `${first!.label} (+${rest.length} more)` : first!.label;
});
</script>

<template>
  <div data-part="field" :data-field-error="isError || undefined">
    <label
      v-if="label"
      :id="labelId"
      ref="select-label"
      :for="id"
      data-part="field-label"
      @pointerdown="onTriggerPointerdown"
      >{{ label }}</label
    >

    <div ref="select-control" data-part="select-control">
      <button
        :id="id"
        ref="select-trigger"
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        data-part="trigger"
        :aria-expanded="isOpen"
        :aria-controls="listboxId"
        :aria-activedescendant="activeId"
        :aria-labelledby="label ? `${labelId} ${id}` : undefined"
        :aria-describedby="describedBy"
        :aria-invalid="isError || undefined"
        :disabled="disabled"
        :data-select-open="isOpen || undefined"
        :data-select-error="isError || undefined"
        v-bind="$attrs"
        @keydown="onTriggerKeydown"
        @pointerdown="onTriggerPointerdown"
      >
        <span data-part="value" :data-select-placeholder="!selectedOptions.length || undefined">
          <slot name="value" :selected="selectedOptions" :placeholder="placeholder">{{
            displayLabel
          }}</slot>
        </span>
        <span data-part="chevron" aria-hidden="true"><slot name="chevron">▾</slot></span>
      </button>

      <Transition name="ui-select-pop">
        <ul
          v-if="isOpen"
          :id="listboxId"
          ref="select-listbox"
          role="listbox"
          popover="manual"
          data-part="listbox"
          :style="[panelStyle, listConstraints]"
          :data-select-drop-up="dropUp"
          :aria-multiselectable="multiple || undefined"
          :aria-labelledby="label ? labelId : undefined"
        >
          <li
            v-for="(opt, i) in options"
            :id="optionId(i)"
            :key="opt.value"
            role="option"
            data-part="option"
            :aria-selected="isSelected(opt.value)"
            :aria-disabled="opt.disabled || undefined"
            :data-select-active="i === activeIndex || undefined"
            @click="selectAt(i)"
            @pointerdown.prevent
            @mousemove="!opt.disabled && setActive(i)"
          >
            <slot
              name="option"
              :option="opt"
              :selected="isSelected(opt.value)"
              :active="i === activeIndex"
              :index="i"
            >
              <span data-part="option-check" aria-hidden="true">
                <slot name="check" :selected="isSelected(opt.value)" />
              </span>
              <span data-part="option-label">{{ opt.label }}</span>
            </slot>
          </li>
        </ul>
      </Transition>
    </div>

    <Transition name="field-message" mode="out-in">
      <p
        v-if="errorMessage"
        :id="errorId"
        key="error"
        role="alert"
        data-part="field-message"
        data-field-tone="error"
      >
        {{ errorMessage }}
      </p>
      <p v-else-if="hint" :id="hintId" key="hint" data-part="field-message" data-field-tone="hint">
        {{ hint }}
      </p>
    </Transition>
  </div>
</template>

<style scoped>
/* Positioning, popover reset and motion only — no visual chrome. Style the
   trigger, listbox and options via their data-part hooks in your own CSS. */
[data-part="select-control"] {
  position: relative;
}

[data-part="listbox"] {
  /* Manual popover lifted into the top layer; top/left/width come from the
     composable's inline style. Reset the UA popover box so it positions cleanly,
     with z-index as the fallback for browsers without the Popover API. */
  position: fixed;
  inset: auto;
  margin: 0;
  z-index: 20;
  list-style: none;
  overflow-y: auto;
  overscroll-behavior: contain;
}

[data-part="listbox"][data-select-drop-up="false"] {
  transform-origin: top center;
}

[data-part="listbox"][data-select-drop-up="true"] {
  transform-origin: bottom center;
}

[data-part="chevron"] {
  display: inline-flex;
  transition: transform 200ms var(--ease-out);
}

[data-part="trigger"][data-select-open] [data-part="chevron"] {
  transform: rotate(180deg);
}

.ui-select-pop-enter-active {
  transition:
    opacity 160ms var(--ease-out),
    transform 160ms var(--ease-out);
}

.ui-select-pop-leave-active {
  transition:
    opacity 120ms var(--ease-out),
    transform 120ms var(--ease-out);
}

.ui-select-pop-enter-from,
.ui-select-pop-leave-to {
  opacity: 0;
  transform: scale(0.96);
}

@media (prefers-reduced-motion: reduce) {
  .ui-select-pop-enter-from,
  .ui-select-pop-leave-to {
    transform: none;
  }

  [data-part="chevron"] {
    transition: none;
  }
}
</style>
