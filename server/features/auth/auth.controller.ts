import type { H3Event } from "h3";

import type { EmailService } from "#server/features/email/email.service";

import type { AuthService } from "./auth.service";
import type { OAuthIdentity } from "./auth.type";
import { UnverifiedOAuthEmailError } from "./auth.type";

export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly email: EmailService,
  ) {}

  async oauthSuccess(event: H3Event, identity: OAuthIdentity) {
    try {
      const { user, linked, isNew } = await this.auth.findOrCreateByOAuth(identity);
      await setUserSession(event, { user });

      if (isNew) {
        event.waitUntil(this.email.sendWelcome({ to: user.email, name: user.name }));
      }

      return sendRedirect(event, linked ? `/?linked=${identity.provider}` : "/");
    } catch (error) {
      if (error instanceof UnverifiedOAuthEmailError) {
        return sendRedirect(event, "/auth/sign-in?error=oauth-unverified");
      }
      throw error;
    }
  }
}
