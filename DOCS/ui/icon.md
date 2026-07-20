# UiIcon

Renders one symbol from the SVG sprite. Auto-imported as `<UiIcon>` from
`app/components/ui/icon.vue`.

Every other component takes its icons as slots; `UiSelect`, `UiAccordionItem`, `UiDialog`
and `UiToast` default those slots to `UiIcon` (`chevron-down`, `check`, `x`) so they look
right untouched. Override the slot to pass your own `<svg>` or an icon library — replacing
`UiIcon` outright means updating those four defaults too.

## Props

| Prop    | Type                | Default | Notes                                      |
| ------- | ------------------- | ------- | ------------------------------------------ |
| `name`  | `IconName`          | —       | Symbol id without the `i-` prefix          |
| `size`  | `` `${number}px` `` | —       | Sets `--icon-size` inline; omit to inherit |
| `label` | `string`            | —       | Accessible name; omit for decorative icons |

`IconName` is a union in `app/types/components.type.ts`, so a typo is a type error
rather than an invisible empty box.

## Accessibility

`label` decides how the icon is exposed:

- **omitted** (default) → `aria-hidden="true"`. Correct when the icon sits next to text,
  or inside a `UiIconButton` that already carries the label — otherwise the name is
  announced twice.
- **provided** → `role="img"` + `aria-label`. Use when the icon is the only content and
  nothing else names it.

`focusable="false"` is always set (IE/Edge legacy would otherwise put SVGs in the tab order).

## Styling hooks

`data-part="icon"`, plus the `--icon-size` custom property.

The component ships no CSS. Give it a size in your stylesheet — an `<svg>` with no
dimensions falls back to the SVG default of 300×150:

```css
[data-part="icon"] {
  width: var(--icon-size, 1em);
  height: var(--icon-size, 1em);
  flex: none;
}
```

The `1em` fallback makes icons scale with the surrounding font size, so they track button
and heading sizes automatically. The `size` prop overrides it per instance.

## Usage

```vue
<UiIcon name="pencil" />
<UiIcon name="trash" size="20px" />
<UiIcon name="arrow-down" label="Sort descending" />
```

## The sprite

Icons live in one file, `public/assets/icon-sprite.svg`, as `<symbol>` elements whose ids
are prefixed `i-`. `UiIcon` references them as `/assets/icon-sprite.svg#i-<name>`.

```svg
<svg xmlns="http://www.w3.org/2000/svg" style="display: none">
  <symbol
    id="i-pencil"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </symbol>
</svg>
```

### Adding an icon

1. Paste the icon's paths into a new `<symbol id="i-<name>" viewBox="…">` in the sprite.
2. Add `"<name>"` to the `IconName` union in `app/types/components.type.ts`.

Two steps, both mechanical — but skipping step 2 means the name won't typecheck, and
skipping step 1 means it typechecks and renders nothing.

### Conventions that matter

- **`currentColor`, never a hard-coded colour.** It resolves against the _referencing_
  element, so an icon takes the colour of the button or link it sits in, and follows
  light/dark automatically.
- **Set `fill`/`stroke` on the `<symbol>`, not the `<use>`.** `icon.vue` puts
  `fill="currentColor"` on the outer `<svg>` as the default; stroke-style icons override it
  with `fill="none" stroke="currentColor"` on their own symbol.
- **Keep one `viewBox` per sprite** (this one is `0 0 24 24`) so stroke widths stay
  visually consistent across icons.

### Why a sprite

One cached request for the whole set, no per-icon component, no build step, and no icon
library in the bundle. The tradeoff: the sprite is fetched separately, so the very first
icon paint can lag the HTML by a frame. If that matters more than the caching, inline the
`<svg>` sprite into `app.vue` instead and drop the file path from `icon.vue`.
