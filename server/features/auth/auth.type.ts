import type { OAUTH_PROVIDERS } from "#server/utils/constant";
import type { SessionUser } from "#shared/types/auth";

export type OAuthProvider = (typeof OAUTH_PROVIDERS)[number];

export interface OAuthIdentity {
  provider: OAuthProvider;
  providerUserId: string;
  email: string;
  emailVerified: boolean;
  name: string;
}

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
