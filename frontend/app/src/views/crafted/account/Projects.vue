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
      <!--begin::Select wrapper-->
      <div class="m-0">
        <!--begin::Select-->
        <select
          name="status"
          data-control="select2"
          data-hide-search="true"
          class="form-select form-select-white form-select-sm fw-bold w-125px"
        >
          <option value="Active" selected>Active</option>
          <option value="Approved">In Progress</option>
          <option value="Declined">To Do</option>
          <option value="In Progress">Completed</option>
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
        :status="project.status"
        :status-data-badge-color="getStatusBadge(project.status || '')"
        :progress="calculateProgress(project)"
        :icon="getProjectIcon(index)"
        :title="project.name || 'Progetto senza nome'"
        :date="formatDate(project.start_date)"
        :budget="formatBudget(project.budget)"
        :users="getProjectUsers(index)"
        :description="project.description"
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
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, ref, onMounted } from "vue";
import KTCard from "@/components/cards/Card1.vue";
import { getUserProjects } from "@/core/services/businessServices/Project";
import type { Project } from "@/core/models/Project";

export default defineComponent({
  name: "profile-projects",
  components: {
    KTCard,
  },
  setup() {
    const projects = ref<Project[]>([]);
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

    // Avatars mock per gli utenti dei progetti
    const mockUsers = [
      [
        { name: "Emma Smith", src: getAssetPath("media/avatars/300-6.jpg") },
        { name: "Rudy Stone", src: getAssetPath("media/avatars/300-1.jpg") },
        { name: "Susan Redwood", initials: "S", state: "primary" },
      ],
      [
        { name: "Alan Warden", initials: "A", state: "warning" },
        { name: "Brian Cox", src: getAssetPath("media/avatars/300-5.jpg") },
      ],
      [
        { name: "Mad Masy", src: getAssetPath("media/avatars/300-6.jpg") },
        { name: "Cris Willson", src: getAssetPath("media/avatars/300-1.jpg") },
        { name: "Mike Garcie", initials: "M", state: "info" },
      ],
    ];

    const loadProjects = async () => {
      try {
        isLoading.value = true;
        error.value = null;
        
        const userProjects = await getUserProjects();
        if (userProjects) {
          projects.value = userProjects;
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

    // Funzione per calcolare la percentuale di progresso
    const calculateProgress = (project: any) => {
      if (project.status === "Completed") return 100;
      if (project.status === "In Progress") return project.allocationPercentage || 50;
      if (project.status === "Pending") return 30;
      return 10;
    };

    // Funzione per ottenere l'icona del progetto
    const getProjectIcon = (index: number) => {
      return getAssetPath(projectIcons[index % projectIcons.length]);
    };

    // Funzione per ottenere gli utenti mock
    const getProjectUsers = (index: number) => {
      return mockUsers[index % mockUsers.length];
    };

    // Funzione per mappare lo status ai badge
    const getStatusBadge = (status: string) => {
      const statusMap: Record<string, string> = {
        "Completed": "badge-light-success",
        "In Progress": "badge-light-primary",
        "Pending": "badge-light",
        "Overdue": "badge-light-danger",
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

    onMounted(() => {
      loadProjects();
    });

    return {
      projects,
      isLoading,
      error,
      getAssetPath,
      calculateProgress,
      getProjectIcon,
      getProjectUsers,
      getStatusBadge,
      formatDate,
      formatBudget,
      loadProjects,
    };
  },
});
</script>
