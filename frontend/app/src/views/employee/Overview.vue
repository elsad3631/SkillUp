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
          :to="`/employees/${employee.id}/settings`"
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
                      <h4>Hard Skills</h4>
                      <ul>
                        <li v-for="(skill, i) in employee.hardSkills" :key="'hard-' + i">
                          {{ skill.name }} ({{ skill.proficiencyLevel }}) <span v-if="skill.certification">- {{ skill.certification }}</span>
                        </li>
                      </ul>
                    </div>
                    <div v-if="employee.softSkills && employee.softSkills.length">
                      <h4>Soft Skills</h4>
                      <ul>
                        <li v-for="(skill, i) in employee.softSkills" :key="'soft-' + i">
                          {{ skill.name }} ({{ skill.proficiencyLevel }}) <span v-if="skill.certification">- {{ skill.certification }}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="card mb-6">
                  <div class="card-header">
                    <h3 class="card-title">Work Experience</h3>
                  </div>
                  <div class="card-body">
                    <div v-if="employee.experiences && employee.experiences.length">
                      <div v-for="(exp, i) in employee.experiences" :key="'exp-' + i" class="mb-4 p-4 border rounded">
                        <div><strong>{{ exp.jobTitle }}</strong> @ <strong>{{ exp.companyName }}</strong></div>
                        <div>{{ exp.startDate ? (new Date(exp.startDate)).toLocaleDateString() : '' }} - {{ exp.endDate ? (new Date(exp.endDate)).toLocaleDateString() : '' }}</div>
                        <div>{{ exp.description }}</div>
                        <div v-if="exp.technologiesUsed && exp.technologiesUsed.length">Tech: {{ exp.technologiesUsed.join(', ') }}</div>
                      </div>
                    </div>
                    <div v-else>
                      <em>No experience data.</em>
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
    const employee = inject<any>('employee');
    const refreshEmployee = inject<any>('refreshEmployee');

    return {
      getAssetPath,
      employee,
    };
  },
});
</script>
