import { and, desc, eq, lt } from "drizzle-orm";

import { notes } from "#server/database/schema";
import type { CreateNoteInput, UpdateNoteInput } from "#shared/utils/schema-validation";

import type { Note, NoteRef } from "./notes.type";

export class NotesService {
  constructor(private readonly db: Database) {}

  list(userId: string): Promise<Note[]> {
    return this.db
      .select()
      .from(notes)
      .where(eq(notes.userId, userId))
      .orderBy(desc(notes.createdAt));
  }

  async getById({ id, userId }: NoteRef): Promise<Note> {
    const [note] = await this.db
      .select()
      .from(notes)
      .where(and(eq(notes.id, id), eq(notes.userId, userId)))
      .limit(1);
    if (!note) throw Errors.notFound("Note");
    return note;
  }

  async create({ input, userId }: { input: CreateNoteInput; userId: string }): Promise<Note> {
    const [note] = await this.db
      .insert(notes)
      .values({ ...input, userId })
      .returning();
    return note!;
  }

  async update({ id, userId, input }: NoteRef & { input: UpdateNoteInput }): Promise<Note> {
    await this.getById({ id, userId });
    const [note] = await this.db
      .update(notes)
      .set(input)
      .where(and(eq(notes.id, id), eq(notes.userId, userId)))
      .returning();
    return note!;
  }

  async remove({ id, userId }: NoteRef): Promise<void> {
    await this.getById({ id, userId });
    await this.db.delete(notes).where(and(eq(notes.id, id), eq(notes.userId, userId)));
  }

  async pruneOlderThan(days: number): Promise<number> {
    const cutoff = new Date(Date.now() - days * 86_400_000);
    const pruned = await this.db
      .delete(notes)
      .where(lt(notes.createdAt, cutoff))
      .returning({ id: notes.id });
    return pruned.length;
  }
}
