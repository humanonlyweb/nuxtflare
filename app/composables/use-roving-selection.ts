import type { SelectOption } from "~/types/components.type";

interface RovingSelectionOptions<T extends string | number> {
  items: () => SelectOption<T>[];
  elements: () => HTMLElement[] | undefined;
  model: Ref<T | undefined>;
  disabled?: () => boolean;
}

export function useRovingSelection<T extends string | number>({
  items,
  elements,
  model,
  disabled = () => false,
}: RovingSelectionOptions<T>) {
  const enabledIndexes = computed(() =>
    items().reduce<number[]>((acc, option, index) => {
      if (!option.disabled) acc.push(index);
      return acc;
    }, []),
  );

  function isTabStop(option: SelectOption<T>, index: number) {
    if (model.value != null) return option.value === model.value;
    return index === enabledIndexes.value[0];
  }

  function select(option: SelectOption<T>) {
    if (disabled() || option.disabled) return;
    model.value = option.value;
  }

  function moveTo(index: number | undefined) {
    if (index == null) return;
    model.value = items()[index]!.value;
    elements()?.[index]?.focus();
  }

  function step(direction: 1 | -1) {
    const enabled = enabledIndexes.value;
    if (!enabled.length) return;

    const current = model.value == null ? -1 : items().findIndex((o) => o.value === model.value);
    const position = enabled.indexOf(current);
    if (position < 0) {
      moveTo(direction === 1 ? enabled[0] : enabled.at(-1));
      return;
    }

    moveTo(enabled[(position + direction + enabled.length) % enabled.length]);
  }

  function onKeydown(event: KeyboardEvent) {
    if (disabled()) return;

    const enabled = enabledIndexes.value;
    const actions: Record<string, () => void> = {
      ArrowRight: () => step(1),
      ArrowDown: () => step(1),
      ArrowLeft: () => step(-1),
      ArrowUp: () => step(-1),
      Home: () => moveTo(enabled[0]),
      End: () => moveTo(enabled.at(-1)),
    };

    const action = actions[event.key];
    if (!action) return;
    event.preventDefault();
    action();
  }

  return { isTabStop, select, onKeydown };
}
