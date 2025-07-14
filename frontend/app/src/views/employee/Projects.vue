<template>
  <!--begin::Toolbar-->
  <div class="d-flex flex-wrap flex-stack my-5">
    <!--begin::Heading-->
    <h2 class="fs-2 fw-semobold my-2">
      Projects
      <span class="fs-6 text-gray-400 ms-1">by Status</span>
    </h2>
    <!--end::Heading-->

    <!--begin::Controls-->
    <div class="d-flex flex-wrap my-1">
      <!--begin::Assign Projects Button-->
      <div v-if="isEmployeeView" class="me-3">
        <button
          type="button"
          class="btn btn-sm btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#kt_modal_add_project_assignment"
        >
          <i class="ki-duotone ki-plus fs-2">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          Assign Projects
        </button>
      </div>
      <!--end::Assign Projects Button-->
      
      <!--begin::Select wrapper-->
      <div class="m-0">
        <!--begin::Select-->
        <select
          v-model="selectedStatus"
          @change="filterProjects"
          name="status"
          class="form-select form-select-white form-select-sm fw-bold w-125px"
        >
          <option value="">All Status</option>
          <option value="PLANNING">Planning</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="ON_HOLD">On Hold</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <!--end::Select-->
      </div>
      <!--end::Select wrapper-->
    </div>
    <!--end::Controls-->
  </div>
  <!--end::Toolbar-->

  <!--begin::Row-->
  <div class="row g-6 g-xl-9" v-if="!isLoading && !error">
    <!--begin::Col-->
    <div 
      v-for="(project, index) in projects" 
      :key="project.id"
      class="col-md-6 col-xl-4"
    >
      <!--begin::Card-->
      <div class="card border border-2 border-gray-300 border-hover cursor-pointer" @click="handleEditAssignment(project)">
        <!--begin::Card header-->
        <div class="card-header border-0 pt-9">
          <!--begin::Card Title-->
          <div class="card-title m-0">
            <!--begin::Avatar-->
            <div class="symbol symbol-50px w-50px bg-light">
              <img :src="getProjectIcon(index)" alt="image" class="p-3" />
            </div>
            <!--end::Avatar-->
          </div>
          <!--end::Card Title-->

          <!--begin::Card toolbar-->
          <div class="card-toolbar">
            <span
              :class="getStatusBadge((project as any).assignmentStatus || project.status || '')"
              class="badge fw-bold me-auto px-4 py-3"
            >
              {{ (project as any).assignmentStatus || project.status }}
            </span>
          </div>
          <!--end::Card toolbar-->
        </div>
        <!--end::Card header-->

        <!--begin::Card body-->
        <div class="card-body p-9">
          <!--begin::Name-->
          <div class="fs-3 fw-bold text-dark">
            {{ project.name || 'Progetto senza nome' }}
          </div>
          <!--end::Name-->

          <!--begin::Description-->
          <p class="text-gray-400 fw-semobold fs-5 mt-1 mb-7">
            {{ getProjectDescription(project) }}
          </p>
          <!--end::Description-->

          <!--begin::Info-->
          <div class="d-flex flex-wrap mb-5">
            <!--begin::Start Date-->
            <div class="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-7 mb-3">
              <div class="fs-6 text-gray-800 fw-bold">
                {{ formatDate((project as any).assignmentStartDate || (project as any).startDate || project.start_date) }}
              </div>
              <div class="fw-semobold text-gray-400">Start Date</div>
            </div>
            <!--end::Start Date-->

            <!--begin::End Date-->
            <div class="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-7 mb-3">
              <div class="fs-6 text-gray-800 fw-bold">
                {{ formatDate((project as any).assignmentEndDate || (project as any).endDate || project.end_date) }}
              </div>
              <div class="fw-semobold text-gray-400">End Date</div>
            </div>
            <!--end::End Date-->
          </div>
          <!--end::Info-->

          <!--begin::Allocation-->
          <div v-if="(project as any).allocationPercentage" class="mb-5">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="fw-semobold text-gray-600">Allocazione</span>
              <span class="fw-bold text-primary">{{ (project as any).allocationPercentage }}%</span>
            </div>
            <div
              class="h-4px w-100 bg-light"
              data-bs-toggle="tooltip"
              :title="`Allocazione: ${(project as any).allocationPercentage}%`"
            >
              <div
                class="bg-primary rounded h-4px"
                role="progressbar"
                :style="{ width: (project as any).allocationPercentage + '%' }"
                :aria-valuenow="(project as any).allocationPercentage"
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
          </div>
          <!--end::Allocation-->

          <!--begin::Users-->
          <div v-if="getProjectUsers(project).length > 0" class="symbol-group symbol-hover mb-5">
            <template v-for="(user, userIndex) in getProjectUsers(project)" :key="userIndex">
              <div
                class="symbol symbol-35px symbol-circle"
                data-bs-toggle="tooltip"
                :title="user.name"
              >
                <img v-if="user.src" alt="Pic" :src="user.src" />
                <span
                  v-else
                  class="symbol-label fw-bold"
                  :class="`bg-${user.state} text-inverse-${user.state}`"
                >
                  {{ user.initials }}
                </span>
              </div>
            </template>
          </div>
          <!--end::Users-->

          <!--begin::Actions-->
          <div class="d-flex justify-content-between">
            <!--begin::View Project-->
            <button
              @click.stop="handleProjectClick(project)"
              class="btn btn-sm btn-light-primary me-2 flex-grow-1"
              type="button"
              :disabled="!isUserAdmin"
            >
              <i class="ki-duotone ki-eye fs-6 me-1">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
              </i>
              View Details
            </button>
            <!--end::View Project-->

            <!--begin::Remove Assignment-->
            <button
              v-if="isEmployeeView && (project as any).assignmentId && isUserAdmin"
              @click.stop="handleRemoveAssignment(project)"
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
    
    <!--begin::Empty State-->
    <div v-if="projects.length === 0" class="col-12">
      <div class="card">
        <div class="card-body text-center py-10">
          <div class="mb-5">
            <i class="ki-duotone ki-notepad fs-5x text-muted mb-5">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
          </div>
          <h3 class="text-gray-800">Nessun progetto assegnato</h3>
          <p class="text-gray-600 mb-0">
            Al momento non hai progetti assegnati. Contatta il tuo manager per ulteriori informazioni.
          </p>
        </div>
      </div>
    </div>
    <!--end::Empty State-->
  </div>
  
  <!--begin::Loading State-->
  <div v-if="isLoading" class="row g-6 g-xl-9">
    <div class="col-12">
      <div class="card">
        <div class="card-body text-center py-10">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Caricamento...</span>
          </div>
          <p class="text-gray-600 mt-3">Caricamento progetti in corso...</p>
        </div>
      </div>
    </div>
  </div>
  <!--end::Loading State-->
  
  <!--begin::Error State-->
  <div v-if="error" class="row g-6 g-xl-9">
    <div class="col-12">
      <div class="alert alert-danger d-flex align-items-center">
        <i class="ki-duotone ki-information fs-2x text-danger me-4">
          <span class="path1"></span>
          <span class="path2"></span>
          <span class="path3"></span>
        </i>
        <div>
          <h4 class="alert-heading">Errore nel caricamento</h4>
          <p class="mb-2">{{ error }}</p>
          <button @click="loadProjects" class="btn btn-sm btn-outline-danger">
            Riprova
          </button>
        </div>
      </div>
    </div>
  </div>
     <!--end::Error State-->
   <!--end::Row-->

    <!--begin::Pagination-->
    <div v-if="!isLoading && !error && projects.length > 0" class="d-flex flex-stack flex-wrap pt-10">
      <div class="fs-6 fw-semobold text-gray-700">
        Mostrando {{ projects.length }} {{ projects.length === 1 ? 'progetto' : 'progetti' }}
      </div>

      <!--begin::Pages-->
      <ul class="pagination" v-if="projects.length > 9">
        <li class="page-item previous">
          <a href="#" class="page-link"><i class="previous"></i></a>
        </li>

        <li class="page-item active">
          <a href="#" class="page-link">1</a>
        </li>

        <li class="page-item next">
          <a href="#" class="page-link"><i class="next"></i></a>
        </li>
      </ul>
      <!--end::Pages-->
    </div>
    <!--end::Pagination-->

    <!--begin::Assign Projects Modal-->
    <AddProjectAssignmentModal
      v-if="isEmployeeView && employeeId"
      :employee-id="employeeId"
      :assigned-project-ids="assignedProjectIds"
      @assignment-created="handleAssignmentCreated"
    />
    <!--end::Assign Projects Modal-->

    <!--begin::Edit Assignment Modal-->
    <EditAssignmentModal
      :assignment="selectedAssignment"
      @assignment-updated="handleAssignmentUpdated"
    />
    <!--end::Edit Assignment Modal-->

    <!--begin::Hidden button to trigger modal-->
    <button
      id="hidden-edit-modal-trigger"
      type="button"
      class="d-none"
      data-bs-toggle="modal"
      data-bs-target="#kt_modal_edit_assignment"
    >
    </button>
    <!--end::Hidden button to trigger modal-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import KTCard from "@/components/cards/Card1.vue";
