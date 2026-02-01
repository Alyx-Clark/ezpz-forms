<template>
  <div>
    <h2 class="text-2xl font-bold text-center mb-6 glass-heading">Sign In</h2>

    <div v-if="errorMsg" class="alert alert-error mb-4">
      <span>{{ errorMsg }}</span>
    </div>

    <form @submit.prevent="handleLogin">
      <div class="form-control mb-4">
        <label class="label">
          <span class="label-text">Email</span>
        </label>
        <input
          v-model="email"
          type="email"
          placeholder="you@example.com"
          class="input input-bordered w-full glass-input"
          required
        />
      </div>

      <div class="form-control mb-6">
        <label class="label">
          <span class="label-text">Password</span>
        </label>
        <input
          v-model="password"
          type="password"
          placeholder="Your password"
          class="input input-bordered w-full glass-input"
          required
        />
      </div>

      <button type="submit" class="btn btn-primary w-full" :disabled="loading">
        <span v-if="loading" class="loading loading-spinner loading-sm"></span>
        Sign In
      </button>
    </form>

    <p class="text-center mt-4 text-slate-600">
      Don't have an account?
      <NuxtLink to="/register" class="link link-primary">Create one</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: 'auth',
})

const supabase = useSupabaseClient()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

async function handleLogin() {
  loading.value = true
  errorMsg.value = ''

  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })

  if (error) {
    errorMsg.value = error.message
  } else {
    router.push('/dashboard')
  }

  loading.value = false
}
</script>
