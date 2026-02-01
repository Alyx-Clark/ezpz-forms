<template>
  <div class="form-control mb-4">
    <label class="label">
      <span class="label-text">
        {{ field.label }}
        <span v-if="field.required" class="text-error">*</span>
      </span>
    </label>

    <!-- Text -->
    <input
      v-if="field.field_type === 'text'"
      :value="modelValue"
      type="text"
      :placeholder="field.placeholder || ''"
      class="input input-bordered w-full glass-input"
      :required="field.required"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />

    <!-- Textarea -->
    <textarea
      v-else-if="field.field_type === 'textarea'"
      :value="modelValue"
      :placeholder="field.placeholder || ''"
      class="textarea textarea-bordered w-full glass-input"
      rows="3"
      :required="field.required"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    ></textarea>

    <!-- Number -->
    <input
      v-else-if="field.field_type === 'number'"
      :value="modelValue"
      type="number"
      :placeholder="field.placeholder || ''"
      class="input input-bordered w-full glass-input"
      :required="field.required"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />

    <!-- Email -->
    <input
      v-else-if="field.field_type === 'email'"
      :value="modelValue"
      type="email"
      :placeholder="field.placeholder || ''"
      class="input input-bordered w-full glass-input"
      :required="field.required"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />

    <!-- Phone -->
    <input
      v-else-if="field.field_type === 'phone'"
      :value="modelValue"
      type="tel"
      :placeholder="field.placeholder || ''"
      class="input input-bordered w-full glass-input"
      :required="field.required"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />

    <!-- Date -->
    <input
      v-else-if="field.field_type === 'date'"
      :value="modelValue"
      type="date"
      class="input input-bordered w-full glass-input"
      :required="field.required"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />

    <!-- Select -->
    <select
      v-else-if="field.field_type === 'select'"
      :value="modelValue"
      class="select select-bordered w-full glass-input"
      :required="field.required"
      @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option value="" disabled>Select an option</option>
      <option v-for="opt in field.options" :key="opt" :value="opt">{{ opt }}</option>
    </select>

    <!-- Radio -->
    <div v-else-if="field.field_type === 'radio'" class="space-y-2 mt-1">
      <label v-for="opt in field.options" :key="opt" class="label cursor-pointer justify-start gap-3">
        <input
          type="radio"
          :name="`field-${field.id}`"
          :value="opt"
          class="radio radio-primary"
          :checked="modelValue === opt"
          :required="field.required"
          @change="emit('update:modelValue', opt)"
        />
        <span class="label-text">{{ opt }}</span>
      </label>
    </div>

    <!-- Checkbox (multiple) -->
    <div v-else-if="field.field_type === 'checkbox'" class="space-y-2 mt-1">
      <label v-for="opt in field.options" :key="opt" class="label cursor-pointer justify-start gap-3">
        <input
          type="checkbox"
          :value="opt"
          class="checkbox checkbox-primary"
          :checked="Array.isArray(modelValue) && modelValue.includes(opt)"
          @change="toggleCheckbox(opt)"
        />
        <span class="label-text">{{ opt }}</span>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormField } from '~/types'

const props = defineProps<{
  field: FormField
  modelValue: unknown
}>()

const emit = defineEmits<{
  'update:modelValue': [value: unknown]
}>()

function toggleCheckbox(opt: string) {
  const current = Array.isArray(props.modelValue) ? [...props.modelValue] : []
  const idx = current.indexOf(opt)
  if (idx === -1) {
    current.push(opt)
  } else {
    current.splice(idx, 1)
  }
  emit('update:modelValue', current)
}
</script>
