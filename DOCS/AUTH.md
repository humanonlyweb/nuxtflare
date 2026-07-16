# Auth (OAuth)

OAuth sign-in with **GitHub** and **Google**, built on
[nuxt-auth-utils](https://github.com/atinux/nuxt-auth-utils). On a successful
callback a provider identity is resolved to a local user with a
`findOrCreateByOAuth` flow, and a sealed session cookie is set.

## Flow

```
/auth/github (or /google)     server/routes/auth/*.get.ts
  → provider consent
  → onSuccess: normalize provider payload → OAuthIdentity
  → createContainer(event).authController.oauthSuccess(event, identity)
      → AuthService.findOrCreateByOAuth(identity)   # link / create user
      → setUserSession(event, { user })             # sealed cookie
      → redirect to /  (or /sign-in?error=… on failure)
```

`findOrCreateByOAuth` resolves in three cases:

1. **Provider account already linked** → sign in as that user.
2. **Email already exists** (verified) → link the new provider to that account
   (`linked: true`).
3. **New email** → create the account (`isNew: true`).

Creating or linking requires a **verified** provider email; an unverified one
throws `UnverifiedOAuthEmailError` → `/sign-in?error=oauth-unverified`.

## Files

| File                                      | Role                                         |
| ----------------------------------------- | -------------------------------------------- |
| `server/routes/auth/github.get.ts`        | GitHub callback → normalized `OAuthIdentity` |
| `server/routes/auth/google.get.ts`        | Google callback → normalized `OAuthIdentity` |
| `server/features/auth/auth.controller.ts` | Sets the session, redirects                  |
| `server/features/auth/auth.service.ts`    | `findOrCreateByOAuth` (all DB work)          |
| `server/features/auth/auth.type.ts`       | `OAuthIdentity`, `SessionUser`, errors       |
| `server/database/schema/users.ts`         | `users` + `user_oauth` tables                |
| `shared/types/auth.d.ts`                  | Declares the session `User` shape            |
| `app/composables/use-auth.ts`             | `useAuth()` — user, `loggedIn`, `signout()`  |
| `app/pages/sign-in.vue`                   | Provider buttons + error display             |

## Setup

1. Copy `.env.example` → `.env` and fill it in. `NUXT_SESSION_PASSWORD`
   must be ≥32 chars (`openssl rand -base64 32`).
2. Register OAuth apps and set the callback URLs:
   - **GitHub** (<https://github.com/settings/developers>) → `<origin>/auth/github`
   - **Google** (<https://console.cloud.google.com/apis/credentials>) → `<origin>/auth/google`
3. In production, set the same values as Worker secrets:
   `bunx wrangler secret put NUXT_SESSION_PASSWORD` (and each OAuth id/secret).

## Using the session

```ts
// Client
const { user, loggedIn, signout } = useAuth();

// Server route/controller — require an authenticated user
const { user } = await requireUserSession(event);
```

Sign-out uses nuxt-auth-utils' built-in session-clear endpoint via
`useAuth().signout()` — there is no custom sign-out route.

## Adding a provider

nuxt-auth-utils ships `defineOAuth<Provider>EventHandler` for many providers.
Add the provider to `OAUTH_PROVIDERS` in `server/database/schema/users.ts`, add a
`server/routes/auth/<provider>.get.ts` that normalizes the payload to an
`OAuthIdentity`, and add its env vars. No service changes needed.

## Removing auth

Delete `server/routes/auth/`, `server/features/auth/`, `shared/types/auth.d.ts`,
`app/pages/sign-in.vue`, `app/composables/use-auth.ts`, the `users`/`user_oauth`
tables in `server/database/schema/users.ts`, the `authController` getter in
`server/utils/container.ts`, the account nav in `app/layouts/default.vue`, and
the `nuxt-auth-utils` module in `nuxt.config.ts`.
