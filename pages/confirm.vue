<template>
  <div>
    <h2 class="text-2xl font-bold text-center mb-6 glass-heading">Confirming...</h2>
    <div class="flex justify-center">
      <span class="loading loading-spinner loading-lg"></span>
    </div>
    <p class="text-center mt-4 text-slate-600">
      Please wait while we verify your email.
    </p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const router = useRouter()
const user = useSupabaseUser()

// Watch for user to be set after auth callback processes
watch(user, (val) => {
  if (val) {
    router.push('/dashboard')
  }
}, { immediate: true })
</script>
