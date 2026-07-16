# Auth (OAuth)

OAuth sign-in with **GitHub** and **Google** via
[nuxt-auth-utils](https://github.com/atinux/nuxt-auth-utils). A successful callback
resolves the provider identity to a local user (`findOrCreateByOAuth`) and sets a
sealed session cookie.

## Flow

```
/auth/github (or /google) → provider → onSuccess (normalize → OAuthIdentity)
  → authController.oauthSuccess → AuthService.findOrCreateByOAuth
  → setUserSession → redirect (or /auth/sign-in?error=… on failure)
```

`findOrCreateByOAuth`:

1. **Provider already linked** → sign in.
2. **Email exists** (verified) → link provider (`linked: true`).
3. **New email** → create account (`isNew: true`).

Creating or linking needs a **verified** provider email; otherwise
`UnverifiedOAuthEmailError` → `/auth/sign-in?error=oauth-unverified`.

Concurrent first sign-ins are race-safe: the user insert is `onConflictDoNothing`
on email with a re-lookup on conflict, and provider links ignore duplicates —
so a lost race links instead of surfacing a unique-constraint 500.

## Files

| File                                        | Role                                  |
| ------------------------------------------- | ------------------------------------- |
| `server/routes/auth/{github,google}.get.ts` | Callback → normalized `OAuthIdentity` |
| `server/features/auth/auth.controller.ts`   | Sets session, redirects               |
| `server/features/auth/auth.service.ts`      | `findOrCreateByOAuth` (DB)            |
| `server/features/auth/auth.type.ts`         | `OAuthIdentity`, errors               |
| `server/database/schema/users.ts`           | `users` + `user_oauth` tables         |
| `shared/types/auth.d.ts`                    | Session `SessionUser` shape           |
| `app/composables/use-auth.ts`               | `useAuth()`                           |
| `app/pages/auth/sign-in.vue`                | Provider buttons                      |
| `app/middleware/{auth,guest}.ts`            | Route protection                      |
| `shared/utils/safe-redirect.ts`             | `?redirect` cookie name + sanitizer   |

## Setup

1. Copy `.env.example` → `.env`. `NUXT_SESSION_PASSWORD` must be ≥32 chars
   (`openssl rand -base64 32`).
2. Register OAuth apps with callback URLs `<origin>/auth/github` and
   `<origin>/auth/google` ([GitHub](https://github.com/settings/developers),
   [Google](https://console.cloud.google.com/apis/credentials)).
3. In production, set the same values as Worker secrets: `bunx wrangler secret put <NAME>`.

## Usage

```ts
const { user, loggedIn, signout } = useAuth(); // client
const { user } = await requireUserSession(event); // server — enforce access
```

Sign-out uses nuxt-auth-utils' built-in clear endpoint (`useAuth().signout()`) — no custom route.

Protect pages with named middleware (UI gate only; server handlers must still call
`requireUserSession`):

```ts
definePageMeta({ middleware: "auth" });
```

`?redirect` survives the OAuth round-trip: the sign-in page stashes it in a
short-lived `auth_redirect` cookie, and `oauthSuccess` reads (and clears) it,
accepting only same-site paths via `safeRedirectPath`
(`shared/utils/safe-redirect.ts` — also used by the `guest` middleware). Without
it, post-login lands on `/`.

## Adding a provider

Add it to `OAUTH_PROVIDERS` (`server/utils/constant.ts`) and a
`server/routes/auth/<provider>.get.ts` that normalizes the payload to an
`OAuthIdentity` (nuxt-auth-utils ships `defineOAuth<Provider>EventHandler`), then add
its env vars. No service changes.

## Removing auth

Delete `server/routes/auth/`, `server/features/auth/`, `shared/types/auth.d.ts`,
`app/pages/auth/sign-in.vue`, `app/composables/use-auth.ts`, `app/middleware/{auth,guest}.ts`;
drop the `users`/`user_oauth` tables, the `authController` getter in
`server/utils/container.ts`, the account nav in `app/layouts/default.vue`, and the
`nuxt-auth-utils` module.
