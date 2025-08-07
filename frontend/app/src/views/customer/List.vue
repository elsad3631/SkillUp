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
                    <!--begin::Add customer-->
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal"
                        data-bs-target="#kt_modal_add_customer">
                        <KTIcon icon-name="plus" icon-class="fs-2" />
                        Add Customer
                    </button>
                    <!--end::Add customer-->
                </div>
                <!--end::Toolbar-->
                <!--begin::Group actions-->
                <div v-else class="d-flex justify-content-end align-items-center"
                    data-kt-customer-table-toolbar="selected">
                    <div class="fw-bold me-5">
                        <span class="me-2">{{ selectedIds.length }}</span>Selected
                    </div>
                    <button type="button" class="btn btn-danger" @click="deleteFewCustomers()">
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
                <template v-slot:customer="{ row: customer }">
                    <div class="d-flex align-items-center">
                        <div class="symbol symbol-50px me-5">
                            <div class="symbol-label bg-light-primary d-flex align-items-center justify-content-center" style="font-size: 1.2rem; font-weight: 600; color: #fff;">
                                {{ getInitials(customer.name) }}
                            </div>
                        </div>
                        <div class="d-flex flex-column">
                            <router-link :to="`/customers/${customer.id}/overview`" class="text-gray-800 text-hover-primary fw-bold mb-1">
                                {{ customer.name }}
                            </router-link>
                            <span v-if="customer.companyName" class="text-muted fs-8">{{ customer.companyName }}</span>
                        </div>
                    </div>
                </template>

                <template v-slot:contact="{ row: customer }">
                    <div class="d-flex flex-column align-items-start">
                        <div v-if="customer.email" class="d-flex align-items-center mb-1">
                            <KTIcon icon-name="sms" icon-class="fs-7 me-1 text-primary" />
                            <span class="text-muted fs-8">{{ customer.email }}</span>
                        </div>
                        <div v-if="customer.phone" class="d-flex align-items-center">
                            <KTIcon icon-name="phone" icon-class="fs-7 me-1 text-success" />
                            <span class="text-muted fs-8">{{ customer.phone }}</span>
                        </div>
                        <div v-if="customer.contactPerson" class="d-flex align-items-center mt-1">
                            <KTIcon icon-name="user" icon-class="fs-7 me-1 text-info" />
                            <span class="text-muted fs-8">{{ customer.contactPerson }}</span>
                        </div>
                    </div>
                </template>

                <template v-slot:location="{ row: customer }">
                    <div class="d-flex flex-column align-items-start">
                        <div v-if="customer.city || customer.country" class="d-flex align-items-center">
                            <KTIcon icon-name="location" icon-class="fs-7 me-1 text-warning" />
                            <span class="text-muted fs-8">
                                {{ [customer.city, customer.country].filter(Boolean).join(', ') }}
                            </span>
                        </div>
                        <div v-if="customer.address" class="d-flex align-items-center mt-1">
                            <KTIcon icon-name="map" icon-class="fs-7 me-1 text-secondary" />
                            <span class="text-muted fs-8">{{ customer.address }}</span>
                        </div>
                    </div>
                </template>

                <template v-slot:industry="{ row: customer }">
                    <div class="d-flex flex-column align-items-start">
                        <span v-if="customer.industry" class="badge badge-light-info">
                            <KTIcon icon-name="building" icon-class="fs-7 me-1" />
                            {{ customer.industry }}
                        </span>
                        <span v-else class="text-muted fs-8">N/A</span>
                    </div>
                </template>

                <template v-slot:status="{ row: customer }">
                    <div class="d-flex flex-column align-items-start">
                        <span v-if="customer.status === 'ACTIVE'" class="badge badge-light-success">
                            <KTIcon icon-name="check-circle" icon-class="fs-7 me-1" />
                            Active
                        </span>
                        <span v-else-if="customer.status === 'INACTIVE'" class="badge badge-light-warning">
                            <KTIcon icon-name="pause-circle" icon-class="fs-7 me-1" />
                            Inactive
                        </span>
                        <span v-else-if="customer.status === 'PROSPECT'" class="badge badge-light-primary">
                            <KTIcon icon-name="star" icon-class="fs-7 me-1" />
                            Prospect
                        </span>
                        <span v-else class="badge badge-light-secondary">
                            <KTIcon icon-name="question" icon-class="fs-7 me-1" />
                            Unknown
                        </span>
                    </div>
                </template>

                <template v-slot:projects="{ row: customer }">
                    <div class="d-flex flex-column align-items-start">
                        <span v-if="customer.projects && customer.projects.length > 0" class="badge badge-light-primary">
                            <KTIcon icon-name="briefcase" icon-class="fs-7 me-1" />
                            {{ customer.projects.length }} project{{ customer.projects.length > 1 ? 's' : '' }}
                        </span>
                        <span v-else class="badge badge-light-secondary">
                            <KTIcon icon-name="briefcase" icon-class="fs-7 me-1" />
                            No projects
                        </span>
                    </div>
                </template>

                <template v-slot:actions="{ row: customer }">
                    <div class="d-flex gap-2">
                        <router-link :to="`/customers/${customer.id}/overview`" class="btn btn-sm btn-light-primary">
                            <KTIcon icon-name="eye" icon-class="fs-7" />
                            View
                        </router-link>
                        <router-link :to="`/customers/${customer.id}/settings`" class="btn btn-sm btn-light-warning">
                            <KTIcon icon-name="pencil" icon-class="fs-7" />
                            Edit
                        </router-link>
                        <button @click="deleteSingleCustomer(customer.id)" class="btn btn-sm btn-light-danger">
                            <KTIcon icon-name="trash" icon-class="fs-7" />
                            Delete
                        </button>
                    </div>
                </template>
            </Datatable>
        </div>
    </div>

    <!-- Modals -->
    <AddCustomerModal @customer-created="onCustomerCreated" :close-modal="() => closeModal('kt_modal_add_customer')" />
    <ExportCustomerModal />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import { MenuComponent } from "@/assets/ts/components";
