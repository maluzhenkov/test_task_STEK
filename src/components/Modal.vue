<template>
  <div v-if="open" class="modal-backdrop" @click.self="onCancel(persistent)" @keydown.esc="onCancel(false)">
    <div class="modal" ref="modalRef">
      <header class="modal__header">
        <h3 class="modal__title">{{ title }}</h3>
      </header>
      <section class="modal__body">
        <slot />
      </section>
      <footer class="modal__footer">
        <button type="button" class="btn" @click="onCancel(false)">
          Отмена
        </button>
        <button
          type="button"
          class="btn btn--primary"
          :disabled="okDisabled"
          @click="$emit('ok')"
        >
          OK
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { useFocusTrap } from '../composables/useFocusTrap';

const props = defineProps<{
  title: string;
  open: boolean;
  okDisabled?: boolean;
  persistent?: boolean;
}>();

const emit = defineEmits<{ (e: 'cancel'): void; (e: 'ok'): void }>();
const onCancel = (isPersistent?: boolean) => {
  if (isPersistent) return;
  return emit('cancel');
};

const modalRef = useTemplateRef('modalRef');
const isOpen = computed(() => props.open);

useFocusTrap(modalRef, isOpen);
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: var(--color-backdrop);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}
.modal {
  background: #fff;
  width: 100%;
  max-width: 640px;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}
.modal__header {
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
}
.modal__title {
  margin: 0;
}
.modal__body {
  padding: 16px 20px;
}
.modal__footer {
  padding: 12px 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
.btn {
  border: 1px solid #d0d7de;
  background: #fff;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
}
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.btn--primary {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}
</style>
