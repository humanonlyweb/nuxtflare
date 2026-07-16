import { z } from "zod";

import { idSchema } from "./helper";

export const noteIdSchema = z.object({ id: idSchema("note") });
export const createNoteSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(120, "Keep the title under 120 characters"),
  body: z.string().max(10_000, "Keep the note under 10,000 characters").default(""),
});
export const updateNoteSchema = createNoteSchema.partial();

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
