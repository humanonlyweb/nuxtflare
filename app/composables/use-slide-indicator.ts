import type { ShallowRef } from "vue";

interface SlideIndicatorOptions {
  container: Readonly<ShallowRef<HTMLElement | null>>;
  items: () => HTMLElement[] | undefined;
  activeIndex: () => number;
}

export function useSlideIndicator({ container, items, activeIndex }: SlideIndicatorOptions) {
  const offset = ref(0);
  const size = ref(0);
  const isMeasured = ref(false);
  const canAnimate = ref(false);

  function measure() {
    const el = items()?.[activeIndex()];
    if (!el) {
      isMeasured.value = false;
      return;
    }
    offset.value = el.offsetLeft;
    size.value = el.offsetWidth;
    isMeasured.value = true;
  }

  watch([activeIndex, () => items()?.length], measure, { flush: "post" });

  useResizeObserver(container, measure);

  onMounted(() => {
    measure();
    requestAnimationFrame(() => {
      canAnimate.value = true;
    });
  });

  const style = computed(() => ({
    transform: `translateX(${offset.value}px)`,
    width: `${size.value}px`,
  }));

  return { style, isMeasured, canAnimate };
}
