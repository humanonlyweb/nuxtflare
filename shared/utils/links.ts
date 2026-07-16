export const AUTH_REDIRECT_COOKIE = "auth_redirect";

export function safeRedirectPath(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  if (!value.startsWith("/") || /^\/[/\\]/.test(value)) return undefined;
  return value;
}
