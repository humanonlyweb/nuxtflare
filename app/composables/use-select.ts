import type { Ref } from "vue";

import type { OpenIntent, SelectOption, SelectValue } from "~/types/components.type";

const VIEWPORT_HEIGHT_CAP = 0.4;
const TYPEAHEAD_RESET = 500;
const PANEL_GAP = 6;

interface UseSelectOptions<T extends SelectValue> {
  options: Ref<SelectOption<T>[]>;
  model: Ref<T | T[] | undefined>;
  multiple: Ref<boolean>;
  disabled: Ref<boolean>;
  maxHeight: Ref<number>;
  baseId: Ref<string>;
}

export function useSelect<T extends SelectValue>({
  model,
  baseId,
  options,
  multiple,
  disabled,
  maxHeight,
}: UseSelectOptions<T>) {
  const isOpen = ref(false);
  const dropUp = ref(false);
  const activeIndex = ref(-1);

  const triggerRef = useTemplateRef<HTMLButtonElement>("select-trigger");
  const listboxRef = useTemplateRef<HTMLUListElement>("select-listbox");
  const labelRef = useTemplateRef<HTMLLabelElement>("select-label");
  const controlRef = useTemplateRef<HTMLElement>("select-control");

  const { top, bottom, left, width, update } = useElementBounding(triggerRef);
  const { height: viewportHeight } = useWindowSize();
  const panelStyle = computed<Record<string, string>>(() => ({
    left: `${left.value}px`,
    width: `${width.value}px`,
    ...(dropUp.value
      ? { top: "auto", bottom: `${viewportHeight.value - top.value + PANEL_GAP}px` }
      : { top: `${bottom.value + PANEL_GAP}px`, bottom: "auto" }),
  }));

  const isSelected = (value: T) => selectedValues.value.includes(value);
  const optionId = (index: number) => `${baseId.value}-opt-${index}`;

  const selectedOptions = computed(() => options.value.filter((o) => isSelected(o.value)));
  const selectedValues = computed<T[]>(() => {
    const value = model.value;
    if (multiple.value) return Array.isArray(value) ? value : [];
    if (value == null || Array.isArray(value)) return [];
    return [value];
  });

  const activeId = computed(() =>
    isOpen.value && activeIndex.value >= 0 && activeIndex.value < options.value.length
      ? optionId(activeIndex.value)
      : undefined,
  );

  function enabledFrom(start: number, dir: 1 | -1) {
    const list = options.value;

    for (let i = start; i >= 0 && i < list.length; i += dir) {
      if (!list[i]?.disabled) return i;
    }
    return -1;
  }

  function focusTrigger() {
    triggerRef.value?.focus();
  }

  async function scrollActiveIntoView() {
    if (activeIndex.value < 0) return;
    await nextTick();
    document.getElementById(optionId(activeIndex.value))?.scrollIntoView({ block: "nearest" });
  }

  function open(intent: OpenIntent) {
    if (disabled.value || !options.value.length) return;

    update();
    const below = viewportHeight.value - bottom.value;
    const panelHeight = Math.min(maxHeight.value, viewportHeight.value * VIEWPORT_HEIGHT_CAP);
    dropUp.value = below < panelHeight && top.value > below;

    isOpen.value = true;
    const selected =
      intent === "selected" ? options.value.findIndex((o) => isSelected(o.value)) : -1;
    if (selected >= 0) {
      activeIndex.value = selected;
    } else {
      activeIndex.value =
        intent === "last" ? enabledFrom(options.value.length - 1, -1) : enabledFrom(0, 1);
    }
    void scrollActiveIntoView();
  }

  function close() {
    if (!isOpen.value) return;
    isOpen.value = false;
    activeIndex.value = -1;
  }

  function selectAt(index: number) {
    const option = options.value[index];
    if (!option || option.disabled) return;

    if (multiple.value) {
      const current = selectedValues.value;
      model.value = current.includes(option.value)
        ? current.filter((v) => v !== option.value)
        : [...current, option.value];
      activeIndex.value = index; // keep the panel open for further picks
      return;
    }

    model.value = option.value;
    close();
    focusTrigger();
  }

  function setActive(index: number) {
    if (index < 0 || index === activeIndex.value) return;
    activeIndex.value = index;
    void scrollActiveIntoView();
  }

  function move(dir: 1 | -1) {
    const from =
      activeIndex.value < 0 ? (dir === 1 ? -1 : options.value.length) : activeIndex.value + dir;
    const next = enabledFrom(from, dir);

    if (next >= 0) setActive(next);
  }

  watch(
    () => options.value.length,
    (len) => {
      if (activeIndex.value >= len) activeIndex.value = enabledFrom(0, 1);
    },
  );

  let typeahead = "";
  const resetTypeahead = useTimeoutFn(() => (typeahead = ""), TYPEAHEAD_RESET, {
    immediate: false,
  });

  function onType(char: string) {
    typeahead += char.toLowerCase();
    resetTypeahead.start();

    const list = options.value;
    const single = typeahead.length > 1 && typeahead.split("").every((c) => c === typeahead[0]);
    const needle = single ? typeahead[0]! : typeahead;
    const start = single ? activeIndex.value : activeIndex.value - 1;

    for (let step = 1; step <= list.length; step++) {
      const i = (start + step + list.length) % list.length;
      const opt = list[i];
      if (opt && !opt.disabled && opt.label.toLowerCase().startsWith(needle)) {
        setActive(i);
        return;
      }
    }
  }

  function onTriggerKeydown(e: KeyboardEvent) {
    if (disabled.value) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (isOpen.value) move(1);
        else open("first");
        break;
      case "ArrowUp":
        e.preventDefault();
        if (isOpen.value) move(-1);
        else open("last");
        break;
      case "Home":
        if (isOpen.value) {
          e.preventDefault();
          setActive(enabledFrom(0, 1));
        }
        break;
      case "End":
        if (isOpen.value) {
          e.preventDefault();
          setActive(enabledFrom(options.value.length - 1, -1));
        }
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (isOpen.value) selectAt(activeIndex.value);
        else open("selected");
        break;
      case "Escape":
        if (isOpen.value) {
          e.preventDefault();
          close();
        }
        break;
      case "Tab":
        close();
        break;
      default:
        if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
          if (!isOpen.value) open("selected");
          onType(e.key);
        }
    }
  }

  function onTriggerPointerdown(e: PointerEvent) {
    if (disabled.value || e.button !== 0) return;
    e.preventDefault();
    focusTrigger();

    if (isOpen.value) close();
    else open("selected");
  }

  watch(isOpen, async (opened) => {
    if (!opened) return;
    await nextTick();
    const el = listboxRef.value;
    if (el?.showPopover && !el.matches(":popover-open")) el.showPopover();
  });

  onClickOutside(controlRef, () => close(), { ignore: [labelRef] });

  return {
    onTriggerPointerdown,
    onTriggerKeydown,
    selectedOptions,
    activeIndex,
    isSelected,
    panelStyle,
    setActive,
    optionId,
    activeId,
    selectAt,
    dropUp,
    isOpen,
  };
}
