<template>
  <div class="navbar glass-navbar no-print">
    <div class="flex-1">
      <NuxtLink to="/dashboard" class="btn btn-ghost text-xl">EZPZ Forms</NuxtLink>
    </div>
    <div class="flex-none gap-2">
      <NuxtLink to="/dashboard" class="btn btn-ghost btn-sm">Dashboard</NuxtLink>
      <NuxtLink to="/profile" class="btn btn-ghost btn-sm">Profile</NuxtLink>
      <button class="btn btn-ghost btn-sm" @click="signOut">Sign Out</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()
const router = useRouter()

async function signOut() {
  await supabase.auth.signOut()
  router.push('/login')
}
</script>
