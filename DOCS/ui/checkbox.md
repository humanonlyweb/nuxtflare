# UiCheckbox

Wraps a native `<input type="checkbox">`, so Space toggle, focus and form submission come
free.

## Props

| Prop            | Type               | Default | Notes                                          |
| --------------- | ------------------ | ------- | ---------------------------------------------- |
| `label`         | `string`           | —       | Or use the default slot                        |
| `value`         | `string \| number` | —       | Contributed when `v-model` is an array         |
| `indeterminate` | `boolean`          | `false` | Visual mixed state (a DOM property, reflected) |
| `disabled`      | `boolean`          | `false` |                                                |
| `id`            | `string`           | auto    | Override the generated id                      |

`v-model` binds a `boolean`, or an array for a group (native `v-model` adds/removes
`value`). Unknown attrs (`name`, `required`, `true-value`…) fall through.

No `error` prop — render validation messages yourself (see
[`useForm`](../composables/use-form.md)).

## Slots

| Slot        | Purpose                     |
| ----------- | --------------------------- |
| `default`   | Label content               |
| `indicator` | Custom glyph inside the box |

## Styling hooks

`data-part="checkbox" | "checkbox-input" | "checkbox-control" | "checkbox-label"`; state
`data-checkbox-disabled` (label). Style the box off the input's native pseudo-classes via
the adjacent control:

```css
[data-part="checkbox-input"] { position: absolute; opacity: 0; width: 1px; height: 1px; }
[data-part="checkbox-input"]:checked + [data-part="checkbox-control"] { … }
[data-part="checkbox-input"]:indeterminate + [data-part="checkbox-control"] { … }
```

## Usage

```vue
<UiCheckbox v-model="accepted">I accept the terms</UiCheckbox>

<!-- Group + a "select all" with an indeterminate middle state -->
<UiCheckbox v-model="allChecked" :indeterminate="someChecked" label="Select all" />
<UiCheckbox v-for="o in options" :key="o" v-model="picked" :value="o" :label="o" />
```

## Notes

- `indeterminate` is a property, not an attribute, so it's reflected reactively — drive it
  from a parent (a "select all" that's partially checked).
- For a single on/off toggle, [`UiSwitch`](./switch.md) usually reads friendlier.
