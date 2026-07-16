# Email

Transactional email via the Cloudflare **Email Sending** binding (`EMAIL`). The
template ships one worked example: a **welcome email** sent when an OAuth sign-in
creates a new account (`auth.controller.ts`, gated on `isNew`, dispatched with
`event.waitUntil`).

Templates are plain HTML in `server/assets/emails/<name>.html` with `{{var}}`
placeholders, read at runtime via `useStorage("assets:server")`.

## Files

| File                                     | Role                                    |
| ---------------------------------------- | --------------------------------------- |
| `server/features/email/email.service.ts` | `sendWelcome`, transport + render + esc |
| `server/features/email/email.type.ts`    | `EmailSender`, `OutboundEmail`, names   |
| `server/assets/emails/welcome.html`      | Welcome template (`{{var}}` slots)      |

## Setup

1. Add the binding (already in `wrangler.jsonc`):
   ```jsonc
   "send_email": [{ "name": "EMAIL" }]
   ```
2. Verify a sender domain in Cloudflare Email Sending, then set env
   (`.env` locally, Worker secrets in prod): `NUXT_EMAIL_FROM_ADDRESS`,
   `NUXT_EMAIL_FROM_NAME`, and `NUXT_PUBLIC_SITE_URL` (for absolute links).

**Local dev has no `EMAIL` binding** — `send()` logs a warning and no-ops (returns
`false`), so auth still works without email configured.

## Sending

`EmailService` is injected into controllers by the DI container (see how
`AuthController` receives it). Send fire-and-forget so the response isn't blocked:

```ts
// inside a controller that was given `email: EmailService`
event.waitUntil(this.email.sendWelcome({ to, name }));
```

`send()` never throws — failures are logged and return `false`. A `waitUntil` send is
best-effort: if it fails, the email is gone. Move to a queue once you need retries or
durability.

## Adding an email

1. Add `server/assets/emails/<name>.html` and the name to `EmailTemplate`.
2. Add a `send<Name>()` method that calls `render(<name>, vars)` then `send(...)`.

## Removing email

Delete `server/features/email/`, `server/assets/emails/`, the `send_email` binding,
the `EMAIL` type in `server/types/env.d.ts`, `runtimeConfig.email`, and the
`emailService` wiring in `server/utils/container.ts` + `auth.controller.ts`.
