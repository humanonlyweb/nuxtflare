import { and, eq } from "drizzle-orm";

import { userOauth, users } from "#server/database/schema";

import type { OAuthIdentity, OAuthSigninResult, SessionUser } from "./auth.type";
import { UnverifiedOAuthEmailError } from "./auth.type";

type UserRow = typeof users.$inferSelect;

const toSessionUser = (row: UserRow): SessionUser => ({
  id: row.id,
  name: row.name,
  email: row.email,
  emailVerified: row.emailVerifiedAt != null,
});

export class AuthService {
  constructor(private readonly db: Database) {}

  async findOrCreateByOAuth(identity: OAuthIdentity): Promise<OAuthSigninResult> {
    const email = identity.email.toLowerCase();
    const name = identity.name.trim() || email;

    const [link] = await this.db
      .select({ userId: userOauth.userId })
      .from(userOauth)
      .where(
        and(
          eq(userOauth.provider, identity.provider),
          eq(userOauth.providerUserId, identity.providerUserId),
        ),
      )
      .limit(1);

    if (link) {
      const [existing] = await this.db
        .select()
        .from(users)
        .where(eq(users.id, link.userId))
        .limit(1);
      if (existing) return { user: toSessionUser(existing), linked: false, isNew: false };
    }

    // Creating or linking requires a trustworthy email — an unverified one could hijack an account.
    if (!identity.emailVerified) throw new UnverifiedOAuthEmailError();

    const [existingByEmail] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingByEmail) {
      const verifiedAt = existingByEmail.emailVerifiedAt ?? new Date();
      if (!existingByEmail.emailVerifiedAt) {
        await this.db
          .update(users)
          .set({ emailVerifiedAt: verifiedAt })
          .where(eq(users.id, existingByEmail.id));
      }
      await this.linkProvider(existingByEmail.id, identity);
      return {
        user: toSessionUser({ ...existingByEmail, emailVerifiedAt: verifiedAt }),
        linked: true,
        isNew: false,
      };
    }

    const [created] = await this.db
      .insert(users)
      .values({ name, email, emailVerifiedAt: new Date() })
      .returning();
    await this.linkProvider(created!.id, identity);
    return { user: toSessionUser(created!), linked: false, isNew: true };
  }

  private async linkProvider(userId: string, identity: OAuthIdentity): Promise<void> {
    await this.db.insert(userOauth).values({
      userId,
      provider: identity.provider,
      providerUserId: identity.providerUserId,
    });
  }
}
