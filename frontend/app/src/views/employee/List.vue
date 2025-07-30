<template>
    <div class="card">
        <div class="card-header border-0 pt-6">
            <!--begin::Card title-->
            <div class="card-title">
                <!--begin::Search-->
                <div class="d-flex align-items-center position-relative my-1">
                    <KTIcon icon-name="magnifier" icon-class="fs-1 position-absolute ms-6" />
                    <input type="text" v-model="search" @input="searchItems()"
                        class="form-control form-control-solid w-250px ps-15" placeholder="Search Employees" />
                </div>
                <!--end::Search-->
            </div>
            <!--begin::Card title-->
            <!--begin::Card toolbar-->
            <div class="card-toolbar">
                <!--begin::Toolbar-->
                <div v-if="selectedIds.length === 0" class="d-flex justify-content-end"
                    data-kt-employee-table-toolbar="base">
                    <!--begin::Export-->
                    <button type="button" class="btn btn-light-primary me-3" data-bs-toggle="modal"
                        data-bs-target="#kt_employees_export_modal">
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
                    data-kt-employee-table-toolbar="selected">
                    <div class="fw-bold me-5">
                        <span class="me-2">{{ selectedIds.length }}</span>Selected
                    </div>
                    <button type="button" class="btn btn-danger" @click="deleteFewEmployees()">
                        <KTIcon icon-name="trash" icon-class="fs-2" />
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
                <template v-slot:employee="{ row: employee }">
                    <div class="d-flex align-items-center">
                        <div class="symbol symbol-50px me-5">
                            <div class="symbol-label bg-light-success d-flex align-items-center justify-content-center" style="font-size: 1.2rem; font-weight: 600; color: #fff;">
                                {{ getInitials(employee.firstName, employee.lastName) }}
                            </div>
                        </div>
                        <div class="d-flex flex-column">
                            <router-link :to="`/employees/${employee.id}/overview`" class="text-gray-800 text-hover-primary fw-bold mb-1">
                                {{ employee.firstName }} {{ employee.lastName }}
                            </router-link>

                        </div>
                    </div>
                </template>

                <template v-slot:contact="{ row: employee }">
                    <div class="d-flex flex-column align-items-start">
                        <div class="d-flex align-items-center mb-1">
                            <KTIcon icon-name="sms" icon-class="fs-7 me-1 text-primary" />
                            <span class="text-muted fs-8">{{ employee.email }}</span>
                        </div>
                        <div v-if="employee.phone" class="d-flex align-items-center">
                            <KTIcon icon-name="phone" icon-class="fs-7 me-1 text-success" />
                            <span class="text-muted fs-8">{{ employee.phone }}</span>
                        </div>
                        <div v-if="employee.address" class="d-flex align-items-center mt-1">
                            <KTIcon icon-name="location" icon-class="fs-7 me-1 text-warning" />
                            <span class="text-muted fs-8">{{ employee.address }}</span>
                        </div>
                    </div>
                </template>

                <template v-slot:role="{ row: employee }">
                    <div class="d-flex flex-column align-items-start">
                        <div v-if="employee.userRoles && employee.userRoles.length > 0">
                            <span v-for="role in employee.userRoles" :key="role.id" class="badge badge-light-primary me-1 mb-1">
                                <KTIcon icon-name="shield-tick" icon-class="fs-7 me-1" />
                                {{ role.description || role.name }}
                            </span>
                        </div>
                        <div v-else>
                            <span class="badge badge-light-warning">
                                <KTIcon icon-name="shield-cross" icon-class="fs-7 me-1" />
                                No roles assigned
                            </span>
                        </div>
                    </div>
                </template>

                <template v-slot:department="{ row: employee }">
                    <div class="d-flex flex-column align-items-start">
                        <span v-if="employee.department" class="badge badge-light-info">
                            <KTIcon icon-name="building" icon-class="fs-7 me-1" />
                            {{ employee.department }}
                        </span>
                        <span v-else class="text-muted fs-8">N/A</span>
                    </div>
                </template>

                <template v-slot:status="{ row: employee }">
                    <div class="d-flex flex-column align-items-start">
                        <span v-if="employee.isAvailable" class="badge badge-light-success">
                            <KTIcon icon-name="check-circle" icon-class="fs-7 me-1" />
                            Available
                        </span>
                        <span v-else class="badge badge-light-warning">
                            <KTIcon icon-name="pause-circle" icon-class="fs-7 me-1" />
                            Busy
                        </span>
                    </div>
                </template>

                <template v-slot:actions="{ row: employee }">
                    <div class="d-flex gap-2">
                        <router-link :to="`/employees/${employee.id}/overview`" class="btn btn-sm btn-light-primary">
                            <KTIcon icon-name="eye" icon-class="fs-7" />
                            View
                        </router-link>
                        <router-link :to="`/employees/${employee.id}/settings`" class="btn btn-sm btn-light-warning">
                            <KTIcon icon-name="pencil" icon-class="fs-7" />
                            Edit
                        </router-link>
                        <button @click="deleteSingleEmployee(employee.id)" class="btn btn-sm btn-light-danger">
                            <KTIcon icon-name="trash" icon-class="fs-7" />
                            Delete
                        </button>
                    </div>
                </template>
            </Datatable>
        </div>
    </div>

    <!-- Modals -->
    <AddEmployeeModal @employee-created="onEmployeeCreated" :close-modal="() => closeModal('kt_modal_add_employee')" />
    <EditEmployeeModal 
      v-if="selectedEmployee"
      :employee="convertApplicationUserToEmployee(selectedEmployee)" 
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

