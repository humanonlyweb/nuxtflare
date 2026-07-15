# UiButton

Shared button. Auto-imported as `<UiButton>` from `app/components/ui/button.vue`.

## Props

| Prop       | Type                               | Default     | Notes                                    |
| ---------- | ---------------------------------- | ----------- | ---------------------------------------- |
| `variant`  | `"primary" \| "ghost" \| "danger"` | `"primary"` | Visual style                             |
| `type`     | `"button" \| "submit" \| "reset"`  | `"button"`  | Native button type                       |
| `loading`  | `boolean`                          | `false`     | Disables the button and sets `aria-busy` |
| `disabled` | `boolean`                          | `false`     | Disables the button                      |

Content goes in the default slot.

## Usage

```vue
<UiButton type="submit" :loading="pending">Save</UiButton>
<UiButton variant="ghost">Cancel</UiButton>
<UiButton variant="danger" aria-label="Delete" @click="remove(id)">Delete</UiButton>
```

## Notes

- Pass `:loading` while a request is in flight to prevent duplicate submissions.
- Icon-only buttons must set an explicit `aria-label`.
- Hover styles apply only on hover-capable pointers; press scales to `0.97`.
