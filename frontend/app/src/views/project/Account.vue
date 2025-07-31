<template>
  <!--begin::Loading State-->
  <div v-if="loading" class="d-flex justify-content-center align-items-center" style="min-height: 400px;">
    <div class="text-center">
      <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="mt-3">
        <span class="fw-semobold text-gray-600">Loading project data...</span>
        <div class="mt-2">
          <small class="text-muted">Please wait while we fetch the latest information</small>
        </div>
      </div>
    </div>
  </div>
  <!--end::Loading State-->

  <!--begin::Error State-->
  <div v-else-if="error" class="d-flex justify-content-center align-items-center" style="min-height: 400px;">
    <div class="text-center">
      <div class="mb-4">
        <i class="bi bi-exclamation-triangle text-danger" style="font-size: 3rem;"></i>
      </div>
      <div class="mb-3">
        <h4 class="text-danger">Unable to Load Project</h4>
        <p class="text-gray-600 mb-3">{{ error }}</p>
        <div class="alert alert-info" role="alert">
          <i class="bi bi-info-circle me-2"></i>
          <small>This might be due to network issues or the project may have been moved/deleted.</small>
        </div>
      </div>
      <div class="d-flex gap-2 justify-content-center">
        <button @click="handleRefreshClick" class="btn btn-primary">
          <i class="bi bi-arrow-clockwise me-2"></i>Try Again
        </button>
        <button @click="goBack" class="btn btn-outline-secondary">
          <i class="bi bi-arrow-left me-2"></i>Go Back
        </button>
      </div>
    </div>
  </div>
  <!--end::Error State-->

  <!--begin::Content (shown when loaded)-->
  <div v-else>
    <!--begin::Navbar-->
    <div class="card mb-5 mb-xl-10">
      <div class="card-body pt-9 pb-0">
        <!--begin::Details-->
        <div class="d-flex flex-wrap flex-sm-nowrap mb-3">
          <!--begin: Icon-->
          <div class="me-7 mb-4">
            <div
              class="symbol symbol-100px symbol-lg-160px symbol-fixed position-relative"
            >
              <div class="symbol-label fs-2 fw-semobold text-success d-flex align-items-center justify-content-center">
                {{ project?.name?.charAt(0)?.toUpperCase() || 'P' }}
              </div>
              <div
                :class="getStatusIndicatorClass(project?.status)"
                class="position-absolute translate-middle bottom-0 start-100 mb-6 rounded-circle border border-4 border-white h-20px w-20px"
                :title="`Project Status: ${project?.status || 'Unknown'}`"
              ></div>
            </div>
          </div>
          <!--end::Icon-->

          <!--begin::Info-->
          <div class="flex-grow-1">
            <!--begin::Title-->
            <div
              class="d-flex justify-content-between align-items-start flex-wrap mb-2"
            >
              <!--begin::Project-->
              <div class="d-flex flex-column">
                <!--begin::Name-->
                <div class="d-flex align-items-center mb-2">
                  <span class="text-gray-800 fs-2 fw-bold me-1">
                    {{ project?.name || 'Project Name' }}
                  </span>
                  <span :class="getStatusBadgeClass(project?.status)" class="badge fs-8 fw-bold ms-2">
                    {{ project?.status || 'Unknown' }}
                  </span>
                  <span v-if="project?.isActive" class="badge badge-light-success fs-8 fw-bold ms-2">
                    <i class="bi bi-check-circle me-1"></i>Active
                  </span>
                </div>
                <!--end::Name-->

                <!--begin::Info-->
                <div class="d-flex flex-wrap fw-semobold fs-6 mb-4 pe-2">
                  <span v-if="project?.priority" class="d-flex align-items-center text-gray-400 text-hover-primary me-5 mb-2" :title="`Priority Level: ${project?.priority}`">
                    <KTIcon icon-name="tag" icon-class="fs-4 me-1" />
                    Priority: {{ project?.priority }}
                  </span>
                  <span v-if="project?.budget" class="d-flex align-items-center text-gray-400 text-hover-primary me-5 mb-2" :title="`Project Budget: $${project?.budget?.toLocaleString()}`">
                    <KTIcon icon-name="dollar" icon-class="fs-4 me-1" />
                    Budget: ${{ project?.budget?.toLocaleString() }}
                  </span>
                  <span v-if="project?.managerId" class="d-flex align-items-center text-gray-400 text-hover-primary mb-2" :title="`Project Manager ID: ${project?.managerId}`">
                    <KTIcon icon-name="profile-circle" icon-class="fs-4 me-1" />
                    Manager ID: {{ project?.managerId }}
                  </span>
                </div>
                <!--end::Info-->

                <!--begin::Project Dates-->
                <div v-if="project?.startDate || project?.endDate" class="d-flex flex-wrap fw-semobold fs-6 mb-4 pe-2">
                  <span v-if="project?.startDate" class="d-flex align-items-center text-gray-400 text-hover-primary me-5 mb-2" :title="`Project Start Date: ${formatDate(project?.startDate)}`">
                    <KTIcon icon-name="calendar" icon-class="fs-4 me-1" />
                    Start: {{ formatDate(project?.startDate) }}
                  </span>
                  <span v-if="project?.endDate" class="d-flex align-items-center text-gray-400 text-hover-primary mb-2" :title="`Project End Date: ${formatDate(project?.endDate)}`">
                    <KTIcon icon-name="calendar" icon-class="fs-4 me-1" />
                    End: {{ formatDate(project?.endDate) }}
                  </span>
                </div>
                <!--end::Project Dates-->
              </div>
              <!--end::Project-->

              <!--begin::Actions-->
              <div class="d-flex my-4">
                <router-link
                  :to="`/projects/${route.params.id}/settings`"
                  class="btn btn-sm btn-primary me-3"
                  title="Edit project details and settings"
                >
                  <i class="bi bi-pencil me-1"></i>
                  Edit Project
                </router-link>

                <!--begin::Menu-->
                <div class="me-0">
                  <button
                    class="btn btn-sm btn-icon btn-bg-light btn-active-color-primary"
                    data-kt-menu-trigger="click"
                    data-kt-menu-placement="bottom-end"
                    data-kt-menu-flip="top-end"
                    title="More options"
                  >
                    <i class="bi bi-three-dots fs-3"></i>
                  </button>
                  <Dropdown3></Dropdown3>
                </div>
                <!--end::Menu-->
              </div>
              <!--end::Actions-->
            </div>
            <!--end::Title-->

            <!--begin::Stats-->
            <div class="d-flex flex-wrap flex-stack">
              <!--begin::Wrapper-->
              <div class="d-flex flex-column flex-grow-1 pe-8">
                <!--begin::Stats-->
                <div class="d-flex flex-wrap">
                  <!--begin::Stat-->
                  <div
                    class="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3 hover-elevate-up"
                    :title="`Project Duration: ${getProjectDuration()} days`"
                  >
                    <!--begin::Number-->
                    <div class="d-flex align-items-center">
                      <KTIcon
                        icon-name="calendar"
                        icon-class="fs-3 text-primary me-2"
                      />
                      <div class="fs-2 fw-bold">{{ getProjectDuration() }}</div>
                    </div>
                    <!--end::Number-->

                    <!--begin::Label-->
                    <div class="fw-semobold fs-6 text-gray-400">Duration (days)</div>
                    <!--end::Label-->
                  </div>
                  <!--end::Stat-->

                  <!--begin::Stat-->
                  <div
                    class="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3 hover-elevate-up"
                    :title="`Team Members: ${project?.assignments?.length || 0} assigned`"
                  >
                    <!--begin::Number-->
                    <div class="d-flex align-items-center">
                      <KTIcon
                        icon-name="people"
                        icon-class="fs-3 text-info me-2"
                      />
                      <div class="fs-2 fw-bold">
                        {{ project?.assignments?.length || 0 }}
                      </div>
                    </div>
                    <!--end::Number-->

                    <!--begin::Label-->
                    <div class="fw-semobold fs-6 text-gray-400">Team Members</div>
                    <!--end::Label-->
                  </div>
                  <!--end::Stat-->

                  <!--begin::Stat-->
                  <div
                    class="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3 hover-elevate-up"
                    :title="`Required Skills: ${(project?.requiredHardSkills?.length || 0) + (project?.requiredSoftSkills?.length || 0)} total`"
                  >
                    <!--begin::Number-->
                    <div class="d-flex align-items-center">
                      <KTIcon
                        icon-name="gear"
                        icon-class="fs-3 text-warning me-2"
                      />
                      <div class="fs-2 fw-bold">
                        {{ (project?.requiredHardSkills?.length || 0) + (project?.requiredSoftSkills?.length || 0) }}
                      </div>
                    </div>
                    <!--end::Number-->

                    <!--begin::Label-->
                    <div class="fw-semobold fs-6 text-gray-400">Required Skills</div>
                    <!--end::Label-->
                  </div>
                  <!--end::Stat-->

                  <!--begin::Stat-->
                  <div
                    class="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3 hover-elevate-up"
                    :title="`Project Progress: ${getProjectProgress()}%`"
                  >
                    <!--begin::Number-->
                    <div class="d-flex align-items-center">
                      <KTIcon
                        icon-name="chart-simple"
                        icon-class="fs-3 text-success me-2"
                      />
                      <div class="fs-2 fw-bold">
                        {{ getProjectProgress() }}%
                      </div>
                    </div>
                    <!--end::Number-->

                    <!--begin::Label-->
                    <div class="fw-semobold fs-6 text-gray-400">Progress</div>
                    <!--end::Label-->
                  </div>
                  <!--end::Stat-->
                </div>
                <!--end::Stats-->
              </div>
              <!--end::Wrapper-->
            </div>
            <!--end::Stats-->
          </div>
          <!--end::Info-->
        </div>
        <!--end::Details-->

        <!--begin::Navs-->
        <div class="d-flex overflow-auto h-55px">
          <ul
            class="nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bold flex-nowrap"
          >
            <!--begin::Nav item-->
            <li class="nav-item">
              <router-link
                :to="`/projects/${route.params.id}/overview`"
                class="nav-link text-active-primary me-6"
                active-class="active"
                title="View project overview and summary"
              >
                <i class="bi bi-eye me-1"></i>
                Overview
              </router-link>
            </li>
            <!--end::Nav item-->
            <!--begin::Nav item-->
            <li class="nav-item">
              <router-link
                :to="`/projects/${route.params.id}/employee`"
                class="nav-link text-active-primary me-6"
                active-class="active"
                title="Manage project team members"
              >
                <i class="bi bi-people me-1"></i>
                Employee
              </router-link>
            </li>
            <!--end::Nav item-->
            <!--begin::Nav item-->
            <li class="nav-item">
              <router-link
                :to="`/projects/${route.params.id}/documents`"
                class="nav-link text-active-primary me-6"
                active-class="active"
                title="View and manage project documents"
              >
                <i class="bi bi-file-earmark-text me-1"></i>
                Documents
              </router-link>
            </li>
            <!--end::Nav item-->
            <!--begin::Nav item-->
            <li class="nav-item">
              <router-link
                :to="`/projects/${route.params.id}/settings`"
                class="nav-link text-active-primary me-6"
                active-class="active"
                title="Configure project settings"
              >
                <i class="bi bi-gear me-1"></i>
                Settings
              </router-link>
            </li>
            <!--end::Nav item-->
          </ul>
        </div>
        <!--begin::Navs-->
      </div>
    </div>
    <!--end::Navbar-->
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, provide, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import Dropdown3 from "@/components/dropdown/Dropdown3.vue";
import Swal from "sweetalert2/dist/sweetalert2.js";

