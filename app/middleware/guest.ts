export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession();
  if (!loggedIn.value) return;

  const redirect = String(to.query.redirect);
  const isSafe = redirect.startsWith("/") && !redirect.startsWith("//");

  return navigateTo(isSafe ? redirect : "/");
});
