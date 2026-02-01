import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { form_id, data } = body

  if (!form_id || !data) {
    throw createError({ statusCode: 400, statusMessage: 'Missing form_id or data' })
  }

  const supabase = serverSupabaseServiceRole(event)

  // Verify form exists and is published
  const { data: form, error: formErr } = await supabase
    .from('forms')
    .select('id, title, is_published, submission_settings')
    .eq('id', form_id)
    .eq('is_published', true)
    .single()

  if (formErr || !form) {
    throw createError({ statusCode: 404, statusMessage: 'Form not found or not published' })
  }

  // Insert submission
  const { error: insertErr } = await supabase
    .from('form_submissions')
    .insert({
      form_id,
      data,
    })

  if (insertErr) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to save submission' })
  }

  // Trigger email notification if recipients configured
  const settings = form.submission_settings as { email_recipients?: string[]; email_subject?: string } | null
  if (settings?.email_recipients && settings.email_recipients.length > 0) {
    try {
      // Fetch form fields for context
      const { data: fields } = await supabase
        .from('form_fields')
        .select('label, field_type')
        .eq('form_id', form_id)
        .order('position')

      const projectUrl = process.env.SUPABASE_URL
      await fetch(`${projectUrl}/functions/v1/send-form-submission`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY || ''}`,
        },
        body: JSON.stringify({
          form_title: form.title,
          recipients: settings.email_recipients,
          subject: settings.email_subject || `New submission: ${form.title}`,
          fields: fields || [],
          submission_data: data,
        }),
      })
    } catch {
      // Don't fail the submission if email fails
      console.error('Failed to send email notification')
    }
  }

  return { success: true }
})
