<script setup lang="ts" generic="T">
import type { TableColumn } from "~/types/components.type";

const {
  columns,
  rows,
  rowKey,
  caption,
  stickyHeader = false,
  hideHeader = false,
  rowClass,
} = defineProps<{
  columns: TableColumn<T>[];
  rows: T[];
  rowKey?: keyof T | ((row: T, index: number) => PropertyKey);
  caption?: string;
  stickyHeader?: boolean;
  hideHeader?: boolean;
  rowClass?: (row: T, index: number) => string | undefined;
}>();

defineSlots<
  Record<
    `${string}-cell`,
    (props: { row: T; value: unknown; column: TableColumn<T>; rowIndex: number }) => unknown
  > &
    Record<`${string}-header`, (props: { column: TableColumn<T> }) => unknown> & {
      empty?: () => unknown;
      footer?: (props: { columns: TableColumn<T>[] }) => unknown;
    }
>();

const captionId = useId();
const hasWidths = computed(() => columns.some((column) => column.width));

function keyFor(row: T, index: number): PropertyKey {
  if (typeof rowKey === "function") return rowKey(row, index);
  if (rowKey != null) return row[rowKey] as PropertyKey;
  return index;
}

function valueFor(row: T, column: TableColumn<T>): unknown {
  return column.accessor ? column.accessor(row) : (row as Record<string, unknown>)[column.key];
}
</script>

<template>
  <div
    data-part="table-scroll"
    tabindex="0"
    :role="caption ? 'region' : undefined"
    :aria-labelledby="caption ? captionId : undefined"
  >
    <table data-part="table">
      <caption v-if="caption" :id="captionId" data-part="caption">
        {{
          caption
        }}
      </caption>

      <colgroup v-if="hasWidths">
        <col v-for="column in columns" :key="column.key" :style="{ width: column.width }" />
      </colgroup>

      <UiTableHeader :sticky="stickyHeader" :sr-only="hideHeader">
        <UiTableRow>
          <UiTableCell
            v-for="column in columns"
            :key="column.key"
            as="th"
            scope="col"
            :align="column.align"
            :numeric="column.numeric"
          >
            <slot :name="`${column.key}-header`" :column="column">{{ column.header }}</slot>
          </UiTableCell>
        </UiTableRow>
      </UiTableHeader>

      <tbody>
        <UiTableRow
          v-for="(row, rowIndex) in rows"
          :key="keyFor(row, rowIndex)"
          :class="rowClass?.(row, rowIndex)"
        >
          <UiTableCell
            v-for="column in columns"
            :key="column.key"
            :align="column.align"
            :numeric="column.numeric"
          >
            <slot
              :name="`${column.key}-cell`"
              :row="row"
              :value="valueFor(row, column)"
              :column="column"
              :row-index="rowIndex"
            >
              {{ valueFor(row, column) }}
            </slot>
          </UiTableCell>
        </UiTableRow>

        <tr v-if="!rows.length">
          <td data-part="empty" :colspan="columns.length">
            <slot name="empty">No data to display.</slot>
          </td>
        </tr>
      </tbody>

      <UiTableFooter v-if="$slots.footer">
        <slot name="footer" :columns="columns" />
      </UiTableFooter>
    </table>
  </div>
</template>

<style scoped>
/* Functional only: let wide tables scroll instead of overflowing the page. */
[data-part="table-scroll"] {
  width: 100%;
  overflow-x: auto;
}

[data-part="table"] {
  width: 100%;
  border-collapse: collapse;
}
</style>