export default defineComponent({
  name: "project-account",
  components: {
    Dropdown3,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const project = ref<any>(null);
    const loading = ref(true);
    const error = ref<string | null>(null);

    const refreshProjectData = async (id: string) => {
      loading.value = true;
      error.value = '';
      
      try {
        const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:3000';
        const response = await fetch(`${API_URL}/projects/${id}`);
        if (response.ok) {
          const newProjectData = await response.json();
          project.value = newProjectData;
        } else {
          console.error('❌ Failed to refresh project data:', response.status);
          error.value = 'Failed to load project data. Please try again.';
        }
      } catch (err) {
        console.error('❌ Failed to refresh project:', err);
        error.value = 'An error occurred while loading project data.';
      }
      loading.value = false;
    };

    // Provide refreshProject function to child components
    provide('refreshProject', () => {
      if (route.params.id) {
        return refreshProjectData(route.params.id as string);
      }
    });

    // Provide project data to child components
    provide('project', project);

    onMounted(async () => {
      if (route.params.id) {
        try {
          await refreshProjectData(route.params.id as string);
        } catch (err) {
          console.error('Failed to fetch project:', err);
        }
      }
    });

    // Watch for route changes
    watch(() => route.params.id, (newId) => {
      if (newId) {
        refreshProjectData(newId as string);
      }
    });

    const handleRefreshClick = () => {
      if (route.params.id) {
        refreshProjectData(route.params.id as string);
      }
    };

    const goBack = () => {
      router.go(-1);
    };

    const getStatusIndicatorClass = (status: string) => {
      switch (status?.toLowerCase()) {
        case 'active': return 'bg-success';
        case 'completed': return 'bg-primary';
        case 'on hold': return 'bg-warning';
        case 'cancelled': return 'bg-danger';
        default: return 'bg-secondary';
      }
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

    const getProjectDuration = () => {
      if (!project.value?.startDate || !project.value?.endDate) return 'N/A';
      const start = new Date(project.value.startDate);
      const end = new Date(project.value.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays.toString();
    };

    const getProjectProgress = () => {
      // Simple progress calculation based on current date vs project dates
      if (!project.value?.startDate || !project.value?.endDate) return 0;
      
      const start = new Date(project.value.startDate);
      const end = new Date(project.value.endDate);
      const now = new Date();
      
      if (now < start) return 0;
      if (now > end) return 100;
      
      const totalDuration = end.getTime() - start.getTime();
      const elapsed = now.getTime() - start.getTime();
      return Math.round((elapsed / totalDuration) * 100);
    };

    const formatDate = (dateString: string) => {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    return {
      route,
      project,
      loading,
      error,
      handleRefreshClick,
      goBack,
      getStatusIndicatorClass,
      getStatusBadgeClass,
      getProjectDuration,
      getProjectProgress,
      formatDate,
    };
  },
});
</script>

<style scoped>
.hover-elevate-up {
  transition: all 0.3s ease;
}

.hover-elevate-up:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.nav-link {
  transition: all 0.2s ease;
}

.nav-link:hover {
  transform: translateY(-1px);
}

.badge {
  transition: all 0.2s ease;
}

.badge:hover {
  transform: scale(1.05);
}
</style>
