<template>
  <div class="container mx-auto p-6 max-w-lg">
    <h1 class="text-3xl font-bold mb-6 glass-heading">Profile</h1>

    <div v-if="loading" class="flex justify-center py-10">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <template v-else>
      <div v-if="successMsg" class="alert alert-success mb-4">
        <span>{{ successMsg }}</span>
      </div>

      <div v-if="errorMsg" class="alert alert-error mb-4">
        <span>{{ errorMsg }}</span>
      </div>

      <form @submit.prevent="handleUpdate" class="glass-card p-6">
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text">Email</span>
          </label>
          <input
            :value="user?.email"
            type="email"
            class="input input-bordered w-full glass-input"
            disabled
          />
          <label class="label">
            <span class="label-text-alt">Email cannot be changed</span>
          </label>
        </div>

        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text">Full Name</span>
          </label>
          <input
            v-model="fullName"
            type="text"
            class="input input-bordered w-full glass-input"
            placeholder="Your full name"
          />
        </div>

        <div class="form-control mb-6">
          <label class="label">
            <span class="label-text">Phone</span>
          </label>
          <input
            v-model="phone"
            type="tel"
            class="input input-bordered w-full glass-input"
            placeholder="Your phone number"
          />
        </div>

        <div class="flex gap-2">
          <button type="submit" class="btn btn-primary" :disabled="saving">
            <span v-if="saving" class="loading loading-spinner loading-sm"></span>
            Update Profile
          </button>
          <button type="button" class="btn btn-ghost" @click="signOut">
            Sign Out
          </button>
        </div>
      </form>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Profile } from '~/types'

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

const fullName = ref('')
const phone = ref('')
const loading = ref(true)
const saving = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

async function loadProfile() {
  if (!user.value?.sub) {
    loading.value = false
    return
  }

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.value.sub)
    .single()

  if (data) {
    const profile = data as Profile
    fullName.value = profile.full_name || ''
    phone.value = profile.phone || ''
  }

  loading.value = false
}

async function handleUpdate() {
  if (!user.value?.sub) return
  saving.value = true
  successMsg.value = ''
  errorMsg.value = ''

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: fullName.value,
      phone: phone.value,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.value.sub)

  if (error) {
    errorMsg.value = error.message
  } else {
    successMsg.value = 'Profile updated successfully!'
    setTimeout(() => (successMsg.value = ''), 3000)
  }

  saving.value = false
}

async function signOut() {
  await supabase.auth.signOut()
  router.push('/login')
}

onMounted(loadProfile)
</script>
