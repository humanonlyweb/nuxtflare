import type { H3Event } from "h3";

import { AuthController } from "#server/features/auth/auth.controller";
import { AuthService } from "#server/features/auth/auth.service";
import { EmailService } from "#server/features/email/email.service";
import { NotesController } from "#server/features/notes/notes.controller";
import { NotesService } from "#server/features/notes/notes.service";

// Single source of truth for dependency injection. Lighter than a full DI framework.
// The db is built lazily so a request only constructs what it hits.
export function createContainer(event: H3Event) {
  let db: Database | undefined;
  const getDb = () => (db ??= useDrizzle(event));

  const config = useRuntimeConfig();

  const emailService = () =>
    new EmailService(event.context.cloudflare?.env?.EMAIL, {
      from: { name: config.email.fromName, email: config.email.fromAddress },
      siteUrl: config.public.siteUrl,
    });

  return {
    get notesController() {
      return new NotesController(new NotesService(getDb()));
    },
    get authController() {
      return new AuthController(new AuthService(getDb()), emailService());
    },
  };
}
