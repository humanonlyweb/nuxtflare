import type { CommandItem, SelectValue } from "~/types/components.type";

interface CommandPaletteOptions<T extends SelectValue> {
  items: () => CommandItem<T>[];
  filter?: (item: CommandItem<T>, query: string) => boolean;
  onSelect: (item: CommandItem<T>) => void;
}

export interface CommandGroup<T extends SelectValue> {
  name?: string;
  entries: { item: CommandItem<T>; index: number }[];
}

function defaultFilter<T extends SelectValue>(item: CommandItem<T>, query: string) {
  return (
    item.label.toLowerCase().includes(query) || Boolean(item.group?.toLowerCase().includes(query))
  );
}

/**
 * Query, filtering and active-option state for a command palette.
 *
 * TODO: might add fuzzysort (https://npmx.dev/package/fuzzysort)
 */
export function useCommandPalette<T extends SelectValue>({
  items,
  filter,
  onSelect,
}: CommandPaletteOptions<T>) {
  const query = ref("");
  const activeIndex = ref(0);

  const matches = computed(() => {
    const q = query.value.trim().toLowerCase();
    if (!q) return items();
    return items().filter((item) => (filter ?? defaultFilter)(item, q));
  });

  const selectable = computed(() =>
    matches.value.reduce<number[]>((acc, item, index) => {
      if (!item.disabled) acc.push(index);
      return acc;
    }, []),
  );

  const groups = computed(() =>
    matches.value.reduce<CommandGroup<T>[]>((acc, item, index) => {
      const last = acc.at(-1);
      if (last && last.name === item.group) last.entries.push({ item, index });
      else acc.push({ name: item.group, entries: [{ item, index }] });
      return acc;
    }, []),
  );

  watch(matches, () => {
    activeIndex.value = selectable.value[0] ?? 0;
  });

  function setActive(index: number) {
    if (matches.value[index]?.disabled) return;
    activeIndex.value = index;
  }

  function step(direction: 1 | -1) {
    const list = selectable.value;
    if (!list.length) return;
    const position = list.indexOf(activeIndex.value);
    const next = position < 0 ? 0 : (position + direction + list.length) % list.length;
    activeIndex.value = list[next]!;
  }

  function select(item: CommandItem<T>) {
    if (item.disabled) return;
    onSelect(item);
  }

  function onKeydown(event: KeyboardEvent) {
    const list = selectable.value;
    const actions: Record<string, () => void> = {
      ArrowDown: () => step(1),
      ArrowUp: () => step(-1),
      Home: () => list[0] != null && (activeIndex.value = list[0]),
      End: () => list.at(-1) != null && (activeIndex.value = list.at(-1)!),
      Enter: () => {
        const item = matches.value[activeIndex.value];
        if (item) select(item);
      },
    };

    const action = actions[event.key];
    if (!action) return;
    // Escape is left alone: <dialog> already closes on it.
    event.preventDefault();
    action();
  }

  function reset() {
    query.value = "";
    activeIndex.value = selectable.value[0] ?? 0;
  }

  return { query, matches, groups, activeIndex, setActive, select, onKeydown, reset };
}
