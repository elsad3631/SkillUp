<template>
    <div class="card">
        <div class="card-header border-0 pt-6">
            <!--begin::Card title-->
            <div class="card-title">
                <!--begin::Search-->
                <div class="d-flex align-items-center position-relative my-1">
                    <KTIcon icon-name="magnifier" icon-class="fs-1 position-absolute ms-6" />
                    <input type="text" v-model="search" @input="searchItems()"
                        class="form-control form-control-solid w-250px ps-15" placeholder="Search Customers" />
                </div>
                <!--end::Search-->
            </div>
            <!--begin::Card title-->
            <!--begin::Card toolbar-->
            <div class="card-toolbar">
                <!--begin::Toolbar-->
                <div v-if="selectedIds.length === 0" class="d-flex justify-content-end"
                    data-kt-customer-table-toolbar="base">
                    <!--begin::Export-->
                    <button type="button" class="btn btn-light-primary me-3" data-bs-toggle="modal"
                        data-bs-target="#kt_customers_export_modal">
                        <KTIcon icon-name="exit-up" icon-class="fs-2" />
                        Export
                    </button>
                    <!--end::Export-->
                    <!--begin::Add employee-->
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal"
                        data-bs-target="#kt_modal_add_employee">
                        <KTIcon icon-name="plus" icon-class="fs-2" />
                        Add Employee
                    </button>
                    <!--end::Add employee-->
                </div>
                <!--end::Toolbar-->
                <!--begin::Group actions-->
                <div v-else class="d-flex justify-content-end align-items-center"
                    data-kt-customer-table-toolbar="selected">
                    <div class="fw-bold me-5">
                        <span class="me-2">{{ selectedIds.length }}</span>Selected
                    </div>
                    <button type="button" class="btn btn-danger" @click="deleteFewEmployees()">
                        Delete Selected
                    </button>
                </div>
                <!--end::Group actions-->
                <!--begin::Group actions-->
                <div class="d-flex justify-content-end align-items-center d-none"
                    data-kt-customer-table-toolbar="selected">
                    <div class="fw-bold me-5">
                        <span class="me-2" data-kt-customer-table-select="selected_count"></span>Selected
                    </div>
                    <button type="button" class="btn btn-danger" data-kt-customer-table-select="delete_selected">
                        Delete Selected
                    </button>
                </div>
                <!--end::Group actions-->
            </div>
            <!--end::Card toolbar-->
        </div>
        <div class="card-body pt-0" style="position:relative;min-height:200px;">
            <Loading v-if="loading" />
            <Datatable v-else @on-sort="sort" @on-items-select="onItemSelect" :data="tableData" :header="tableHeader"
                :enable-items-per-page-dropdown="true" :checkbox-enabled="true" checkbox-label="id">
                <template v-slot:name="{ row: employee }">
                    {{ employee.firstName }} {{ employee.lastName }}
                </template>

                <template v-slot:email="{ row: employee }">
                    <a href="#" class="text-gray-600 text-hover-primary mb-1" @click.prevent="openEditModal(employee)" data-bs-toggle="modal" data-bs-target="#kt_modal_edit_employee">
                        {{ employee.email }}
                    </a>
                </template>

                <template v-slot:role="{ row: employee }">
                    {{ employee.currentRole }}
                </template>

                <template v-slot:department="{ row: employee }">
                    {{ employee.department }}
                </template>

                <template v-slot:actions="{ row: employee }">
                    <button @click="openEditModal(employee)" data-bs-toggle="modal" data-bs-target="#kt_modal_edit_employee" class="btn btn-sm btn-light-primary me-2">
                        Details
                    </button>
                    <button @click="deleteSingleEmployee(employee.id)" class="btn btn-sm btn-danger">
                        Delete
                    </button>
                </template>
            </Datatable>
        </div>
    </div>

    <!-- Modals -->
    <AddEmployeeModal @employee-created="onEmployeeCreated" :close-modal="() => closeModal('kt_modal_add_employee')" />
    <EditEmployeeModal 
      v-if="selectedEmployee"
      :employee="selectedEmployee" 
      @employee-updated="onEmployeeUpdated" 
      :close-modal="() => closeModal('kt_modal_edit_employee')"
    >
      <template #default>
        <Loading v-if="editModalLoading" />
      </template>
    </EditEmployeeModal>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import { MenuComponent } from "@/assets/ts/components";
import arraySort from "array-sort";
import { getEmployees, deleteEmployee, getEmployee } from "@/core/services/businessServices/Employee";
import type { Employee } from "@/core/models/Employee";
import type { Sort } from "@/components/kt-datatable/table-partials/models";
import AddEmployeeModal from "@/components/employee/AddEmployeeModal.vue";
import EditEmployeeModal from "@/components/employee/EditEmployeeModal.vue";
import Swal from "sweetalert2/dist/sweetalert2.js";
import Loading from "@/components/kt-datatable/table-partials/Loading.vue";

