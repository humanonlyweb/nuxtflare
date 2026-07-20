export type ToastTone = "success" | "danger";

export interface Toast {
  id: number;
  message: string;
  tone: ToastTone;
}

const DEFAULT_MAX = 5;

const items = ref<Toast[]>([]);
const maxToasts = ref(DEFAULT_MAX);
let counter = 0;

function push(message: string, tone: ToastTone) {
  if (import.meta.server) return -1;

  const id = ++counter;
  items.value = [...items.value, { id, message, tone }].slice(-maxToasts.value);
  return id;
}

export function useToast() {
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
