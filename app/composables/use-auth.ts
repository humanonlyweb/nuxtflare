export function useAuth() {
  const { loggedIn, user, clear, fetch: refresh } = useUserSession();

  async function signout() {
    await clear();
    await navigateTo("/sign-in");
  }

  return { loggedIn, user, refresh, signout };
}
