<template>
  <div class="modal fade" id="kt_modal_add_project" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered mw-900px">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Add New Project</h2>
          <div class="btn btn-icon btn-sm btn-active-icon-primary" data-bs-dismiss="modal">
            <KTIcon icon-name="cross" icon-class="fs-1" />
          </div>
        </div>

        <div class="modal-body scroll-y mx-5 mx-xl-15 my-7">
          <form @submit.prevent="onSubmit" class="form">
            <!-- Basic Information -->
            <div class="card mb-6">
              <div class="card-header">
                <h3 class="card-title">Basic Information</h3>
              </div>
              <div class="card-body">
                <div class="row mb-6">
                  <div class="col-md-6">
                    <label class="form-label required">Project Name</label>
                    <input
                      v-model="form.name"
                      type="text"
                      class="form-control"
                      required
                    />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Manager ID</label>
                    <input
                      v-model="form.managerId"
                      type="text"
                      class="form-control"
                      placeholder="Manager's ID"
                    />
                  </div>
                </div>



                <div class="mb-6">
                  <label class="form-label">Description</label>
                  <textarea
                    v-model="form.description"
                    class="form-control"
                    rows="3"
                    placeholder="Project description..."
                  ></textarea>
                </div>

                <div class="row mb-6">
                  <div class="col-md-6">
                    <label class="form-label">Start Date</label>
                    <input
                      v-model="form.startDate"
                      type="date"
                      class="form-control"
                    />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">End Date</label>
                    <input
                      v-model="form.endDate"
                      type="date"
                      class="form-control"
                    />
                  </div>
                </div>

                <div class="row mb-6">
                  <div class="col-md-4">
                    <label class="form-label required">Status</label>
                    <select v-model="form.status" class="form-select" required>
                      <option value="">Select Status</option>
                      <option value="PLANNING">Planning</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="ON_HOLD">On Hold</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">Priority</label>
                    <select v-model="form.priority" class="form-select">
                      <option value="">Select Priority</option>
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="CRITICAL">Critical</option>
                    </select>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">Budget</label>
                    <input
                      v-model="form.budget"
                      type="number"
                      class="form-control"
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Skill Requirements Section -->
            <div class="card mb-6">
              <div class="card-body">
                <div class="mb-6">
                  <h4>Hard Skills Requirements</h4>
                  <div class="card-toolbar d-flex justify-content-end">
                    <button type="button" class="btn btn-sm btn-primary mb-3" @click="addSkillRequirement">
                      <KTIcon icon-name="plus" icon-class="fs-2" />
                      Add Skill Requirement
                    </button>
                  </div>
                  <div v-for="(skill, index) in form.requiredHardSkills" :key="`hard-${index}`" class="mb-3 p-3 border rounded">
                    <div class="row">
                      <div class="col-md-3">
                        <input v-model="skill.name" placeholder="Skill name" class="form-control" />
                      </div>
                      <div class="col-md-3">
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
                        <div class="form-check mb-2">
                          <input v-model="skill.isMandatory" class="form-check-input" type="checkbox" />
                          <label class="form-check-label">Mandatory</label>
                        </div>
                      </div>
                      <div class="col-md-1">
                        <button type="button" class="btn btn-sm btn-danger" @click="removeHardSkillRequirement(index)">
                          <KTIcon icon-name="trash" icon-class="fs-2" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="mb-6">
                  <h4>Soft Skills Requirements</h4>
                  <div class="card-toolbar d-flex justify-content-end">
                    <button type="button" class="btn btn-sm btn-primary mb-3" @click="addSoftSkillRequirement">
                      <KTIcon icon-name="plus" icon-class="fs-2" />
                      Add Soft Skill
                    </button>
                  </div>
                  <div v-for="(skill, index) in form.requiredSoftSkills" :key="`soft-${index}`" class="mb-3 p-3 border rounded">
                    <div class="row">
                      <div class="col-md-3">
                        <input v-model="skill.name" placeholder="Skill name" class="form-control" />
                      </div>
                      <div class="col-md-3">
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
                        <div class="form-check mb-2">
                          <input v-model="skill.isMandatory" class="form-check-input" type="checkbox" />
                          <label class="form-check-label">Mandatory</label>
                        </div>
                      </div>
                      <div class="col-md-1">
                        <button type="button" class="btn btn-sm btn-danger" @click="removeSoftSkillRequirement(index)">
                          <KTIcon icon-name="trash" icon-class="fs-2" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="text-center">
              <button
                type="button"
                class="btn btn-light me-3"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="loading"
              >
                <span v-if="loading" class="indicator-progress">
                  Please wait...
                  <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
                </span>
                <span v-else class="indicator-label">Add Project</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from "vue";
