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
                <template v-slot:project="{ row: project }">
                    <div class="d-flex align-items-center">
                      
                        <div class="d-flex flex-column">
                            <router-link :to="`/projects/${project.id}/overview`" class="text-gray-800 text-hover-primary fw-bold mb-1">
                                {{ project.name }}
                            </router-link>
                            <div class="text-muted fw-semibold d-block fs-7">
                                {{ project.description }}
                            </div>
                        </div>
                    </div>
                </template>

                <template v-slot:status="{ row: project }">
                    <div class="d-flex flex-column align-items-start">
                        <span :class="getStatusBadgeClass(project.status)" class="badge">
                            <KTIcon :icon-name="getStatusIcon(project.status)" icon-class="fs-7 me-1" />
                            {{ project.status }}
                        </span>
                    </div>
                </template>

                <template v-slot:priority="{ row: project }">
                    <div class="d-flex flex-column align-items-start">
                        <span :class="getPriorityBadgeClass(project.priority)" class="badge mb-1">
                            <KTIcon :icon-name="getPriorityIcon(project.priority)" icon-class="fs-7 me-1" />
                            {{ project.priority || 'N/A' }}
                        </span>
                    </div>
                </template>

                <template v-slot:budget="{ row: project }">
                    <div class="d-flex flex-column align-items-start">
                        <span class="fw-bold text-gray-800">
                            <KTIcon icon-name="dollar" icon-class="fs-7 me-1" />
                            {{ project.budget ? `$${project.budget.toLocaleString()}` : 'N/A' }}
                        </span>
                        <span v-if="project.budget" class="text-muted fs-8">
                            <KTIcon icon-name="chart-line" icon-class="fs-7 me-1" />
                            Budget allocated
                        </span>
                    </div>
                </template>

                <template v-slot:timeline="{ row: project }">
                    <div class="d-flex flex-column">
                        <div class="d-flex align-items-center mb-1">
                            <KTIcon icon-name="calendar" icon-class="fs-7 me-1 text-success" />
                            <span class="text-muted fs-8">Start: {{ formatDate(project.startDate) }}</span>
                        </div>
                        <div class="d-flex align-items-center">
                            <KTIcon icon-name="calendar" icon-class="fs-7 me-1 text-danger" />
                            <span class="text-muted fs-8">End: {{ formatDate(project.endDate) }}</span>
                        </div>
                        <div v-if="project.startDate && project.endDate" class="mt-1">
                            <div class="progress h-6px w-100">
                                <div class="progress-bar" :style="{ width: getProgressPercentage(project.startDate, project.endDate) + '%' }"></div>
                            </div>
                        </div>
                    </div>
                </template>

                <template v-slot:actions="{ row: project }">
                    <div class="d-flex gap-2">
                        <router-link :to="`/projects/${project.id}/overview`" class="btn btn-sm btn-light-primary">
                            <KTIcon icon-name="eye" icon-class="fs-7" />
                            View
                        </router-link>
                        <router-link :to="`/projects/${project.id}/settings`" class="btn btn-sm btn-light-warning">
                            <KTIcon icon-name="pencil" icon-class="fs-7" />
                            Edit
                        </router-link>
                        <button @click="deleteSingleProject(project.id)" class="btn btn-sm btn-light-danger">
                            <KTIcon icon-name="trash" icon-class="fs-7" />
                            Delete
                        </button>
                    </div>
                </template>
            </Datatable>
        </div>
    </div>

    <!-- Modals -->
    <AddProjectModal @project-created="onProjectCreated" :close-modal="() => closeModal('kt_modal_add_project')" />
    <ExportProjectModal />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import { MenuComponent } from "@/assets/ts/components";
import arraySort from "array-sort";
import type { Project } from "@/core/models/Project";
import { getProjects, deleteProject, getProject, getUserProjects } from "@/core/services/businessServices/Project";
import type { Sort } from "@/components/kt-datatable/table-partials/models";
import AddProjectModal from "@/components/project/AddProjectModal.vue";
import ExportProjectModal from "@/components/project/ExportProjectModal.vue";
import { useToast } from "vue-toastification";
import Loading from "@/components/kt-datatable/table-partials/Loading.vue";
import { useCurrentUser } from "@/core/composables/useCurrentUser";

