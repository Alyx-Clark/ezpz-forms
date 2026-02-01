<template>
  <div class="container mx-auto p-6 max-w-4xl">
    <div v-if="loading" class="flex justify-center py-20">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <div v-else-if="!form" class="text-center py-20">
      <h2 class="text-2xl font-bold">Form not found</h2>
      <NuxtLink to="/dashboard" class="btn btn-primary mt-4">Back to Dashboard</NuxtLink>
    </div>

    <template v-else>
      <!-- Header -->
      <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <NuxtLink to="/dashboard" class="btn btn-ghost btn-sm mb-2">&larr; Dashboard</NuxtLink>
          <h1 class="text-3xl font-bold glass-heading">Edit Form</h1>
        </div>
        <div class="flex gap-2">
          <button class="btn btn-sm" :disabled="saving" @click="saveAll">
            <span v-if="saving" class="loading loading-spinner loading-xs"></span>
            Save
          </button>
          <NuxtLink :to="`/f/${form.slug}`" target="_blank" class="btn btn-sm btn-outline">
            Preview
          </NuxtLink>
          <button
            class="btn btn-sm"
            :class="form.is_published ? 'btn-warning' : 'btn-success'"
            @click="togglePublish"
          >
            {{ form.is_published ? 'Unpublish' : 'Publish' }}
          </button>
        </div>
      </div>

      <div v-if="error" class="alert alert-error mb-4">
        <span>{{ error }}</span>
      </div>

      <div v-if="saveSuccess" class="alert alert-success mb-4">
        <span>Form saved successfully!</span>
      </div>

      <!-- Form metadata -->
      <div class="card glass-card mb-6">
        <div class="card-body">
          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text font-semibold">Title</span>
            </label>
            <input
              v-model="form.title"
              type="text"
              class="input input-bordered w-full glass-input"
              placeholder="Form title"
            />
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold">Description</span>
            </label>
            <textarea
              v-model="form.description"
              class="textarea textarea-bordered w-full glass-input"
              placeholder="Form description (optional)"
              rows="2"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Field type toolbar -->
      <div class="mb-4">
        <h3 class="text-sm font-semibold mb-2 text-slate-600">Add Field</h3>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="ft in fieldTypes"
            :key="ft.type"
            class="btn btn-sm btn-outline"
            @click="addField(ft.type)"
          >
            {{ ft.label }}
          </button>
        </div>
      </div>

      <!-- Fields list with drag-and-drop -->
      <div class="mb-6">
        <h3 class="text-sm font-semibold mb-2 text-slate-600">
          Fields ({{ fields.length }})
        </h3>

        <div v-if="fields.length === 0" class="text-center py-10 border-2 border-dashed border-slate-300 rounded-lg">
          <p class="text-slate-500">No fields yet. Click a field type above to add one.</p>
        </div>

        <Draggable
          v-else
          :list="fields"
          item-key="id"
          handle=".drag-handle"
          ghost-class="opacity-30"
          @end="reorderFields(fields)"
        >
          <template #item="{ element }">
            <div class="mb-3">
              <FormFieldEditor
                :field="element"
                @update="updateField"
                @remove="removeField"
              />
            </div>
          </template>
        </Draggable>
      </div>

      <!-- Submission Settings -->
      <div class="card glass-card mb-6">
        <div class="card-body">
          <h3 class="card-title text-lg">Submission Settings</h3>

          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text">Email Recipients</span>
            </label>
            <input
              :value="emailRecipients"
              type="text"
              class="input input-bordered w-full glass-input"
              placeholder="email1@example.com, email2@example.com"
              @input="updateEmailRecipients(($event.target as HTMLInputElement).value)"
            />
            <label class="label">
              <span class="label-text-alt">Comma-separated email addresses to receive submission notifications</span>
            </label>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Email Subject</span>
            </label>
            <input
              :value="form.submission_settings?.email_subject || ''"
              type="text"
              class="input input-bordered w-full glass-input"
              placeholder="New form submission"
              @input="form.submission_settings = { ...form.submission_settings, email_subject: ($event.target as HTMLInputElement).value }"
            />
          </div>
        </div>
      </div>

      <!-- Public URL -->
      <div v-if="form.is_published" class="card glass-card mb-6">
        <div class="card-body">
          <h3 class="card-title text-lg">Public URL</h3>
          <div class="flex items-center gap-2">
            <code class="flex-1 glass-code">
              {{ publicUrl }}
            </code>
            <button class="btn btn-sm btn-outline" @click="copyLink">
              {{ copied ? 'Copied!' : 'Copy' }}
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import Draggable from 'vuedraggable'
import type { FieldType } from '~/types'

const route = useRoute()
const {
  form,
  fields,
  loading,
  saving,
  error,
  loadForm,
  saveAll: doSave,
  addField,
  removeField,
  updateField,
  reorderFields,
  togglePublish: doTogglePublish,
} = useFormBuilder()

const saveSuccess = ref(false)
const copied = ref(false)

const fieldTypes: { type: FieldType; label: string }[] = [
  { type: 'text', label: 'Text' },
  { type: 'textarea', label: 'Textarea' },
  { type: 'number', label: 'Number' },
  { type: 'email', label: 'Email' },
  { type: 'phone', label: 'Phone' },
  { type: 'select', label: 'Select' },
  { type: 'radio', label: 'Radio' },
  { type: 'checkbox', label: 'Checkbox' },
  { type: 'date', label: 'Date' },
]

const emailRecipients = computed(() => {
  return form.value?.submission_settings?.email_recipients?.join(', ') || ''
})

const publicUrl = computed(() => {
  if (!form.value) return ''
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  return `${origin}/f/${form.value.slug}`
})

function updateEmailRecipients(value: string) {
  if (!form.value) return
  const recipients = value
    .split(',')
    .map((e) => e.trim())
    .filter((e) => e.length > 0)
  form.value.submission_settings = {
    ...form.value.submission_settings,
    email_recipients: recipients,
  }
}

async function saveAll() {
  await doSave()
  if (!error.value) {
    saveSuccess.value = true
    setTimeout(() => (saveSuccess.value = false), 3000)
  }
}

async function togglePublish() {
  await doTogglePublish()
}

function copyLink() {
  navigator.clipboard.writeText(publicUrl.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}

onMounted(() => {
  const formId = route.params.id as string
  loadForm(formId)
})
</script>
