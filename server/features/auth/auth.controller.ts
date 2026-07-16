import type { H3Event } from "h3";

import type { AuthService } from "./auth.service";
import { UnverifiedOAuthEmailError } from "./auth.type";
import type { OAuthIdentity } from "./auth.type";

export class AuthController {
  constructor(private readonly auth: AuthService) {}

  async oauthSuccess(event: H3Event, identity: OAuthIdentity) {
    try {
      const { user, linked } = await this.auth.findOrCreateByOAuth(identity);
      await setUserSession(event, { user });

      // Future email branch: gate a welcome email on the `isNew` flag returned above.
      return sendRedirect(event, linked ? `/?linked=${identity.provider}` : "/");
    } catch (error) {
      if (error instanceof UnverifiedOAuthEmailError) {
        return sendRedirect(event, "/auth/sign-in?error=oauth-unverified");
      }
      throw error;
    }
  }
}
