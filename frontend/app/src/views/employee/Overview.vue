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
    <!--begin::details View-->
    <div class="card mb-5 mb-xl-10" id="kt_profile_details_view">
      <!--begin::Card header-->
      <div class="card-header cursor-pointer">
        <!--begin::Card title-->
        <div class="d-flex align-items-center">          
          <!--begin::Title-->
          <div>
            <h3 class="fw-bold m-0">Profile Details</h3>
            <div class="text-muted fs-7" v-if="employee?.firstName || employee?.lastName">
              {{ (employee?.firstName || '') + ' ' + (employee?.lastName || '') }}
            </div>
          </div>
          <!--end::Title-->
        </div>
        <!--end::Card title-->

        <!--begin::Action-->
        <router-link
          v-if="employee && employee.id"
          :to="editProfileUrl"
          class="btn btn-primary align-self-center"
          >Edit Profile</router-link>
        <!--end::Action-->
      </div>
      <!--begin::Card header-->

      <!--begin::Card body-->
      <div class="card-body pt-9 pb-0">
          <!--begin::Details-->
          <div class="d-flex flex-wrap flex-sm-nowrap mb-3">
            <!--begin::Info-->
            <div class="flex-grow-1">
              <!--begin::Row-->
              <div class="row mb-7">
                <!--begin::Label-->
                <label class="col-lg-4 fw-semobold text-muted">Full Name</label>
                <!--end::Label-->

                <!--begin::Col-->
                <div class="col-lg-8">
                  <span class="fw-bold fs-6 text-dark">{{ (employee?.firstName || '') + ' ' + (employee?.lastName || '') }}</span>
                </div>
                <!--end::Col-->
              </div>
              <!--end::Row-->

              <div class="row mb-7">
                <label class="col-lg-4 fw-semobold text-muted">Email</label>
                <div class="col-lg-8">
                  <span class="fw-bold fs-6 text-dark">{{ employee?.email || '' }}</span>
                </div>
              </div>

              <div class="row mb-7">
                <label class="col-lg-4 fw-semobold text-muted">Phone</label>
                <div class="col-lg-8">
                  <span class="fw-bold fs-6 text-dark">{{ employee?.phone || '' }}</span>
                </div>
              </div>

              <div class="row mb-7">
                <label class="col-lg-4 fw-semobold text-muted">Date of Birth</label>
                <div class="col-lg-8">
                  <span class="fw-bold fs-6 text-dark">{{ employee?.dateOfBirth ? (new Date(employee.dateOfBirth)).toLocaleDateString() : '' }}</span>
                </div>
              </div>

              <div class="row mb-7">
                <label class="col-lg-4 fw-semobold text-muted">Place of Birth</label>
                <div class="col-lg-8">
                  <span class="fw-bold fs-6 text-dark">{{ employee?.placeOfBirth || '' }}</span>
                </div>
              </div>

              <div class="row mb-7">
                <label class="col-lg-4 fw-semobold text-muted">Address</label>
                <div class="col-lg-8">
                  <span class="fw-bold fs-6 text-dark">{{ employee?.address || '' }}</span>
                </div>
              </div>

              <div class="row mb-7">
                <label class="col-lg-4 fw-semobold text-muted">Current Role</label>
                <div class="col-lg-8">
                  <span class="fw-bold fs-6 text-dark">{{ employee?.currentRole || '' }}</span>
                </div>
              </div>

              <div class="row mb-7">
                <label class="col-lg-4 fw-semobold text-muted">Department</label>
                <div class="col-lg-8">
                  <span class="fw-bold fs-6 text-dark">{{ employee?.department || '' }}</span>
                </div>
              </div>

              <div class="row mb-7">
                <label class="col-lg-4 fw-semobold text-muted">Available</label>
                <div class="col-lg-8">
                  <span class="fw-bold fs-6 text-dark">{{ employee?.isAvailable ? 'Yes' : 'No' }}</span>
                </div>
              </div>

              <div class="row mb-7" v-if="employee?.cvData">
                <label class="col-lg-4 fw-semobold text-muted">CV File</label>
                <div class="col-lg-8">
                  <a v-if="employee.cvData.storageUrl" :href="employee.cvData.storageUrl" target="_blank">{{ employee.cvData.fileName }}</a>
                  <span v-else>{{ employee.cvData.fileName }}</span>
                </div>
              </div>

              <!-- Skills & Experience -->
              <div v-if="employee">
                <div class="card mb-6">
                  <div class="card-header">
                    <h3 class="card-title">Skills</h3>
                  </div>
                  <div class="card-body">
                    <div v-if="employee.hardSkills && employee.hardSkills.length">
                      <h4 class="mb-4">Hard Skills</h4>
                      <div class="table-responsive">
                        <table class="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
                          <thead>
                            <tr class="fw-bold text-muted">
                              <th class="min-w-150px">Skill Name</th>
                              <th class="min-w-100px">Proficiency Level</th>
                              <th class="min-w-150px">Certification</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(skill, i) in employee.hardSkills" :key="'hard-' + i">
                              <td>
                                <div class="d-flex align-items-center">
                                  <div class="fw-bold text-dark">{{ skill.name }}</div>
                                </div>
                              </td>
                              <td>
                                <span class="badge badge-light-info">Level {{ skill.proficiencyLevel }}</span>
                              </td>
                              <td>
                                <span class="text-muted">{{ skill.certification || 'No certification' }}</span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <div v-if="employee.softSkills && employee.softSkills.length" class="mt-6">
                      <h4 class="mb-4">Soft Skills</h4>
                      <div class="table-responsive">
                        <table class="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
                          <thead>
                            <tr class="fw-bold text-muted">
                              <th class="min-w-150px">Skill Name</th>
                              <th class="min-w-100px">Proficiency Level</th>
                              <th class="min-w-150px">Certification</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(skill, i) in employee.softSkills" :key="'soft-' + i">
                              <td>
                                <div class="d-flex align-items-center">
                                  <div class="fw-bold text-dark">{{ skill.name }}</div>
                                </div>
                              </td>
                              <td>
                                <span class="badge badge-light-success">Level {{ skill.proficiencyLevel }}</span>
                              </td>
                              <td>
                                <span class="text-muted">{{ skill.certification || 'No certification' }}</span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div v-if="(!employee.hardSkills || !employee.hardSkills.length) && 
                               (!employee.softSkills || !employee.softSkills.length)">
                      <div class="text-center py-10">
                        <i class="ki-duotone ki-technology-4 fs-3x text-muted mb-4">
                          <span class="path1"></span>
                          <span class="path2"></span>
                          <span class="path3"></span>
                        </i>
                        <div class="text-muted fw-semibold fs-6">No skills registered yet.</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="card mb-6">
                  <div class="card-header">
                    <h3 class="card-title">Work Experience</h3>
                  </div>
                  <div class="card-body">
                    <div v-if="employee.experiences && employee.experiences.length">
                      <div class="table-responsive">
                        <table class="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
                          <thead>
                            <tr class="fw-bold text-muted">
                              <th class="min-w-150px">Position</th>
                              <th class="min-w-150px">Company</th>
                              <th class="min-w-120px">Duration</th>
                              <th class="min-w-200px">Description</th>
                              <th class="min-w-150px">Technologies</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(exp, i) in employee.experiences" :key="'exp-' + i">
                              <td>
                                <div class="fw-bold text-dark">{{ exp.jobTitle }}</div>
                              </td>
                              <td>
                                <div class="fw-semibold text-muted">{{ exp.companyName }}</div>
                              </td>
                              <td>
                                <div class="text-muted">
                                  <div>{{ exp.startDate ? (new Date(exp.startDate)).toLocaleDateString() : 'N/A' }}</div>
                                  <div class="text-center">to</div>
                                  <div>{{ exp.endDate ? (new Date(exp.endDate)).toLocaleDateString() : 'Present' }}</div>
                                </div>
                              </td>
                              <td>
                                <div class="text-muted" style="max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" :title="exp.description">
                                  {{ exp.description || 'No description available' }}
                                </div>
                              </td>
                              <td>
                                <div v-if="exp.technologiesUsed && exp.technologiesUsed.length" class="d-flex flex-wrap gap-1">
                                  <span v-for="tech in exp.technologiesUsed.slice(0, 3)" :key="tech" class="badge badge-light-primary">
                                    {{ tech }}
                                  </span>
                                  <span v-if="exp.technologiesUsed.length > 3" class="badge badge-light-secondary">
                                    +{{ exp.technologiesUsed.length - 3 }} more
                                  </span>
                                </div>
                                <div v-else class="text-muted">No technologies specified</div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div v-else>
                      <div class="text-center py-10">
                        <i class="ki-duotone ki-briefcase fs-3x text-muted mb-4">
                          <span class="path1"></span>
                          <span class="path2"></span>
                        </i>
                        <div class="text-muted fw-semibold fs-6">No work experience registered yet.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!--end::Info-->
          </div>
          <!--end::Details-->
        </div>
        <!--end::Card body-->
      </div>
      <!--end::details View-->

    <!--begin::Row-->
    <div class="row gy-10 gx-xl-10">
      <!--begin::Col-->
      <div class="col-xl-6">
        <KTChartWidget1
          widget-classes="card-xxl-stretch mb-5 mb-xl-10"
        ></KTChartWidget1>
      </div>
      <!--end::Col-->

      <!--begin::Col-->
      <div class="col-xl-6">
        <KTListWidget1
          widget-classes="card-xxl-stretch mb-5 mb-xl-10'"
        ></KTListWidget1>
      </div>
      <!--end::Col-->
    </div>
    <!--end::Row-->

    <!--begin::Row-->
    <div class="row gy-10 gx-xl-10">
      <!--begin::Col-->
      <div class="col-xl-6">
        <KTListWidget5
          widget-classes="card-xxl-stretch mb-5 mb-xl-10"
        ></KTListWidget5>
      </div>
      <!--end::Col-->

      <!--begin::Col-->
      <div class="col-xl-6">
        <KTTableWidget5
          widget-classes="card-xxl-stretch mb-5 mb-xl-10"
        ></KTTableWidget5>
      </div>
      <!--end::Col-->
    </div>
    <!--end::Row-->
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

    return {
      getAssetPath,
      employee: userData, // Unified reference
      editProfileUrl,
    };
  },
});
</script>
