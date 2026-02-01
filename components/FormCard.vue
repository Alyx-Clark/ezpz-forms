<template>
  <div class="card glass-card">
    <div class="card-body">
      <div class="flex items-start justify-between">
        <div>
          <h2 class="card-title text-lg">{{ form.title }}</h2>
          <p v-if="form.description" class="text-sm text-slate-600 mt-1 line-clamp-2">
            {{ form.description }}
          </p>
        </div>
        <span
          class="badge badge-sm"
          :class="form.is_published ? 'badge-success' : 'badge-ghost'"
        >
          {{ form.is_published ? 'Published' : 'Draft' }}
        </span>
      </div>

      <div class="text-xs text-slate-500 mt-2">
        {{ fieldCount }} field{{ fieldCount !== 1 ? 's' : '' }}
        &middot;
        Created {{ formatDate(form.created_at) }}
      </div>

      <div class="card-actions justify-end mt-4">
        <NuxtLink :to="`/forms/${form.id}/edit`" class="btn btn-sm btn-primary">
          Edit
        </NuxtLink>
        <NuxtLink :to="`/forms/${form.id}/submissions`" class="btn btn-sm btn-outline">
          Submissions
        </NuxtLink>
        <button
          v-if="form.is_published"
          class="btn btn-sm btn-outline"
          @click="copyLink"
        >
          {{ copied ? 'Copied!' : 'Copy Link' }}
        </button>
        <button class="btn btn-sm btn-ghost text-error" @click="emit('delete', form.id)">
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Form } from '~/types'

const props = defineProps<{
  form: Form
  fieldCount: number
}>()

const emit = defineEmits<{
  delete: [formId: string]
}>()

const copied = ref(false)

function copyLink() {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const url = `${origin}/f/${props.form.slug}`
  navigator.clipboard.writeText(url)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString()
}
</script>
