# UiTooltip

Wraps a trigger (default slot) and shows `text` on hover or keyboard focus.

## Props

| Prop        | Type                | Default | Notes                                       |
| ----------- | ------------------- | ------- | ------------------------------------------- |
| `text`      | `string`            | —       | Tooltip content (no text ⇒ nothing renders) |
| `placement` | `"top" \| "bottom"` | `"top"` | → `data-tooltip-placement`                  |

## Styling hooks

`data-part="tooltip-root" | "tooltip"`; state `data-tooltip-placement="top|bottom"`. The
arrow is a `::after` whose colour reads from `--ui-tooltip-arrow` — set it to your tooltip
background:

```css
[data-part="tooltip"] {
  background: var(--text);
  color: var(--bg);
  --ui-tooltip-arrow: var(--text);
}
```

## Usage

```vue
<UiTooltip text="Copy to clipboard">
  <UiButton variant="ghost" aria-label="Copy">…</UiButton>
</UiTooltip>
```

## Notes

- Reveal, positioning and arrow geometry ship in the component; padding, colour and radius
  are yours.
- Pure CSS reveal with a 250ms delay; reduced-motion drops the movement, keeps the fade.
- Rich or interactive content belongs in a popover/menu, not a tooltip.