import type { Sort } from "@/components/kt-datatable/table-partials/models";
import AddEmployeeModal from "@/components/employee/AddEmployeeModal.vue";
import EditEmployeeModal from "@/components/employee/EditEmployeeModal.vue";
import Swal from "sweetalert2/dist/sweetalert2.js";
import Loading from "@/components/kt-datatable/table-partials/Loading.vue";
import { Modal } from "bootstrap";
import { 
    getNonSuperAdminUsers, 
    getApplicationUserById, 
    deleteApplicationUser,
    bulkDeleteApplicationUsers,
    type ApplicationUser 
} from "@/core/services/businessServices/ApplicationUser";
import type { Employee } from "@/core/models/Employee";
import { useCurrentUser } from "@/core/composables/useCurrentUser";

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
                columnName: "Employee",
                columnLabel: "employee",
                sortEnabled: true,
                columnWidth: 280,
            },
            {
                columnName: "Contact",
                columnLabel: "contact",
                sortEnabled: true,
                columnWidth: 220,
            },
            {
                columnName: "Role",
                columnLabel: "role",
                sortEnabled: true,
                columnWidth: 120,
            },
            {
                columnName: "Department",
                columnLabel: "department",
                sortEnabled: true,
                columnWidth: 140,
            },
            {
                columnName: "Status",
                columnLabel: "status",
                sortEnabled: true,
                columnWidth: 120,
            },
            {
                columnName: "Actions",
                columnLabel: "actions",
                sortEnabled: false,
                columnWidth: 160,
            },
        ]);

        const tableData = ref<ApplicationUser[]>([]);
        const initEmployees = ref<ApplicationUser[]>([]);
        const selectedIds = ref<string[]>([]);
        const search = ref<string>("");
        const selectedEmployee = ref<ApplicationUser | null>(null);
        const loading = ref(false);
        const editModalLoading = ref(false);

        const { currentUser } = useCurrentUser();

        const fetchEmployees = async () => {
            loading.value = true;
            try {
                // Determina il companyId basato sull'utente corrente
                let companyId: string | undefined;
                if (currentUser.value) {
                    const userRoles = currentUser.value.userRoles || [];
                    const isSuperAdmin = userRoles.some((ur: any) => ur.name === 'superadmin');
                
                    if (isSuperAdmin) {
                        // Se l'utente corrente è super admin, mostra tutti gli employee della sua società
                        companyId = currentUser.value.company || currentUser.value.id;
                    } else {
                        // Se l'utente corrente non è super admin, mostra solo gli employee della sua società
                        companyId = currentUser.value.company;
                    }
                } else {
                    console.warn('⚠️ No current user found');
                }
                
                const result = await getNonSuperAdminUsers(companyId);
                
                if (result) {
                    tableData.value = result;
                    initEmployees.value = [...result];
                } else {
                    console.warn('⚠️ No employees returned');
                }
            } catch (error) {
                console.error('Failed to fetch employees:', error);
            }
            loading.value = false;
        };

        const onEmployeeCreated = (employee: Employee) => {
            const appUser = convertEmployeeToApplicationUser(employee);
            tableData.value.push(appUser);
            initEmployees.value.push(appUser);
        };

        const onEmployeeUpdated = (updatedEmployee: Employee) => {
            const appUser = convertEmployeeToApplicationUser(updatedEmployee);
            const index = tableData.value.findIndex(e => e.id === appUser.id);
            if (index !== -1) {
                tableData.value[index] = appUser;
                initEmployees.value[index] = appUser;
            }
        };

        const editEmployee = (employee: ApplicationUser) => {
            selectedEmployee.value = employee;
            const modal = document.getElementById('kt_modal_edit_employee');
            if (modal) {
                const bootstrapModal = new Modal(modal);
                bootstrapModal.show();
            }
        };

        const openEditModal = async (employee: ApplicationUser) => {
            editModalLoading.value = true;
            try {
                const freshEmployee = await getApplicationUserById(employee.id);
                if (freshEmployee) {
                    selectedEmployee.value = freshEmployee;
                } else {
                    selectedEmployee.value = employee;
                }
            } catch (error) {
                selectedEmployee.value = employee;
            }
            editModalLoading.value = false;
        };

        const deleteFewEmployees = async () => {
            if (selectedIds.value.length === 0) return;
            const confirm = await Swal.fire({
                title: 'Are you sure?',
                text: `You are about to delete ${selectedIds.value.length} employees and all their associated files (CVs, avatars, documents, etc.). This action cannot be undone!`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete them!'
            });
            if (confirm.isConfirmed) {
                try {
                    const result = await bulkDeleteApplicationUsers(selectedIds.value);
                    if (result) {
                        tableData.value = tableData.value.filter(e => !selectedIds.value.includes(e.id));
                        initEmployees.value = initEmployees.value.filter(e => !selectedIds.value.includes(e.id));
                        selectedIds.value = [];
                        
                        Swal.fire({
                            icon: 'success',
                            title: 'Deleted!',
                            html: `
                                <p><strong>${result.deletedUsers} employees</strong> have been deleted successfully.</p>
                                <p class="text-muted">Also deleted <strong>${result.deletedFiles} associated files</strong> (CVs, avatars, documents, etc.).</p>
                            `
                        });
                    } else {
                        Swal.fire('Error', 'Failed to delete employees.', 'error');
                    }
                } catch (error) {
                    console.error('Failed to delete employees:', error);
                    Swal.fire('Error', 'Failed to delete employees.', 'error');
                }
            }
        };

        const deleteSingleEmployee = async (id: string) => {
            const confirm = await Swal.fire({
                title: 'Are you sure?',
                text: "This will delete the employee and all their associated files (CV, avatar, documents, etc.). This action cannot be undone!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!'
            });
            if (confirm.isConfirmed) {
                try {
                    const success = await deleteApplicationUser(id);
                    if (success) {
                        tableData.value = tableData.value.filter(e => e.id !== id);
                        initEmployees.value = initEmployees.value.filter(e => e.id !== id);
                        Swal.fire('Deleted!', 'Employee and all associated files (CV, avatar, documents, etc.) have been deleted.', 'success');
                    } else {
                        Swal.fire('Error', 'Failed to delete employee.', 'error');
                    }
                } catch (error) {
                    console.error('Failed to delete employee:', error);
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
                    emp.firstName?.toLowerCase().includes(query) ||
                    emp.lastName?.toLowerCase().includes(query) ||
                    emp.email?.toLowerCase().includes(query) ||
                    emp.currentRole?.toLowerCase().includes(query) ||
                    emp.department?.toLowerCase().includes(query) ||
                    emp.phone?.toLowerCase().includes(query) ||
                    emp.address?.toLowerCase().includes(query)
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

        const formatDate = (date: Date | string | undefined) => {
            if (!date) return 'N/A';
            return new Date(date).toLocaleDateString();
        };

        const getAge = (dateOfBirth: Date | string | undefined) => {
            if (!dateOfBirth) return 'N/A';
            const birthDate = new Date(dateOfBirth);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age;
        };

        const getInitials = (firstName: string = '', lastName: string = ''): string => {
            const first = firstName ? firstName.charAt(0).toUpperCase() : '';
            const last = lastName ? lastName.charAt(0).toUpperCase() : '';
            return first + last;
        };

        const convertApplicationUserToEmployee = (appUser: ApplicationUser): Employee => {
            return {
                id: appUser.id,
                first_name: appUser.firstName || '',
                last_name: appUser.lastName || '',
                email: appUser.email,
                phone: appUser.phone || '',
                address: appUser.address || '',
                avatar: appUser.avatar || '',
                current_role: appUser.currentRole || '',
                department: appUser.department || '',
                is_available: appUser.isAvailable,
                date_of_birth: appUser.dateOfBirth,
                place_of_birth: appUser.placeOfBirth,
                user_id: appUser.id,
                company: appUser.company,
                creation_date: new Date(),
                update_date: new Date(),
            } as Employee;
        };

        const convertEmployeeToApplicationUser = (employee: Employee): ApplicationUser => {
            return {
                id: employee.id,
                username: employee.user_id || employee.id,
                email: employee.email,
                roles: ['employee'],
                avatar: employee.avatar,
                firstName: employee.first_name,
                lastName: employee.last_name,
                dateOfBirth: employee.date_of_birth,
                placeOfBirth: employee.place_of_birth,
                address: employee.address,
                phone: employee.phone,
                currentRole: employee.current_role,
                department: employee.department,
                isAvailable: employee.is_available,
                company: employee.company,
            } as ApplicationUser;
        };

        const closeModal = (modalId: string) => {
            const modal = document.getElementById(modalId);
            if (modal) {
                const dismissBtn = modal.querySelector('[data-bs-dismiss="modal"]') as HTMLElement;
                if (dismissBtn) {
                    dismissBtn.click();
                }
            }
        };

        onMounted(async () => {
            // Assicurati che l'utente corrente sia caricato prima di fetchare gli employee
            if (!currentUser.value) {
                await new Promise(resolve => setTimeout(resolve, 1000)); // Attendi un po' per il caricamento
            }
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
            formatDate,
            getAge,
            loading,
            editModalLoading,
            getInitials,
            convertApplicationUserToEmployee,
            convertEmployeeToApplicationUser,
        };
    },
});
</script>
