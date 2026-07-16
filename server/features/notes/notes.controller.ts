import type { H3Event } from "h3";

import { createNoteSchema, noteIdSchema, updateNoteSchema } from "#shared/utils/schema-validation";

import type { NotesService } from "./notes.service";

export class NotesController {
  constructor(private readonly notes: NotesService) {}

  list() {
    return this.notes.list();
  }

  async get(event: H3Event) {
    const { id } = await validateRouterParams(event, noteIdSchema);
    return this.notes.getById(id);
  }

  async create(event: H3Event) {
    const input = await validateRequestBody(event, createNoteSchema);
    const note = await this.notes.create(input);
    setResponseStatus(event, 201);
    return note;
  }

  async update(event: H3Event) {
    const [{ id }, input] = await Promise.all([
      validateRouterParams(event, noteIdSchema),
      validateRequestBody(event, updateNoteSchema),
    ]);
    return this.notes.update(id, input);
  }

  async remove(event: H3Event) {
    const { id } = await validateRouterParams(event, noteIdSchema);
    await this.notes.remove(id);
    setResponseStatus(event, 204);
    return null;
  }
}
