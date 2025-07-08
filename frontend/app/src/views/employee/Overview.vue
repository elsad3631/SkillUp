<template>
  <!--begin::details View-->
  <div class="card mb-5 mb-xl-10" id="kt_profile_details_view">
    <!--begin::Card header-->
    <div class="card-header cursor-pointer">
      <!--begin::Card title-->
      <div class="card-title m-0">
        <h3 class="fw-bold m-0">Profile Details</h3>
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
    <div class="card-body p-9">
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

      <div
        class="notice d-flex bg-light-warning rounded border-warning border border-dashed p-6"
      >
        <KTIcon
          icon-name="information-5"
          icon-class="fs-2tx text-warning me-4"
        />
        <!--begin::Wrapper-->
        <div class="d-flex flex-stack flex-grow-1">
          <!--begin::Content-->
          <div class="fw-semobold">
            <h4 class="text-gray-800 fw-bold">We need your attention!</h4>

            <div class="fs-6 text-gray-600">
              Your payment was declined. To start using tools, please
              <a class="fw-bold" href="#">Add Payment Method</a>.
            </div>
          </div>
          <!--end::Content-->
        </div>
        <!--end::Wrapper-->
      </div>
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

  <!-- Sotto la sezione dettagli, aggiungi skills ed experience se non presenti -->
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
            <div>{{ exp.startDate }} - {{ exp.endDate }}</div>
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
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, inject } from "vue";
import KTChartWidget1 from "@/components/widgets/charts/Widget1.vue";
import KTListWidget5 from "@/components/widgets/lists/Widget5.vue";
import KTTableWidget5 from "@/components/widgets/tables/Widget5.vue";
import KTListWidget1 from "@/components/widgets/lists/Widget1.vue";

export default defineComponent({
  name: "account-overview",
  components: {
    KTChartWidget1,
    KTListWidget5,
    KTTableWidget5,
    KTListWidget1,
  },
  setup() {
    const employee = inject<any>('employee');
    return {
      getAssetPath,
      employee,
    };
  },
});
</script>
