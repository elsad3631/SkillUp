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
          <option value="Active">Active</option>
          <option value="In Progress">In Progress</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="On Hold">On Hold</option>
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
      <KTCard
        :status="(project as any).assignmentStatus || project.status"
        :status-data-badge-color="getStatusBadge((project as any).assignmentStatus || project.status || '')"
        :progress="calculateProgress(project)"
        :icon="getProjectIcon(index)"
        :title="project.name || 'Progetto senza nome'"
        :date="formatDate((project as any).assignmentStartDate || (project as any).startDate || project.start_date)"
        :start-date="formatDate((project as any).assignmentStartDate || (project as any).startDate || project.start_date)"
        :end-date="formatDate((project as any).assignmentEndDate || (project as any).endDate || project.end_date)"
        :users="getProjectUsers(project)"
        :description="getProjectDescription(project)"
      ></KTCard>

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
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import KTCard from "@/components/cards/Card1.vue";
import AddProjectAssignmentModal from "@/components/employee/AddProjectAssignmentModal.vue";
import { getUserProjects, getEmployeeProjects } from "@/core/services/businessServices/Project";
import type { Project } from "@/core/models/Project";

export default defineComponent({
  name: "profile-projects",
  components: {
    KTCard,
    AddProjectAssignmentModal,
  },
  setup() {
    const route = useRoute();
    const projects = ref<Project[]>([]);
    const allProjects = ref<Project[]>([]); // Lista completa senza filtri
    const selectedStatus = ref<string>(""); // Status filtro selezionato
    const isLoading = ref(true);
    const error = ref<string | null>(null);

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
        "Completed": "badge-light-success",
        "In Progress": "badge-light-primary",
        "Active": "badge-light-success",
        "Pending": "badge-light-warning",
        "On Hold": "badge-light-secondary",
        "Overdue": "badge-light-danger",
        "Cancelled": "badge-light-dark",
      };
      return statusMap[status] || "badge-light";
    };

    // Funzione per formattare la data
    const formatDate = (date: Date | string | undefined) => {
      if (!date) return "";
      const d = typeof date === 'string' ? new Date(date) : date;
      return d.toLocaleDateString("it-IT", {
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
        description += description ? `\n\nRuolo: ${project.roleOnProject}` : `Ruolo: ${project.roleOnProject}`;
      }
      
      if (project.allocationPercentage) {
        description += `\nAllocazione: ${project.allocationPercentage}%`;
      }

      if (project.assignmentEndDate) {
        const endDate = new Date(project.assignmentEndDate);
        description += `\nScadenza assignment: ${endDate.toLocaleDateString("it-IT")}`;
      }
      
      return description || "Nessuna descrizione disponibile";
    };

    onMounted(() => {
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
    };
  },
});
</script>
