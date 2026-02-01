<template>
  <div>
    <h2 class="text-2xl font-bold text-center mb-6 glass-heading">Create Account</h2>

    <div v-if="errorMsg" class="alert alert-error mb-4">
      <span>{{ errorMsg }}</span>
    </div>

    <div v-if="successMsg" class="alert alert-success mb-4">
      <span>{{ successMsg }}</span>
    </div>

    <form v-if="!successMsg" @submit.prevent="handleRegister">
      <div class="form-control mb-4">
        <label class="label">
          <span class="label-text">Full Name</span>
        </label>
        <input
          v-model="fullName"
          type="text"
          placeholder="John Doe"
          class="input input-bordered w-full glass-input"
          required
        />
      </div>

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
          placeholder="Min 6 characters"
          class="input input-bordered w-full glass-input"
          minlength="6"
          required
        />
      </div>

      <button type="submit" class="btn btn-primary w-full" :disabled="loading">
        <span v-if="loading" class="loading loading-spinner loading-sm"></span>
        Create Account
      </button>
    </form>

    <p class="text-center mt-4 text-slate-600">
      Already have an account?
      <NuxtLink to="/login" class="link link-primary">Sign in</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: 'auth',
})

const supabase = useSupabaseClient()

const fullName = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

async function handleRegister() {
  loading.value = true
  errorMsg.value = ''

  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      data: {
        full_name: fullName.value,
      },
    },
  })

  if (error) {
    errorMsg.value = error.message
  } else {
    successMsg.value = 'Check your email for a confirmation link to complete your registration.'
  }

  loading.value = false
}
</script>
