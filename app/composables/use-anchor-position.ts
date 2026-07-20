import type { Ref } from "vue";

interface AnchorRect {
  top: number;
  bottom: number;
  left: number;
  width: number;
}

const EMPTY_RECT: AnchorRect = { top: 0, bottom: 0, left: 0, width: 0 };

// Not useElementBounding(): it attaches a ResizeObserver and a MutationObserver for
// the component's whole lifetime with no way to disable either, so a page of closed
// selects pays for panels that aren't rendered.
export function useAnchorPosition(
  anchor: Readonly<Ref<HTMLElement | null>>,
  isOpen: Readonly<Ref<boolean>>,
  panelHeight: (viewportHeight: number) => number,
) {
  const rect = ref<AnchorRect>({ ...EMPTY_RECT });
  const viewportHeight = ref(0);

  function measure() {
    const el = anchor.value;
    if (!el) return;

    const { top, bottom, left, width } = el.getBoundingClientRect();
    rect.value = { top, bottom, left, width };
    viewportHeight.value = window.innerHeight;
  }

  const dropUp = computed(() => {
    const below = viewportHeight.value - rect.value.bottom;
    return below < panelHeight(viewportHeight.value) && rect.value.top > below;
  });

  // A null target detaches the listeners, so they live only while the panel is open.
  const whileOpen = () => (isOpen.value ? window : null);

  useEventListener(whileOpen, "scroll", measure, { capture: true, passive: true });
  useEventListener(whileOpen, "resize", measure, { passive: true });

  return { rect, viewportHeight, dropUp, measure };
}
