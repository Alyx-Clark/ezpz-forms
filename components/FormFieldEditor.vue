<template>
  <div class="card glass-card-light">
    <div class="card-body p-4">
      <div class="flex items-center gap-2 mb-3">
        <!-- Drag handle -->
        <div class="cursor-grab active:cursor-grabbing text-slate-400 drag-handle">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
          </svg>
        </div>

        <!-- Field type badge -->
        <span class="badge badge-outline badge-sm">{{ field.field_type }}</span>

        <!-- Required toggle -->
        <label class="label cursor-pointer gap-1 ml-auto">
          <span class="label-text text-xs">Required</span>
          <input
            type="checkbox"
            :checked="field.required"
            class="checkbox checkbox-xs checkbox-primary"
            @change="emit('update', field.id, { required: !field.required })"
          />
        </label>

        <!-- Delete button -->
        <button class="btn btn-ghost btn-xs text-error" @click="emit('remove', field.id)">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <!-- Label input -->
      <div class="form-control mb-2">
        <label class="label py-1">
          <span class="label-text text-xs">Label</span>
        </label>
        <input
          :value="field.label"
          type="text"
          placeholder="Field label"
          class="input input-bordered input-sm w-full glass-input"
          @input="emit('update', field.id, { label: ($event.target as HTMLInputElement).value })"
        />
      </div>

      <!-- Placeholder input (not for checkbox/radio) -->
      <div v-if="!['checkbox', 'radio', 'select'].includes(field.field_type)" class="form-control mb-2">
        <label class="label py-1">
          <span class="label-text text-xs">Placeholder</span>
        </label>
        <input
          :value="field.placeholder"
          type="text"
          placeholder="Placeholder text"
          class="input input-bordered input-sm w-full glass-input"
          @input="emit('update', field.id, { placeholder: ($event.target as HTMLInputElement).value })"
        />
      </div>

      <!-- Options editor (for select/radio/checkbox) -->
      <div v-if="['select', 'radio', 'checkbox'].includes(field.field_type)" class="form-control mb-2">
        <label class="label py-1">
          <span class="label-text text-xs">Options</span>
        </label>
        <div class="space-y-1">
          <div v-for="(option, idx) in field.options" :key="idx" class="flex gap-1">
            <input
              :value="option"
              type="text"
              class="input input-bordered input-sm flex-1 glass-input"
              @input="updateOption(idx, ($event.target as HTMLInputElement).value)"
            />
            <button
              class="btn btn-ghost btn-xs text-error"
              @click="removeOption(idx)"
              :disabled="field.options.length <= 1"
            >
              ✕
            </button>
          </div>
        </div>
        <button class="btn btn-ghost btn-xs mt-1 self-start" @click="addOption">
          + Add option
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormField } from '~/types'

const props = defineProps<{
  field: FormField
}>()

const emit = defineEmits<{
  update: [fieldId: string, updates: Partial<FormField>]
  remove: [fieldId: string]
}>()

function updateOption(idx: number, value: string) {
  const newOptions = [...props.field.options]
  newOptions[idx] = value
  emit('update', props.field.id, { options: newOptions })
}

function removeOption(idx: number) {
  const newOptions = props.field.options.filter((_, i) => i !== idx)
  emit('update', props.field.id, { options: newOptions })
}

function addOption() {
  const newOptions = [...props.field.options, `Option ${props.field.options.length + 1}`]
  emit('update', props.field.id, { options: newOptions })
}
</script>
