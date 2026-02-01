<template>
  <div class="container mx-auto p-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold glass-heading">My Forms</h1>
      <NuxtLink to="/forms/new" class="btn btn-primary">
        + Create New Form
      </NuxtLink>
    </div>

    <div v-if="loading" class="flex justify-center py-20">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <div v-else-if="forms.length === 0" class="text-center py-20">
      <div class="text-6xl mb-4">&#128221;</div>
      <h2 class="text-xl font-semibold mb-2">No forms yet</h2>
      <p class="text-slate-600 mb-6">Create your first form to get started.</p>
      <NuxtLink to="/forms/new" class="btn btn-primary">
        Create New Form
      </NuxtLink>
    </div>

    <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <FormCard
        v-for="f in forms"
        :key="f.id"
        :form="f"
        :field-count="fieldCounts[f.id] || 0"
        @delete="handleDelete"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Form } from '~/types'

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const forms = ref<Form[]>([])
const fieldCounts = ref<Record<string, number>>({})
const loading = ref(true)

async function loadForms() {
  if (!user.value?.sub) {
    loading.value = false
    return
  }
  loading.value = true

  try {
    const { data } = await supabase
      .from('forms')
      .select('*')
      .eq('user_id', user.value.sub)
      .order('created_at', { ascending: false })

    forms.value = (data || []) as Form[]

    // Get field counts for each form
    if (forms.value.length > 0) {
      const formIds = forms.value.map((f) => f.id)
      const { data: fields } = await supabase
        .from('form_fields')
        .select('form_id')
        .in('form_id', formIds)

      const counts: Record<string, number> = {}
      for (const field of fields || []) {
        counts[field.form_id] = (counts[field.form_id] || 0) + 1
      }
      fieldCounts.value = counts
    }
  } finally {
    loading.value = false
  }
}

async function handleDelete(formId: string) {
  if (!confirm('Are you sure you want to delete this form? This cannot be undone.')) return

  const { error } = await supabase
    .from('forms')
    .delete()
    .eq('id', formId)

  if (!error) {
    forms.value = forms.value.filter((f) => f.id !== formId)
  }
}

watch(user, (val) => {
  if (val?.sub) loadForms()
}, { immediate: true })
</script>
