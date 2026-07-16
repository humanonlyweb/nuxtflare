export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession();
  if (loggedIn.value) return;

  const redirect = to.fullPath !== "/" ? to.fullPath : undefined;
  const target = redirect
    ? `/auth/sign-in?redirect=${encodeURIComponent(redirect)}`
    : "/auth/sign-in";
  return navigateTo(target);
});
