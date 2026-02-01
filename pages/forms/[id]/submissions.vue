<template>
  <div class="container mx-auto p-6">
    <div class="mb-6">
      <NuxtLink :to="`/forms/${formId}/edit`" class="btn btn-ghost btn-sm mb-2">&larr; Back to Editor</NuxtLink>
      <h1 class="text-3xl font-bold glass-heading">Submissions</h1>
      <p v-if="formTitle" class="text-slate-600">{{ formTitle }}</p>
    </div>

    <div v-if="loading" class="flex justify-center py-20">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <div v-else-if="submissions.length === 0" class="text-center py-20">
      <div class="text-6xl mb-4">&#128234;</div>
      <h2 class="text-xl font-semibold mb-2">No submissions yet</h2>
      <p class="text-slate-600">Submissions will appear here once people fill out your form.</p>
    </div>

    <template v-else>
      <p class="text-sm text-slate-600 mb-4">
        {{ submissions.length }} submission{{ submissions.length !== 1 ? 's' : '' }}
      </p>

      <div class="overflow-x-auto glass-table">
        <table class="table w-full">
          <thead>
            <tr>
              <th>#</th>
              <th v-for="col in columns" :key="col">{{ col }}</th>
              <th>Submitted</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(sub, idx) in submissions" :key="sub.id">
              <td>{{ idx + 1 }}</td>
              <td v-for="col in columns" :key="col">
                {{ formatValue(sub.data[col]) }}
              </td>
              <td class="text-sm text-slate-600">
                {{ formatDate(sub.created_at) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { FormSubmission } from '~/types'

const route = useRoute()
const supabase = useSupabaseClient()

const formId = route.params.id as string
const formTitle = ref('')
const submissions = ref<FormSubmission[]>([])
const columns = ref<string[]>([])
const loading = ref(true)

async function loadSubmissions() {
  // Fetch form title
  const { data: form } = await supabase
    .from('forms')
    .select('title')
    .eq('id', formId)
    .single()

  if (form) {
    formTitle.value = form.title
  }

  // Fetch submissions
  const { data } = await supabase
    .from('form_submissions')
    .select('*')
    .eq('form_id', formId)
    .order('created_at', { ascending: false })

  submissions.value = (data || []) as FormSubmission[]

  // Extract column names from first submission
  if (submissions.value.length > 0) {
    const firstData = submissions.value[0].data as Record<string, unknown>
    columns.value = Object.keys(firstData)
  }

  loading.value = false
}

function formatValue(val: unknown): string {
  if (val === null || val === undefined) return ''
  if (Array.isArray(val)) return val.join(', ')
  return String(val)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString()
}

onMounted(loadSubmissions)
</script>