import { createProject } from "@/core/services/businessServices/Project";
import type { Project } from "@/core/models/Project";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { useCurrentUser } from "@/core/composables/useCurrentUser";

export default defineComponent({
  name: "AddProjectModal",
  emits: ["project-created"],
  props: {
    closeModal: {
      type: Function,
      required: false,
      default: undefined,
    },
  },
  setup(props, { emit }) {
    const { currentUser } = useCurrentUser();
    const loading = ref(false);

    const form = reactive({
      name: "",
      description: "",
      managerId: "",
      startDate: "",
      endDate: "",
      status: "",
      priority: "",
      budget: "",
      requiredHardSkills: [] as any[],
      requiredSoftSkills: [] as any[],
    });

    const addSkillRequirement = () => {
      form.requiredHardSkills.push({
        name: "",
        minProficiencyLevel: "",
        certification: "",
        isMandatory: false,
      });
    };

    const removeHardSkillRequirement = (index: number) => {
      form.requiredHardSkills.splice(index, 1);
    };

    const addSoftSkillRequirement = () => {
      form.requiredSoftSkills.push({
        name: '',
        proficiencyLevel: '',
        certification: '',
        isMandatory: false,
      });
    };
    const removeSoftSkillRequirement = (index: number) => {
      form.requiredSoftSkills.splice(index, 1);
    };

    const onSubmit = async () => {
      loading.value = true;
      try {
        // Determina automaticamente il companyId basato sull'utente corrente
        let companyId: string | undefined;
        if (currentUser.value) {
          const userRoles = currentUser.value.userRoles || [];
          const isSuperAdmin = userRoles.some((ur: any) => ur.name === 'superadmin');
          
          if (isSuperAdmin) {
            // Se l'utente corrente è super admin, il nuovo progetto viene associato alla sua società
            companyId = currentUser.value.company || currentUser.value.id;
          } else {
            // Se l'utente corrente non è super admin, il nuovo progetto viene associato alla società dell'utente corrente
            companyId = currentUser.value.company;
          }
        }

        const projectData: Partial<Project> = {
          name: form.name,
          description: form.description,
          manager_id: form.managerId || undefined,
          company: companyId,
          start_date: form.startDate ? new Date(form.startDate) : undefined,
          end_date: form.endDate ? new Date(form.endDate) : undefined,
          status: form.status,
          priority: form.priority || undefined,
          budget: form.budget ? parseFloat(form.budget) : undefined,
          required_hard_skills: form.requiredHardSkills.filter(skill => skill.name),
          required_soft_skills: form.requiredSoftSkills.filter(skill => skill.name),
        };

        const result = await createProject(projectData as Project);
        if (result) {
          emit("project-created", result);
          Swal.fire('Success', 'Project has been created.', 'success');
          if (props.closeModal) props.closeModal();
          // Reset form
          Object.assign(form, {
            name: "",
            description: "",
            managerId: "",
            startDate: "",
            endDate: "",
            status: "",
            priority: "",
            budget: "",
            requiredHardSkills: [],
            requiredSoftSkills: [],
          });
        } else {
          Swal.fire('Error', 'Failed to create project.', 'error');
        }
      } catch (error) {
        console.error("Error creating project:", error);
        Swal.fire('Error', 'An error occurred while creating the project.', 'error');
      } finally {
        loading.value = false;
      }
    };

    return {
      form,
      loading,
      onSubmit,
      addSkillRequirement,
      removeHardSkillRequirement,
      addSoftSkillRequirement,
      removeSoftSkillRequirement,
    };
  },
});
</script> 