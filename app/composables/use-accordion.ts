import type { InjectionKey } from "vue";

export interface AccordionContext {
  isOpen: (value: string) => boolean;
  isLocked: (value: string) => boolean;
  toggle: (value: string) => void;
}

export const accordionKey: InjectionKey<AccordionContext> = Symbol("ui-accordion");

export function useAccordionItem() {
  const context = inject(accordionKey, null);
  if (!context) throw new Error("<UiAccordionItem> must be used inside <UiAccordion>.");
  return context;
}
