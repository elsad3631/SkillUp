<template>
    <div class="card">
        <div class="card-header border-0 pt-6">
            <!--begin::Card title-->
            <div class="card-title">
                <!--begin::Search-->
                <div class="d-flex align-items-center position-relative my-1">
                    <KTIcon icon-name="magnifier" icon-class="fs-1 position-absolute ms-6" />
                    <input type="text" v-model="search" @input="searchItems()"
                        class="form-control form-control-solid w-250px ps-15" placeholder="Search Projects" />
                </div>
                <!--end::Search-->
            </div>
            <!--begin::Card title-->
            <!--begin::Card toolbar-->
            <div class="card-toolbar">
                <!--begin::Toolbar-->
                <div v-if="selectedIds.length === 0" class="d-flex justify-content-end"
                    data-kt-project-table-toolbar="base">
                    <!--begin::Export-->
                    <button type="button" class="btn btn-light-primary me-3" data-bs-toggle="modal"
                        data-bs-target="#kt_projects_export_modal">
                        <KTIcon icon-name="exit-up" icon-class="fs-2" />
                        Export
                    </button>
                    <!--end::Export-->
                    <!--begin::Add project-->
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal"
                        data-bs-target="#kt_modal_add_project">
                        <KTIcon icon-name="plus" icon-class="fs-2" />
                        Add Project
                    </button>
                    <!--end::Add project-->
                </div>
                <!--end::Toolbar-->
                <!--begin::Group actions-->
                <div v-else class="d-flex justify-content-end align-items-center"
                    data-kt-project-table-toolbar="selected">
                    <div class="fw-bold me-5">
                        <span class="me-2">{{ selectedIds.length }}</span>Selected
                    </div>
                    <button type="button" class="btn btn-danger" @click="deleteFewProjects()">
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
                <template v-slot:name="{ row: project }">
                    <router-link :to="`/projects/${project.id}/overview`" class="text-gray-600 text-hover-primary mb-1">
                        {{ project.name }}
                    </router-link>
                    <div class="text-muted fw-semobold text-muted d-block fs-7">
                        {{ project.description }}
                    </div>
                </template>

                <template v-slot:status="{ row: project }">
                    <span :class="getStatusBadgeClass(project.status)" class="badge">
                        {{ project.status }}
                    </span>
                </template>

                <template v-slot:priority="{ row: project }">
                    <span :class="getPriorityBadgeClass(project.priority)" class="badge">
                        {{ project.priority || 'N/A' }}
                    </span>
                </template>

                <template v-slot:budget="{ row: project }">
                    <span class="fw-bold">
                        {{ project.budget ? `$${project.budget.toLocaleString()}` : 'N/A' }}
                    </span>
                </template>

                <template v-slot:dates="{ row: project }">
                    <div class="d-flex flex-column">
                        <span class="text-muted fs-7">Start: {{ formatDate(project.startDate) }}</span>
                        <span class="text-muted fs-7">End: {{ formatDate(project.endDate) }}</span>
                    </div>
                </template>

                <template v-slot:actions="{ row: project }">
                    <router-link :to="`/projects/${project.id}/overview`" class="btn btn-sm btn-light-primary me-2">
                        Details
                    </router-link>
                    <button @click="deleteSingleProject(project.id)" class="btn btn-sm btn-danger">
                        Delete
                    </button>
                </template>
            </Datatable>
        </div>
    </div>

    <!-- Modals -->
    <AddProjectModal @project-created="onProjectCreated" :close-modal="() => closeModal('kt_modal_add_project')" />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import { MenuComponent } from "@/assets/ts/components";
import arraySort from "array-sort";
import type { Project } from "@/core/models/Project";
import { getProjects, deleteProject, getProject } from "@/core/services/businessServices/Project";
import type { Sort } from "@/components/kt-datatable/table-partials/models";
import AddProjectModal from "@/components/project/AddProjectModal.vue";
import Swal from "sweetalert2/dist/sweetalert2.js";
import Loading from "@/components/kt-datatable/table-partials/Loading.vue";

