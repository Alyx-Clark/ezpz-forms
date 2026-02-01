<template>
  <div class="min-h-screen flex flex-col glass-bg" data-theme="glass">
    <AppNavbar />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
