import type { notes } from "#server/database/schema";

export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;

export interface NoteRef {
  id: string;
  userId: string;
}
