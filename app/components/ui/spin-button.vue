<script setup lang="ts">
defineOptions({ inheritAttrs: false });

const {
  label,
  hint,
  error,
  format,
  step = 1,
  largeStep,
  id: idProp,
  disabled = false,
  readonly = false,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
} = defineProps<{
  id?: string;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
  label?: string;
  largeStep?: number;
  disabled?: boolean;
  readonly?: boolean;
  error?: string | boolean;
  format?: (value: number) => string;
}>();

const model = defineModel<number>();

defineSlots<{ decrement(): unknown; increment(): unknown }>();

const { id, hintId, errorId, isError, errorMessage, describedBy } = useField({
  id: () => idProp,
  hint: () => hint,
  error: () => error,
});

const pageStep = computed(() => largeStep ?? step * 10);

const decimals = computed(() => String(step).split(".")[1]?.length ?? 0);
function clamp(value: number) {
  const bounded = Math.min(max, Math.max(min, value));
  return decimals.value ? Number(bounded.toFixed(decimals.value)) : bounded;
}

const draft = ref<string | null>(null);
const display = computed(() => {
  if (draft.value !== null) return draft.value;
  if (model.value == null) return "";
  return format ? format(model.value) : String(model.value);
});

function onInput(event: Event) {
  const raw = (event.target as HTMLInputElement).value;
  draft.value = raw;
  const parsed = Number.parseFloat(raw);
  model.value = Number.isNaN(parsed) ? undefined : parsed;
}

function onBlur() {
  draft.value = null;
  if (model.value != null) model.value = clamp(model.value);
}

function set(value: number) {
  if (disabled || readonly) return;
  model.value = clamp(value);
  draft.value = null;
}

function nudge(direction: 1 | -1, amount = step) {
  const base = model.value ?? (Number.isFinite(min) ? min : 0);
  set(model.value == null ? base : base + direction * amount);
}

const atMin = computed(() => model.value != null && model.value <= min);
const atMax = computed(() => model.value != null && model.value >= max);

function onKeydown(event: KeyboardEvent) {
  const actions: Record<string, () => void> = {
    ArrowUp: () => nudge(1),
    ArrowDown: () => nudge(-1),
    PageUp: () => nudge(1, pageStep.value),
    PageDown: () => nudge(-1, pageStep.value),
    Home: () => {
      if (Number.isFinite(min)) set(min);
    },
    End: () => {
      if (Number.isFinite(max)) set(max);
    },
  };
  const action = actions[event.key];
  if (!action) return;
  event.preventDefault();
  action();
}

const REPEAT_DELAY = 400;
const REPEAT_INTERVAL = 60;
let held: 1 | -1 = 1;

const repeat = useIntervalFn(() => nudge(held), REPEAT_INTERVAL, { immediate: false });
const delay = useTimeoutFn(repeat.resume, REPEAT_DELAY, { immediate: false });

function stopRepeat() {
  delay.stop();
  repeat.pause();
}

// Released on the window, not the button: reaching a bound disables the button
// mid-hold, which drops the pointer capture and would strand the repeat running.
useEventListener(window, ["pointerup", "pointercancel", "blur"], stopRepeat);

function onPointerdown(event: PointerEvent, direction: 1 | -1) {
  if (event.button !== 0) return;
  (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  held = direction;
  nudge(direction);
  delay.start();
}

const inputRef = useTemplateRef("input");
defineExpose({ focus: () => inputRef.value?.focus() });
</script>

<template>
  <div data-part="field" :data-field-error="isError || undefined">
    <label v-if="label" :for="id" data-part="field-label">{{ label }}</label>

    <div
      data-part="spinbutton"
      :data-spinbutton-error="isError || undefined"
      :data-spinbutton-disabled="disabled || undefined"
    >
      <button
        type="button"
        tabindex="-1"
        aria-label="Decrease"
        data-part="spinbutton-decrement"
        :disabled="disabled || readonly || atMin"
        @pointerdown="onPointerdown($event, -1)"
      >
        <slot name="decrement">−</slot>
      </button>

      <input
        :id="id"
        ref="input"
        type="text"
        role="spinbutton"
        inputmode="decimal"
        autocomplete="off"
        spellcheck="false"
        v-bind="$attrs"
        :value="display"
        :disabled="disabled"
        :readonly="readonly"
        :aria-valuenow="model"
        :aria-valuemin="Number.isFinite(min) ? min : undefined"
        :aria-valuemax="Number.isFinite(max) ? max : undefined"
        :aria-valuetext="format && model != null ? format(model) : undefined"
        :aria-invalid="isError || undefined"
        :aria-describedby="describedBy"
        data-part="spinbutton-input"
        @input="onInput"
        @blur="onBlur"
        @keydown="onKeydown"
      />

      <button
        type="button"
        tabindex="-1"
        aria-label="Increase"
        data-part="spinbutton-increment"
        :disabled="disabled || readonly || atMax"
        @pointerdown="onPointerdown($event, 1)"
      >
        <slot name="increment">+</slot>
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

<style scoped>
[data-part="spinbutton-decrement"],
[data-part="spinbutton-increment"] {
  transition: transform 120ms var(--ease-out);
}

[data-part="spinbutton-decrement"]:active:not(:disabled),
[data-part="spinbutton-increment"]:active:not(:disabled) {
  transform: scale(0.92);
}

@media (prefers-reduced-motion: reduce) {
  [data-part="spinbutton-decrement"],
  [data-part="spinbutton-increment"] {
    transition: none;
    transform: none;
  }
}
</style>
