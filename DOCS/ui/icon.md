# UiIcon

Renders one symbol from the SVG sprite.

Every other component takes icons as slots; `UiSelect`, `UiAccordionItem`, `UiDialog` and
`UiToast` default those slots to `UiIcon` (`chevron-down`, `check`, `x`). Override the slot
to pass your own `<svg>` or an icon library — replacing `UiIcon` outright means updating
those four defaults too.

## Props

| Prop    | Type                | Default | Notes                                      |
| ------- | ------------------- | ------- | ------------------------------------------ |
| `name`  | `IconName`          | —       | Symbol id without the `i-` prefix          |
| `size`  | `` `${number}px` `` | —       | Sets `--icon-size` inline; omit to inherit |
| `label` | `string`            | —       | Accessible name; omit for decorative icons |

`IconName` is a union in `app/types/components.type.ts`, so a typo is a type error rather
than an invisible empty box.

## Accessibility

`label` decides how the icon is exposed:

- **omitted** → `aria-hidden="true"`. Right when the icon sits next to text, or inside a
  `UiIconButton` that already carries the label — otherwise the name is announced twice.
- **provided** → `role="img"` + `aria-label`. Use when the icon is the only content.

`focusable="false"` is always set (legacy IE/Edge would otherwise put SVGs in the tab
order).

## Styling hooks

`data-part="icon"` plus the `--icon-size` custom property. No CSS ships — give it a size,
or an `<svg>` with no dimensions falls back to the SVG default of 300×150:

```css
[data-part="icon"] {
  width: var(--icon-size, 1em);
  height: var(--icon-size, 1em);
  flex: none;
}
```

The `1em` fallback makes icons track the surrounding font size; `size` overrides it per
instance.

## Usage

```vue
<UiIcon name="pencil" />
<UiIcon name="trash" size="20px" />
<UiIcon name="arrow-down" label="Sort descending" />
```

## The sprite

Icons live in `public/assets/icon-sprite.svg` as `<symbol>`s with `i-`-prefixed ids.
`UiIcon` references them as `/assets/icon-sprite.svg#i-<name>`.

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

1. Paste the paths into a new `<symbol id="i-<name>" viewBox="…">` in the sprite.
2. Add `"<name>"` to the `IconName` union in `app/types/components.type.ts`.

Skip step 2 and the name won't typecheck; skip step 1 and it typechecks but renders
nothing.

### Conventions that matter

- **`currentColor`, never a hard-coded colour.** It resolves against the _referencing_
  element, so an icon takes the colour of the button or link it sits in and follows
  light/dark for free.
- **Set `fill`/`stroke` on the `<symbol>`, not the `<use>`.** `icon.vue` puts
  `fill="currentColor"` on the outer `<svg>`; stroke-style icons override it with
  `fill="none" stroke="currentColor"` on their own symbol.
- **One `viewBox` per sprite** (this one is `0 0 24 24`) so stroke widths stay consistent.

### Why a sprite

One cached request for the whole set, no per-icon component, no build step, no icon library
in the bundle. Tradeoff: the sprite is a separate fetch, so the first icon paint can lag
the HTML by a frame. If that bothers you more than the caching helps, inline the sprite
into `app.vue` and drop the file path from `icon.vue`.
