<script setup lang="ts">
const year = new Date().getFullYear();
</script>

<template>
  <div class="shell">
    <header class="site-header">
      <NuxtLink to="/" class="brand">humanonlyweb</NuxtLink>
    </header>

    <main>
      <slot />
    </main>

    <footer class="site-footer">
      <span>&copy; {{ year }} humanonlyweb</span>
    </footer>
  </div>
</template>

<style scoped>
.shell {
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  max-width: var(--content-width);
  margin-inline: auto;
  padding-inline: 1.25rem;
}

.site-header,
.site-footer {
  display: flex;
  align-items: center;
  padding-block: 1.25rem;
}

.site-footer {
  margin-top: auto;
  padding-block: 2rem 2.5rem;
  color: var(--text-muted);
  font-size: 0.85rem;
}

.brand {
  font-weight: 700;
  color: var(--text);
  text-decoration: none;
}

main {
  padding-block: 1rem 3rem;
}
</style>
