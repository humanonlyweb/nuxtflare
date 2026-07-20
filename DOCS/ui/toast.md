# UiToast + useToast

Toast notifications. Raise them from anywhere with the `useToast()` composable; render
the stack once with `<UiToast>` (auto-imported from `app/components/ui/toast/index.vue`,
teleported to `<body>`). Mount it once — e.g. in your default layout.

## useToast()

```ts
const toast = useToast();
toast.success("Saved."); // returns the toast id
toast.error("Something broke.");
toast.dismiss(id); // remove one early
toast.setMax(3); // change the visible cap
```

| Member    | Type                          | Notes                                    |
| --------- | ----------------------------- | ---------------------------------------- |
| `success` | `(message: string) => number` | Pushes a `success` toast, returns its id |
| `error`   | `(message: string) => number` | Pushes a `danger` toast                  |
| `dismiss` | `(id: number) => void`        | Remove a toast by id                     |
| `setMax`  | `(max: number) => void`       | Max simultaneously-shown toasts          |
| `items`   | `readonly Ref<Toast[]>`       | The live queue (for custom renderers)    |

The queue is a **client-only** module singleton (pushes are no-ops during SSR to avoid
cross-request state), capped at the most recent `max` (oldest drops when full).

## UiToast props

| Prop  | Type     | Default | Notes                                |
| ----- | -------- | ------- | ------------------------------------ |
| `max` | `number` | `5`     | Max visible toasts (drives `setMax`) |

### Slots

| Slot         | Purpose                                             |
| ------------ | --------------------------------------------------- |
| `icon`       | Per-toast leading icon                              |
| `close-icon` | Dismiss-button icon (default `<UiIcon name="x" />`) |

## Styling hooks

`data-part="toast-viewport" | "toast" | "toast-icon" | "toast-message" | "toast-close"`;
state `data-toast-tone="success|danger"`. Enter/leave/reorder motion is the
`ui-toast` transition. Because the stack teleports to `<body>`, put its CSS in a
**global** stylesheet, not a page-scoped block.

## Usage

```vue
<!-- once, in the layout -->
<UiToast :max="5" />

<!-- anywhere -->
<script setup>
const toast = useToast();
</script>
<UiButton @click="toast.success('Saved!')">Save</UiButton>
```

## Notes

- Each toast auto-dismisses after ~4.5s, pausing while hovered or the tab is hidden.
- The viewport ships sensible fixed bottom-right placement; override
  `[data-part="toast-viewport"]` to move it.
