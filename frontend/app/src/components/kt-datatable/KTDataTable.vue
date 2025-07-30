<template>
  <div class="modern-datatable-wrapper">
    <TableContent
      @on-items-select="onItemSelect"
      @on-sort="onSort"
      :header="header"
      :data="dataToDisplay"
      :checkboxEnabled="checkboxEnabled"
      :checkboxLabel="checkboxLabel"
      :empty-table-text="emptyTableText"
      :sort-label="sortLabel"
      :sort-order="sortOrder"
      :loading="loading"
    >
      <template v-for="(_, name) in $slots" v-slot:[name]="{ row: item }">
        <slot :name="name" :row="item" />
      </template>
    </TableContent>
    <TableFooter
      @page-change="pageChange"
      :current-page="currentPage"
      v-model:itemsPerPage="itemsInTable"
      :count="totalItems"
      :items-per-page-dropdown-enabled="itemsPerPageDropdownEnabled"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue";
import TableContent from "@/components/kt-datatable/table-partials/table-content/TableContent.vue";
import TableFooter from "@/components/kt-datatable/table-partials/TableFooter.vue";
import type { Sort } from "@/components/kt-datatable/table-partials/models";

export default defineComponent({
  name: "kt-datatable",
  props: {
    header: { type: Array, required: true },
    data: { type: Array, required: true },
    itemsPerPage: { type: Number, default: 10 },
    itemsPerPageDropdownEnabled: {
      type: Boolean,
      required: false,
      default: true,
    },
    checkboxEnabled: { type: Boolean, required: false, default: false },
    checkboxLabel: { type: String, required: false, default: "id" },
    total: { type: Number, required: false },
    loading: { type: Boolean, required: false, default: false },
    sortLabel: { type: String, required: false, default: null },
    sortOrder: {
      type: String as () => "asc" | "desc",
      required: false,
      default: "asc",
    },
    emptyTableText: { type: String, required: false, default: "No data found" },
    currentPage: { type: Number, required: false, default: 1 },
  },
  emits: [
    "page-change",
    "on-sort",
    "on-items-select",
    "on-items-per-page-change",
  ],
  components: {
    TableContent,
    TableFooter,
  },
  setup(props, { emit }) {
    const currentPage = ref(props.currentPage);
    const itemsInTable = ref<number>(props.itemsPerPage);

    watch(
      () => itemsInTable.value,
      (val) => {
        currentPage.value = 1;
        emit("on-items-per-page-change", val);
      }
    );

    const pageChange = (page: number) => {
      currentPage.value = page;
      emit("page-change", page);
    };

    const dataToDisplay = computed(() => {
      if (props.data) {
        if (props.data.length <= itemsInTable.value) {
          return props.data;
        } else {
          let sliceFrom = (currentPage.value - 1) * itemsInTable.value;
          return props.data.slice(sliceFrom, sliceFrom + itemsInTable.value);
        }
      }
      return [];
    });

    const totalItems = computed(() => {
      if (props.data) {
        if (props.data.length <= itemsInTable.value) {
          return props.total;
        } else {
          return props.data.length;
        }
      }
      return 0;
    });

    const onSort = (sort: Sort) => {
      emit("on-sort", sort);
    };

    //eslint-disable-next-line
    const onItemSelect = (selectedItems: any) => {
      emit("on-items-select", selectedItems);
    };

    return {
      pageChange,
      dataToDisplay,
      onSort,
      onItemSelect,
      itemsInTable,
      totalItems,
    };
  },
});
</script>

<style scoped>
.modern-datatable-wrapper {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.modern-datatable-wrapper:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  border-color: rgba(255, 255, 255, 0.15);
}

/* Dark theme styles */
[data-bs-theme="dark"] .modern-datatable-wrapper {
  background: rgba(31, 41, 55, 0.8);
  border-color: rgba(75, 85, 99, 0.3);
}

[data-bs-theme="dark"] .modern-datatable-wrapper:hover {
  border-color: rgba(99, 102, 241, 0.3);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
}

/* Light theme styles */
[data-bs-theme="light"] .modern-datatable-wrapper {
  background: rgba(255, 255, 255, 0.9);
  border-color: rgba(229, 231, 235, 0.8);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

[data-bs-theme="light"] .modern-datatable-wrapper:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  border-color: rgba(99, 102, 241, 0.2);
}

/* Responsive design */
@media (max-width: 768px) {
  .modern-datatable-wrapper {
    padding: 1rem;
    border-radius: 12px;
  }
}

/* Loading state */
.modern-datatable-wrapper.loading {
  opacity: 0.7;
  pointer-events: none;
}

/* Empty state */
.modern-datatable-wrapper.empty {
  text-align: center;
  padding: 3rem 1.5rem;
}

.modern-datatable-wrapper.empty::before {
  content: "📊";
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
  opacity: 0.5;
}

/* Smooth transitions for all interactive elements */
.modern-datatable-wrapper :deep(*) {
  transition: all 0.2s ease;
}

/* Table specific overrides */
.modern-datatable-wrapper :deep(.table) {
  background: transparent;
  border-collapse: separate;
  border-spacing: 0;
  margin: 0;
}

