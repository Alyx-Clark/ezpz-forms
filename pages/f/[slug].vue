<template>
  <div class="container mx-auto p-6 max-w-2xl print-full-width">
    <div v-if="loading" class="flex justify-center py-20">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <div v-else-if="!form" class="text-center py-20">
      <h2 class="text-2xl font-bold">Form not found</h2>
      <p class="text-slate-600 mt-2">This form may not exist or is no longer published.</p>
    </div>

    <template v-else>
      <!-- Success state -->
      <div v-if="submitted" class="text-center py-20">
        <div class="text-5xl mb-4">&#10003;</div>
        <h2 class="text-2xl font-bold mb-2">Thank you!</h2>
        <p class="text-slate-600">Your response has been submitted successfully.</p>
        <button class="btn btn-primary mt-6" @click="resetForm">Submit another response</button>
      </div>

      <!-- Form -->
      <template v-else>
        <div class="mb-6">
          <h1 class="text-3xl font-bold glass-heading">{{ form.title }}</h1>
          <p v-if="form.description" class="text-slate-600 mt-2">{{ form.description }}</p>
        </div>

        <div v-if="error" class="alert alert-error mb-4">
          <span>{{ error }}</span>
        </div>

        <form @submit.prevent="handleSubmit" class="glass-card p-8">
          <FormFieldRenderer
            v-for="field in fields"
            :key="field.id"
            :field="field"
            :model-value="formData[field.id]"
            @update:model-value="formData[field.id] = $event"
          />

          <div class="flex gap-2 mt-6 btn-print-hide">
            <button type="submit" class="btn btn-primary" :disabled="submitting">
              <span v-if="submitting" class="loading loading-spinner loading-sm"></span>
              Submit
            </button>
            <button type="button" class="btn btn-outline" @click="printForm">
              Print
            </button>
          </div>
        </form>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Form, FormField } from '~/types'

definePageMeta({
  layout: 'public',
})

const route = useRoute()
const supabase = useSupabaseClient()

const form = ref<Form | null>(null)
const fields = ref<FormField[]>([])
const formData = ref<Record<string, unknown>>({})
const loading = ref(true)
const submitting = ref(false)
const submitted = ref(false)
const error = ref('')

async function fetchForm() {
  const slug = route.params.slug as string

  const { data: formData_, error: formErr } = await supabase
    .from('forms')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (formErr || !formData_) {
    loading.value = false
    return
  }

  form.value = formData_ as Form

  const { data: fieldsData } = await supabase
    .from('form_fields')
    .select('*')
    .eq('form_id', form.value.id)
    .order('position')

  fields.value = (fieldsData || []) as FormField[]

  // Initialize form data
  for (const field of fields.value) {
    formData.value[field.id] = field.field_type === 'checkbox' ? [] : ''
  }

  loading.value = false
}

async function handleSubmit() {
  if (!form.value) return

  // Validate required fields
  for (const field of fields.value) {
    if (field.required) {
      const val = formData.value[field.id]
      if (!val || (Array.isArray(val) && val.length === 0)) {
        error.value = `"${field.label}" is required.`
        return
      }
    }
  }

  submitting.value = true
  error.value = ''

  // Build labeled submission data
  const labeledData: Record<string, unknown> = {}
  for (const field of fields.value) {
    labeledData[field.label] = formData.value[field.id]
  }

  try {
    const res = await $fetch('/api/submit-form', {
      method: 'POST',
      body: {
        form_id: form.value.id,
        data: labeledData,
      },
    })

    submitted.value = true
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to submit form'
    error.value = message
  }

  submitting.value = false
}

function resetForm() {
  submitted.value = false
  error.value = ''
  for (const field of fields.value) {
    formData.value[field.id] = field.field_type === 'checkbox' ? [] : ''
  }
}

function printForm() {
  window.print()
}

onMounted(fetchForm)
</script>
