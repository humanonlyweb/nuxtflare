export type ToastTone = "success" | "danger";

export interface Toast {
  id: number;
  message: string;
  tone: ToastTone;
}

const DEFAULT_MAX = 5;

export function useToast() {
  const items = useState<Toast[]>("toasts", () => []);
  const maxToasts = useState("toasts:max", () => DEFAULT_MAX);

  function push(message: string, tone: ToastTone) {
    if (import.meta.server) return -1;

    const id = (items.value.at(-1)?.id ?? 0) + 1;
    items.value = [...items.value, { id, message, tone }].slice(-maxToasts.value);
    return id;
  }

  return {
    items: readonly(items),
    dismiss: (id: number) => {
      items.value = items.value.filter((toast) => toast.id !== id);
    },
    setMax: (max: number) => {
      maxToasts.value = Math.max(1, max);
      if (items.value.length > maxToasts.value) {
        items.value = items.value.slice(-maxToasts.value);
      }
    },
    success: (message: string) => push(message, "success"),
    error: (message: string) => push(message, "danger"),
  };
}
