<template>
  <!--begin::Loading State for Settings-->
  <div v-if="!project" class="d-flex justify-content-center align-items-center" style="min-height: 300px;">
    <div class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="mt-3">
        <span class="fw-semobold text-gray-600">Loading project settings...</span>
      </div>
    </div>
  </div>
  <!--end::Loading State for Settings-->

  <!--begin::Settings Content-->
  <div v-else>
    <!--begin::Page Header-->
    <div class="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between mb-5">
      <div class="d-flex align-items-center">
        <KTIcon icon-name="setting-2" icon-class="fs-2x text-primary me-3" />
        <div>
          <h1 class="fw-bold mb-1">Project Settings</h1>
          <p class="text-muted mb-0">Manage your project details and requirements</p>
        </div>
      </div>
      <div class="d-flex align-items-center mt-3 mt-sm-0">
        <span class="badge badge-light-primary fs-7 me-2">
          <KTIcon icon-name="information-5" icon-class="fs-6 me-1" />
          Auto-save enabled
        </span>
      </div>
    </div>
    <!--end::Page Header-->

    <!--begin::Basic info-->
    <div class="card mb-5 mb-xl-10">
      <!--begin::Card header-->
      <div
        class="card-header border-0 cursor-pointer"
        role="button"
        data-bs-toggle="collapse"
        data-bs-target="#kt_account_project_details"
        aria-expanded="true"
        aria-controls="kt_account_project_details"
      >
        <!--begin::Card title-->
        <div class="card-title m-0">
          <div class="d-flex align-items-center">
            <KTIcon icon-name="document" icon-class="fs-2 text-primary me-3" />
            <h3 class="fw-bold m-0">Project Details</h3>
          </div>
        </div>
        <!--end::Card title-->
        
        <!--begin::Card toolbar-->
        <div class="card-toolbar">
          <span class="badge badge-light-info fs-7">
            <KTIcon icon-name="information-5" icon-class="fs-6 me-1" />
            Required fields marked with *
          </span>
        </div>
        <!--end::Card toolbar-->
      </div>
      <!--begin::Card header-->

      <!--begin::Content-->
      <div id="kt_account_project_details" class="collapse show">
        <!--begin::Form-->
        <form
          id="kt_account_project_details_form"
          class="form"
          @submit.prevent="saveChanges()"
        >
          <!--begin::Card body-->
          <div class="card-body border-top p-9">
            <!--begin::Input group-->
            <div class="row mb-6">
              <!--begin::Label-->
              <label class="col-lg-4 col-form-label required fw-semobold fs-6">
                <KTIcon icon-name="tag" icon-class="fs-6 me-2" />
                Project Name
              </label>
              <!--end::Label-->

              <!--begin::Col-->
              <div class="col-lg-8 fv-row">
                <input
                  type="text"
                  name="name"
                  class="form-control form-control-lg form-control-solid mb-3 mb-lg-0"
                  placeholder="Enter project name"
                  v-model="projectDetails.name"
                  :class="{ 'is-invalid': !projectDetails.name }"
                />
                <div class="invalid-feedback" v-if="!projectDetails.name">
                  Project name is required
                </div>
                <div class="form-text">
                  <KTIcon icon-name="information-5" icon-class="fs-6 me-1" />
                  Choose a descriptive name that clearly identifies your project
                </div>
              </div>
            </div>
            <!--end::Input group-->

            <!--begin::Input group-->
            <div class="row mb-6">
              <!--begin::Label-->
              <label class="col-lg-4 col-form-label fw-semobold fs-6">
                <KTIcon icon-name="document-text" icon-class="fs-6 me-2" />
                Description
              </label>
              <!--end::Label-->

              <!--begin::Col-->
              <div class="col-lg-8 fv-row">
                <textarea
                  name="description"
                  class="form-control form-control-lg form-control-solid"
                  placeholder="Describe your project goals, objectives, and key deliverables"
                  rows="4"
                  v-model="projectDetails.description"
                ></textarea>
                <div class="form-text">
                  <KTIcon icon-name="information-5" icon-class="fs-6 me-1" />
                  Provide a comprehensive description to help team members understand the project scope
                </div>
              </div>
              <!--end::Col-->
            </div>
            <!--end::Input group-->

            <!--begin::Input group-->
            <div class="row mb-6">
              <!--begin::Label-->
              <label class="col-lg-4 col-form-label required fw-semobold fs-6">
                <KTIcon icon-name="chart-simple" icon-class="fs-6 me-2" />
                Status
              </label>
              <!--end::Label-->

              <!--begin::Col-->
              <div class="col-lg-8 fv-row">
                <select
                  name="status"
                  class="form-select form-select-lg form-select-solid"
                  v-model="projectDetails.status"
                  :class="{ 'is-invalid': !projectDetails.status }"
                >
                  <option value="">Select project status</option>
                  <option value="PLANNING">📋 Planning</option>
                  <option value="IN_PROGRESS">🚀 In Progress</option>
                  <option value="ON_HOLD">⏸️ On Hold</option>
                  <option value="COMPLETED">✅ Completed</option>
                  <option value="CANCELLED">❌ Cancelled</option>
                </select>
                <div class="invalid-feedback" v-if="!projectDetails.status">
                  Project status is required
                </div>
                <div class="form-text">
                  <KTIcon icon-name="information-5" icon-class="fs-6 me-1" />
                  Current stage of your project lifecycle
                </div>
              </div>
              <!--end::Col-->
            </div>
            <!--end::Input group-->

            <!--begin::Input group-->
            <div class="row mb-6">
              <!--begin::Label-->
              <label class="col-lg-4 col-form-label fw-semobold fs-6">
                <KTIcon icon-name="flag" icon-class="fs-6 me-2" />
                Priority
              </label>
              <!--end::Label-->

              <!--begin::Col-->
              <div class="col-lg-8 fv-row">
                <select
                  name="priority"
                  class="form-select form-select-lg form-select-solid"
                  v-model="projectDetails.priority"
                >
                  <option value="">Select priority level</option>
                  <option value="LOW">🟢 Low</option>
                  <option value="MEDIUM">🟡 Medium</option>
                  <option value="HIGH">🟠 High</option>
                  <option value="CRITICAL">🔴 Critical</option>
                </select>
                <div class="form-text">
                  <KTIcon icon-name="information-5" icon-class="fs-6 me-1" />
                  Set the urgency level for resource allocation and scheduling
                </div>
              </div>
              <!--end::Col-->
            </div>
            <!--end::Input group-->

            <!--begin::Input group-->
            <div class="row mb-6">
              <!--begin::Label-->
              <label class="col-lg-4 col-form-label fw-semobold fs-6">
                <KTIcon icon-name="dollar" icon-class="fs-6 me-2" />
                Budget
              </label>
              <!--end::Label-->

              <!--begin::Col-->
              <div class="col-lg-8 fv-row">
                <div class="input-group">
                  <span class="input-group-text">$</span>
                  <input
                    type="number"
                    name="budget"
                    class="form-control form-control-lg form-control-solid"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    v-model="projectDetails.budget"
                  />
                </div>
                <div class="form-text">
                  <KTIcon icon-name="information-5" icon-class="fs-6 me-1" />
                  Estimated or allocated budget for the project
                </div>
              </div>
              <!--end::Col-->
            </div>
            <!--end::Input group-->

            <!--begin::Input group-->
            <div class="row mb-6">
              <!--begin::Label-->
              <label class="col-lg-4 col-form-label fw-semobold fs-6">
                <KTIcon icon-name="user" icon-class="fs-6 me-2" />
                Project Manager
              </label>
              <!--end::Label-->

              <!--begin::Col-->
              <div class="col-lg-8 fv-row">
                <input
                  type="text"
                  name="managerId"
                  class="form-control form-control-lg form-control-solid"
                  placeholder="Enter manager ID or name"
                  v-model="projectDetails.managerId"
                />
                <div class="form-text">
                  <KTIcon icon-name="information-5" icon-class="fs-6 me-1" />
                  The person responsible for overseeing the project
                </div>
              </div>
              <!--end::Col-->
            </div>
            <!--end::Input group-->

            <!-- Date Range -->
            <div class="row mb-6">
              <div class="col-lg-6">
                <label class="col-form-label fw-semobold fs-6">
                  <KTIcon icon-name="calendar" icon-class="fs-6 me-2" />
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  class="form-control form-control-lg form-control-solid"
                  v-model="projectDetails.startDate"
                />
                <div class="form-text">
                  <KTIcon icon-name="information-5" icon-class="fs-6 me-1" />
                  When the project officially begins
                </div>
              </div>
              <div class="col-lg-6">
                <label class="col-form-label fw-semobold fs-6">
                  <KTIcon icon-name="calendar" icon-class="fs-6 me-2" />
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  class="form-control form-control-lg form-control-solid"
                  v-model="projectDetails.endDate"
                />
                <div class="form-text">
                  <KTIcon icon-name="information-5" icon-class="fs-6 me-1" />
                  Expected completion date
                </div>
              </div>
            </div>
          </div>
          <!--end::Card body-->

          <!--begin::Actions-->
          <div class="card-footer d-flex justify-content-end py-6 px-9">
            <button
              type="reset"
              class="btn btn-light btn-active-light-primary me-2"
              @click="resetForm"
            >
              <KTIcon icon-name="refresh" icon-class="fs-2 me-2" />
              Discard Changes
            </button>

            <button
              type="submit"
              id="kt_account_project_details_submit"
              ref="submitButton"
              class="btn btn-primary"
              :disabled="!isFormValid"
            >
              <span class="indicator-label">
                <KTIcon icon-name="check" icon-class="fs-2 me-2" />
                Save Changes
              </span>
              <span class="indicator-progress">
                <span class="spinner-border spinner-border-sm align-middle me-2"></span>
                Saving...
              </span>
            </button>
          </div>
          <!--end::Actions-->
        </form>
        <!--end::Form-->
      </div>
      <!--end::Content-->
    </div>
    <!--end::Basic info-->

    <!-- Sezione Skills -->
    <div class="card mb-6">
      <div class="card-header">
        <div class="card-title d-flex align-items-center">
          <KTIcon icon-name="star" icon-class="fs-2 text-warning me-3" />
          <h3 class="m-0">Required Skills</h3>
        </div>
        <div class="card-toolbar">
          <div class="d-flex gap-2">
            <button type="button" class="btn btn-sm btn-primary" @click="addHardSkill">
              <KTIcon icon-name="plus" icon-class="fs-2 me-1" />
              Add Hard Skill
            </button>
            <button type="button" class="btn btn-sm btn-secondary" @click="addSoftSkillToSkillsCard">
              <KTIcon icon-name="plus" icon-class="fs-2 me-1" />
              Add Soft Skill
            </button>
          </div>
        </div>
      </div>
      <div class="card-body">
        <!-- Info Alert -->
        <div class="alert alert-info d-flex align-items-center mb-6">
          <KTIcon icon-name="information-5" icon-class="fs-2 me-3" />
          <div>
            <strong>Skills Management:</strong>
            <ul class="mb-0 mt-2">
              <li>Hard skills are technical abilities (e.g., programming, design)</li>
              <li>Soft skills are interpersonal abilities (e.g., communication, leadership)</li>
              <li>Set minimum proficiency levels to ensure team members meet requirements</li>
              <li>Mark skills as mandatory or optional based on project needs</li>
            </ul>
          </div>
        </div>

        <div v-if="projectDetails.requiredHardSkills && projectDetails.requiredHardSkills.length">
          <div class="d-flex align-items-center mb-4">
            <KTIcon icon-name="code" icon-class="fs-2 text-primary me-2" />
            <h4 class="mb-0">Hard Skills</h4>
            <span class="badge badge-light-primary ms-2">{{ projectDetails.requiredHardSkills.length }} skills</span>
          </div>
          <div v-for="(skill, index) in projectDetails.requiredHardSkills" :key="'hard-' + index" class="mb-3 p-4 border rounded bg-light">
            <div class="row align-items-center">
              <template v-if="editingHardSkillIndex === index">
                <div class="col-md-3">
                  <label class="form-label small">Skill Name</label>
                  <input v-model="skill.name" placeholder="e.g., JavaScript, React" class="form-control" />
                </div>
                <div class="col-md-2">
                  <label class="form-label small">Min Level</label>
                  <select v-model="skill.minProficiencyLevel" class="form-select">
                    <option value="">Select Level</option>
                    <option value="1">1 - Beginner</option>
                    <option value="2">2 - Intermediate</option>
                    <option value="3">3 - Advanced</option>
                    <option value="4">4 - Expert</option>
                    <option value="5">5 - Master</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="form-label small">Certification</label>
                  <input v-model="skill.certification" placeholder="e.g., AWS Certified" class="form-control" />
                </div>
                <div class="col-md-2">
                  <label class="form-label small">Requirement</label>
                  <select v-model="skill.isMandatory" class="form-select">
                    <option :value="true">Mandatory</option>
                    <option :value="false">Optional</option>
                  </select>
                </div>
                <div class="col-md-2 d-flex gap-1">
                  <button type="button" class="btn btn-sm btn-success" @click="saveHardSkill(skill, index)" title="Save skill">
                    <KTIcon icon-name="check" icon-class="fs-3" />
                  </button>
                  <button type="button" class="btn btn-sm btn-danger" @click="removeHardSkill(skill, index)" title="Delete skill">
                    <KTIcon icon-name="trash" icon-class="fs-3" />
                  </button>
                </div>
              </template>
              <template v-else>
                <div class="col-md-3">
                  <div class="fw-semobold">{{ skill.name }}</div>
                  <small class="text-muted">Skill name</small>
                </div>
                <div class="col-md-2">
                  <div class="fw-semobold">{{ skill.minProficiencyLevel || 'Not specified' }}</div>
                  <small class="text-muted">Min level</small>
                </div>
                <div class="col-md-3">
                  <div class="fw-semobold">{{ skill.certification || 'No certification' }}</div>
                  <small class="text-muted">Certification</small>
                </div>
                <div class="col-md-2">
                  <span :class="skill.isMandatory ? 'badge-light-danger' : 'badge-light-success'" class="badge">
                    {{ skill.isMandatory ? 'Mandatory' : 'Optional' }}
                  </span>
                </div>
                <div class="col-md-2 d-flex gap-1">
                  <button type="button" class="btn btn-sm btn-warning" @click="editHardSkill(index)" title="Edit skill">
                    <KTIcon icon-name="pencil" icon-class="fs-3" />
                  </button>
                  <button type="button" class="btn btn-sm btn-danger" @click="removeHardSkill(skill, index)" title="Delete skill">
                    <KTIcon icon-name="trash" icon-class="fs-3" />
                  </button>
                </div>
              </template>
            </div>
          </div>
        </div>
        
        <div v-if="projectDetails.requiredSoftSkills && projectDetails.requiredSoftSkills.length">
          <div class="d-flex align-items-center mb-4 mt-5">
            <KTIcon icon-name="user-tick" icon-class="fs-2 text-success me-2" />
            <h4 class="mb-0">Soft Skills</h4>
            <span class="badge badge-light-success ms-2">{{ projectDetails.requiredSoftSkills.length }} skills</span>
          </div>
          <div v-for="(skill, index) in projectDetails.requiredSoftSkills" :key="'soft-' + index" class="mb-3 p-4 border rounded bg-light">
            <div class="row align-items-center">
              <template v-if="editingSoftSkillIndex === index">
                <div class="col-md-3">
                  <label class="form-label small">Skill Name</label>
                  <input v-model="skill.name" placeholder="e.g., Communication, Leadership" class="form-control" />
                </div>
                <div class="col-md-2">
                  <label class="form-label small">Level</label>
                  <select v-model="skill.proficiencyLevel" class="form-select">
                    <option value="">Select Level</option>
                    <option value="1">1 - Beginner</option>
                    <option value="2">2 - Intermediate</option>
                    <option value="3">3 - Advanced</option>
                    <option value="4">4 - Expert</option>
                    <option value="5">5 - Master</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="form-label small">Certification</label>
                  <input v-model="skill.certification" placeholder="e.g., PMP, Scrum Master" class="form-control" />
                </div>
                <div class="col-md-2">
                  <label class="form-label small">Requirement</label>
                  <select v-model="skill.isMandatory" class="form-select">
                    <option :value="true">Mandatory</option>
                    <option :value="false">Optional</option>
                  </select>
                </div>
                <div class="col-md-2 d-flex gap-1">
                  <button type="button" class="btn btn-sm btn-success" @click="saveSoftSkill(skill, index)" title="Save skill">
                    <KTIcon icon-name="check" icon-class="fs-3" />
                  </button>
                  <button type="button" class="btn btn-sm btn-danger" @click="removeSoftSkill(skill, index)" title="Delete skill">
                    <KTIcon icon-name="trash" icon-class="fs-3" />
                  </button>
                </div>
              </template>
              <template v-else>
                <div class="col-md-3">
                  <div class="fw-semobold">{{ skill.name }}</div>
                  <small class="text-muted">Skill name</small>
                </div>
                <div class="col-md-2">
                  <div class="fw-semobold">{{ skill.proficiencyLevel || 'Not specified' }}</div>
                  <small class="text-muted">Level</small>
                </div>
                <div class="col-md-3">
                  <div class="fw-semobold">{{ skill.certification || 'No certification' }}</div>
                  <small class="text-muted">Certification</small>
                </div>
                <div class="col-md-2">
                  <span :class="skill.isMandatory ? 'badge-light-danger' : 'badge-light-success'" class="badge">
                    {{ skill.isMandatory ? 'Mandatory' : 'Optional' }}
                  </span>
                </div>
                <div class="col-md-2 d-flex gap-1">
                  <button type="button" class="btn btn-sm btn-warning" @click="editSoftSkill(index)" title="Edit skill">
                    <KTIcon icon-name="pencil" icon-class="fs-3" />
                  </button>
                  <button type="button" class="btn btn-sm btn-danger" @click="removeSoftSkill(skill, index)" title="Delete skill">
                    <KTIcon icon-name="trash" icon-class="fs-3" />
                  </button>
                </div>
              </template>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="(!projectDetails.requiredHardSkills || !projectDetails.requiredHardSkills.length) && 
                    (!projectDetails.requiredSoftSkills || !projectDetails.requiredSoftSkills.length)" 
             class="text-center py-5">
          <KTIcon icon-name="star" icon-class="fs-2x text-muted mb-3" />
          <h5 class="text-muted mb-2">No skills defined yet</h5>
          <p class="text-muted mb-4">Add hard and soft skills to define the requirements for your project team.</p>
          <div class="d-flex justify-content-center gap-2">
            <button type="button" class="btn btn-primary" @click="addHardSkill">
              <KTIcon icon-name="plus" icon-class="fs-2 me-1" />
              Add Hard Skill
            </button>
            <button type="button" class="btn btn-secondary" @click="addSoftSkillToSkillsCard">
              <KTIcon icon-name="plus" icon-class="fs-2 me-1" />
              Add Soft Skill
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--end::Settings Content-->
</template>

