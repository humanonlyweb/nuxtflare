type GitHubEmail = {
  email: string;
  primary: boolean;
  verified: boolean;
};

export default defineOAuthGitHubEventHandler({
  config: { emailRequired: true, scope: ["user:email"] },
  async onSuccess(event, { user, tokens }) {
    // GitHub's user payload omits the email when it's private, so fetch the
    // verified primary address directly.
    const emails = await $fetch<GitHubEmail[]>("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
        Accept: "application/vnd.github+json",
      },
    }).catch(() => [] as GitHubEmail[]);

    const verifiedPrimary = emails.find((e) => e.primary && e.verified);
    const email = verifiedPrimary?.email ?? user.email ?? "";
    const emailVerified = Boolean(verifiedPrimary);

    const { authController } = createContainer(event);
    return authController.oauthSuccess(event, {
      provider: "github",
      providerUserId: String(user.id),
      email,
      emailVerified,
      name: user.name ?? user.login,
    });
  },
  onError(event) {
    return sendRedirect(event, "/sign-in?error=oauth");
  },
});
