import type { Form, FormField, FieldType, SubmissionSettings } from '~/types'

export function useFormBuilder() {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const form = ref<Form | null>(null)
  const fields = ref<FormField[]>([])
  const loading = ref(false)
  const saving = ref(false)
  const error = ref('')

  async function createForm(title: string, description?: string): Promise<Form | null> {
    if (!user.value) return null
    loading.value = true
    error.value = ''

    const { data, error: err } = await supabase
      .from('forms')
      .insert({
        user_id: user.value.sub,
        title,
        description: description || null,
      })
      .select()
      .single()

    loading.value = false
    if (err) {
      error.value = err.message
      return null
    }
    form.value = data as Form
    return data as Form
  }

  async function loadForm(formId: string) {
    loading.value = true
    error.value = ''

    const [formRes, fieldsRes] = await Promise.all([
      supabase.from('forms').select('*').eq('id', formId).single(),
      supabase.from('form_fields').select('*').eq('form_id', formId).order('position'),
    ])

    if (formRes.error) {
      error.value = formRes.error.message
      loading.value = false
      return
    }

    form.value = formRes.data as Form
    fields.value = (fieldsRes.data || []) as FormField[]
    loading.value = false
  }

  async function saveAll() {
    if (!form.value) return
    saving.value = true
    error.value = ''

    // Save form metadata
    const { error: formErr } = await supabase
      .from('forms')
      .update({
        title: form.value.title,
        description: form.value.description,
        is_published: form.value.is_published,
        submission_settings: form.value.submission_settings as unknown as Record<string, unknown>,
        updated_at: new Date().toISOString(),
      })
      .eq('id', form.value.id)

    if (formErr) {
      error.value = formErr.message
      saving.value = false
      return
    }

    // Upsert all fields with updated positions
    for (let i = 0; i < fields.value.length; i++) {
      fields.value[i].position = i
    }

    if (fields.value.length > 0) {
      const { error: fieldsErr } = await supabase
        .from('form_fields')
        .upsert(
          fields.value.map((f) => ({
            id: f.id,
            form_id: f.form_id,
            field_type: f.field_type,
            label: f.label,
            placeholder: f.placeholder,
            required: f.required,
            options: f.options as unknown as Record<string, unknown>,
            position: f.position,
            updated_at: new Date().toISOString(),
          })),
        )

      if (fieldsErr) {
        error.value = fieldsErr.message
      }
    }

    saving.value = false
  }

  async function addField(fieldType: FieldType) {
    if (!form.value) return

    const newField: Partial<FormField> = {
      form_id: form.value.id,
      field_type: fieldType,
      label: `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Field`,
      placeholder: '',
      required: false,
      options: fieldType === 'select' || fieldType === 'radio' || fieldType === 'checkbox' ? ['Option 1', 'Option 2'] : [],
      position: fields.value.length,
    }

    const { data, error: err } = await supabase
      .from('form_fields')
      .insert(newField)
      .select()
      .single()

    if (err) {
      error.value = err.message
      return
    }

    fields.value.push(data as FormField)
  }

  async function removeField(fieldId: string) {
    const { error: err } = await supabase
      .from('form_fields')
      .delete()
      .eq('id', fieldId)

    if (err) {
      error.value = err.message
      return
    }

    fields.value = fields.value.filter((f) => f.id !== fieldId)
  }

  function updateField(fieldId: string, updates: Partial<FormField>) {
    const idx = fields.value.findIndex((f) => f.id === fieldId)
    if (idx !== -1) {
      fields.value[idx] = { ...fields.value[idx], ...updates }
    }
  }

  function reorderFields(newOrder: FormField[]) {
    fields.value = newOrder.map((f, i) => ({ ...f, position: i }))
  }

  async function deleteForm(formId: string) {
    const { error: err } = await supabase
      .from('forms')
      .delete()
      .eq('id', formId)

    if (err) {
      error.value = err.message
      return false
    }
    return true
  }

  async function togglePublish() {
    if (!form.value) return
    form.value.is_published = !form.value.is_published
    await saveAll()
  }

  return {
    form,
    fields,
    loading,
    saving,
    error,
    createForm,
    loadForm,
    saveAll,
    addField,
    removeField,
    updateField,
    reorderFields,
    deleteForm,
    togglePublish,
  }
}
