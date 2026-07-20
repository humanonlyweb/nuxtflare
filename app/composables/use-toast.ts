export type ToastTone = "success" | "danger";

export interface Toast {
  id: number;
  message: string;
  tone: ToastTone;
}

const items = ref<Toast[]>([]);
let counter = 0;

function push(message: string, tone: ToastTone) {
  if (import.meta.server) return -1;

  const id = ++counter;
  items.value = [...items.value, { id, message, tone }];
  return id;
}

export function useToast() {
  return {
    items: readonly(items),
    dismiss: (id: number) => {
      items.value = items.value.filter((toast) => toast.id !== id);
    },
    success: (message: string) => push(message, "success"),
    error: (message: string) => push(message, "danger"),
  };
}
