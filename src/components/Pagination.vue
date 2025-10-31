<template>
  <div class="pagination">
    <button
      class="btn"
      :disabled="page <= 1"
      @click="$emit('update:page', page - 1)"
    >
      Назад
    </button>
    <span>Стр. {{ page }} / {{ totalPages }}</span>
    <button
      class="btn"
      :disabled="page >= totalPages"
      @click="$emit('update:page', page + 1)"
    >
      Вперёд
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ page: number; total: number; pageSize: number }>();
defineEmits<{ (e: 'update:page', value: number): void }>();
const totalPages = computed(() =>
  Math.max(1, Math.ceil(props.total / props.pageSize))
);
</script>

<style scoped>
.pagination {
  display: flex;
  gap: 12px;
  align-items: center;
}
.btn {
  border: 1px solid var(--color-border);
  background: #fff;
  padding: 6px 12px;
  border-radius: 6px;
}
</style>
