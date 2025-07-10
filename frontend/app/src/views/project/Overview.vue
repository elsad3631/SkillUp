<template>
  <!--begin::Loading State for Overview-->
  <div v-if="!project" class="d-flex justify-content-center align-items-center" style="min-height: 300px;">
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
            <h3 class="fw-bold m-0">Project Details</h3>
            <div class="text-muted fs-7" v-if="project?.name">
              {{ project?.name }}
            </div>
          </div>
          <!--end::Title-->
        </div>
        <!--end::Card title-->

        <!--begin::Action-->
        <router-link
          v-if="project && project.id"
          :to="`/projects/${project.id}/settings`"
          class="btn btn-primary align-self-center"
          >Edit Project</router-link>
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
                <label class="col-lg-4 fw-semobold text-muted">Project Name</label>
                <!--end::Label-->

                <!--begin::Col-->
                <div class="col-lg-8">
                  <span class="fw-bold fs-6 text-dark">{{ project?.name || '' }}</span>
                </div>
                <!--end::Col-->
              </div>
              <!--end::Row-->

              <div class="row mb-7">
                <label class="col-lg-4 fw-semobold text-muted">Description</label>
                <div class="col-lg-8">
                  <span class="fw-bold fs-6 text-dark">{{ project?.description || 'No description provided' }}</span>
                </div>
              </div>

              <div class="row mb-7">
                <label class="col-lg-4 fw-semobold text-muted">Status</label>
                <div class="col-lg-8">
                  <span :class="getStatusBadgeClass(project?.status)" class="badge fw-bold">
                    {{ project?.status || '' }}
                  </span>
                </div>
              </div>

              <div class="row mb-7">
                <label class="col-lg-4 fw-semobold text-muted">Priority</label>
                <div class="col-lg-8">
                  <span :class="getPriorityBadgeClass(project?.priority)" class="badge fw-bold">
                    {{ project?.priority || 'Not set' }}
                  </span>
                </div>
              </div>

              <div class="row mb-7">
                <label class="col-lg-4 fw-semobold text-muted">Budget</label>
                <div class="col-lg-8">
                  <span class="fw-bold fs-6 text-dark">
                    {{ project?.budget ? `$${project.budget.toLocaleString()}` : 'Not specified' }}
                  </span>
                </div>
              </div>

              <div class="row mb-7">
                <label class="col-lg-4 fw-semobold text-muted">Start Date</label>
                <div class="col-lg-8">
                  <span class="fw-bold fs-6 text-dark">{{ project?.startDate ? formatDate(project.startDate) : 'Not set' }}</span>
                </div>
              </div>

              <div class="row mb-7">
                <label class="col-lg-4 fw-semobold text-muted">End Date</label>
                <div class="col-lg-8">
                  <span class="fw-bold fs-6 text-dark">{{ project?.endDate ? formatDate(project.endDate) : 'Not set' }}</span>
                </div>
              </div>

              <div class="row mb-7">
                <label class="col-lg-4 fw-semobold text-muted">Manager ID</label>
                <div class="col-lg-8">
                  <span class="fw-bold fs-6 text-dark">{{ project?.managerId || 'Not assigned' }}</span>
                </div>
              </div>

                              <!-- Required Skills -->
                <div v-if="project">
                  <div class="card mb-6">
                    <div class="card-header">
                      <h3 class="card-title">Required Skills</h3>
                    </div>
                    <div class="card-body">
                      <div v-if="project.requiredHardSkills && project.requiredHardSkills.length">
                        <h4 class="mb-4">Technical Skills</h4>
                        <div class="table-responsive">
                          <table class="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
                            <thead>
                              <tr class="fw-bold text-muted">
                                <th class="min-w-150px">Skill Name</th>
                                <th class="min-w-100px">Min Level</th>
                                <th class="min-w-120px">Certification</th>
                                <th class="min-w-100px">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="(skill, i) in project.requiredHardSkills" :key="'hard-' + i">
                                <td>
                                  <div class="d-flex align-items-center">
                                    <div class="fw-bold text-dark">{{ skill.name }}</div>
                                  </div>
                                </td>
                                <td>
                                  <span class="fw-bold text-muted">{{ skill.minProficiencyLevel || 'Not specified' }}</span>
                                </td>
                                <td>
                                  <span class="text-muted">{{ skill.certification || 'No certification' }}</span>
                                </td>
                                <td>
                                  <span v-if="skill.isMandatory" class="badge badge-light-danger">Mandatory</span>
                                  <span v-else class="badge badge-light-success">Optional</span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      
                      <div v-if="project.requiredSoftSkills && project.requiredSoftSkills.length" class="mt-6">
                        <h4 class="mb-4">Soft Skills</h4>
                        <div class="table-responsive">
                          <table class="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
                            <thead>
                              <tr class="fw-bold text-muted">
                                <th class="min-w-150px">Skill Name</th>
                                <th class="min-w-100px">Level</th>
                                <th class="min-w-120px">Certification</th>
                                <th class="min-w-100px">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="(skill, i) in project.requiredSoftSkills" :key="'soft-' + i">
                                <td>
                                  <div class="d-flex align-items-center">
                                    <div class="fw-bold text-dark">{{ skill.name }}</div>
                                  </div>
                                </td>
                                <td>
                                  <span class="fw-bold text-muted">{{ skill.proficiencyLevel || 'Not specified' }}</span>
                                </td>
                                <td>
                                  <span class="text-muted">{{ skill.certification || 'No certification' }}</span>
                                </td>
                                <td>
                                  <span v-if="skill.isMandatory" class="badge badge-light-danger">Mandatory</span>
                                  <span v-else class="badge badge-light-success">Optional</span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div v-if="(!project.requiredHardSkills || !project.requiredHardSkills.length) && 
                                 (!project.requiredSoftSkills || !project.requiredSoftSkills.length)">
                        <div class="text-center py-10">
                          <i class="ki-duotone ki-information-5 fs-3x text-muted mb-4">
                            <span class="path1"></span>
                            <span class="path2"></span>
                            <span class="path3"></span>
                          </i>
                          <div class="text-muted fw-semibold fs-6">No required skills specified.</div>
                        </div>
                      </div>
                    </div>
                  </div>

                <!-- Team Assignments -->
                <div class="card mb-6">
                  <div class="card-header">
                    <h3 class="card-title">Team Assignments</h3>
                  </div>
                  <div class="card-body">
                    <div v-if="project.assignments && project.assignments.length">
                      <div class="table-responsive">
                        <table class="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
                          <thead>
                            <tr class="fw-bold text-muted">
                              <th class="min-w-120px">User ID</th>
                              <th class="min-w-120px">Role</th>
                              <th class="min-w-100px">Allocation</th>
                              <th class="min-w-100px">Start Date</th>
                              <th class="min-w-100px">End Date</th>
                              <th class="min-w-100px">Status</th>
                              <th class="min-w-200px">Feedback</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(assignment, i) in project.assignments" :key="'assignment-' + i">
                              <td>
                                <div class="fw-bold text-dark">{{ assignment.applicationUserId }}</div>
                              </td>
                              <td>
                                <div class="fw-semibold text-muted">{{ assignment.roleOnProject }}</div>
                              </td>
                              <td>
                                <span class="badge badge-light-primary">{{ assignment.allocationPercentage }}%</span>
                              </td>
                              <td>
                                <div class="text-muted">{{ formatDate(assignment.assignmentStartDate) }}</div>
                              </td>
                              <td>
                                <div class="text-muted">{{ assignment.assignmentEndDate ? formatDate(assignment.assignmentEndDate) : 'Ongoing' }}</div>
                              </td>
                              <td>
                                <span :class="getAssignmentStatusBadgeClass(assignment.status)" class="badge">
                                  {{ assignment.status }}
                                </span>
                              </td>
                              <td>
                                <div class="text-muted" style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" :title="assignment.feedbackReceived">
                                  {{ assignment.feedbackReceived || 'No feedback' }}
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div v-else>
                      <div class="text-center py-10">
                        <i class="ki-duotone ki-users fs-3x text-muted mb-4">
                          <span class="path1"></span>
                          <span class="path2"></span>
                        </i>
                        <div class="text-muted fw-semibold fs-6">No team members assigned yet.</div>
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
import { defineComponent, inject } from "vue";
import KTChartWidget1 from "@/components/widgets/charts/Widget1.vue";
import KTListWidget1 from "@/components/widgets/lists/Widget1.vue";
import KTListWidget5 from "@/components/widgets/lists/Widget5.vue";
import KTTableWidget5 from "@/components/widgets/tables/Widget5.vue";
import Dropdown3 from "@/components/dropdown/Dropdown3.vue";

export default defineComponent({
  name: "project-overview",
  components: {
    Dropdown3,
    KTChartWidget1,
    KTListWidget1,
    KTListWidget5,
    KTTableWidget5,
  },
  setup() {
    const project = inject<any>('project');
    const refreshProject = inject<any>('refreshProject');

    const formatDate = (date: Date | string | undefined) => {
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString();
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

    const getPriorityBadgeClass = (priority: string) => {
      switch (priority?.toLowerCase()) {
        case 'high': return 'badge-light-danger';
        case 'medium': return 'badge-light-warning';
        case 'low': return 'badge-light-success';
        default: return 'badge-light-secondary';
      }
    };

    const getAssignmentStatusBadgeClass = (status: string) => {
      switch (status?.toLowerCase()) {
        case 'active': return 'badge-light-success';
        case 'completed': return 'badge-light-primary';
        case 'on hold': return 'badge-light-warning';
        case 'cancelled': return 'badge-light-danger';
        default: return 'badge-light-secondary';
      }
    };

    return {
      project,
      formatDate,
      getStatusBadgeClass,
      getPriorityBadgeClass,
      getAssignmentStatusBadgeClass,
    };
  },
});
</script>
