<template>
  <section class="wrap">
    <div class="toolbar">
      <input
        v-model.trim="search"
        type="search"
        class="input"
        autofocus
        placeholder="Найти по ФИО..."
      />
      <button class="btn btn--primary" @click="openAdd">Добавить</button>
    </div>

    <OrgTable
      :items="filtered"
      :sort="sort"
      :page="page"
      :page-size="pageSize"
      @sort="(s) => (sort = s)"
      @delete="openDeleteConfirm"
      @edit="openEdit"
    />

    <div class="footer">
      <Pagination
        :page="page"
        :total="filtered.length"
        :page-size="pageSize"
        @update:page="(p) => (page = p)"
      />
    </div>

    <Modal
      :open="isAddOpen"
      title="Добавить организацию"
      :ok-disabled="!formValid"
      persistent
      @cancel="closeModal"
      @ok="confirmAdd"
    >
      <OrgForm v-model="formModel" @valid="(v) => (formValid = v)" @save="confirmAdd" />
    </Modal>

    <Modal
      :open="isEditOpen"
      title="Редактировать организацию"
      :ok-disabled="!formValid"
      persistent
      @cancel="closeModal"
      @ok="confirmEdit"
    >
      <OrgForm v-model="formModel" @valid="(v) => (formValid = v)" @save="confirmEdit" />
    </Modal>

    <Modal
      :open="isDeleteOpen"
      title="Удалить запись?"
      @cancel="closeDelete"
      @ok="confirmDelete"
    >
      <p>
        Вы действительно хотите удалить организацию
        <strong v-if="deleteTarget">{{ deleteTarget.name }}</strong>
        ?
      </p>
    </Modal>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { Organization, SortState } from '../types';
import OrgTable from '../components/OrgTable.vue';
import Pagination from '../components/Pagination.vue';
import Modal from '../components/Modal.vue';
import OrgForm from '../components/OrgForm.vue';

const pageSize = 2;
const page = ref(1);
const search = ref('');
const sort = ref<SortState>({ key: null, direction: 'asc' });

const organizations = ref<Organization[]>([
  {
    id: crypto.randomUUID(),
    name: 'ООО "Вектор"',
    directorFullName: 'Иванов И.И.',
    phone: '+7 000 123 45 67',
    address: { city: 'Москва', street: 'Ленина', house: '1' },
  },
  {
    id: crypto.randomUUID(),
    name: 'ИП Сидоров С.С.',
    directorFullName: 'Сидоров С.С.',
    phone: '+7 000 56 78 99',
    address: { city: 'Санкт-Петербург', street: 'Невский', house: '2' },
  },
]);

const filtered = computed(() => {
  const q = search.value.toLowerCase();
  return organizations.value.filter((o) =>
    o.directorFullName.toLowerCase().includes(q)
  );
});

// Keep current page within available range after data changes (e.g., deletions)
const totalPages = computed(() =>
  Math.max(1, Math.ceil(filtered.value.length / pageSize))
);
watch(
  [() => filtered.value.length, () => page.value],
  () => {
    const tp = totalPages.value;
    if (page.value > tp) page.value = tp;
    if (filtered.value.length === 0) page.value = 1;
  },
  { immediate: true }
);

// Add/Edit modal state
const isAddOpen = ref(false);
const isEditOpen = ref(false);
const formValid = ref(false);
const formModel = ref<Organization>(emptyOrg());
const editingId = ref<string | null>(null);
const isDeleteOpen = ref(false);
const deleteId = ref<string | null>(null);
const deleteTarget = computed(
  () => organizations.value.find((o) => o.id === deleteId.value) || null
);

function emptyOrg(): Organization {
  return {
    id: '',
    name: '',
    directorFullName: '',
    phone: '',
    address: { city: '', street: '', house: '' },
  };
}

function openAdd() {
  formModel.value = emptyOrg();
  formValid.value = false;
  isAddOpen.value = true;
}

function openEdit(org: Organization) {
  editingId.value = org.id;
  formModel.value = JSON.parse(JSON.stringify(org));
  formValid.value = true;
  isEditOpen.value = true;
}

function closeModal() {
  isAddOpen.value = false;
  isEditOpen.value = false;
}

function confirmAdd() {
  if (!formValid.value) return;
  const entry = { ...formModel.value, id: crypto.randomUUID() };
  organizations.value.unshift(entry);

  closeModal();
}

function confirmEdit() {
  if (!formValid.value || !editingId.value) return;
  const idx = organizations.value.findIndex((o) => o.id === editingId.value);
  if (idx !== -1) {
    organizations.value[idx] = { ...formModel.value, id: editingId.value };
  }
  closeModal();
}

function openDeleteConfirm(id: string) {
  deleteId.value = id;
  isDeleteOpen.value = true;
}

function closeDelete() {
  isDeleteOpen.value = false;
  deleteId.value = null;
}

function confirmDelete() {
  if (!deleteId.value) return;
  organizations.value = organizations.value.filter(
    (o) => o.id !== deleteId.value
  );
  closeDelete();
}
</script>

<style scoped>
.wrap {
  padding: 24px;
}
.toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}
.input {
  flex: 1;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  padding: 8px 10px;
}
.btn {
  border: 1px solid var(--color-border);
  background: #fff;
  padding: 8px 14px;
  border-radius: 6px;
}
.btn--primary {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}
.footer {
  margin-top: 12px;
  display: flex;
  justify-content: center;
}
</style>
