<template>
  <!--begin::Loading State for Employee-->
  <div v-if="!project" class="d-flex justify-content-center align-items-center" style="min-height: 300px;">
    <div class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="mt-3">
        <span class="fw-semobold text-gray-600">Loading employees...</span>
      </div>
    </div>
  </div>
  <!--end::Loading State for Employee-->

  <!--begin::Employee Content-->
  <div v-else>
    <!--begin::Toolbar-->
    <div class="d-flex flex-wrap flex-stack my-5">
      <!--begin::Heading-->
      <h2 class="fs-2 fw-semobold my-2">
        Project Team
        <span class="fs-6 text-gray-400 ms-1">{{ projectEmployees.length }} employee{{ projectEmployees.length !== 1 ? 's' : '' }} assigned</span>
      </h2>
      <!--end::Heading-->

      <!--begin::Controls-->
      <div class="d-flex flex-wrap my-1">
        <!--begin::Assign Employee Button-->
        <div class="me-3">
          <button
            type="button"
            class="btn btn-sm btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#kt_modal_assign_employee_to_project"
          >
            <i class="ki-duotone ki-plus fs-2">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            Assign Employee
          </button>
        </div>
        <!--end::Assign Employee Button-->
      </div>
      <!--end::Controls-->
    </div>
    <!--end::Toolbar-->

    <!--begin::Row-->
    <div class="row g-6 g-xl-9" v-if="projectEmployees.length > 0">
      <!--begin::Col-->
      <div 
        v-for="(assignment, index) in projectEmployees" 
        :key="assignment.id"
        class="col-md-6 col-xl-4"
      >
        <!--begin::Card-->
        <div class="card border border-2 border-gray-300 border-hover">
          <!--begin::Card header-->
          <div class="card-header border-0 pt-9">
            <!--begin::Card Title-->
            <div class="card-title m-0">
              <!--begin::Avatar-->
              <div class="symbol symbol-50px w-50px bg-light">
                <div v-if="assignment.applicationUser?.avatar" class="symbol-label">
                  <img :src="getAvatarUrl(assignment.applicationUser.avatar)" alt="Avatar" class="w-100" />
                </div>
                <div v-else class="symbol-label bg-light-info">
                  <span class="fs-2 fw-bold text-info">
                    {{ getInitials(assignment.applicationUser) }}
                  </span>
                </div>
              </div>
              <!--end::Avatar-->
            </div>
            <!--end::Card Title-->

            <!--begin::Card toolbar-->
            <div class="card-toolbar">
              <span
                :class="getAssignmentStatusBadgeClass(assignment.status)"
                class="badge fw-bold me-auto px-4 py-3"
              >
                {{ assignment.status }}
              </span>
            </div>
            <!--end::Card toolbar-->
          </div>
          <!--end::Card header-->

          <!--begin::Card body-->
          <div class="card-body p-9">
            <!--begin::Name-->
            <div class="fs-3 fw-bold text-dark">
              {{ getEmployeeName(assignment.applicationUser) }}
            </div>
            <!--end::Name-->

            <!--begin::Role-->
            <p class="text-gray-400 fw-semibold fs-5 mt-1 mb-7">
              {{ assignment.roleOnProject || 'No role assigned' }}
            </p>
            <!--end::Role-->

            <!--begin::Info-->
            <div class="d-flex flex-wrap mb-5">
              <!--begin::Allocation-->
              <div class="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-7 mb-3">
                <div class="fs-6 text-gray-800 fw-bold">{{ assignment.allocationPercentage }}%</div>
                <div class="fw-semobold text-gray-400">Allocation</div>
              </div>
              <!--end::Allocation-->

              <!--begin::Start Date-->
              <div class="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-7 mb-3">
                <div class="fs-6 text-gray-800 fw-bold">{{ formatDate(assignment.assignmentStartDate) }}</div>
                <div class="fw-semobold text-gray-400">Start Date</div>
              </div>
              <!--end::Start Date-->
            </div>
            <!--end::Info-->

            <!--begin::Progress-->
            <div
              class="h-4px w-100 bg-light mb-5"
              data-bs-toggle="tooltip"
              :title="`${assignment.allocationPercentage}% allocation`"
            >
              <div
                class="bg-primary rounded h-4px"
                role="progressbar"
                :style="{ width: assignment.allocationPercentage + '%' }"
                :aria-valuenow="assignment.allocationPercentage"
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
            <!--end::Progress-->

            <!--begin::Department-->
            <div v-if="assignment.applicationUser?.department" class="symbol-group symbol-hover mb-5">
              <div class="d-flex align-items-center">
                <i class="ki-duotone ki-abstract-41 fs-2 text-primary me-2">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
                <span class="fw-semibold text-gray-600">{{ assignment.applicationUser.department }}</span>
              </div>
            </div>
            <!--end::Department-->

            <!--begin::Feedback-->
            <div v-if="assignment.feedbackReceived" class="mb-5">
              <div class="alert alert-light-info p-3">
                <div class="fw-semibold fs-7 text-gray-600 mb-1">Feedback:</div>
                <div class="text-gray-800 fs-8">{{ assignment.feedbackReceived }}</div>
              </div>
            </div>
            <!--end::Feedback-->

            <!--begin::Actions-->
            <div class="d-flex justify-content-between">
              <!--begin::View Employee-->
              <button
                @click="viewEmployeeDetails(assignment.applicationUser.id)"
                class="btn btn-sm btn-light-primary me-2 flex-grow-1"
                type="button"
              >
                <i class="ki-duotone ki-eye fs-6 me-1">
                  <span class="path1"></span>
                  <span class="path2"></span>
                  <span class="path3"></span>
                </i>
                View Details
              </button>
              <!--end::View Employee-->

              <!--begin::Remove Assignment-->
              <button
                @click="handleRemoveAssignment(assignment)"
                class="btn btn-sm btn-light-danger"
                type="button"
              >
                <i class="ki-duotone ki-trash fs-6">
                  <span class="path1"></span>
                  <span class="path2"></span>
                  <span class="path3"></span>
                  <span class="path4"></span>
                  <span class="path5"></span>
                </i>
              </button>
              <!--end::Remove Assignment-->
            </div>
            <!--end::Actions-->
          </div>
          <!--end::Card body-->
        </div>
        <!--end::Card-->
      </div>
      <!--end::Col-->
    </div>
    <!--end::Row-->
    
    <!--begin::Empty State-->
    <div v-if="projectEmployees.length === 0" class="row g-6 g-xl-9">
      <div class="col-12">
        <div class="card">
          <div class="card-body text-center py-10">
            <div class="mb-5">
              <i class="ki-duotone ki-users fs-5x text-muted mb-5">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </div>
            <h3 class="text-gray-800">No Employees Assigned</h3>
            <p class="text-gray-600 mb-6">
              This project doesn't have any employees assigned yet.<br>Click the "Assign Employee" button to add team members.
            </p>
            <button
              type="button"
              class="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#kt_modal_assign_employee_to_project"
            >
              <i class="ki-duotone ki-plus fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              Assign Employee
            </button>
          </div>
        </div>
      </div>
    </div>
    <!--end::Empty State-->
  </div>
  <!--end::Employee Content-->

  <!--begin::Assign Employee Modal-->
  <AssignEmployeeToProjectModal
    v-if="project?.id"
    :project-id="project.id"
    :assigned-employee-ids="assignedEmployeeIds"
    @assignment-created="handleAssignmentCreated"
  />
  <!--end::Assign Employee Modal-->
