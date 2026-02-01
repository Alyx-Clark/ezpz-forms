<template>
  <div class="min-h-screen glass-bg" data-theme="glass">
    <div class="hero min-h-screen">
      <div class="hero-content text-center">
        <div class="max-w-2xl">
          <h1 class="text-5xl font-extrabold glass-heading">Build Forms, EZPZ</h1>
          <p class="py-6 text-lg text-slate-700">
            Create custom forms with a drag-and-drop builder, share them with a
            simple link, and get submissions delivered straight to your inbox.
          </p>
          <div class="flex gap-4 justify-center">
            <NuxtLink to="/register" class="btn btn-primary btn-lg">
              Get Started
            </NuxtLink>
            <NuxtLink to="/login" class="btn btn-outline btn-lg">
              Sign In
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})
</script>
