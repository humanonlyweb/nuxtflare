import type { TdHTMLAttributes } from "vue";
import type { RouteLocationRaw } from "vue-router";

// Button
export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "link";
export type ButtonSize = "small" | "medium" | "large";
export type ButtonType = "button" | "submit" | "reset";
export type LinkTarget = "_blank" | "_self" | "_parent" | "_top";

/* Buttons render as <button>, NuxtLink or <a>. The union keeps those mutually
   exclusive: `to`/`href`/`type` can never be combined at a call site. */
export type ButtonElementProps<Base> =
  | (Base & { type?: ButtonType; href?: never; to?: never })
  | (Base & { to: RouteLocationRaw; href?: never; type?: never })
  | (Base & { href: string; target?: LinkTarget; to?: never; type?: never });

export type ButtonBaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
};

export type ButtonProps = ButtonElementProps<ButtonBaseProps & { fullWidth?: boolean }>;

export type IconButtonProps = ButtonElementProps<ButtonBaseProps & { label: string }>;

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
export type IconName = "arrow-down" | "check" | "chevron-down" | "pencil" | "trash" | "x";
