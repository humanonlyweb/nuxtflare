import type { TdHTMLAttributes } from "vue";

// Button
export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "link";
export type ButtonSize = "small" | "medium" | "large";
export type ButtonShape = "square" | "round";
export type ButtonType = "button" | "submit" | "reset";
export type LinkTarget = "_blank" | "_self" | "_parent" | "_top";

// Avatar
export type AvatarSize = "small" | "medium" | "large";

export interface AvatarItem {
  name: string;
  src?: string;
  id?: string | number;
}

// Command palette
export interface CommandItem<T extends SelectValue = SelectValue> {
  value: T;
  label: string;
  /** Consecutive items sharing a group render under one heading. */
  group?: string;
  icon?: IconName;
  /** Chord for the trailing key caps, e.g. "mod+shift+s". */
  keys?: string;
  hint?: string;
  disabled?: boolean;
}

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
  | "arrow-up"
  | "check"
  | "chevron-down"
  | "chevron-left"
  | "chevron-right"
  | "chevron-up"
  | "minus"
  | "more-horizontal"
  | "plus"
  | "search"
  | "x"
  | "copy"
  | "download"
  | "external-link"
  | "eye"
  | "pencil"
  | "redo"
  | "send"
  | "sliders"
  | "trash"
  | "undo"
  | "columns"
  | "divider"
  | "grip-vertical"
  | "image"
  | "layout-grid"
  | "rectangle-horizontal"
  | "type"
  | "braces"
  | "code"
  | "link"
  | "clock"
  | "mail"
  | "monitor"
  | "smartphone"
  | "alert-triangle"
  | "check-circle"
  | "info"
  | "github"
  | "google";
