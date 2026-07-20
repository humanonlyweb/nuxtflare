import type { TdHTMLAttributes } from "vue";

// Select
export type SelectValue = string | number;

export interface SelectOption<T extends SelectValue = SelectValue> {
  label: string;
  value: T;
  disabled?: boolean;
}

export type OpenIntent = "first" | "last" | "selected";

// Table
export interface TableColumn<T> {
  key: string;
  header: string;
  accessor?: (row: T) => unknown;
  align?: TdHTMLAttributes["align"];
  numeric?: boolean;
  width?: `${number}px` | `${number}%`;
}

// Tooltip
export type TooltipPlacement = "top" | "bottom";
