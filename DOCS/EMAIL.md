# Email

Transactional email through the Cloudflare **Email Sending** binding (`EMAIL`). One
worked example ships: a welcome email on first OAuth sign-in (`auth.controller.ts`, gated
on `isNew`, dispatched with `event.waitUntil`).

Templates are plain HTML in `server/assets/emails/<name>.html` with `{{var}}` slots, read
at runtime via `useStorage("assets:server")`.

| File                                     | Role                                    |
| ---------------------------------------- | --------------------------------------- |
| `server/features/email/email.service.ts` | `sendWelcome`, transport + render + esc |
| `server/features/email/email.type.ts`    | `EmailSender`, `OutboundEmail`, names   |
| `server/assets/emails/welcome.html`      | Welcome template                        |

## Setup

1. The binding is already in `wrangler.jsonc`:
   ```jsonc
   "send_email": [{ "name": "EMAIL" }]
   ```
2. Verify a sender domain in Cloudflare Email Sending, then set `NUXT_EMAIL_FROM_ADDRESS`,
   `NUXT_EMAIL_FROM_NAME` and `NUXT_PUBLIC_SITE_URL` (`.env` locally, Worker secrets in
   prod).

**Local dev has no `EMAIL` binding** — `send()` warns and no-ops, so auth still works
without email configured.

## Sending

The DI container injects `EmailService` into controllers (see `AuthController`). Send
fire-and-forget so the response isn't blocked:

```ts
event.waitUntil(this.email.sendWelcome({ to, name }));
```

`send()` never throws — it logs and returns `false`. But a `waitUntil` send is
best-effort: if it fails, the email is gone. Move to a queue once you need retries.

## Adding an email

1. Add `server/assets/emails/<name>.html` and the name to `EmailTemplate`.
2. Add a `send<Name>()` that calls `render(<name>, vars)` then `send(...)`.

## Removing email

Delete `server/features/email/`, `server/assets/emails/`, the `send_email` binding, the
`EMAIL` type in `server/types/env.d.ts`, `runtimeConfig.email`, and the `emailService`
wiring in `server/utils/container.ts` + `auth.controller.ts`.