export default defineComponent({
    name: "projects-listing",
    components: {
        Datatable,
        AddProjectModal,
        Loading,
    },
    setup() {
        const tableHeader = ref([
            {
                columnName: "Project",
                columnLabel: "name",
                sortEnabled: true,
                columnWidth: 300,
            },
            {
                columnName: "Status",
                columnLabel: "status",
                sortEnabled: true,
                columnWidth: 120,
            },
            {
                columnName: "Priority",
                columnLabel: "priority",
                sortEnabled: true,
                columnWidth: 120,
            },
            {
                columnName: "Budget",
                columnLabel: "budget",
                sortEnabled: true,
                columnWidth: 150,
            },
            {
                columnName: "Timeline",
                columnLabel: "dates",
                sortEnabled: true,
                columnWidth: 200,
            },
            {
                columnName: "Actions",
                columnLabel: "actions",
                sortEnabled: false,
                columnWidth: 150,
            },
        ]);

        const tableData = ref<Project[]>([]);
        const initProjects = ref<Project[]>([]);
        const selectedIds = ref<string[]>([]);
        const search = ref<string>("");
        const loading = ref(false);

        const fetchProjects = async () => {
            loading.value = true;
            const result = await getProjects();
            if (result) {
                tableData.value = result;
                initProjects.value = [...result];
            }
            loading.value = false;
        };

        const onProjectCreated = (project: Project) => {
            tableData.value.push(project);
            initProjects.value.push(project);
            Swal.fire('Success', 'Project has been created.', 'success');
        };



        const deleteFewProjects = async () => {
            if (selectedIds.value.length === 0) return;
            const confirm = await Swal.fire({
                title: 'Are you sure?',
                text: `You are about to delete ${selectedIds.value.length} projects. This action cannot be undone!`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete them!'
            });
            if (confirm.isConfirmed) {
                let allSuccess = true;
                for (const id of selectedIds.value) {
                    const success = await deleteProject(id);
                    if (!success) allSuccess = false;
                }
                tableData.value = tableData.value.filter(p => !selectedIds.value.includes(p.id));
                initProjects.value = initProjects.value.filter(p => !selectedIds.value.includes(p.id));
                selectedIds.value = [];
                if (allSuccess) {
                    Swal.fire('Deleted!', 'Selected projects have been deleted.', 'success');
                } else {
                    Swal.fire('Error', 'Some projects could not be deleted.', 'error');
                }
            }
        };

        const deleteSingleProject = async (id: string) => {
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
                const success = await deleteProject(id);
                if (success) {
                    tableData.value = tableData.value.filter(p => p.id !== id);
                    initProjects.value = initProjects.value.filter(p => p.id !== id);
                    Swal.fire('Deleted!', 'Project has been deleted.', 'success');
                } else {
                    Swal.fire('Error', 'Failed to delete project.', 'error');
                }
            }
        };

        const searchItems = () => {
            const query = search.value.toLowerCase();
            if (!query) {
                tableData.value = [...initProjects.value];
                return;
            }

            tableData.value = initProjects.value.filter(project => {
                return (
                    project.name?.toLowerCase().includes(query) ||
                    project.description?.toLowerCase().includes(query) ||
                    project.status?.toLowerCase().includes(query) ||
                    project.priority?.toLowerCase().includes(query)
                );
            });
        };

        const sort = (sort: Sort) => {
            const reverse: boolean = sort.order === 'asc';
            if (!sort.label) return;
            const sorted = arraySort(tableData.value, sort.label, { reverse });
            tableData.value = sorted;
        };

        const onItemSelect = (selectedItems: string[]) => {
            selectedIds.value = selectedItems;
        };

        const getStatusBadgeClass = (status: string) => {
            switch (status?.toLowerCase()) {
                case 'active': return 'badge-light-success';
                case 'completed': return 'badge-light-primary';
                case 'on hold': return 'badge-light-warning';
                case 'cancelled': return 'badge-light-danger';
                default: return 'badge-light-secondary';
            }
        };

        const getPriorityBadgeClass = (priority: string) => {
            switch (priority?.toLowerCase()) {
                case 'high': return 'badge-light-danger';
                case 'medium': return 'badge-light-warning';
                case 'low': return 'badge-light-success';
                default: return 'badge-light-secondary';
            }
        };

        const formatDate = (date: Date | string | undefined) => {
            if (!date) return 'N/A';
            return new Date(date).toLocaleDateString();
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
            fetchProjects();
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
            deleteFewProjects,
            deleteSingleProject,
            onProjectCreated,
            getStatusBadgeClass,
            getPriorityBadgeClass,
            formatDate,
            closeModal,
            loading,
        };
    },
});
</script> 