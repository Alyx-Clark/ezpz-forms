export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'email'
  | 'phone'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'date'

export interface Profile {
  id: string
  full_name: string | null
  phone: string | null
  created_at: string
  updated_at: string
}

export interface Form {
  id: string
  user_id: string
  title: string
  description: string | null
  slug: string
  is_published: boolean
  submission_settings: SubmissionSettings
  created_at: string
  updated_at: string
}

export interface FormField {
  id: string
  form_id: string
  field_type: FieldType
  label: string
  placeholder: string | null
  required: boolean
  options: string[]
  position: number
  created_at: string
  updated_at: string
}

export interface FormSubmission {
  id: string
  form_id: string
  data: Record<string, unknown>
  created_at: string
}

export interface SubmissionSettings {
  email_recipients?: string[]
  email_subject?: string
}