<script lang="ts">
import { defineComponent, ref, inject, watch, onMounted, computed } from "vue";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { useRoute } from "vue-router";
import { 
  createSoftSkill, updateSoftSkill, deleteSoftSkill, getSoftSkillsByProjectId,
  createHardSkill, updateHardSkill, deleteHardSkill, getHardSkillsByProjectId 
} from "@/core/services/businessServices/ProjectSkill";
import type { ProjectSkill } from "@/core/services/businessServices/ProjectSkill";

interface ProjectDetails {
  name: string;
  description: string;
  status: string;
  priority: string;
  budget: number | null;
  managerId: string;
  startDate: string;
  endDate: string;
  requiredSoftSkills: ProjectSkill[];
  requiredHardSkills: ProjectSkill[];
}

export default defineComponent({
  name: "project-settings",
  setup() {
    const route = useRoute();
    const submitButton = ref<HTMLElement | null>(null);
    const editingHardSkillIndex = ref<number | null>(null);
    const editingSoftSkillIndex = ref<number | null>(null);
    const newSoftSkill = ref('');

    const project = inject<any>('project');
    const refreshProject = inject<any>('refreshProject');

    // Project details reactive object
    const projectDetails = ref<ProjectDetails>({
      name: '',
      description: '',
      status: '',
      priority: '',
      budget: null,
      managerId: '',
      startDate: '',
      endDate: '',
      requiredSoftSkills: [],
      requiredHardSkills: [],
    });

    // Form validation
    const isFormValid = computed(() => {
      return projectDetails.value.name && projectDetails.value.status;
    });

    // Load skills from backend
    const loadProjectSkills = async () => {
      if (route.params.id) {
        try {
          const [softSkills, hardSkills] = await Promise.all([
            getSoftSkillsByProjectId(route.params.id as string),
            getHardSkillsByProjectId(route.params.id as string)
          ]);
          projectDetails.value.requiredSoftSkills = softSkills;
          projectDetails.value.requiredHardSkills = hardSkills;
        } catch (error) {
          console.error("Error loading project skills:", error);
        }
      }
    };

    // Watch for project changes and update project details
    watch(project, async (val) => {
      if (val) {
        projectDetails.value = {
          name: val.name || '',
          description: val.description || '',
          status: val.status || '',
          priority: val.priority || '',
          budget: val.budget || null,
          managerId: val.managerId || '',
          startDate: val.startDate ? val.startDate.split('T')[0] : '',
          endDate: val.endDate ? val.endDate.split('T')[0] : '',
          requiredSoftSkills: [],
          requiredHardSkills: [],
        };
        // Load skills from backend after setting basic project data
        await loadProjectSkills();
      }
    }, { immediate: true });

    onMounted(() => {
      loadProjectSkills();
    });

    const saveChanges = async () => {
      if (submitButton.value && isFormValid.value) {
        // Activate indicator
        submitButton.value.setAttribute("data-kt-indicator", "on");
        
        try {
          if (route.params.id) {
            // Prepare data to save
            const projectData = {
              name: projectDetails.value.name,
              description: projectDetails.value.description,
              status: projectDetails.value.status,
              priority: projectDetails.value.priority,
              budget: projectDetails.value.budget ? parseFloat(projectDetails.value.budget.toString()) : null,
              manager_id: projectDetails.value.managerId || null,
              start_date: projectDetails.value.startDate ? new Date(projectDetails.value.startDate) : null,
              end_date: projectDetails.value.endDate ? new Date(projectDetails.value.endDate) : null,
              requiredSoftSkills: projectDetails.value.requiredSoftSkills,
              requiredHardSkills: projectDetails.value.requiredHardSkills,
            };

            const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:3000';
            const response = await fetch(`${API_URL}/projects/${route.params.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(projectData)
            });
            
            if (!response.ok) {
              throw new Error('Failed to update project');
            }
            
            // Refresh project data
            if (refreshProject) {
              await refreshProject();
            }
            
            // Show success message
            Swal.fire({
              icon: 'success',
              title: 'Project updated successfully!',
              text: 'Your project settings have been saved.',
              confirmButtonText: 'Great!',
              confirmButtonColor: '#3699FF'
            });
          }
        } catch (error) {
          console.error("Error updating project:", error);
          Swal.fire({
            icon: 'error',
            title: 'Update failed',
            text: 'There was an error updating your project. Please try again.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#F64E60'
          });
        } finally {
          setTimeout(() => {
            submitButton.value?.removeAttribute("data-kt-indicator");
          }, 1000);
        }
      } else if (!isFormValid.value) {
        Swal.fire({
          icon: 'warning',
          title: 'Missing required fields',
          text: 'Please fill in all required fields (marked with *) before saving.',
          confirmButtonText: 'OK',
          confirmButtonColor: '#FFA800'
        });
      }
    };

    const resetForm = () => {
      // Reset to original project data
      if (project.value) {
        projectDetails.value = {
          name: project.value.name || '',
          description: project.value.description || '',
          status: project.value.status || '',
          priority: project.value.priority || '',
          budget: project.value.budget || null,
          managerId: project.value.managerId || '',
          startDate: project.value.startDate ? project.value.startDate.split('T')[0] : '',
          endDate: project.value.endDate ? project.value.endDate.split('T')[0] : '',
          requiredSoftSkills: [...(project.value.requiredSoftSkills || [])],
          requiredHardSkills: [...(project.value.requiredHardSkills || [])],
        };
        
        Swal.fire({
          icon: 'info',
          title: 'Form reset',
          text: 'All changes have been discarded.',
          confirmButtonText: 'OK',
          confirmButtonColor: '#6C757D'
        });
      }
    };

    // Soft Skills management
    const addSoftSkill = async () => {
      if (newSoftSkill.value.trim() && route.params.id) {
        try {
          const newSkill = await createSoftSkill({
            name: newSoftSkill.value.trim(),
            projectSoftId: route.params.id as string
          });
          if (newSkill) {
            projectDetails.value.requiredSoftSkills.push(newSkill);
            newSoftSkill.value = '';
            Swal.fire({
              icon: 'success',
              title: 'Soft skill added!',
              text: 'The soft skill has been added successfully.'
            });
          }
        } catch (error) {
          console.error("Error adding soft skill:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'There was an error adding the soft skill.'
          });
        }
      }
    };

    const editSoftSkill = (index: number) => {
      editingSoftSkillIndex.value = index;
    };

    const saveSoftSkill = async (skill: any, index: number) => {
      try {
        if (skill.isNew || !skill.id) {
          // Create new skill
          const dataToSend = {
            name: skill.name,
            proficiencyLevel: skill.proficiencyLevel ? parseInt(skill.proficiencyLevel) : undefined,
            certification: skill.certification,
            isMandatory: skill.isMandatory,
            projectSoftId: route.params.id as string
          };
          const created = await createSoftSkill(dataToSend);
          if (created) {
            projectDetails.value.requiredSoftSkills[index] = created;
          }
        } else {
          // Update existing skill
          const dataToUpdate = {
            name: skill.name,
            proficiencyLevel: skill.proficiencyLevel ? parseInt(skill.proficiencyLevel) : undefined,
            certification: skill.certification,
            isMandatory: skill.isMandatory
          };
          await updateSoftSkill(skill.id, dataToUpdate);
        }
        editingSoftSkillIndex.value = null;
        Swal.fire({
          icon: 'success',
          title: 'Soft skill saved!',
          text: 'The soft skill has been saved successfully.'
        });
      } catch (error) {
        console.error("Error saving soft skill:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an error saving the soft skill.'
        });
      }
    };

    const removeSoftSkill = async (skill: any, index: number) => {
      const confirm = await Swal.fire({
        title: 'Remove soft skill?',
        text: `Are you sure you want to remove "${skill.name}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#F64E60',
        cancelButtonColor: '#6C757D',
        confirmButtonText: 'Yes, remove it!'
      });

      if (confirm.isConfirmed) {
        try {
          if (skill.id && !skill.isNew) {
            await deleteSoftSkill(skill.id);
          }
          projectDetails.value.requiredSoftSkills.splice(index, 1);
          if (editingSoftSkillIndex.value === index) {
            editingSoftSkillIndex.value = null;
          }
          Swal.fire({
            icon: 'success',
            title: 'Soft skill removed!',
            text: 'The soft skill has been removed successfully.'
          });
        } catch (error) {
          console.error("Error removing soft skill:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'There was an error removing the soft skill.'
          });
        }
      }
    };

    // Hard Skills management
    const addHardSkill = () => {
      if (!projectDetails.value.requiredHardSkills) projectDetails.value.requiredHardSkills = [];
      // Add a temporary skill object for editing - will be saved via API
      const tempSkill: any = { 
        name: '', 
        minProficiencyLevel: '', 
        certification: '',
        isMandatory: false,
        projectId: route.params.id as string,
        isNew: true // Flag to indicate this is a new skill
      };
      projectDetails.value.requiredHardSkills.push(tempSkill);
      editingHardSkillIndex.value = projectDetails.value.requiredHardSkills.length - 1;
    };

    // Add hard skill directly to the skills card (alias for consistency)
    const addHardSkillToSkillsCard = () => {
      if (!projectDetails.value.requiredHardSkills) projectDetails.value.requiredHardSkills = [];
      // Add a temporary skill object for editing - will be saved via API
      const tempSkill: any = { 
        name: '', 
        minProficiencyLevel: '', 
        certification: '',
        isMandatory: false,
        projectHardId: route.params.id as string,
        isNew: true // Flag to indicate this is a new skill
      };
      projectDetails.value.requiredHardSkills.push(tempSkill);
      editingHardSkillIndex.value = projectDetails.value.requiredHardSkills.length - 1;
    };

    const editHardSkill = (index: number) => {
      editingHardSkillIndex.value = index;
    };

    const saveHardSkill = async (skill: any, index: number) => {
      try {
        if (skill.isNew || !skill.id) {
          // Create new skill
          const dataToSend = {
            name: skill.name,
            minProficiencyLevel: skill.minProficiencyLevel ? parseInt(skill.minProficiencyLevel) : undefined,
            certification: skill.certification,
            isMandatory: skill.isMandatory,
            projectHardId: route.params.id as string
          };
          const created = await createHardSkill(dataToSend);
          if (created) {
            projectDetails.value.requiredHardSkills[index] = created;
          }
        } else {
          // Update existing skill
          const dataToUpdate = {
            name: skill.name,
            minProficiencyLevel: skill.minProficiencyLevel ? parseInt(skill.minProficiencyLevel) : undefined,
            certification: skill.certification,
            isMandatory: skill.isMandatory
          };
          await updateHardSkill(skill.id, dataToUpdate);
        }
        editingHardSkillIndex.value = null;
        Swal.fire({
          icon: 'success',
          title: 'Hard skill saved!',
          text: 'The skill requirement has been saved successfully.'
        });
      } catch (error) {
        console.error("Error saving hard skill:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an error saving the skill requirement.'
        });
      }
    };

    const removeHardSkill = async (skill: any, index: number) => {
      const confirm = await Swal.fire({
        title: 'Remove hard skill?',
        text: `Are you sure you want to remove "${skill.name}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#F64E60',
        cancelButtonColor: '#6C757D',
        confirmButtonText: 'Yes, remove it!'
      });

      if (confirm.isConfirmed) {
        try {
          if (skill.id && !skill.isNew) {
            await deleteHardSkill(skill.id);
          }
          projectDetails.value.requiredHardSkills?.splice(index, 1);
          if (editingHardSkillIndex.value === index) {
            editingHardSkillIndex.value = null;
          }
          Swal.fire({
            icon: 'success',
            title: 'Hard skill deleted!',
            text: 'The skill requirement has been deleted successfully.'
          });
        } catch (error) {
          console.error("Error deleting hard skill:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'There was an error deleting the skill requirement.'
          });
        }
      }
    };

    // Add soft skill directly to the skills card
    const addSoftSkillToSkillsCard = () => {
      if (!projectDetails.value.requiredSoftSkills) projectDetails.value.requiredSoftSkills = [];
      // Add a temporary skill object for editing - will be saved via API
      const tempSkill: any = { 
        name: '',
        proficiencyLevel: '',
        certification: '',
        isMandatory: false,
        projectSoftId: route.params.id as string,
        isNew: true // Flag to indicate this is a new skill
      };
      projectDetails.value.requiredSoftSkills.push(tempSkill);
      editingSoftSkillIndex.value = projectDetails.value.requiredSoftSkills.length - 1;
    };

    return {
      submitButton,
      saveChanges,
      resetForm,
      projectDetails,
      project,
      editingHardSkillIndex,
      editingSoftSkillIndex,
      newSoftSkill,
      isFormValid,
      addSoftSkill,
      addSoftSkillToSkillsCard,
      editSoftSkill,
      saveSoftSkill,
      removeSoftSkill,
      addHardSkill,
      addHardSkillToSkillsCard,
      editHardSkill,
      saveHardSkill,
      removeHardSkill,
    };
  },
});
</script>

<style scoped>
/* Custom styles for better UX */
.card-header {
  transition: all 0.3s ease;
}

.card-header:hover {
  background-color: rgba(54, 153, 255, 0.05);
}

.form-control:focus,
.form-select:focus {
  border-color: #3699FF;
  box-shadow: 0 0 0 0.2rem rgba(54, 153, 255, 0.25);
}

.btn {
  transition: all 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
}

.alert {
  border-left: 4px solid #3699FF;
}

.badge {
  font-weight: 500;
}

/* Skill cards styling */
.bg-light {
  background-color: #f8f9fa !important;
  border: 1px solid #e9ecef !important;
}

.bg-light:hover {
  background-color: #e9ecef !important;
  border-color: #dee2e6 !important;
}

/* Form validation styling */
.is-invalid {
  border-color: #F64E60 !important;
}

.invalid-feedback {
  display: block;
  color: #F64E60;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.form-text {
  color: #6C757D;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>