export default defineComponent({
    name: "employees-listing",
    components: {
        Datatable,
        AddEmployeeModal,
        EditEmployeeModal,
        Loading,
    },
    setup() {
        const tableHeader = ref([
            {
                columnName: "Name",
                columnLabel: "name",
                sortEnabled: true,
                columnWidth: 200,
            },
            {
                columnName: "Email",
                columnLabel: "email",
                sortEnabled: true,
                columnWidth: 200,
            },
            {
                columnName: "Role",
                columnLabel: "role",
                sortEnabled: true,
                columnWidth: 180,
            },
            {
                columnName: "Department",
                columnLabel: "department",
                sortEnabled: true,
                columnWidth: 180,
            },
            {
                columnName: "Actions",
                columnLabel: "actions",
                sortEnabled: false,
                columnWidth: 150,
            },
        ]);

        const tableData = ref<Employee[]>([]);
        const initEmployees = ref<Employee[]>([]);
        const selectedIds = ref<string[]>([]);
        const search = ref<string>("");
        const selectedEmployee = ref<Employee | null>(null);
        const loading = ref(false);
        const editModalLoading = ref(false);

        const fetchEmployees = async () => {
            loading.value = true;
            const result = await getEmployees();
            if (result) {
                tableData.value = result;
                initEmployees.value = [...result];
            }
            loading.value = false;
        };

        const onEmployeeCreated = (employee: Employee) => {
            tableData.value.push(employee);
            initEmployees.value.push(employee);
        };

        const onEmployeeUpdated = (updatedEmployee: Employee) => {
            const index = tableData.value.findIndex(e => e.id === updatedEmployee.id);
            if (index !== -1) {
                tableData.value[index] = updatedEmployee;
                initEmployees.value[index] = updatedEmployee;
            }
        };

        const editEmployee = (employee: Employee) => {
            selectedEmployee.value = employee;
            // Trigger modal opening
            const modal = document.getElementById('kt_modal_edit_employee');
            if (modal) {
                const bootstrapModal = new (window as any).bootstrap.Modal(modal);
                bootstrapModal.show();
            }
        };

        const openEditModal = async (employee: Employee) => {
            editModalLoading.value = true;
            // Recupera i dati aggiornati dal backend
            const freshEmployee = await getEmployee(employee.id);
            if (freshEmployee) {
                selectedEmployee.value = freshEmployee;
            } else {
                selectedEmployee.value = employee; // fallback
            }
            editModalLoading.value = false;
        };

        const deleteFewEmployees = async () => {
            if (selectedIds.value.length === 0) return;
            const confirm = await Swal.fire({
                title: 'Are you sure?',
                text: `You are about to delete ${selectedIds.value.length} employees. This action cannot be undone!`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete them!'
            });
            if (confirm.isConfirmed) {
                let allSuccess = true;
                for (const id of selectedIds.value) {
                    const success = await deleteEmployee(id);
                    if (!success) allSuccess = false;
                }
                tableData.value = tableData.value.filter(e => !selectedIds.value.includes(e.id));
                initEmployees.value = initEmployees.value.filter(e => !selectedIds.value.includes(e.id));
                selectedIds.value = [];
                if (allSuccess) {
                    Swal.fire('Deleted!', 'Selected employees have been deleted.', 'success');
                } else {
                    Swal.fire('Error', 'Some employees could not be deleted.', 'error');
                }
            }
        };

        const deleteSingleEmployee = async (id: string) => {
            const confirm = await Swal.fire({
                title: 'Are you sure?',
                text: "This action cannot be undone!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!'
            });
            if (confirm.isConfirmed) {
                const success = await deleteEmployee(id);
                if (success) {
                    tableData.value = tableData.value.filter(e => e.id !== id);
                    initEmployees.value = initEmployees.value.filter(e => e.id !== id);
                    Swal.fire('Deleted!', 'Employee has been deleted.', 'success');
                } else {
                    Swal.fire('Error', 'Failed to delete employee.', 'error');
                }
            }
        };

        const searchItems = () => {
            const query = search.value.toLowerCase();
            if (!query) {
                tableData.value = [...initEmployees.value];
                return;
            }

            tableData.value = initEmployees.value.filter(emp => {
                return (
                    emp.first_name?.toLowerCase().includes(query) ||
                    emp.last_name?.toLowerCase().includes(query) ||
                    emp.email?.toLowerCase().includes(query) ||
                    emp.current_role?.toLowerCase().includes(query) ||
                    emp.department?.toLowerCase().includes(query)
                );
            });
        };

        const sort = (sort: Sort) => {
            if (!sort.label) return;
            const reverse: boolean = sort.order === 'asc';
            const sorted = arraySort(tableData.value, sort.label, { reverse });
            tableData.value = sorted;
        };

        const onItemSelect = (selectedItems: string[]) => {
            selectedIds.value = selectedItems;
        };

        const closeModal = (modalId: string) => {
            const modal = document.getElementById(modalId);
            if (modal) {
                // Trova un elemento con data-bs-dismiss="modal" e simula il click
                const dismissBtn = modal.querySelector('[data-bs-dismiss="modal"]') as HTMLElement;
                if (dismissBtn) {
                    dismissBtn.click();
                }
            }
        };

        onMounted(() => {
            fetchEmployees();
            MenuComponent.reinitialization();
        });

        return {
            tableData,
            tableHeader,
            search,
            selectedIds,
            selectedEmployee,
            searchItems,
            sort,
            onItemSelect,
            deleteFewEmployees,
            deleteSingleEmployee,
            editEmployee,
            onEmployeeCreated,
            onEmployeeUpdated,
            openEditModal,
            closeModal,
            loading,
            editModalLoading,
        };
    },
});
</script>
