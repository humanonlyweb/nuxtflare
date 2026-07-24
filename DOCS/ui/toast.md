# UiToast + useToast

Raise toasts from anywhere with `useToast()`; render the stack once with `<UiToast>`
(teleported to `<body>`) — usually in your default layout.

## useToast()

```ts
const toast = useToast();
toast.success("Saved."); // returns the toast id
toast.error("Something broke.");
toast.dismiss(id);
toast.setMax(3);
```

| Member    | Type                          | Notes                                    |
| --------- | ----------------------------- | ---------------------------------------- |
| `success` | `(message: string) => number` | Pushes a `success` toast, returns its id |
| `error`   | `(message: string) => number` | Pushes a `danger` toast                  |
| `dismiss` | `(id: number) => void`        | Remove a toast by id                     |
| `setMax`  | `(max: number) => void`       | Max simultaneously-shown toasts          |
| `items`   | `readonly Ref<Toast[]>`       | Live queue, for custom renderers         |

The queue is a **client-only** module singleton — pushes are no-ops during SSR, so there's
no cross-request state. Capped at the most recent `max`; the oldest drops when full.

## UiToast

| Prop  | Type     | Default | Notes                                |
| ----- | -------- | ------- | ------------------------------------ |
| `max` | `number` | `5`     | Max visible toasts (drives `setMax`) |

| Slot         | Purpose                                             |
| ------------ | --------------------------------------------------- |
| `icon`       | Per-toast leading icon                              |
| `close-icon` | Dismiss-button icon (default `<UiIcon name="x" />`) |

## Styling hooks

`data-part="toast-viewport" | "toast" | "toast-icon" | "toast-message" | "toast-close"`;
state `data-toast-tone="success|danger"`. Motion is the `ui-toast` transition. The stack
teleports to `<body>`, so its CSS must be **global**, not page-scoped.

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

- Auto-dismisses after ~4.5s, paused while hovered or the tab is hidden.
- Ships fixed bottom-right placement; override `[data-part="toast-viewport"]` to move it.
