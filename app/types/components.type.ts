import type { TdHTMLAttributes } from "vue";

// Button
export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "link";
export type ButtonSize = "small" | "medium" | "large";
export type ButtonType = "button" | "submit" | "reset";
export type LinkTarget = "_blank" | "_self" | "_parent" | "_top";

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

// Icons
export type IconName =
  | "arrow-down"
  | "check"
  | "chevron-down"
  | "github"
  | "google"
  | "pencil"
  | "trash"
  | "x";
