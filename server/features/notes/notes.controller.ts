import type { H3Event } from "h3";

import { createNoteSchema, noteIdSchema, updateNoteSchema } from "#shared/utils/schema-validation";

import type { NotesService } from "./notes.service";

export class NotesController {
  constructor(private readonly notes: NotesService) {}

  async list(event: H3Event) {
    const { user } = await requireUserSession(event);
    return this.notes.list(user.id);
  }

  async get(event: H3Event) {
    const [{ id }, user] = await Promise.all([
      validateRouterParams(event, noteIdSchema),
      requireUserSession(event),
    ]);

    return this.notes.getById({ id, userId: user.id });
  }

  async create(event: H3Event) {
    const [input, { user }] = await Promise.all([
      validateRequestBody(event, createNoteSchema),
      requireUserSession(event),
    ]);

    const note = await this.notes.create({ input, userId: user.id });
    setResponseStatus(event, 201);
    return note;
  }

  async update(event: H3Event) {
    const { user } = await requireUserSession(event);
    const [{ id }, input] = await Promise.all([
      validateRouterParams(event, noteIdSchema),
      validateRequestBody(event, updateNoteSchema),
    ]);

    return this.notes.update({ id, userId: user.id, input });
  }

  async remove(event: H3Event) {
    const [{ id }, user] = await Promise.all([
      validateRouterParams(event, noteIdSchema),
      requireUserSession(event),
    ]);

    await this.notes.remove({ id, userId: user.id });
    setResponseStatus(event, 204);
    return null;
  }
}
