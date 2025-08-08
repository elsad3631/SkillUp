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
    <!--begin::Project Header Card-->
    <div class="card mb-5 mb-xl-10">
      <div class="card-body p-0">
        <!--begin::Project Header-->
        <div class="d-flex flex-column flex-md-row align-items-center p-8">
          <!--begin::Project Icon-->
          <div class="symbol symbol-100px symbol-circle mb-5 mb-md-0 me-md-8">
            <div class="symbol-label bg-light-primary">
              <i class="ki-duotone ki-briefcase fs-2x text-primary">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </div>
          </div>
          <!--end::Project Icon-->

          <!--begin::Project Info-->
          <div class="flex-grow-1 text-center text-md-start">
            <h2 class="fw-bold fs-1 text-dark mb-2">
              {{ project?.name || 'Project Name' }}
            </h2>
            <div class="d-flex flex-column flex-md-row align-items-center gap-3 mb-3">
              <span :class="getStatusBadgeClass(project?.status)" class="badge fw-bold fs-7">
                {{ project?.status || 'Status not set' }}
              </span>
              <span :class="getPriorityBadgeClass(project?.priority)" class="badge fw-bold fs-7">
                {{ project?.priority || 'Priority not set' }}
              </span>
              <span v-if="project?.budget" class="badge badge-light-info fw-bold fs-7">
                Budget: ${{ project.budget.toLocaleString() }}
              </span>
            </div>
            <p class="text-muted fs-6 mb-3" v-if="project?.description">
              {{ project.description }}
            </p>
            <div class="d-flex flex-column flex-md-row align-items-center gap-4 text-muted">
              <div class="d-flex align-items-center" v-if="project?.startDate">
                <i class="ki-duotone ki-calendar fs-5 me-2"></i>
                <span>Started: {{ formatDate(project.startDate) }}</span>
              </div>
              <div class="d-flex align-items-center" v-if="project?.endDate">
                <i class="ki-duotone ki-calendar fs-5 me-2"></i>
                <span>Ends: {{ formatDate(project.endDate) }}</span>
              </div>
              <div class="d-flex align-items-center" v-if="project?.managerId">
                <i class="ki-duotone ki-user fs-5 me-2"></i>
                <span>Manager: {{ project.managerId }}</span>
              </div>
            </div>
          </div>
          <!--end::Project Info-->

          <!--begin::Actions-->
          <div class="mt-5 mt-md-0 d-flex flex-column gap-2">
            <router-link
              v-if="project && project.id"
              :to="`/projects/${project.id}/documents`"
              class="btn btn-light btn-lg"
              >
              <i class="ki-duotone ki-folder fs-5 me-2"></i>
              Documents
            </router-link>
            <router-link
              v-if="project && project.id"
              :to="`/projects/${project.id}/settings`"
              class="btn btn-primary btn-lg"
              >
              <i class="ki-duotone ki-pencil fs-5 me-2"></i>
              Edit Project
            </router-link>
          </div>
          <!--end::Actions-->
        </div>
        <!--end::Project Header-->
      </div>
    </div>
    <!--end::Project Header Card-->

    <!--begin::Project Details Cards-->
    <div class="row g-5 g-xl-10 mb-5 mb-xl-10">
      <!--begin::Project Information-->
      <div class="col-xl-6">
        <div class="card h-100">
          <div class="card-header">
            <div class="card-title">
              <i class="ki-duotone ki-information-5 fs-2 me-2 text-primary"></i>
              <h3 class="fw-bold m-0">Project Information</h3>
            </div>
          </div>
          <div class="card-body">
            <div class="d-flex flex-column gap-4">
              <div class="d-flex align-items-center p-4 bg-light-primary rounded">
                <i class="ki-duotone ki-document fs-2 me-3 text-primary"></i>
                <div>
                  <div class="text-muted fs-7 fw-semibold">Description</div>
                  <div class="fw-bold fs-6">{{ project?.description || 'No description provided' }}</div>
                </div>
              </div>

              <div class="d-flex align-items-center p-4 bg-light-info rounded" v-if="project?.budget">
                <i class="ki-duotone ki-dollar fs-2 me-3 text-info"></i>
                <div>
                  <div class="text-muted fs-7 fw-semibold">Budget</div>
                  <div class="fw-bold fs-6">${{ project.budget.toLocaleString() }}</div>
                </div>
              </div>

              <div class="d-flex align-items-center p-4 bg-light-success rounded" v-if="project?.startDate">
                <i class="ki-duotone ki-calendar fs-2 me-3 text-success"></i>
                <div>
                  <div class="text-muted fs-7 fw-semibold">Start Date</div>
                  <div class="fw-bold fs-6">{{ formatDate(project.startDate) }}</div>
                </div>
              </div>

              <div class="d-flex align-items-center p-4 bg-light-warning rounded" v-if="project?.endDate">
                <i class="ki-duotone ki-calendar fs-2 me-3 text-warning"></i>
                <div>
                  <div class="text-muted fs-7 fw-semibold">End Date</div>
                  <div class="fw-bold fs-6">{{ formatDate(project.endDate) }}</div>
                </div>
              </div>

              <div class="d-flex align-items-center p-4 bg-light-danger rounded" v-if="project?.managerId">
                <i class="ki-duotone ki-user fs-2 me-3 text-danger"></i>
                <div>
                  <div class="text-muted fs-7 fw-semibold">Project Manager</div>
                  <div class="fw-bold fs-6">{{ project.managerId }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--end::Project Information-->

      <!--begin::Team Overview-->
      <div class="col-xl-6">
        <div class="card h-100">
          <div class="card-header">
            <div class="card-title">
              <i class="ki-duotone ki-users fs-2 me-2 text-primary"></i>
              <h3 class="fw-bold m-0">Team Overview</h3>
            </div>
          </div>
          <div class="card-body">
            <div class="d-flex flex-column gap-4">
              <!-- Team Members Summary -->
              <div v-if="project?.assignments && project.assignments.length" class="p-4 bg-light-primary rounded">
                <div class="d-flex align-items-center mb-3">
                  <i class="ki-duotone ki-users fs-2 me-2 text-primary"></i>
                  <h5 class="fw-bold m-0">Team Members</h5>
                  <span class="badge badge-primary ms-auto">{{ project.assignments.length }}</span>
                </div>
                <div class="d-flex flex-wrap gap-2">
                  <span v-for="assignment in project.assignments.slice(0, 5)" :key="assignment.applicationUserId" 
                        class="badge badge-light-primary fs-7">
                    {{ assignment.applicationUserId }} ({{ assignment.roleOnProject }})
                  </span>
                  <span v-if="project.assignments.length > 5" class="badge badge-light-secondary fs-7">
                    +{{ project.assignments.length - 5 }} more
                  </span>
                </div>
              </div>

              <!-- Required Skills Summary -->
              <div v-if="project?.requiredHardSkills && project.requiredHardSkills.length" class="p-4 bg-light-success rounded">
                <div class="d-flex align-items-center mb-3">
                  <i class="ki-duotone ki-cpu fs-2 me-2 text-success"></i>
                  <h5 class="fw-bold m-0">Required Technical Skills</h5>
                  <span class="badge badge-success ms-auto">{{ project.requiredHardSkills.length }}</span>
                </div>
                <div class="d-flex flex-wrap gap-2">
                  <span v-for="skill in project.requiredHardSkills.slice(0, 5)" :key="skill.name" 
                        class="badge badge-light-success fs-7">
                    {{ skill.name }}
                  </span>
                  <span v-if="project.requiredHardSkills.length > 5" class="badge badge-light-secondary fs-7">
                    +{{ project.requiredHardSkills.length - 5 }} more
                  </span>
                </div>
              </div>

              <!-- No Team Message -->
              <div v-if="(!project?.assignments || !project.assignments.length) && 
                         (!project?.requiredHardSkills || !project.requiredHardSkills.length)" 
                   class="text-center py-8">
                <i class="ki-duotone ki-users fs-3x text-muted mb-4">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
                <div class="text-muted fw-semibold fs-6">No team members assigned yet.</div>
                <div class="text-muted fs-7 mt-2">Assign team members and define required skills</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--end::Team Overview-->
    </div>
    <!--end::Project Details Cards-->

    <!--begin::Required Skills Section-->
    <div v-if="project" class="card mb-5 mb-xl-10">
      <div class="card-header">
        <div class="card-title">
          <i class="ki-duotone ki-technology-4 fs-2 me-2 text-primary"></i>
          <h3 class="fw-bold m-0">Required Skills</h3>
        </div>
      </div>
      <div class="card-body">
        <!-- Technical Skills Table -->
        <div v-if="project.requiredHardSkills && project.requiredHardSkills.length" class="mb-8">
          <h4 class="fw-bold mb-4">
            <i class="ki-duotone ki-cpu fs-3 me-2 text-primary"></i>
            Technical Skills
          </h4>
          <div class="table-responsive">
            <table class="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
              <thead>
                <tr class="fw-bold text-muted bg-light-primary">
                  <th class="min-w-150px ps-4">Skill Name</th>
                  <th class="min-w-100px">Min Level</th>
                  <th class="min-w-120px">Certification</th>
                  <th class="min-w-100px">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(skill, i) in project.requiredHardSkills" :key="'hard-' + i">
                  <td class="ps-4">
                    <div class="d-flex align-items-center">
                      <div class="fw-bold text-dark">{{ skill.name }}</div>
                    </div>
                  </td>
                  <td>
                    <div class="d-flex align-items-center">
                      <div class="progress h-6px w-100px me-3">
                        <div class="progress-bar bg-primary" :style="{ width: (skill.minProficiencyLevel / 5) * 100 + '%' }"></div>
                      </div>
                      <span class="fw-bold text-muted">Level {{ skill.minProficiencyLevel || 'Not specified' }}</span>
                    </div>
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
        
        <!-- Soft Skills Table -->
        <div v-if="project.requiredSoftSkills && project.requiredSoftSkills.length">
          <h4 class="fw-bold mb-4">
            <i class="ki-duotone ki-users fs-3 me-2 text-success"></i>
            Soft Skills
          </h4>
          <div class="table-responsive">
            <table class="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
              <thead>
                <tr class="fw-bold text-muted bg-light-success">
                  <th class="min-w-150px ps-4">Skill Name</th>
                  <th class="min-w-100px">Level</th>
                  <th class="min-w-120px">Certification</th>
                  <th class="min-w-100px">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(skill, i) in project.requiredSoftSkills" :key="'soft-' + i">
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
                      <span class="fw-bold text-muted">Level {{ skill.proficiencyLevel || 'Not specified' }}</span>
                    </div>
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
            <div class="text-muted fs-7 mt-2">Define required skills to help match the right team members</div>
          </div>
        </div>
      </div>
    </div>
    <!--end::Required Skills Section-->

    <!--begin::Team Assignments Section-->
    <div v-if="project" class="card mb-5 mb-xl-10">
      <div class="card-header">
        <div class="card-title">
          <i class="ki-duotone ki-users fs-2 me-2 text-primary"></i>
          <h3 class="fw-bold m-0">Team Assignments</h3>
        </div>
      </div>
      <div class="card-body">
        <div v-if="project.assignments && project.assignments.length">
          <div class="assignment-timeline">
            <div v-for="(assignment, i) in project.assignments" :key="'assignment-' + i" class="assignment-item">
              <div class="assignment-badge">
                <i class="ki-duotone ki-user fs-2 text-white"></i>
              </div>
              <div class="assignment-content">
                <div class="d-flex justify-content-between align-items-start mb-3">
                  <h5 class="fw-bold text-dark mb-1">{{ assignment.applicationUserId }}</h5>
                  <span class="badge badge-light-primary">{{ assignment.roleOnProject }}</span>
                </div>
                <div class="d-flex flex-wrap gap-3 mb-3">
                  <div class="d-flex align-items-center text-muted fs-7">
                    <i class="ki-duotone ki-calendar fs-5 me-1"></i>
                    <span>{{ formatDate(assignment.assignmentStartDate) }} - {{ assignment.assignmentEndDate ? formatDate(assignment.assignmentEndDate) : 'Ongoing' }}</span>
                  </div>
                  <div class="d-flex align-items-center text-muted fs-7">
                    <i class="ki-duotone ki-chart-simple fs-5 me-1"></i>
                    <span>{{ assignment.allocationPercentage }}% allocation</span>
                  </div>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                  <span :class="getAssignmentStatusBadgeClass(assignment.status)" class="badge">
                    {{ assignment.status }}
                  </span>
                  <div v-if="assignment.feedbackReceived" class="text-muted fs-7" style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" :title="assignment.feedbackReceived">
                    <i class="ki-duotone ki-message-text-2 fs-5 me-1"></i>
                    {{ assignment.feedbackReceived }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="text-center py-10">
            <i class="ki-duotone ki-users fs-3x text-muted mb-4">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            <div class="text-muted fw-semibold fs-6">No team members assigned yet.</div>
            <div class="text-muted fs-7 mt-2">Assign team members to start working on this project</div>
          </div>
        </div>
      </div>
    </div>
    <!--end::Team Assignments Section-->


    <!--begin::Comments Section-->
    <div class="row g-5 g-xl-10 mb-5 mb-xl-10">
      <div class="col-12">
        <CommentSection 
          v-if="project"
          entity-type="PROJECT"
          :entity-id="project.id"
          @comment-added="onCommentAdded"
          @comment-updated="onCommentUpdated"
          @comment-deleted="onCommentDeleted"
        />
      </div>
    </div>
    <!--end::Comments Section-->
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
import KTIcon from "@/core/helpers/kt-icon/KTIcon.vue";
import CommentSection from "@/components/comment/CommentSection.vue";

export default defineComponent({
  name: "project-overview",
  components: {
    Dropdown3,
    KTChartWidget1,
    KTListWidget1,
    KTListWidget5,
    KTTableWidget5,
    KTIcon,
    CommentSection,
  },
  setup() {
    const project = inject<any>('project');
    const refreshProject = inject<any>('refreshProject');

    const formatDate = (date: Date | string | undefined) => {
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString();
    };

    const getStatusBadgeClass = (status: string) => {
      switch (status?.toUpperCase()) {
        case 'PLANNING': return 'badge-light-info';
        case 'IN_PROGRESS': return 'badge-light-primary';
        case 'ON_HOLD': return 'badge-light-warning';
        case 'COMPLETED': return 'badge-light-success';
        case 'CANCELLED': return 'badge-light-danger';
        // Backwards compatibility
        case 'ACTIVE': return 'badge-light-success';
        case 'COMPLETED': return 'badge-light-success';
        case 'ON HOLD': return 'badge-light-warning';
        case 'CANCELLED': return 'badge-light-danger';
        default: return 'badge-light-secondary';
      }
    };

    const getPriorityBadgeClass = (priority: string) => {
      switch (priority?.toUpperCase()) {
        case 'CRITICAL': return 'badge-light-danger';
        case 'HIGH': return 'badge-light-warning';
        case 'MEDIUM': return 'badge-light-primary';
        case 'LOW': return 'badge-light-success';
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

    const onCommentAdded = (comment: any) => {
      console.log('Comment added:', comment);
    };

    const onCommentUpdated = (comment: any) => {
      console.log('Comment updated:', comment);
    };

    const onCommentDeleted = (commentId: string) => {
      console.log('Comment deleted:', commentId);
    };

    return {
      project,
      formatDate,
      getStatusBadgeClass,
      getPriorityBadgeClass,
      getAssignmentStatusBadgeClass,
      onCommentAdded,
      onCommentUpdated,
      onCommentDeleted,
    };
  },
});
</script>

<style scoped>
.assignment-timeline {
  position: relative;
  padding-left: 30px;
}

.assignment-item {
  position: relative;
  margin-bottom: 30px;
}

.assignment-badge {
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

.assignment-content {
  background: var(--kt-card-bg);
  border: 1px solid var(--kt-border-color);
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid var(--kt-primary);
  position: relative;
}

.assignment-item:not(:last-child)::after {
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
[data-theme="dark"] .assignment-content {
  background: var(--kt-dark-card-bg);
  border-color: var(--kt-dark-border-color);
}

[data-theme="dark"] .assignment-item:not(:last-child)::after {
  background: var(--kt-dark-border-color);
}
</style>
