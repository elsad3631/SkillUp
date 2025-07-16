<template>
  <!--begin::Loading State for Settings-->
  <div v-if="!project" class="d-flex justify-content-center align-items-center" style="min-height: 300px;">
    <div class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="mt-3">
        <span class="fw-semobold text-gray-600">Loading settings...</span>
      </div>
    </div>
  </div>
  <!--end::Loading State for Settings-->

  <!--begin::Settings Content-->
  <div v-else>
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
        <h3 class="fw-bold m-0">Project Details</h3>
      </div>
      <!--end::Card title-->
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
            <label class="col-lg-4 col-form-label required fw-semobold fs-6">Project Name</label>
            <!--end::Label-->

            <!--begin::Col-->
            <div class="col-lg-8 fv-row">
              <input
                type="text"
                name="name"
                class="form-control form-control-lg form-control-solid mb-3 mb-lg-0"
                placeholder="Project name"
                v-model="projectDetails.name"
              />
            </div>
          </div>
          <!--end::Input group-->

          <!--begin::Input group-->
          <div class="row mb-6">
            <!--begin::Label-->
            <label class="col-lg-4 col-form-label fw-semobold fs-6">Description</label>
            <!--end::Label-->

            <!--begin::Col-->
            <div class="col-lg-8 fv-row">
              <textarea
                name="description"
                class="form-control form-control-lg form-control-solid"
                placeholder="Project description"
                rows="4"
                v-model="projectDetails.description"
              ></textarea>
            </div>
            <!--end::Col-->
          </div>
          <!--end::Input group-->

          <!--begin::Input group-->
          <div class="row mb-6">
            <!--begin::Label-->
            <label class="col-lg-4 col-form-label required fw-semobold fs-6">Status</label>
            <!--end::Label-->

            <!--begin::Col-->
            <div class="col-lg-8 fv-row">
              <select
                name="status"
                class="form-select form-select-lg form-select-solid"
                v-model="projectDetails.status"
              >
                <option value="">Select Status</option>
                <option value="PLANNING">Planning</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="ON_HOLD">On Hold</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            <!--end::Col-->
          </div>
          <!--end::Input group-->

          <!--begin::Input group-->
          <div class="row mb-6">
            <!--begin::Label-->
            <label class="col-lg-4 col-form-label fw-semobold fs-6">Priority</label>
            <!--end::Label-->

            <!--begin::Col-->
            <div class="col-lg-8 fv-row">
              <select
                name="priority"
                class="form-select form-select-lg form-select-solid"
                v-model="projectDetails.priority"
              >
                <option value="">Select Priority</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
            <!--end::Col-->
          </div>
          <!--end::Input group-->

          <!--begin::Input group-->
          <div class="row mb-6">
            <!--begin::Label-->
            <label class="col-lg-4 col-form-label fw-semobold fs-6">Budget</label>
            <!--end::Label-->

            <!--begin::Col-->
            <div class="col-lg-8 fv-row">
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
            <!--end::Col-->
          </div>
          <!--end::Input group-->

          <!--begin::Input group-->
          <div class="row mb-6">
            <!--begin::Label-->
            <label class="col-lg-4 col-form-label fw-semobold fs-6">Manager ID</label>
            <!--end::Label-->

            <!--begin::Col-->
            <div class="col-lg-8 fv-row">
              <input
                type="text"
                name="managerId"
                class="form-control form-control-lg form-control-solid"
                placeholder="Manager ID"
                v-model="projectDetails.managerId"
              />
            </div>
            <!--end::Col-->
          </div>
          <!--end::Input group-->

          <!-- Date Range -->
          <div class="row mb-6">
            <div class="col-lg-6">
              <label class="col-form-label fw-semobold fs-6">Start Date</label>
              <input
                type="date"
                name="startDate"
                class="form-control form-control-lg form-control-solid"
                v-model="projectDetails.startDate"
              />
            </div>
            <div class="col-lg-6">
              <label class="col-form-label fw-semobold fs-6">End Date</label>
              <input
                type="date"
                name="endDate"
                class="form-control form-control-lg form-control-solid"
                v-model="projectDetails.endDate"
              />
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
            Discard
          </button>

          <button
            type="submit"
            id="kt_account_project_details_submit"
            ref="submitButton"
            class="btn btn-primary"
          >
            <span class="indicator-label"> Save Changes </span>
            <span class="indicator-progress">
              Please wait...
              <span
                class="spinner-border spinner-border-sm align-middle ms-2"
              ></span>
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
      <h3 class="card-title">Skills</h3>
      <div class="card-toolbar">
        <button type="button" class="btn btn-sm btn-primary me-2" @click="addHardSkill">
          Add Hard Skill
        </button>
        <button type="button" class="btn btn-sm btn-secondary" @click="addSoftSkillToSkillsCard">
          Add Soft Skill
        </button>
      </div>
    </div>
    <div class="card-body">
      <div v-if="projectDetails.requiredHardSkills && projectDetails.requiredHardSkills.length">
        <h4>Hard Skills</h4>
        <div v-for="(skill, index) in projectDetails.requiredHardSkills" :key="'hard-' + index" class="mb-3 p-3 border rounded">
          <div class="row align-items-center">
            <template v-if="editingHardSkillIndex === index">
              <div class="col-md-3">
                <input v-model="skill.name" placeholder="Skill name" class="form-control" />
              </div>
              <div class="col-md-2">
                <select v-model="skill.minProficiencyLevel" class="form-select">
                  <option value="">Min Level</option>
                  <option value="1">1 - Beginner</option>
                  <option value="2">2 - Intermediate</option>
                  <option value="3">3 - Advanced</option>
                  <option value="4">4 - Expert</option>
                  <option value="5">5 - Master</option>
                </select>
              </div>
              <div class="col-md-3">
                <input v-model="skill.certification" placeholder="Certification" class="form-control" />
              </div>
              <div class="col-md-2">
                <select v-model="skill.isMandatory" class="form-select">
                  <option :value="true">Mandatory</option>
                  <option :value="false">Optional</option>
                </select>
              </div>
              <div class="col-md-2 d-flex gap-1">
                <button type="button" class="btn btn-sm btn-success" @click="saveHardSkill(skill, index)">
                  <KTIcon icon-name="check" icon-class="fs-3" />
                </button>
                <button type="button" class="btn btn-sm btn-danger" @click="removeHardSkill(skill, index)">
                  <KTIcon icon-name="trash" icon-class="fs-3" />
                </button>
              </div>
            </template>
            <template v-else>
              <div class="col-md-3">
                {{ skill.name }}
              </div>
              <div class="col-md-2">
                Min Level: {{ skill.minProficiencyLevel || 'Not specified' }}
              </div>
              <div class="col-md-3">
                {{ skill.certification || 'No certification' }}
              </div>
              <div class="col-md-2">
                <span :class="skill.isMandatory ? 'badge-light-danger' : 'badge-light-success'" class="badge">
                  {{ skill.isMandatory ? 'Mandatory' : 'Optional' }}
                </span>
              </div>
              <div class="col-md-2 d-flex gap-1">
                <button type="button" class="btn btn-sm btn-warning" @click="editHardSkill(index)">
                  <KTIcon icon-name="pencil" icon-class="fs-3" />
                </button>
                <button type="button" class="btn btn-sm btn-danger" @click="removeHardSkill(skill, index)">
                  <KTIcon icon-name="trash" icon-class="fs-3" />
                </button>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div v-if="projectDetails.requiredSoftSkills && projectDetails.requiredSoftSkills.length">
        <h4>Soft Skills</h4>
        <div v-for="(skill, index) in projectDetails.requiredSoftSkills" :key="'soft-' + index" class="mb-3 p-3 border rounded">
          <div class="row align-items-center">
            <template v-if="editingSoftSkillIndex === index">
              <div class="col-md-3">
                <input v-model="skill.name" placeholder="Skill name" class="form-control" />
              </div>
              <div class="col-md-2">
                <select v-model="skill.proficiencyLevel" class="form-select">
                  <option value="">Level</option>
                  <option value="1">1 - Beginner</option>
                  <option value="2">2 - Intermediate</option>
                  <option value="3">3 - Advanced</option>
                  <option value="4">4 - Expert</option>
                  <option value="5">5 - Master</option>
                </select>
              </div>
              <div class="col-md-3">
                <input v-model="skill.certification" placeholder="Certification" class="form-control" />
              </div>
              <div class="col-md-2">
                <select v-model="skill.isMandatory" class="form-select">
                  <option :value="true">Mandatory</option>
                  <option :value="false">Optional</option>
                </select>
              </div>
              <div class="col-md-2 d-flex gap-1">
                <button type="button" class="btn btn-sm btn-success" @click="saveSoftSkill(skill, index)">
                  <KTIcon icon-name="check" icon-class="fs-3" />
                </button>
                <button type="button" class="btn btn-sm btn-danger" @click="removeSoftSkill(skill, index)">
                  <KTIcon icon-name="trash" icon-class="fs-3" />
                </button>
              </div>
            </template>
            <template v-else>
              <div class="col-md-3">
                {{ skill.name }}
              </div>
              <div class="col-md-2">
                Level: {{ skill.proficiencyLevel || 'Not specified' }}
              </div>
              <div class="col-md-3">
                {{ skill.certification || 'No certification' }}
              </div>
              <div class="col-md-2">
                <span :class="skill.isMandatory ? 'badge-light-danger' : 'badge-light-success'" class="badge">
                  {{ skill.isMandatory ? 'Mandatory' : 'Optional' }}
                </span>
              </div>
              <div class="col-md-2 d-flex gap-1">
                <button type="button" class="btn btn-sm btn-warning" @click="editSoftSkill(index)">
                  <KTIcon icon-name="pencil" icon-class="fs-3" />
                </button>
                <button type="button" class="btn btn-sm btn-danger" @click="removeSoftSkill(skill, index)">
                  <KTIcon icon-name="trash" icon-class="fs-3" />
                </button>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>



  </div>
  <!--end::Settings Content-->
</template>

<script lang="ts">
import { defineComponent, ref, inject, watch, onMounted } from "vue";
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
      if (submitButton.value) {
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
              title: 'Project updated!',
              text: 'Your project has been updated successfully.'
            });
          }
        } catch (error) {
          console.error("Error updating project:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'There was an error updating your project.'
          });
        } finally {
          setTimeout(() => {
            submitButton.value?.removeAttribute("data-kt-indicator");
          }, 1000);
        }
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
/* Avatar management has been moved to Account.vue */
</style>
