<template>
  <div class="container mx-auto p-6 max-w-lg">
    <h1 class="text-3xl font-bold mb-6 glass-heading">Create New Form</h1>

    <div v-if="error" class="alert alert-error mb-4">
      <span>{{ error }}</span>
    </div>

    <form @submit.prevent="handleCreate" class="glass-card p-6">
      <div class="form-control mb-4">
        <label class="label">
          <span class="label-text">Form Title</span>
        </label>
        <input
          v-model="title"
          type="text"
          placeholder="My awesome form"
          class="input input-bordered w-full glass-input"
          required
        />
      </div>

      <div class="form-control mb-6">
        <label class="label">
          <span class="label-text">Description (optional)</span>
        </label>
        <textarea
          v-model="description"
          placeholder="What is this form about?"
          class="textarea textarea-bordered w-full glass-input"
          rows="3"
        ></textarea>
      </div>

      <button type="submit" class="btn btn-primary w-full" :disabled="loading">
        <span v-if="loading" class="loading loading-spinner loading-sm"></span>
        Create Form
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
const { createForm, loading, error } = useFormBuilder()
const router = useRouter()

const title = ref('')
const description = ref('')

async function handleCreate() {
  const form = await createForm(title.value, description.value)
  if (form) {
    router.push(`/forms/${form.id}/edit`)
  }
}
</script>
