<template>
  <form class="form" @submit.prevent @keydown.enter="emit('save')">
    <div class="grid">
      <label class="field">
        <span>Название организации</span>
        <input v-model.trim="local.name" type="text" />
      </label>
      <label class="field">
        <span>ФИО директора</span>
        <input
          v-model.trim="local.directorFullName"
          type="text"
          placeholder="Иванов И.И."
        />
      </label>
      <label class="field">
        <span>Номер телефона</span>
        <input
          :value="local.phone"
          @input="onPhoneInput"
          type="tel"
          inputmode="tel"
          maxlength="16"
          placeholder="+7 000 123 45 67"
        />
      </label>
    </div>

    <fieldset class="fieldset">
      <legend>Адрес</legend>
      <div class="grid">
        <label class="field">
          <span>Город</span>
          <input v-model.trim="local.address.city" type="text" />
        </label>
        <label class="field">
          <span>Улица</span>
          <input v-model.trim="local.address.street" type="text" />
        </label>
        <label class="field">
          <span>Дом</span>
          <input v-model.trim="local.address.house" type="text" />
        </label>
      </div>
    </fieldset>
  </form>
</template>

<script setup lang="ts">
import { computed, watch, reactive } from 'vue';
import type { Organization } from '../types';

const props = defineProps<{ modelValue: Organization }>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: Organization): void;
  (e: 'valid', value: boolean): void;
  (e: 'save'): void;
}>();

const local = reactive<Organization>(
  JSON.parse(JSON.stringify(props.modelValue))
);

const isValid = computed(() => {
  return (
    local.phone.length === 16 &&
    !!local.name &&
    !!local.directorFullName &&
    !!local.address.city &&
    !!local.address.street &&
    !!local.address.house
  );
});

function formatPhone(national: string): string {
  const p1 = national.slice(0, 3);
  const p2 = national.slice(3, 6);
  const p3 = national.slice(6, 8);
  const p4 = national.slice(8, 10);
  let out = '+7';
  if (national.length > 0) out += ` ${p1}`;
  if (national.length > 3) out += ` ${p2}`;
  if (national.length > 6) out += ` ${p3}`;
  if (national.length > 8) out += ` ${p4}`;
  return out;
}

function normalizeToNational(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  let national = digits;
  if (digits.startsWith('7') || digits.startsWith('8'))
    national = digits.slice(1);
  return national.slice(0, 10);
}

function onPhoneInput(e: Event) {
  const target = e.target as HTMLInputElement;
  const national = normalizeToNational(target.value);
  const formatted = formatPhone(national);
  local.phone = formatted;
  target.value = formatted;
}

// Reset local state only when switching the edited entity (by id)
watch(
  () => props.modelValue.id,
  () => {
    Object.assign(local, JSON.parse(JSON.stringify(props.modelValue)));
  }
);

watch(
  local,
  () => {
    emit('update:modelValue', JSON.parse(JSON.stringify(local)));
    emit('valid', isValid.value);
  },
  { deep: true, immediate: true }
);
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.fieldset {
  margin-top: 12px;
  border: 1px solid #eee;
  border-radius: 6px;
  padding: 8px 12px 12px;
}
input[type='text'],
input[type='tel'] {
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 8px 10px;
}
</style>
