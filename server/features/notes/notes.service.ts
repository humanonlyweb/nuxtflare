import { desc, eq, lt } from "drizzle-orm";

import { notes } from "#server/database/schema";
import type { CreateNoteInput, UpdateNoteInput } from "#shared/utils/schema-validation";

import type { Note } from "./notes.type";

export class NotesService {
  constructor(private readonly db: Database) {}

  list(): Promise<Note[]> {
    return this.db.select().from(notes).orderBy(desc(notes.createdAt));
  }

  async getById(id: string): Promise<Note> {
    const [note] = await this.db.select().from(notes).where(eq(notes.id, id)).limit(1);
    if (!note) throw Errors.notFound("Note");
    return note;
  }

  async create(input: CreateNoteInput): Promise<Note> {
    const [note] = await this.db.insert(notes).values(input).returning();
    return note!;
  }

  async update(id: string, input: UpdateNoteInput): Promise<Note> {
    await this.getById(id);
    const [note] = await this.db.update(notes).set(input).where(eq(notes.id, id)).returning();
    return note!;
  }

  async remove(id: string): Promise<void> {
    await this.getById(id);
    await this.db.delete(notes).where(eq(notes.id, id));
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
