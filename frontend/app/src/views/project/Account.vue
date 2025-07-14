<template>
  <!--begin::Loading State-->
  <div v-if="loading" class="d-flex justify-content-center align-items-center" style="min-height: 400px;">
    <div class="text-center">
      <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="mt-3">
        <span class="fw-semobold text-gray-600">Loading project data...</span>
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
        <h4 class="text-danger">Error Loading Project</h4>
        <p class="text-gray-600">{{ error }}</p>
      </div>
      <button @click="handleRefreshClick" class="btn btn-primary">
        <i class="bi bi-arrow-clockwise me-2"></i>Try Again
      </button>
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
              <div class="symbol-label fs-2 fw-semobold text-success">
                {{ project?.name?.charAt(0)?.toUpperCase() || 'P' }}
              </div>
              <div
                :class="getStatusIndicatorClass(project?.status)"
                class="position-absolute translate-middle bottom-0 start-100 mb-6 rounded-circle border border-4 border-white h-20px w-20px"
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
                </div>
                <!--end::Name-->

                <!--begin::Info-->
                <div class="d-flex flex-wrap fw-semobold fs-6 mb-4 pe-2">
                  <span v-if="project?.priority" class="d-flex align-items-center text-gray-400 text-hover-primary me-5 mb-2">
                    <KTIcon icon-name="tag" icon-class="fs-4 me-1" />
                    Priority: {{ project?.priority }}
                  </span>
                  <span v-if="project?.budget" class="d-flex align-items-center text-gray-400 text-hover-primary me-5 mb-2">
                    <KTIcon icon-name="dollar" icon-class="fs-4 me-1" />
                    Budget: ${{ project?.budget?.toLocaleString() }}
                  </span>
                  <span v-if="project?.managerId" class="d-flex align-items-center text-gray-400 text-hover-primary mb-2">
                    <KTIcon icon-name="profile-circle" icon-class="fs-4 me-1" />
                    Manager ID: {{ project?.managerId }}
                  </span>
                </div>
                <!--end::Info-->
              </div>
              <!--end::Project-->

              <!--begin::Actions-->
              <div class="d-flex my-4">
                <router-link
                  :to="`/projects/${route.params.id}/settings`"
                  class="btn btn-sm btn-primary me-3"
                >
                  Edit Project
                </router-link>

                <!--begin::Menu-->
                <div class="me-0">
                  <button
                    class="btn btn-sm btn-icon btn-bg-light btn-active-color-primary"
                    data-kt-menu-trigger="click"
                    data-kt-menu-placement="bottom-end"
                    data-kt-menu-flip="top-end"
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
                    class="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3"
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
                    class="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3"
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
                    class="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3"
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
              >
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
              >
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
              >
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
              >
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
import { useRoute } from "vue-router";
import Dropdown3 from "@/components/dropdown/Dropdown3.vue";
import Swal from "sweetalert2/dist/sweetalert2.js";

export default defineComponent({
  name: "project-account",
  components: {
    Dropdown3,
  },
  setup() {
    const route = useRoute();
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

    return {
      route,
      project,
      loading,
      error,
      handleRefreshClick,
      getStatusIndicatorClass,
      getStatusBadgeClass,
      getProjectDuration,
    };
  },
});
</script>