import AddProjectAssignmentModal from "@/components/employee/AddProjectAssignmentModal.vue";
import EditAssignmentModal from "@/components/project/EditAssignmentModal.vue";
import { getUserProjects, getEmployeeProjects, removeProjectAssignment } from "@/core/services/businessServices/Project";
import type { Project } from "@/core/models/Project";
import { useCurrentUser } from "@/core/composables/useCurrentUser";
import Swal from "sweetalert2/dist/sweetalert2.js";

export default defineComponent({
  name: "profile-projects",
  components: {
    KTCard,
    AddProjectAssignmentModal,
    EditAssignmentModal,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { currentUser } = useCurrentUser();
    const projects = ref<Project[]>([]);
    const allProjects = ref<Project[]>([]); // Lista completa senza filtri
    const selectedStatus = ref<string>(""); // Status filtro selezionato
    const isLoading = ref(true);
    const error = ref<string | null>(null);
    const selectedAssignment = ref<any>(null);

    // Icone predefinite per i progetti
    const projectIcons = [
      "media/svg/brand-logos/plurk.svg",
      "media/svg/brand-logos/disqus.svg",
      "media/svg/brand-logos/figma-1.svg",
      "media/svg/brand-logos/sentry-3.svg",
      "media/svg/brand-logos/xing-icon.svg",
      "media/svg/brand-logos/tvit.svg",
      "media/svg/brand-logos/aven.svg",
      "media/svg/brand-logos/treva.svg",
      "media/svg/brand-logos/kanba.svg",
    ];

    // Stati per colori avatar quando non c'è immagine
    const avatarStates = ["primary", "success", "warning", "info", "danger"];

    // ID employee dalla rotta
    const employeeId = computed(() => route.params.id as string);

    // Determina se siamo in modalità employee view o account view
    const isEmployeeView = computed(() => !!employeeId.value);

    // Controlla se l'utente corrente è admin
    const isUserAdmin = computed(() => {
      return currentUser.value?.roles?.includes('admin') || false;
    });

    // ID dei progetti già assegnati
    const assignedProjectIds = computed(() => 
      projects.value.map(project => project.id).filter(Boolean) as string[]
    );

    const loadProjects = async () => {
      try {
        isLoading.value = true;
        error.value = null;
        
        // Se abbiamo un employee ID, carica i suoi progetti, altrimenti usa getUserProjects
        const userProjects = employeeId.value 
          ? await getEmployeeProjects(employeeId.value)
          : await getUserProjects();
          
        if (userProjects) {
          allProjects.value = userProjects; // Salva la lista completa
          projects.value = userProjects; // Lista visualizzata (filtrata)
        } else {
          error.value = "Impossibile caricare i progetti";
        }
      } catch (err) {
        error.value = "Errore durante il caricamento dei progetti";
        console.error("Error loading projects:", err);
      } finally {
        isLoading.value = false;
      }
    };

    // Handler per quando vengono assegnati nuovi progetti
    const handleAssignmentCreated = () => {
      loadProjects();
    };

    // Handler per modifica assegnazione
    const handleEditAssignment = (project: any) => {
      // Crea un oggetto assignment dal progetto
      const assignment = {
        id: project.assignmentId,
        applicationUserId: employeeId.value,
        projectId: project.id,
        roleOnProject: project.roleOnProject,
        assignmentStartDate: project.assignmentStartDate,
        assignmentEndDate: project.assignmentEndDate,
        allocationPercentage: project.allocationPercentage,
        status: project.assignmentStatus,
        feedbackReceived: project.feedbackReceived,
        applicationUser: {
          id: employeeId.value,
          firstName: currentUser.value?.firstName,
          lastName: currentUser.value?.lastName,
          email: currentUser.value?.email,
          department: currentUser.value?.department,
          avatar: currentUser.value?.avatar,
        },
        project: project,
      };
      
      selectedAssignment.value = assignment;
      // Apri la modale usando un pulsante nascosto
      const hiddenButton = document.getElementById('hidden-edit-modal-trigger');
      if (hiddenButton) {
        hiddenButton.click();
      }
    };

    // Handler per aggiornamento assegnazione
    const handleAssignmentUpdated = async () => {
      await loadProjects();
      selectedAssignment.value = null;
    };

    // Funzione per gestire il click del progetto (solo per admin)
    const handleProjectClick = (project: any) => {
      if (isUserAdmin.value && project.id) {
        // Apri la pagina di dettaglio del progetto in una nuova scheda
        const url = router.resolve(`/projects/${project.id}/overview`).href;
        window.open(url, '_blank');
      }
    };

    // Funzione per rimuovere l'assignment del progetto
    const handleRemoveAssignment = async (project: any) => {
      if (!project.assignmentId) {
        console.error("Assignment ID not found");
        return;
      }

      try {
        const result = await Swal.fire({
          title: 'Conferma rimozione',
          text: `Sei sicuro di voler rimuovere l'assegnazione del progetto "${project.name}"?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Sì, rimuovi',
          cancelButtonText: 'Annulla'
        });

        if (result.isConfirmed) {
          const success = await removeProjectAssignment(project.assignmentId);
          
          if (success) {
            // Rimuovi il progetto dalla lista locale
            projects.value = projects.value.filter(p => p.id !== project.id);
            allProjects.value = allProjects.value.filter(p => p.id !== project.id);
            
            // Mostra messaggio di successo
            await Swal.fire({
              title: 'Rimosso!',
              text: 'L\'assegnazione del progetto è stata rimossa con successo.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          } else {
            // Mostra messaggio di errore
            await Swal.fire({
              title: 'Errore!',
              text: 'Si è verificato un errore durante la rimozione dell\'assegnazione.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        }
      } catch (err) {
        console.error("Error removing assignment:", err);
        await Swal.fire({
          title: 'Errore!',
          text: 'Si è verificato un errore imprevisto.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    };

    // Funzione per filtrare i progetti
    const filterProjects = () => {
      if (!selectedStatus.value) {
        // Se nessun filtro selezionato, mostra tutti i progetti
        projects.value = allProjects.value;
      } else {
        // Filtra per status
        projects.value = allProjects.value.filter((project: any) => {
          const projectStatus = (project as any).assignmentStatus || project.status;
          return projectStatus === selectedStatus.value;
        });
      }
    };

    // Funzione per calcolare la percentuale di progresso
    const calculateProgress = (project: any) => {
      // Usa lo status del progetto o dell'assignment
      const status = project.assignmentStatus || project.status;
      
      if (status === "Completed") return 100;
      if (status === "In Progress" || status === "Active") {
        // Usa la percentuale di allocazione dell'assignment se disponibile
        return project.allocationPercentage || 50;
      }
      if (status === "Pending") return 30;
      if (status === "On Hold") return 25;
      return 10;
    };

    // Funzione per ottenere l'icona del progetto
    const getProjectIcon = (index: number) => {
      return getAssetPath(projectIcons[index % projectIcons.length]);
    };

    // Funzione per ottenere gli utenti reali del progetto
    const getProjectUsers = (project: any) => {
      if (!project.assignedUsers || project.assignedUsers.length === 0) {
        return [];
      }

      return project.assignedUsers.map((user: any, index: number) => {
        // Se l'utente ha un avatar, usalo
        if (user.avatar) {
          return {
            name: user.name,
            src: user.avatar.startsWith('http') 
              ? user.avatar 
              : getAssetPath(`media/avatars/${user.avatar}`),
          };
        }
        
        // Altrimenti usa le iniziali con un colore
        const initials = user.firstName && user.lastName
          ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
          : user.name.split(' ').map((n: string) => n.charAt(0)).join('').substring(0, 2);
          
        return {
          name: user.name,
          initials: initials.toUpperCase(),
          state: avatarStates[index % avatarStates.length],
        };
      });
    };

    // Funzione per mappare lo status ai badge
    const getStatusBadge = (status: string) => {
      const statusMap: Record<string, string> = {
        "PLANNING": "badge-light-info",
        "IN_PROGRESS": "badge-light-primary",
        "ON_HOLD": "badge-light-warning",
        "COMPLETED": "badge-light-success",
        "CANCELLED": "badge-light-danger",
        // Backwards compatibility per assignment status
        "Active": "badge-light-success",
        "Pending": "badge-light-warning",
        "Completed": "badge-light-success",
        "In Progress": "badge-light-primary",
        "On Hold": "badge-light-warning",
        "Overdue": "badge-light-danger",
      };
      return statusMap[status] || "badge-light";
    };

    // Funzione per formattare la data
    const formatDate = (date: Date | string | undefined) => {
      if (!date) return "";
      
      let dateObj: Date;
      
      if (typeof date === 'string') {
        // Se è già una stringa ISO completa, usala direttamente
        if (date.includes('T') || date.includes('Z')) {
          dateObj = new Date(date);
        } else {
          // Se è solo una data (YYYY-MM-DD), aggiungi l'ora locale
          dateObj = new Date(date + 'T00:00:00');
        }
      } else {
        // Se è già un oggetto Date
        dateObj = new Date(date);
      }
      
      // Verifica che la data sia valida
      if (isNaN(dateObj.getTime())) {
        return 'Invalid Date';
      }
      
      return dateObj.toLocaleDateString("it-IT", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    };

    // Funzione per formattare il budget
    const formatBudget = (budget: number | undefined) => {
      if (!budget) return "";
      return new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "EUR"
      }).format(budget);
    };

    // Funzione per ottenere la descrizione dinamica del progetto
    const getProjectDescription = (project: any) => {
      let description = project.description || "";
      
      // Aggiungi informazioni dell'assignment se disponibili
      if (project.roleOnProject) {
        description += description ? `\n\n${project.roleOnProject}` : `${project.roleOnProject}`;
      }
      
      if (project.assignmentEndDate) {
        let endDate: Date;
        
        if (typeof project.assignmentEndDate === 'string') {
          // Se è già una stringa ISO completa, usala direttamente
          if (project.assignmentEndDate.includes('T') || project.assignmentEndDate.includes('Z')) {
            endDate = new Date(project.assignmentEndDate);
          } else {
            // Se è solo una data (YYYY-MM-DD), aggiungi l'ora locale
            endDate = new Date(project.assignmentEndDate + 'T00:00:00');
          }
        } else {
          // Se è già un oggetto Date
          endDate = new Date(project.assignmentEndDate);
        }
        
      }
      
      return description || "Nessuna descrizione disponibile";
    };

    onMounted(async () => {
      // Inizializza l'utente corrente per controllare i ruoli
      const { fetchCurrentUser } = useCurrentUser();
      await fetchCurrentUser();
      
      // Carica i progetti
      loadProjects();
    });

    return {
      projects,
      isLoading,
      error,
      employeeId,
      isEmployeeView,
      assignedProjectIds,
      selectedStatus,
      selectedAssignment,
      getAssetPath,
      calculateProgress,
      getProjectIcon,
      getProjectUsers,
      getStatusBadge,
      formatDate,
      formatBudget,
      getProjectDescription,
      loadProjects,
      handleAssignmentCreated,
      filterProjects,
      handleProjectClick,
      handleRemoveAssignment,
      handleEditAssignment,
      handleAssignmentUpdated,
      isUserAdmin,
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
