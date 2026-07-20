# UiTooltip

Hover/focus tooltip. Auto-imported as `<UiTooltip>` from
`app/components/ui/tooltip.vue`. Wraps a trigger (default slot) and shows `text` on
hover or keyboard focus.

## Props

| Prop        | Type                | Default | Notes                                       |
| ----------- | ------------------- | ------- | ------------------------------------------- |
| `text`      | `string`            | —       | Tooltip content (no text ⇒ nothing renders) |
| `placement` | `"top" \| "bottom"` | `"top"` | Exposed as `data-tooltip-placement`         |

## Styling hooks

`data-part="tooltip-root" | "tooltip"`; state `data-tooltip-placement="top|bottom"`.
The pointer arrow is a `::after` on the tooltip whose colour reads from the
`--ui-tooltip-arrow` custom property — set it to your tooltip's background:

```css
[data-part="tooltip"] {
  background: var(--text);
  color: var(--bg);
  --ui-tooltip-arrow: var(--text); /* arrow matches the background */
}
```

## Usage

```vue
<UiTooltip text="Copy to clipboard">
  <UiButton variant="ghost" aria-label="Copy">…</UiButton>
</UiTooltip>
```

## Notes

- Reveal, positioning and the arrow geometry ship in the component; padding, colour and
  radius are your CSS.
- Pure CSS reveal with a 250ms delay; reduced-motion drops the movement, keeps the fade.
- For rich interactive content, reach for a popover/menu rather than a tooltip.
