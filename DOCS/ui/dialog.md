# UiDialog / UiDialogConfirm

Modal dialog built on the native `<dialog>` element (`showModal()` — real top-layer,
focus trap and backdrop for free). Auto-imported as `<UiDialog>` from
`app/components/ui/dialog/index.vue`, and `<UiDialogConfirm>` from
`app/components/ui/dialog/confirm.vue`. Control visibility with `v-model:open`.

## UiDialog props

| Prop              | Type                   | Default | Notes                          |
| ----------------- | ---------------------- | ------- | ------------------------------ |
| `title`           | `string`               | —       | Renders a titled header        |
| `description`     | `string`               | —       | Sub-text under the title       |
| `size`            | `"sm" \| "md" \| "lg"` | `"md"`  | Exposed as `data-dialog-size`  |
| `dismissible`     | `boolean`              | `true`  | Allow Esc / close to dismiss   |
| `closeOnBackdrop` | `boolean`              | `true`  | Click outside the panel closes |
| `showCloseButton` | `boolean`              | `true`  | Render the header close button |

`v-model:open` binds a `boolean`. Emits `close`.

### Slots

| Slot         | Props       | Purpose                                           |
| ------------ | ----------- | ------------------------------------------------- |
| `default`    | `{ close }` | Body content (lazy-mounted on first open)         |
| `header`     | —           | Replace the whole header                          |
| `footer`     | `{ close }` | Footer actions                                    |
| `close-icon` | —           | Close-button icon (default `<UiIcon name="x" />`) |

### Styling hooks

`data-part="dialog" | "panel" | "header" | "header-text" | "title" | "description" |
"close" | "body" | "footer"`; state `data-dialog-size`. The native `[open]` attribute
reflects visibility.

## UiDialogConfirm

Convenience confirm/cancel dialog over `UiDialog`.

| Prop          | Type      | Default     |
| ------------- | --------- | ----------- |
| `title`       | `string`  | —           |
| `description` | `string`  | —           |
| `confirmText` | `string`  | `"Confirm"` |
| `cancelText`  | `string`  | `"Cancel"`  |
| `danger`      | `boolean` | `false`     |

`v-model:open` binds a `boolean`. Emits `confirm` and `cancel` (cancel also fires if the
dialog is dismissed without a choice).

## Usage

```vue
<UiButton @click="open = true">Edit</UiButton>

<UiDialog v-model:open="open" title="Edit profile" description="Update your details.">
  <UiInput v-model="name" label="Name" />
  <template #footer="{ close }">
    <UiButton variant="ghost" @click="close">Cancel</UiButton>
    <UiButton @click="save">Save</UiButton>
  </template>
</UiDialog>

<UiDialogConfirm
  v-model:open="confirmOpen"
  title="Delete item?"
  description="This can't be undone."
  confirm-text="Delete"
  danger
  @confirm="remove(id)"
/>
```

## Notes

- The body is lazy-mounted on first open and kept mounted after, so a heavy form isn't
  built until needed and re-opening is instant.
- Open/close/backdrop motion uses `@starting-style` + `allow-discrete` (reduced-motion
  gated). The component keeps `margin: auto` so it stays centered despite the global
  `* { margin: 0 }` reset — style everything else (width, surface, padding) yourself.