export default defineComponent({
    name: "projects-listing",
    components: {
        Datatable,
        AddProjectModal,
        ExportProjectModal,
        Loading,
    },
    setup() {
        const { currentUser } = useCurrentUser();
        const toast = useToast();
        
        const tableHeader = ref([
            {
                columnName: "Project",
                columnLabel: "project",
                sortEnabled: true,
                columnWidth: 300,
            },
            {
                columnName: "Status",
                columnLabel: "status",
                sortEnabled: true,
                columnWidth: 150,
            },
            {
                columnName: "Priority",
                columnLabel: "priority",
                sortEnabled: true,
                columnWidth: 150,
            },
            {
                columnName: "Budget",
                columnLabel: "budget",
                sortEnabled: true,
                columnWidth: 150,
            },
            {
                columnName: "Timeline",
                columnLabel: "timeline",
                sortEnabled: true,
                columnWidth: 200,
            },
            {
                columnName: "Actions",
                columnLabel: "actions",
                sortEnabled: false,
                columnWidth: 200,
            },
        ]);

        const tableData = ref<Project[]>([]);
        const initProjects = ref<Project[]>([]);
        const selectedIds = ref<string[]>([]);
        const search = ref<string>("");
        const loading = ref(false);

                const fetchProjects = async () => {
            loading.value = true;
            try {
                const result = await getUserProjects();
                
                if (result) {
                    tableData.value = result;
                    initProjects.value = [...result];
                } else {
                    console.warn('⚠️ No projects returned');
                }
            } catch (error) {
                console.error('Failed to fetch projects:', error);
            }
            loading.value = false;
        };

        const onProjectCreated = (project: Project) => {
            // Verifica se il progetto appartiene alla company dell'utente corrente
            if (currentUser.value) {
                const userRoles = currentUser.value.userRoles || [];
                const isSuperAdmin = userRoles.some((ur: any) => ur.name === 'superadmin');
                
                if (isSuperAdmin || project.company === currentUser.value.company) {
                    tableData.value.push(project);
                    initProjects.value.push(project);
                    toast.success('Project has been created.');
                }
            } else {
                // Se non c'è un utente corrente, aggiungi comunque il progetto
                tableData.value.push(project);
                initProjects.value.push(project);
                toast.success('Project has been created.');
            }
        };

        const editProject = (project: Project) => {
            // TODO: Implement edit functionality
            console.log('Edit project:', project);
        };

        const deleteFewProjects = async () => {
            if (selectedIds.value.length === 0) return;
            if (confirm(`Are you sure you want to delete ${selectedIds.value.length} projects and all their associated documents? This action cannot be undone!`)) {
                let allSuccess = true;
                for (const id of selectedIds.value) {
                    const success = await deleteProject(id);
                    if (!success) allSuccess = false;
                }
                tableData.value = tableData.value.filter(p => !selectedIds.value.includes(p.id));
                initProjects.value = initProjects.value.filter(p => !selectedIds.value.includes(p.id));
                selectedIds.value = [];
                if (allSuccess) {
                    toast.success('Selected projects and all their associated documents have been deleted.');
                } else {
                    toast.error('Some projects could not be deleted.');
                }
            }
        };

        const deleteSingleProject = async (id: string) => {
            if (confirm("Are you sure you want to delete this project and all its associated documents? This action cannot be undone!")) {
                const success = await deleteProject(id);
                if (success) {
                    tableData.value = tableData.value.filter(p => p.id !== id);
                    initProjects.value = initProjects.value.filter(p => p.id !== id);
                    toast.success('Project and all associated documents have been deleted.');
                } else {
                    toast.error('Failed to delete project.');
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

        const getStatusIcon = (status: string) => {
            switch (status?.toLowerCase()) {
                case 'active': return 'check-circle';
                case 'completed': return 'shield-tick';
                case 'on hold': return 'pause-circle';
                case 'cancelled': return 'cross-circle';
                default: return 'minus-circle';
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

        const getPriorityIcon = (priority: string) => {
            switch (priority?.toLowerCase()) {
                case 'high': return 'arrow-up';
                case 'medium': return 'minus';
                case 'low': return 'arrow-down';
                default: return 'minus';
            }
        };

        const formatDate = (date: Date | string | undefined) => {
            if (!date) return 'N/A';
            return new Date(date).toLocaleDateString();
        };

        const getDaysRemaining = (endDate: Date | string | undefined) => {
            if (!endDate) return 'No end date';
            const end = new Date(endDate);
            const now = new Date();
            const diffTime = end.getTime() - now.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays < 0) return 'Overdue';
            if (diffDays === 0) return 'Due today';
            if (diffDays === 1) return 'Due tomorrow';
            return `${diffDays} days left`;
        };

        const getProgressPercentage = (startDate: Date | string | undefined, endDate: Date | string | undefined) => {
            if (!startDate || !endDate) return 0;
            const start = new Date(startDate);
            const end = new Date(endDate);
            const now = new Date();
            
            const totalDuration = end.getTime() - start.getTime();
            const elapsed = now.getTime() - start.getTime();
            
            const percentage = (elapsed / totalDuration) * 100;
            return Math.min(Math.max(percentage, 0), 100);
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
            editProject,
            getStatusBadgeClass,
            getStatusIcon,
            getPriorityBadgeClass,
            getPriorityIcon,
            formatDate,
            getDaysRemaining,
            getProgressPercentage,
            closeModal,
            loading,
        };
    },
});
</script> 