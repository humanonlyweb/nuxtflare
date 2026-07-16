import type { User } from "#auth-utils";
import type { OAUTH_PROVIDERS } from "#server/utils/constant";

export type OAuthProvider = (typeof OAUTH_PROVIDERS)[number];

export interface OAuthIdentity {
  provider: OAuthProvider;
  providerUserId: string;
  email: string;
  emailVerified: boolean;
  name: string;
}

// The user we persist in the session — one shape, declared in shared/types/auth.d.ts.
export type SessionUser = User;

export interface OAuthSigninResult {
  user: SessionUser;
  linked: boolean;
  isNew: boolean;
}

export class UnverifiedOAuthEmailError extends Error {
  constructor() {
    super("OAuth provider email is not verified");
    this.name = "UnverifiedOAuthEmailError";
  }
}