.modern-datatable-wrapper :deep(.table th) {
  background: rgba(99, 102, 241, 0.05);
  border: none;
  padding: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

[data-bs-theme="light"] .modern-datatable-wrapper :deep(.table th) {
  background: rgba(99, 102, 241, 0.08);
  color: rgba(31, 41, 55, 0.9);
}

.modern-datatable-wrapper :deep(.table td) {
  border: none;
  padding: 1rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

[data-bs-theme="light"] .modern-datatable-wrapper :deep(.table td) {
  color: rgba(31, 41, 55, 0.8);
  border-bottom: 1px solid rgba(229, 231, 235, 0.5);
}

.modern-datatable-wrapper :deep(.table tbody tr:hover) {
  background: rgba(99, 102, 241, 0.05);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.1);
}

[data-bs-theme="light"] .modern-datatable-wrapper :deep(.table tbody tr:hover) {
  background: rgba(99, 102, 241, 0.08);
}

/* Checkbox styling */
.modern-datatable-wrapper :deep(.form-check-input) {
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  width: 1.25rem;
  height: 1.25rem;
}

[data-bs-theme="light"] .modern-datatable-wrapper :deep(.form-check-input) {
  border-color: rgba(156, 163, 175, 0.5);
  background: rgba(255, 255, 255, 0.9);
}

.modern-datatable-wrapper :deep(.form-check-input:checked) {
  background: #6366f1;
  border-color: #6366f1;
}

/* Sort indicators */
.modern-datatable-wrapper :deep(.sortable) {
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
}

.modern-datatable-wrapper :deep(.sortable:hover) {
  color: #6366f1;
}

.modern-datatable-wrapper :deep(.sortable::after) {
  content: "↕";
  position: absolute;
  right: 0.5rem;
  opacity: 0.5;
  font-size: 0.75rem;
}

.modern-datatable-wrapper :deep(.sortable.asc::after) {
  content: "↑";
  opacity: 1;
  color: #6366f1;
}

.modern-datatable-wrapper :deep(.sortable.desc::after) {
  content: "↓";
  opacity: 1;
  color: #6366f1;
}

/* Pagination styling */
.modern-datatable-wrapper :deep(.pagination) {
  gap: 0.25rem;
  margin: 0;
}

.modern-datatable-wrapper :deep(.page-link) {
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  margin: 0 0.125rem;
  transition: all 0.2s ease;
}

[data-bs-theme="light"] .modern-datatable-wrapper :deep(.page-link) {
  background: rgba(255, 255, 255, 0.9);
  color: rgba(31, 41, 55, 0.8);
  border: 1px solid rgba(229, 231, 235, 0.5);
}

.modern-datatable-wrapper :deep(.page-link:hover) {
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
  transform: translateY(-1px);
}

.modern-datatable-wrapper :deep(.page-item.active .page-link) {
  background: #6366f1;
  color: white;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
}

/* Items per page select */
.modern-datatable-wrapper :deep(.form-select) {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
}

[data-bs-theme="light"] .modern-datatable-wrapper :deep(.form-select) {
  background: rgba(255, 255, 255, 0.9);
  border-color: rgba(229, 231, 235, 0.5);
  color: rgba(31, 41, 55, 0.8);
}

.modern-datatable-wrapper :deep(.form-select:focus) {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

/* Loading overlay */
.modern-datatable-wrapper :deep(.overlay) {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  border-radius: 16px;
}

/* Empty state */
.modern-datatable-wrapper :deep(.dataTables_empty) {
  text-align: center;
  padding: 3rem 1rem;
  color: rgba(255, 255, 255, 0.6);
  font-style: italic;
}

[data-bs-theme="light"] .modern-datatable-wrapper :deep(.dataTables_empty) {
  color: rgba(107, 114, 128, 0.8);
}

/* Responsive table */
.modern-datatable-wrapper :deep(.table-responsive) {
  border-radius: 12px;
  overflow-x: auto;
  overflow-y: hidden;
}

/* Footer styling */
.modern-datatable-wrapper :deep(.row) {
  margin: 1.5rem 0 0 0;
  align-items: center;
  justify-content: space-between;
}

.modern-datatable-wrapper :deep(.col-md-6) {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Info text */
.modern-datatable-wrapper :deep(.dataTables_info) {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
}

[data-bs-theme="light"] .modern-datatable-wrapper :deep(.dataTables_info) {
  color: rgba(107, 114, 128, 0.8);
}

/* Animation for new rows */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modern-datatable-wrapper :deep(.table tbody tr) {
  animation: fadeInUp 0.3s ease-out;
}

/* Focus states for accessibility */
.modern-datatable-wrapper :deep(.table tbody tr:focus-within) {
  outline: 2px solid #6366f1;
  outline-offset: 2px;
}

/* Custom scrollbar */
.modern-datatable-wrapper :deep(.table-responsive::-webkit-scrollbar) {
  height: 6px;
}

.modern-datatable-wrapper :deep(.table-responsive::-webkit-scrollbar-track) {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.modern-datatable-wrapper :deep(.table-responsive::-webkit-scrollbar-thumb) {
  background: rgba(99, 102, 241, 0.3);
  border-radius: 3px;
}

.modern-datatable-wrapper :deep(.table-responsive::-webkit-scrollbar-thumb:hover) {
  background: rgba(99, 102, 241, 0.5);
}
</style>
