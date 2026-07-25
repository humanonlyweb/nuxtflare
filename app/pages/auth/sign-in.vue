<script setup lang="ts">
definePageMeta({ middleware: "guest" });

const route = useRoute();

const redirectCookie = useCookie(AUTH_REDIRECT_COOKIE, { maxAge: 600, sameSite: "lax" });
redirectCookie.value = safeRedirectPath(route.query.redirect) ?? null;

useSeoMeta({
  title: "Sign in — humanonlyweb starter",
  description: "Sign in with GitHub or Google.",
});

const ERROR_MESSAGES: Record<string, string> = {
  oauth: "Something went wrong signing you in. Please try again.",
  "oauth-unverified":
    "Your provider email isn't verified yet. Verify it with the provider, then try again.",
  "rate-limited": "Too many sign-in attempts. Wait a minute and try again.",
};

const error = computed(() => {
  const code = Array.isArray(route.query.error) ? route.query.error[0] : route.query.error;
  return code ? (ERROR_MESSAGES[code] ?? ERROR_MESSAGES.oauth) : null;
});
</script>

<template>
  <div :class="$style.wrap">
    <section :class="$style.card">
      <h1 :class="$style.title">Sign in</h1>
      <p :class="$style.subtitle">Continue with a provider to access your account.</p>

      <p v-if="error" :class="$style.error" role="alert">{{ error }}</p>

      <div :class="$style.providers">
        <a :class="$style.provider" href="/auth/github" data-provider="github">
          <UiIcon name="github" size="18px" />
          Continue with GitHub
        </a>

        <a :class="$style.provider" href="/auth/google" data-provider="google">
          <UiIcon name="google" size="18px" />
          Continue with Google
        </a>
      </div>
    </section>
  </div>
</template>

<style module>
.wrap {
  display: grid;
  place-items: center;
  min-height: 60vh;
}

.card {
  width: 100%;
  max-width: 22rem;
  padding: 2rem 1.75rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  text-align: center;
}

.title {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.subtitle {
  margin-top: 0.4rem;
  color: var(--text-muted);
  font-size: 0.95rem;
}

.error {
  margin-top: 1rem;
  padding: 0.6rem 0.8rem;
  color: var(--danger);
  background: color-mix(in oklch, var(--danger) 10%, transparent);
  border: 1px solid color-mix(in oklch, var(--danger) 30%, transparent);
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  text-align: left;
}

.providers {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.provider {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6ch;
  padding: 0.7rem 1rem;
  font-weight: 600;
  color: var(--text);
  background: transparent;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  text-decoration: none;
  transition:
    transform 0.12s ease,
    background-color 0.12s ease;
}

.provider [data-part="icon"] {
  width: var(--icon-size, 1em);
  height: var(--icon-size, 1em);
  flex: none;
}

@media (hover: hover) {
  .provider:hover {
    background: color-mix(in oklch, var(--text) 6%, transparent);
  }
}

.provider:active {
  transform: scale(0.98);
}
</style>
