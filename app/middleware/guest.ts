export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession();
  if (!loggedIn.value) return;

  return navigateTo(safeRedirectPath(to.query.redirect) ?? "/");
});
