<template>
  <table class="table">
    <thead>
      <tr>
        <th @click="toggleSort('name')" class="th--sortable">
          Название
          <span v-if="sort.key === 'name'">
            {{ sort.direction === 'asc' ? '↑' : '↓' }}
          </span>
        </th>
        <th @click="toggleSort('directorFullName')" class="th--sortable">
          ФИО директора
          <span v-if="sort.key === 'directorFullName'">
            {{ sort.direction === 'asc' ? '↑' : '↓' }}
          </span>
        </th>
        <th>Номер телефона</th>
        <th>Адрес</th>
        <th style="width: 40px"></th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="org in pageItems"
        :key="org.id"
        class="row"
        @click="onRowClick(org)"
      >
        <td>{{ org.name }}</td>
        <td>{{ org.directorFullName }}</td>
        <td>{{ org.phone }}</td>
        <td>{{ fullAddress(org) }}</td>
        <td class="cell--delete" @click.stop="emit('delete', org.id)">✕</td>
      </tr>
      <tr v-if="pageItems.length === 0">
        <td colspan="5" class="empty">Нет данных</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Organization, SortState, SortKey } from '../types';

const props = defineProps<{
  items: Organization[];
  sort: SortState;
  page: number;
  pageSize: number;
}>();
const emit = defineEmits<{
  (e: 'sort', value: SortState): void;
  (e: 'delete', id: string): void;
  (e: 'edit', org: Organization): void;
}>();

const toggleSort = (key: SortKey) => {
  if (!key) return;
  if (props.sort.key === key) {
    emit('sort', {
      key,
      direction: props.sort.direction === 'asc' ? 'desc' : 'asc',
    });
  } else {
    emit('sort', { key, direction: 'asc' });
  }
};

const sortedItems = computed(() => {
  if (!props.sort.key) return props.items.slice();
  const arr = props.items.slice();
  arr.sort((a, b) => {
    const ak = String(a[props.sort.key!]).toLowerCase();
    const bk = String(b[props.sort.key!]).toLowerCase();
    if (ak < bk) return props.sort.direction === 'asc' ? -1 : 1;
    if (ak > bk) return props.sort.direction === 'asc' ? 1 : -1;
    return 0;
  });
  return arr;
});

const pageItems = computed(() => {
  const start = (props.page - 1) * props.pageSize;
  return sortedItems.value.slice(start, start + props.pageSize);
});

const fullAddress = (o: Organization) =>
  `г. ${o.address.city}, ул. ${o.address.street}, д. ${o.address.house}`;

const onRowClick = (org: Organization) => emit('edit', org);
</script>

<style scoped>
.table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  border-bottom: 1px solid #eee;
  text-align: left;
  padding: 10px 8px;
}
.row {
  cursor: pointer;
}
.th--sortable {
  cursor: pointer;
  user-select: none;
}
.cell--delete {
  text-align: center;
  cursor: pointer;
  color: var(--color-danger);
}
.cell--delete:hover {
  color: var(--color-danger-hover);
}
.empty {
  text-align: center;
  color: var(--color-muted);
}
</style>
