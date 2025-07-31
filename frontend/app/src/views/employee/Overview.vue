<template>
  <!--begin::Loading State for Overview-->
  <div v-if="!employee" class="d-flex justify-content-center align-items-center" style="min-height: 300px;">
    <div class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="mt-3">
        <span class="fw-semobold text-gray-600">Loading overview...</span>
      </div>
    </div>
  </div>
  <!--end::Loading State for Overview-->

  <!--begin::Overview Content-->
  <div v-else>
    <!--begin::Profile Header Card-->
    <div class="card mb-5 mb-xl-10">
      <div class="card-body p-0">
        <!--begin::Profile Header-->
        <div class="d-flex flex-column flex-md-row align-items-center p-8">
          <!--begin::Avatar-->
          <div class="symbol symbol-100px symbol-circle mb-5 mb-md-0 me-md-8">
            <div class="symbol-label bg-light-primary">
              <span class="fs-2x fw-bold text-primary">
                {{ getInitials(employee?.firstName, employee?.lastName) }}
              </span>
            </div>
          </div>
          <!--end::Avatar-->

          <!--begin::Profile Info-->
          <div class="flex-grow-1 text-center text-md-start">
            <h2 class="fw-bold fs-1 text-dark mb-2">
              {{ (employee?.firstName || '') + ' ' + (employee?.lastName || '') }}
            </h2>
            <div class="d-flex flex-column flex-md-row align-items-center gap-3 mb-3">
              <span class="badge badge-light-primary fs-7 fw-bold">
                {{ employee?.currentRole || 'Role not specified' }}
              </span>
              <span class="badge badge-light-info fs-7 fw-bold">
                {{ employee?.department || 'Department not specified' }}
              </span>
              <span :class="employee?.isAvailable ? 'badge-light-success' : 'badge-light-danger'" class="badge fs-7 fw-bold">
                {{ employee?.isAvailable ? 'Available' : 'Not Available' }}
              </span>
            </div>
            <div class="d-flex flex-column flex-md-row align-items-center gap-4 text-muted">
              <div class="d-flex align-items-center">
                <i class="ki-duotone ki-sms fs-5 me-2"></i>
                <span>{{ employee?.email || 'No email' }}</span>
              </div>
              <div class="d-flex align-items-center" v-if="employee?.phone">
                <i class="ki-duotone ki-phone fs-5 me-2"></i>
                <span>{{ employee.phone }}</span>
              </div>
            </div>
          </div>
          <!--end::Profile Info-->

          <!--begin::Actions-->
          <div class="mt-5 mt-md-0">
            <router-link
              v-if="employee && employee.id"
              :to="editProfileUrl"
              class="btn btn-primary btn-lg"
              >
              <i class="ki-duotone ki-pencil fs-5 me-2"></i>
              Edit Profile
            </router-link>
          </div>
          <!--end::Actions-->
        </div>
        <!--end::Profile Header-->
      </div>
    </div>
    <!--end::Profile Header Card-->

    <!--begin::Details Cards-->
    <div class="row g-5 g-xl-10 mb-5 mb-xl-10">
      <!--begin::Personal Information-->
      <div class="col-xl-6">
        <div class="card h-100">
          <div class="card-header">
            <div class="card-title">
              <i class="ki-duotone ki-user fs-2 me-2 text-primary"></i>
              <h3 class="fw-bold m-0">Personal Information</h3>
            </div>
          </div>
          <div class="card-body">
            <div class="d-flex flex-column gap-4">
              <div class="d-flex align-items-center p-4 bg-light-primary rounded">
                <i class="ki-duotone ki-calendar fs-2 me-3 text-primary"></i>
                <div>
                  <div class="text-muted fs-7 fw-semibold">Date of Birth</div>
                  <div class="fw-bold fs-6">{{ employee?.dateOfBirth ? (new Date(employee.dateOfBirth)).toLocaleDateString() : 'Not specified' }}</div>
                </div>
              </div>

              <div class="d-flex align-items-center p-4 bg-light-info rounded" v-if="employee?.placeOfBirth">
                <i class="ki-duotone ki-geolocation fs-2 me-3 text-info"></i>
                <div>
                  <div class="text-muted fs-7 fw-semibold">Place of Birth</div>
                  <div class="fw-bold fs-6">{{ employee.placeOfBirth }}</div>
                </div>
              </div>

              <div class="d-flex align-items-center p-4 bg-light-success rounded" v-if="employee?.address">
                <i class="ki-duotone ki-home fs-2 me-3 text-success"></i>
                <div>
                  <div class="text-muted fs-7 fw-semibold">Address</div>
                  <div class="fw-bold fs-6">{{ employee.address }}</div>
                </div>
              </div>

              <div class="d-flex align-items-center p-4 bg-light-warning rounded" v-if="employee?.cvData">
                <i class="ki-duotone ki-document fs-2 me-3 text-warning"></i>
                <div>
                  <div class="text-muted fs-7 fw-semibold">CV File</div>
                  <div class="fw-bold fs-6">
                    <a v-if="employee.cvData.storageUrl" :href="employee.cvData.storageUrl" target="_blank" class="text-decoration-none">
                      <i class="ki-duotone ki-download fs-5 me-1"></i>
                      {{ employee.cvData.fileName }}
                    </a>
                    <span v-else>{{ employee.cvData.fileName }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--end::Personal Information-->

      <!--begin::Skills Overview-->
      <div class="col-xl-6">
        <div class="card h-100">
          <div class="card-header">
            <div class="card-title">
              <i class="ki-duotone ki-technology-4 fs-2 me-2 text-primary"></i>
              <h3 class="fw-bold m-0">Skills Overview</h3>
            </div>
          </div>
          <div class="card-body">
            <div class="d-flex flex-column gap-4">
              <!-- Hard Skills Summary -->
              <div v-if="employee?.hardSkills && employee.hardSkills.length" class="p-4 bg-light-primary rounded">
                <div class="d-flex align-items-center mb-3">
                  <i class="ki-duotone ki-cpu fs-2 me-2 text-primary"></i>
                  <h5 class="fw-bold m-0">Technical Skills</h5>
                  <span class="badge badge-primary ms-auto">{{ employee.hardSkills.length }}</span>
                </div>
                <div class="d-flex flex-wrap gap-2">
                  <span v-for="skill in employee.hardSkills.slice(0, 5)" :key="skill.name" 
                        class="badge badge-light-primary fs-7">
                    {{ skill.name }} (L{{ skill.proficiencyLevel }})
                  </span>
                  <span v-if="employee.hardSkills.length > 5" class="badge badge-light-secondary fs-7">
                    +{{ employee.hardSkills.length - 5 }} more
                  </span>
                </div>
              </div>

              <!-- Soft Skills Summary -->
              <div v-if="employee?.softSkills && employee.softSkills.length" class="p-4 bg-light-success rounded">
                <div class="d-flex align-items-center mb-3">
                  <i class="ki-duotone ki-users fs-2 me-2 text-success"></i>
                  <h5 class="fw-bold m-0">Soft Skills</h5>
                  <span class="badge badge-success ms-auto">{{ employee.softSkills.length }}</span>
                </div>
                <div class="d-flex flex-wrap gap-2">
                  <span v-for="skill in employee.softSkills.slice(0, 5)" :key="skill.name" 
                        class="badge badge-light-success fs-7">
                    {{ skill.name }} (L{{ skill.proficiencyLevel }})
                  </span>
                  <span v-if="employee.softSkills.length > 5" class="badge badge-light-secondary fs-7">
                    +{{ employee.softSkills.length - 5 }} more
                  </span>
                </div>
              </div>

              <!-- No Skills Message -->
              <div v-if="(!employee?.hardSkills || !employee.hardSkills.length) && 
                         (!employee?.softSkills || !employee.softSkills.length)" 
                   class="text-center py-8">
                <i class="ki-duotone ki-technology-4 fs-3x text-muted mb-4">
                  <span class="path1"></span>
                  <span class="path2"></span>
                  <span class="path3"></span>
                </i>
                <div class="text-muted fw-semibold fs-6">No skills registered yet.</div>
                <div class="text-muted fs-7 mt-2">Add skills to your profile to get better project matches</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--end::Skills Overview-->
    </div>
    <!--end::Details Cards-->

    <!--begin::Detailed Skills Section-->
    <div v-if="employee" class="card mb-5 mb-xl-10">
      <div class="card-header">
        <div class="card-title">
          <i class="ki-duotone ki-technology-4 fs-2 me-2 text-primary"></i>
          <h3 class="fw-bold m-0">Detailed Skills</h3>
        </div>
      </div>
      <div class="card-body">
        <!-- Hard Skills Table -->
        <div v-if="employee.hardSkills && employee.hardSkills.length" class="mb-8">
          <h4 class="fw-bold mb-4">
            <i class="ki-duotone ki-cpu fs-3 me-2 text-primary"></i>
            Technical Skills
          </h4>
          <div class="table-responsive">
            <table class="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
              <thead>
                <tr class="fw-bold text-muted bg-light-primary">
                  <th class="min-w-150px ps-4">Skill Name</th>
                  <th class="min-w-100px">Proficiency Level</th>
                  <th class="min-w-150px">Certification</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(skill, i) in employee.hardSkills" :key="'hard-' + i">
                  <td class="ps-4">
                    <div class="d-flex align-items-center">
                      <div class="fw-bold text-dark">{{ skill.name }}</div>
                    </div>
                  </td>
                  <td>
                    <div class="d-flex align-items-center">
                      <div class="progress h-6px w-100px me-3">
                        <div class="progress-bar bg-primary" :style="{ width: (skill.proficiencyLevel / 5) * 100 + '%' }"></div>
                      </div>
                      <span class="badge badge-light-primary">Level {{ skill.proficiencyLevel }}</span>
                    </div>
                  </td>
                  <td>
                    <span class="text-muted">{{ skill.certification || 'No certification' }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Soft Skills Table -->
        <div v-if="employee.softSkills && employee.softSkills.length">
          <h4 class="fw-bold mb-4">
            <i class="ki-duotone ki-users fs-3 me-2 text-success"></i>
            Soft Skills
          </h4>
          <div class="table-responsive">
            <table class="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
              <thead>
                <tr class="fw-bold text-muted bg-light-success">
                  <th class="min-w-150px ps-4">Skill Name</th>
                  <th class="min-w-100px">Proficiency Level</th>
                  <th class="min-w-150px">Certification</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(skill, i) in employee.softSkills" :key="'soft-' + i">
                  <td class="ps-4">
                    <div class="d-flex align-items-center">
                      <div class="fw-bold text-dark">{{ skill.name }}</div>
                    </div>
                  </td>
                  <td>
                    <div class="d-flex align-items-center">
                      <div class="progress h-6px w-100px me-3">
                        <div class="progress-bar bg-success" :style="{ width: (skill.proficiencyLevel / 5) * 100 + '%' }"></div>
                      </div>
                      <span class="badge badge-light-success">Level {{ skill.proficiencyLevel }}</span>
                    </div>
                  </td>
                  <td>
                    <span class="text-muted">{{ skill.certification || 'No certification' }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <!--end::Detailed Skills Section-->

    <!--begin::Work Experience Section-->
    <div v-if="employee" class="card mb-5 mb-xl-10">
      <div class="card-header">
        <div class="card-title">
          <i class="ki-duotone ki-briefcase fs-2 me-2 text-primary"></i>
          <h3 class="fw-bold m-0">Work Experience</h3>
        </div>
      </div>
      <div class="card-body">
        <div v-if="employee.experiences && employee.experiences.length">
          <div class="experience-timeline">
            <div v-for="(exp, i) in employee.experiences" :key="'exp-' + i" class="experience-item">
              <div class="experience-badge">
                <i class="ki-duotone ki-briefcase fs-2 text-white"></i>
              </div>
              <div class="experience-content">
                <div class="d-flex justify-content-between align-items-start mb-3">
                  <h5 class="fw-bold text-dark mb-1">{{ exp.jobTitle }}</h5>
                  <span class="badge badge-light-primary">{{ exp.companyName }}</span>
                </div>
                <div class="text-muted fs-7 mb-3">
                  <i class="ki-duotone ki-calendar fs-5 me-1"></i>
                  {{ exp.startDate ? (new Date(exp.startDate)).toLocaleDateString() : 'N/A' }} - 
                  {{ exp.endDate ? (new Date(exp.endDate)).toLocaleDateString() : 'Present' }}
                </div>
                <p class="text-muted mb-3">{{ exp.description || 'No description available' }}</p>
                <div v-if="exp.technologiesUsed && exp.technologiesUsed.length" class="d-flex flex-wrap gap-1">
                  <span v-for="tech in exp.technologiesUsed.slice(0, 5)" :key="tech" class="badge badge-light-info fs-7">
                    {{ tech }}
                  </span>
                  <span v-if="exp.technologiesUsed.length > 5" class="badge badge-light-secondary fs-7">
                    +{{ exp.technologiesUsed.length - 5 }} more
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="text-center py-10">
            <i class="ki-duotone ki-briefcase fs-3x text-muted mb-4">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            <div class="text-muted fw-semibold fs-6">No work experience registered yet.</div>
            <div class="text-muted fs-7 mt-2">Add your work experience to showcase your professional background</div>
          </div>
        </div>
      </div>
    </div>
    <!--end::Work Experience Section-->

    <!--begin::Dashboard Widgets-->
    <div class="row gy-10 gx-xl-10">
      <div class="col-xl-6">
        <KTChartWidget1
          widget-classes="card-xxl-stretch mb-5 mb-xl-10"
        ></KTChartWidget1>
      </div>
      <div class="col-xl-6">
        <KTListWidget1
          widget-classes="card-xxl-stretch mb-5 mb-xl-10"
        ></KTListWidget1>
      </div>
    </div>

    <div class="row gy-10 gx-xl-10">
      <div class="col-xl-6">
        <KTListWidget5
          widget-classes="card-xxl-stretch mb-5 mb-xl-10"
        ></KTListWidget5>
      </div>
      <div class="col-xl-6">
        <KTTableWidget5
          widget-classes="card-xxl-stretch mb-5 mb-xl-10"
        ></KTTableWidget5>
      </div>
    </div>
    <!--end::Dashboard Widgets-->
  </div>
  <!--end::Overview Content-->
</template>

<script lang="ts">
import { defineComponent, computed, ref, inject, onMounted, onUnmounted } from "vue";
import { getAssetPath } from "@/core/helpers/assets";
import KTChartWidget1 from "@/components/widgets/charts/Widget1.vue";
import KTListWidget1 from "@/components/widgets/lists/Widget1.vue";
import KTListWidget5 from "@/components/widgets/lists/Widget5.vue";
import KTTableWidget5 from "@/components/widgets/tables/Widget5.vue";
import Dropdown3 from "@/components/dropdown/Dropdown3.vue";
import { useRoute } from "vue-router";
import { useCurrentUser } from "@/core/composables/useCurrentUser";
import type { Employee } from "@/core/models/Employee";

export default defineComponent({
  name: "employee-overview",
  components: {
    Dropdown3,
    KTChartWidget1,
    KTListWidget1,
    KTListWidget5,
    KTTableWidget5,
  },
  setup() {
    const route = useRoute();
    const employee = inject<any>('employee');
    const refreshEmployee = inject<any>('refreshEmployee');
    
    // Determina se siamo in modalità employee view o account view
    const isEmployeeView = computed(() => !!route.params.id);
    
    // Get current user for account mode
    const { currentUser } = useCurrentUser();
    
    // Unified user data - use employee in employee mode, currentUser in account mode
    const userData = computed(() => {
      if (isEmployeeView.value) {
        return employee.value;
      } else {
        return currentUser.value;
      }
    });

    // Edit Profile URL based on mode
    const editProfileUrl = computed(() => {
      return isEmployeeView.value 
        ? `/employees/${userData.value?.id}/settings`
        : '/crafted/account/settings';
    });

    // Helper function to get initials
    const getInitials = (firstName?: string, lastName?: string) => {
      const first = firstName?.charAt(0) || '';
      const last = lastName?.charAt(0) || '';
      return (first + last).toUpperCase() || 'U';
    };

    return {
      getAssetPath,
      employee: userData, // Unified reference
      editProfileUrl,
      getInitials,
    };
  },
});
</script>

<style scoped>
.experience-timeline {
  position: relative;
  padding-left: 30px;
}

.experience-item {
  position: relative;
  margin-bottom: 30px;
}

.experience-badge {
  position: absolute;
  left: -45px;
  top: 0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--kt-primary);
  z-index: 2;
}

.experience-content {
  background: var(--kt-card-bg);
  border: 1px solid var(--kt-border-color);
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid var(--kt-primary);
  position: relative;
}

.experience-item:not(:last-child)::after {
  content: '';
  position: absolute;
  left: -30px;
  top: 30px;
  width: 2px;
  height: calc(100% + 30px);
  background: var(--kt-border-color);
  z-index: 1;
}

/* Dark theme adjustments */
[data-theme="dark"] .experience-content {
  background: var(--kt-dark-card-bg);
  border-color: var(--kt-dark-border-color);
}

[data-theme="dark"] .experience-item:not(:last-child)::after {
  background: var(--kt-dark-border-color);
}
</style>
