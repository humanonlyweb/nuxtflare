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
          <svg viewBox="0 0 16 16" aria-hidden="true" width="18" height="18">
            <path
              fill="currentColor"
              d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38v-1.33c-2.23.49-2.7-1.07-2.7-1.07-.36-.93-.9-1.18-.9-1.18-.73-.5.06-.49.06-.49.81.06 1.24.83 1.24.83.72 1.24 1.9.88 2.36.67.07-.52.28-.88.5-1.08-1.78-.2-3.65-.89-3.65-3.96 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.08-1.87 3.76-3.66 3.96.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
            />
          </svg>
          Continue with GitHub
        </a>

        <a :class="$style.provider" href="/auth/google" data-provider="google">
          <svg viewBox="0 0 18 18" aria-hidden="true" width="18" height="18">
            <path
              fill="#4285F4"
              d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.71-1.57 2.68-3.88 2.68-6.62Z"
            />
            <path
              fill="#34A853"
              d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z"
            />
            <path
              fill="#FBBC05"
              d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33Z"
            />
            <path
              fill="#EA4335"
              d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.47.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z"
            />
          </svg>
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

@media (hover: hover) {
  .provider:hover {
    background: color-mix(in oklch, var(--text) 6%, transparent);
  }
}

.provider:active {
  transform: scale(0.98);
}
</style>
