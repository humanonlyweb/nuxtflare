<script setup lang="ts" generic="T extends string | number">
import type { SelectOption } from "~/types/components.type";

const {
  options = [],
  label,
  hint,
  error,
  disabled = false,
  orientation = "vertical",
  id: idProp,
} = defineProps<{
  options?: SelectOption<T>[];
  label?: string;
  hint?: string;
  error?: string | boolean;
  disabled?: boolean;
  orientation?: "vertical" | "horizontal";
  id?: string;
}>();

const model = defineModel<T>();

defineSlots<{ option(props: { option: SelectOption<T>; checked: boolean }): unknown }>();

const { id, hintId, errorId, isError, errorMessage, describedBy } = useField({
  id: () => idProp,
  hint: () => hint,
  error: () => error,
});
const labelId = computed(() => `${id.value}-label`);

const radios = useTemplateRef<HTMLButtonElement[]>("radios");

// Roving tabindex: the checked radio is the single tab stop; with nothing
// checked, the first enabled radio takes it so the group is still reachable.
const firstEnabled = computed(() => options.findIndex((o) => !o.disabled));
function isTabStop(opt: SelectOption<T>, index: number) {
  if (model.value != null) return opt.value === model.value;
  return index === firstEnabled.value;
}

function select(opt: SelectOption<T>) {
  if (disabled || opt.disabled) return;
  model.value = opt.value;
}

// Selection follows focus (APG): arrows move to the next enabled radio, select
// it, and move focus there — wrapping at both ends.
function move(dir: 1 | -1) {
  const enabled = options.map((o, i) => i).filter((i) => !options[i]!.disabled);
  if (!enabled.length) return;
  const current = model.value != null ? options.findIndex((o) => o.value === model.value) : -1;
  const pos = enabled.indexOf(current);
  const next =
    enabled[
      pos < 0 ? (dir === 1 ? 0 : enabled.length - 1) : (pos + dir + enabled.length) % enabled.length
    ]!;
  model.value = options[next]!.value;
  radios.value?.[next]?.focus();
}

function focusEdge(edge: "first" | "last") {
  const enabled = options.map((o, i) => i).filter((i) => !options[i]!.disabled);
  const idx = edge === "first" ? enabled[0] : enabled[enabled.length - 1];
  if (idx == null) return;
  model.value = options[idx]!.value;
  radios.value?.[idx]?.focus();
}

function onKeydown(e: KeyboardEvent) {
  if (disabled) return;
  switch (e.key) {
    case "ArrowDown":
    case "ArrowRight":
      e.preventDefault();
      move(1);
      break;
    case "ArrowUp":
    case "ArrowLeft":
      e.preventDefault();
      move(-1);
      break;
    case "Home":
      e.preventDefault();
      focusEdge("first");
      break;
    case "End":
      e.preventDefault();
      focusEdge("last");
      break;
  }
}
</script>

<template>
  <div data-part="field" :data-field-error="isError || undefined">
    <span v-if="label" :id="labelId" data-part="field-label">{{ label }}</span>

    <div
      role="radiogroup"
      data-part="radio-group"
      :data-orientation="orientation"
      :aria-labelledby="label ? labelId : undefined"
      :aria-describedby="describedBy"
      :aria-invalid="isError || undefined"
      @keydown="onKeydown"
    >
      <button
        v-for="(opt, i) in options"
        ref="radios"
        :key="opt.value"
        type="button"
        role="radio"
        data-part="radio"
        :aria-checked="opt.value === model"
        :tabindex="isTabStop(opt, i) ? 0 : -1"
        :disabled="disabled || opt.disabled"
        :data-radio-checked="opt.value === model || undefined"
        @click="select(opt)"
      >
        <slot name="option" :option="opt" :checked="opt.value === model">
          <span data-part="radio-control" aria-hidden="true" />
          <span data-part="radio-label">{{ opt.label }}</span>
        </slot>
      </button>
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
