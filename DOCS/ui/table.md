# UiTable

Data table, generic over the row type `T`. Pass `columns` + `rows` for the common case, or
compose the primitives for full control.

## Props

| Prop           | Type                                   | Default | Notes                                         |
| -------------- | -------------------------------------- | ------- | --------------------------------------------- |
| `columns`      | `TableColumn<T>[]`                     | —       | Column defs                                   |
| `rows`         | `T[]`                                  | —       | Row data                                      |
| `rowKey`       | `keyof T \| ((row, i) => PropertyKey)` | index   | Stable `:key` per row                         |
| `caption`      | `string`                               | —       | Accessible caption; makes it a `region`       |
| `stickyHeader` | `boolean`                              | `false` | Sticky `<thead>`                              |
| `hideHeader`   | `boolean`                              | `false` | Visually hide the header (still in a11y tree) |
| `rowClass`     | `(row, i) => string \| undefined`      | —       | Per-row class                                 |

`TableColumn<T>` (`~/types/components.type`):
`{ key, header, accessor?, align?, numeric?, width? }`.

## Slots

- `` `${column.key}-cell` `` — `{ row, value, column, rowIndex }`
- `` `${column.key}-header` `` — `{ column }`
- `empty` — shown when `rows` is empty
- `footer` — `{ columns }`, renders a `<tfoot>`

## Composition primitives

Also auto-imported, for bespoke tables: `<UiTableHeader :sticky :sr-only>`,
`<UiTableRow :interactive @click>`, `<UiTableCell as="td|th" :align :numeric :scope>`,
`<UiTableFooter>`.

## Styling hooks

`data-part="table-scroll" | "table" | "caption" | "table-header" | "row" | "cell" |
"table-footer" | "empty"`. State: `data-table-sticky`, `data-table-sr-only` (header),
`data-table-interactive` (row), `data-table-align`, `data-table-numeric` (cell).

## Usage

```vue
<UiTable :columns="columns" :rows="people" row-key="id" caption="Team">
  <template #commits-cell="{ value }"><strong>{{ value }}</strong></template>
  <template #empty>No people yet.</template>
</UiTable>
```

## Notes

- The wrapper scrolls horizontally so wide tables never overflow the page.
- Only functional CSS ships (scroll, sticky, visually-hidden header) — borders, padding and
  typography are your skin.
