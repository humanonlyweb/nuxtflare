<script setup lang="ts">
const {
  label,
  align = "start",
  maxHeight = 360,
} = defineProps<{
  label: string;
  align?: "start" | "end";
  maxHeight?: number;
}>();

const open = defineModel<boolean>("open", { default: false });

const teleportReady = useTeleportReady();
const triggerId = useId();
const panelId = useId();
const trigger = useTemplateRef("trigger");
const panel = useTemplateRef("panel");

const { rect, viewportHeight, dropUp, measure } = useAnchorPosition(trigger, open, () => maxHeight);

const panelStyle = computed(() => ({
  maxHeight: `min(${maxHeight}px, 60vh)`,
  ...(align === "end"
    ? { right: `${document.documentElement.clientWidth - rect.value.left - rect.value.width}px` }
    : { left: `${rect.value.left}px` }),
  ...(dropUp.value
    ? { bottom: `${viewportHeight.value - rect.value.top + 6}px`, top: "auto" }
    : { top: `${rect.value.bottom + 6}px`, bottom: "auto" }),
}));

const triggerAttrs = computed(() => ({
  id: triggerId,
  "aria-haspopup": "dialog" as const,
  "aria-expanded": open.value,
  "aria-controls": open.value ? panelId : undefined,
}));

watch(open, async (isOpen) => {
  if (!isOpen) return;
  measure();
  await nextTick();
  panel.value?.focus();
});

function close(refocus = true) {
  if (!open.value) return;
  open.value = false;
  // A split trigger has two buttons; focus belongs on the half that owns the disclosure.
  const el = trigger.value;
  const target = el?.querySelector<HTMLElement>("[aria-haspopup]") ?? el?.querySelector("button");
  if (refocus) target?.focus();
}

onKeyStroke("Escape", () => close());
onClickOutside(panel, () => close(false), { ignore: [trigger] });
</script>

<template>
  <span ref="trigger" data-part="popover-anchor">
    <slot name="trigger" :is-open="open" :attrs="triggerAttrs" />
  </span>

  <Teleport v-if="teleportReady" to="body">
    <Transition name="ui-popover">
      <div
        v-if="open"
        :id="panelId"
        ref="panel"
        data-part="popover"
        role="dialog"
        :aria-label="label"
        :aria-labelledby="triggerId"
        tabindex="-1"
        :data-popover-drop-up="dropUp"
        :data-popover-align="align"
        :style="panelStyle"
      >
        <slot :close="close" />
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
[data-part="popover-anchor"] {
  display: inline-flex;
}

/* Positioning and motion only — the panel's chrome lives with the other
   floating surfaces in the global stylesheet. */
[data-part="popover"] {
  position: fixed;
  z-index: 30;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &:focus-visible {
    outline: none;
    box-shadow: none;
  }
}

/* Scaling from the trigger's edge rather than the panel's centre is what makes it read as coming
   *out of* the button instead of just fading in over it — so the origin tracks both the flip and
   the aligned edge. */
[data-part="popover"][data-popover-drop-up="true"] {
  transform-origin: bottom left;
}

[data-part="popover"][data-popover-drop-up="false"] {
  transform-origin: top left;
}

[data-part="popover"][data-popover-align="end"][data-popover-drop-up="true"] {
  transform-origin: bottom right;
}

[data-part="popover"][data-popover-align="end"][data-popover-drop-up="false"] {
  transform-origin: top right;
}

.ui-popover-enter-active {
  transition:
    opacity 160ms var(--ease-out),
    transform 160ms var(--ease-out);
}

/* Dismissal is the system responding, not the user deciding — so it leaves faster than it enters. */
.ui-popover-leave-active {
  transition:
    opacity 110ms var(--ease-out),
    transform 110ms var(--ease-out);
}

.ui-popover-enter-from,
.ui-popover-leave-to {
  opacity: 0;
  transform: scale(0.96) translateY(4px);
}

[data-part="popover"][data-popover-drop-up="true"].ui-popover-enter-from,
[data-part="popover"][data-popover-drop-up="true"].ui-popover-leave-to {
  transform: scale(0.96) translateY(-4px);
}

@media (prefers-reduced-motion: reduce) {
  .ui-popover-enter-from,
  .ui-popover-leave-to {
    transform: none;
  }
}
</style>
