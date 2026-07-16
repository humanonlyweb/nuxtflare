interface GoogleUser {
  sub: string;
  name: string;
  email: string;
  email_verified: boolean;
  picture?: string;
}

export default defineOAuthGoogleEventHandler({
  config: { scope: ["email", "profile"] },
  async onSuccess(event, { user }: { user: GoogleUser }) {
    const { authController } = createContainer(event);
    return authController.oauthSuccess(event, {
      provider: "google",
      providerUserId: user.sub,
      email: user.email ?? "",
      emailVerified: user.email_verified && Boolean(user.email),
      name: user.name ?? user.email ?? "",
    });
  },
  onError(event) {
    return sendRedirect(event, "/auth/sign-in?error=oauth");
  },
});