</template>

<script lang="ts">
import { defineComponent, inject, ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { getAssetPath } from "@/core/helpers/assets";
import Swal from "sweetalert2/dist/sweetalert2.js";
import AssignEmployeeToProjectModal from "@/components/project/AssignEmployeeToProjectModal.vue";
export default defineComponent({
  name: "project-employee",
  components: {
    AssignEmployeeToProjectModal,
  },
  setup() {
    const router = useRouter();
    const project = inject<any>('project');
    const refreshProject = inject<any>('refreshProject');
    const projectEmployees = ref<any[]>([]);

    // Computed properties
    const assignedEmployeeIds = computed(() => 
      projectEmployees.value.map(assignment => assignment.applicationUserId).filter(Boolean) as string[]
    );

    // Carica gli employee del progetto
    const loadProjectEmployees = () => {
      if (project.value?.assignments) {
        projectEmployees.value = project.value.assignments;
      }
    };

    // Formatta data
    const formatDate = (date: Date | string | undefined) => {
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString("it-IT", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    };

    // Ottieni nome employee
    const getEmployeeName = (user: any) => {
      if (!user) return 'Unknown User';
      const firstName = user.firstName || '';
      const lastName = user.lastName || '';
      return `${firstName} ${lastName}`.trim() || user.username || user.email || 'Unknown User';
    };

    // Ottieni iniziali
    const getInitials = (user: any) => {
      if (!user) return '??';
      const firstName = user.firstName || '';
      const lastName = user.lastName || '';
      if (firstName && lastName) {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
      }
      const name = user.username || user.email || 'Unknown';
      return name.substring(0, 2).toUpperCase();
    };

    // Ottieni URL avatar
    const getAvatarUrl = (avatar: string) => {
      if (avatar.startsWith('http')) {
        return avatar;
      }
      return getAssetPath(`media/avatars/${avatar}`);
    };

    // Badge per status assignment
    const getAssignmentStatusBadgeClass = (status: string) => {
      const statusMap: Record<string, string> = {
        "Active": "badge-light-success",
        "Pending": "badge-light-warning",
        "Completed": "badge-light-primary",
        "On Hold": "badge-light-info",
        "Cancelled": "badge-light-danger",
      };
      return statusMap[status] || "badge-light-secondary";
    };

    // Visualizza dettagli employee
    const viewEmployeeDetails = (employeeId: string) => {
      if (employeeId) {
        const url = router.resolve(`/employees/${employeeId}/overview`).href;
        window.open(url, '_blank');
      }
    };

    // Rimuovi assignment
    const handleRemoveAssignment = async (assignment: any) => {
      try {
        const result = await Swal.fire({
          title: 'Conferma Rimozione',
          text: `Sei sicuro di voler rimuovere ${getEmployeeName(assignment.applicationUser)} dal progetto?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Sì, rimuovi',
          cancelButtonText: 'Annulla'
        });

        if (result.isConfirmed) {
          // Chiama API per rimuovere assignment
          const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:3000';
          const response = await fetch(`${API_URL}/api/appointments/${assignment.id}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            // Rimuovi dalla lista locale
            projectEmployees.value = projectEmployees.value.filter(emp => emp.id !== assignment.id);
            
            // Ricarica i dati del progetto
            if (refreshProject) {
              await refreshProject();
              loadProjectEmployees();
            }
            
            // Mostra messaggio di successo
            await Swal.fire({
              title: 'Rimosso!',
              text: 'Employee rimosso dal progetto con successo.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          } else {
            throw new Error('Failed to remove assignment');
          }
        }
      } catch (err) {
        console.error("Error removing assignment:", err);
        await Swal.fire({
          title: 'Errore!',
          text: 'Si è verificato un errore durante la rimozione.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    };

    // Handler per nuova assegnazione
    const handleAssignmentCreated = async () => {
      if (refreshProject) {
        await refreshProject();
        loadProjectEmployees();
      }
    };

    // Carica employee quando il progetto è disponibile
    onMounted(() => {
      loadProjectEmployees();
    });

    // Watch per cambiamenti nel progetto
    watch(() => project.value, (newProject) => {
      if (newProject) {
        loadProjectEmployees();
      }
    }, { deep: true });

    return {
      project,
      projectEmployees,
      assignedEmployeeIds,
      formatDate,
      getEmployeeName,
      getInitials,
      getAvatarUrl,
      getAssignmentStatusBadgeClass,
      viewEmployeeDetails,
      handleRemoveAssignment,
      handleAssignmentCreated,
    };
  },
});
</script>

<style scoped>
.border-hover:hover {
  border-color: var(--bs-primary) !important;
  transform: translateY(-2px);
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(62, 151, 255, 0.1);
}

.cursor-pointer {
  cursor: pointer;
}

.cursor-pointer:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease;
}
</style> 