import arraySort from "array-sort";

import type { Sort } from "@/components/kt-datatable/table-partials/models";
import AddCustomerModal from "@/components/customer/AddCustomerModal.vue";
import ExportCustomerModal from "@/components/customer/ExportCustomerModal.vue";
import Swal from "sweetalert2/dist/sweetalert2.js";
import Loading from "@/components/kt-datatable/table-partials/Loading.vue";
import { 
    getAllCustomers, 
    deleteCustomer,
    type Customer 
} from "@/core/services/businessServices/Customer";

export default defineComponent({
    name: "customers-listing",
    components: {
        Datatable,
        AddCustomerModal,
        ExportCustomerModal,
        Loading,
    },
    setup() {
        const tableHeader = ref([
            {
                columnName: "Customer",
                columnLabel: "customer",
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
                columnName: "Location",
                columnLabel: "location",
                sortEnabled: true,
                columnWidth: 180,
            },
            {
                columnName: "Industry",
                columnLabel: "industry",
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
                columnName: "Projects",
                columnLabel: "projects",
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

        const tableData = ref<Customer[]>([]);
        const initCustomers = ref<Customer[]>([]);
        const selectedIds = ref<string[]>([]);
        const search = ref<string>("");
        const loading = ref(false);

        const fetchCustomers = async () => {
            loading.value = true;
            try {
                const result = await getAllCustomers();
                
                if (result) {
                    tableData.value = result;
                    initCustomers.value = [...result];
                } else {
                    console.warn('⚠️ No customers returned');
                }
            } catch (error) {
                console.error('Failed to fetch customers:', error);
            }
            loading.value = false;
        };

        const onCustomerCreated = (customer: Customer) => {
            tableData.value.unshift(customer);
            initCustomers.value.unshift(customer);
        };

        const deleteFewCustomers = async () => {
            if (selectedIds.value.length === 0) return;
            const confirm = await Swal.fire({
                title: 'Are you sure?',
                text: `You are about to delete ${selectedIds.value.length} customers. This action cannot be undone!`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete them!'
            });
            if (confirm.isConfirmed) {
                try {
                    let deletedCount = 0;
                    for (const id of selectedIds.value) {
                        const success = await deleteCustomer(id);
                        if (success) {
                            deletedCount++;
                        }
                    }
                    
                    if (deletedCount > 0) {
                        tableData.value = tableData.value.filter(c => !selectedIds.value.includes(c.id));
                        initCustomers.value = initCustomers.value.filter(c => !selectedIds.value.includes(c.id));
                        selectedIds.value = [];
                        
                        Swal.fire({
                            icon: 'success',
                            title: 'Deleted!',
                            text: `${deletedCount} customers have been deleted successfully.`
                        });
                    } else {
                        Swal.fire('Error', 'Failed to delete customers.', 'error');
                    }
                } catch (error) {
                    console.error('Failed to delete customers:', error);
                    Swal.fire('Error', 'Failed to delete customers.', 'error');
                }
            }
        };

        const deleteSingleCustomer = async (id: string) => {
            const confirm = await Swal.fire({
                title: 'Are you sure?',
                text: "This will delete the customer. This action cannot be undone!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!'
            });
            if (confirm.isConfirmed) {
                try {
                    const success = await deleteCustomer(id);
                    if (success) {
                        tableData.value = tableData.value.filter(c => c.id !== id);
                        initCustomers.value = initCustomers.value.filter(c => c.id !== id);
                        Swal.fire('Deleted!', 'Customer has been deleted.', 'success');
                    } else {
                        Swal.fire('Error', 'Failed to delete customer.', 'error');
                    }
                } catch (error) {
                    console.error('Failed to delete customer:', error);
                    Swal.fire('Error', 'Failed to delete customer.', 'error');
                }
            }
        };

        const searchItems = () => {
            const query = search.value.toLowerCase();
            if (!query) {
                tableData.value = [...initCustomers.value];
                return;
            }

            tableData.value = initCustomers.value.filter(customer => {
                return (
                    customer.name?.toLowerCase().includes(query) ||
                    customer.companyName?.toLowerCase().includes(query) ||
                    customer.email?.toLowerCase().includes(query) ||
                    customer.contactPerson?.toLowerCase().includes(query) ||
                    customer.phone?.toLowerCase().includes(query) ||
                    customer.city?.toLowerCase().includes(query) ||
                    customer.country?.toLowerCase().includes(query) ||
                    customer.industry?.toLowerCase().includes(query)
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

        const getInitials = (name: string = ''): string => {
            if (!name) return '';
            const words = name.split(' ');
            const first = words[0] ? words[0].charAt(0).toUpperCase() : '';
            const last = words.length > 1 && words[words.length - 1] ? words[words.length - 1].charAt(0).toUpperCase() : '';
            return first + last;
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
            fetchCustomers();
            MenuComponent.reinitialization();
        });

        return {
            tableData,
            tableHeader,
            search,
            selectedIds,
            searchItems,
            sort,
            onItemSelect,
            deleteFewCustomers,
            deleteSingleCustomer,
            onCustomerCreated,
            closeModal,
            loading,
            getInitials,
        };
    },
});
</script> 