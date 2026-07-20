import type { Ref } from "vue";

const PANEL_GAP = 6;
const VIEWPORT_HEIGHT_CAP = 0.5;

interface UseMenuOptions {
  itemCount: Ref<number>;
  isDisabled: (index: number) => boolean;
  onActivate: (index: number) => void;
}

export function useMenu({ itemCount, isDisabled, onActivate }: UseMenuOptions) {
  const isOpen = ref(false);
  const dropUp = ref(false);
  const activeIndex = ref(-1);
  const panelStyle = ref<Record<string, string>>({});

  const triggerRef = useTemplateRef<HTMLButtonElement>("menu-trigger");
  const menuRef = useTemplateRef<HTMLElement>("menu-panel");

  function enabledFrom(start: number, dir: 1 | -1) {
    for (let i = start; i >= 0 && i < itemCount.value; i += dir) {
      if (!isDisabled(i)) return i;
    }
    return -1;
  }
  const firstEnabled = () => enabledFrom(0, 1);
  const lastEnabled = () => enabledFrom(itemCount.value - 1, -1);

  function focusActive() {
    void nextTick(() => {
      menuRef.value
        ?.querySelectorAll<HTMLElement>('[data-part="menu-item"]')
        [activeIndex.value]?.focus();
    });
  }

  function positionPanel() {
    const rect = triggerRef.value?.getBoundingClientRect();
    if (!rect) return;
    panelStyle.value = {
      left: `${rect.left}px`,
      minWidth: `${rect.width}px`,
      ...(dropUp.value
        ? { top: "auto", bottom: `${window.innerHeight - rect.top + PANEL_GAP}px` }
        : { top: `${rect.bottom + PANEL_GAP}px`, bottom: "auto" }),
    };
  }

  async function open(edge: "first" | "last" = "first") {
    if (isOpen.value || !itemCount.value) return;

    const rect = triggerRef.value?.getBoundingClientRect();
    if (rect) {
      const below = window.innerHeight - rect.bottom;
      dropUp.value = below < window.innerHeight * VIEWPORT_HEIGHT_CAP && rect.top > below;
    }
    positionPanel();
    isOpen.value = true;
    activeIndex.value = edge === "last" ? lastEnabled() : firstEnabled();

    await nextTick();
    const el = menuRef.value;
    if (el?.showPopover && !el.matches(":popover-open")) el.showPopover();
    focusActive();
  }

  function close(refocus = true) {
    if (!isOpen.value) return;
    isOpen.value = false;
    activeIndex.value = -1;
    if (refocus) triggerRef.value?.focus();
  }

  function setActive(index: number) {
    if (index < 0) return;
    activeIndex.value = index;
    focusActive();
  }

  function move(dir: 1 | -1) {
    const from =
      activeIndex.value < 0 ? (dir === 1 ? -1 : itemCount.value) : activeIndex.value + dir;
    const next = enabledFrom(from, dir);
    setActive(next >= 0 ? next : dir === 1 ? firstEnabled() : lastEnabled());
  }

  function activate(index: number) {
    if (index < 0 || isDisabled(index)) return;
    onActivate(index);
    close();
  }

  function onTriggerKeydown(e: KeyboardEvent) {
    switch (e.key) {
      case "ArrowDown":
      case "Enter":
      case " ":
        e.preventDefault();
        void open("first");
        break;
      case "ArrowUp":
        e.preventDefault();
        void open("last");
        break;
    }
  }

  function onMenuKeydown(e: KeyboardEvent) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        move(1);
        break;
      case "ArrowUp":
        e.preventDefault();
        move(-1);
        break;
      case "Home":
        e.preventDefault();
        setActive(firstEnabled());
        break;
      case "End":
        e.preventDefault();
        setActive(lastEnabled());
        break;
      case "Escape":
        e.preventDefault();
        close();
        break;
      case "Tab":
        close(false);
        break;
    }
  }

  // Keep the highlight valid if the item list shrinks while open.
  watch(
    () => itemCount.value,
    (len) => {
      if (activeIndex.value >= len) activeIndex.value = firstEnabled();
    },
  );

  useEventListener(
    window,
    "scroll",
    () => {
      if (isOpen.value) positionPanel();
    },
    { capture: true, passive: true },
  );
  useEventListener(window, "resize", () => {
    if (isOpen.value) positionPanel();
  });
  onClickOutside(menuRef, () => close(false), { ignore: [triggerRef] });

  return {
    isOpen,
    dropUp,
    activeIndex,
    panelStyle,
    toggle: () => {
      if (isOpen.value) close();
      else void open();
    },
    setActive,
    activate,
    onTriggerKeydown,
    onMenuKeydown,
  };
}
