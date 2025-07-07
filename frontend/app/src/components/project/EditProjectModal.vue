<template>
  <div class="modal fade" id="kt_modal_edit_project" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered mw-900px">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Edit Project</h2>
          <div class="btn btn-icon btn-sm btn-active-icon-primary" data-bs-dismiss="modal">
            <KTIcon icon-name="cross" icon-class="fs-1" />
          </div>
        </div>

        <div class="modal-body scroll-y mx-5 mx-xl-15 my-7">
          <form @submit.prevent="onSubmit" class="form" v-if="project">
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
                    <button type="button" class="btn btn-sm btn-primary mb-3" @click="addHardSkillEditRow">
                      <KTIcon icon-name="plus" icon-class="fs-2" />
                      Add Skill Requirement
                    </button>
                  </div>
                  <div v-for="(skill, index) in form.requiredHardSkills" :key="`hard-${index}`" class="mb-3 p-3 border rounded">
                    <div v-if="editHardSkillIndex === index" class="row align-items-center">
                      <div class="col-md-4">
                        <input v-model="editHardSkill.name" placeholder="Skill name" class="form-control" />
                      </div>
                      <div class="col-md-3">
                        <select v-model="editHardSkill.minProficiencyLevel" class="form-select">
                          <option value="">Min Level</option>
                          <option value="1">1 - Beginner</option>
                          <option value="2">2 - Intermediate</option>
                          <option value="3">3 - Advanced</option>
                          <option value="4">4 - Expert</option>
                          <option value="5">5 - Master</option>
                        </select>
                      </div>
                      <div class="col-md-3">
                        <div class="form-check">
                          <input v-model="editHardSkill.isMandatory" class="form-check-input" type="checkbox" />
                          <label class="form-check-label">Mandatory</label>
                        </div>
                      </div>
                      <div class="col-md-2 d-flex gap-2">
                        <button type="button" class="btn btn-sm btn-success" @click="saveHardSkill(index)">
                          <KTIcon icon-name="check" icon-class="fs-2" />
                        </button>
                        <button type="button" class="btn btn-sm btn-secondary" @click="cancelHardSkillEdit">
                          <KTIcon icon-name="cross" icon-class="fs-2" />
                        </button>
                      </div>
                    </div>
                    <div v-else class="row align-items-center">
                      <div class="col-md-4">
                        <span>{{ skill.name }}</span>
                      </div>
                      <div class="col-md-3">
                        <span>{{ skill.minProficiencyLevel }}</span>
                      </div>
                      <div class="col-md-3">
                        <span>{{ skill.isMandatory ? 'Yes' : 'No' }}</span>
                      </div>
                      <div class="col-md-2 d-flex gap-2">
                        <button type="button" class="btn btn-sm btn-primary" @click="editHardSkillRow(index)">
                          <KTIcon icon-name="pencil" icon-class="fs-2" />
                        </button>
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
                      <div class="col-md-8">
                        <input v-model="skill.name" placeholder="Skill name" class="form-control" />
                      </div>
                      <div class="col-md-2 d-flex align-items-center">
                        <div class="form-check">
                          <input v-model="skill.isMandatory" class="form-check-input" type="checkbox" />
                          <label class="form-check-label">Mandatory</label>
                        </div>
                      </div>
                      <div class="col-md-2">
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
                <span v-else class="indicator-label">Update Project</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, watch } from "vue";
import { updateProject, createSkillRequirement, updateSkillRequirement, deleteSkillRequirement } from "@/core/services/businessServices/Project";
import type { Project } from "@/core/models/Project";
import Swal from "sweetalert2/dist/sweetalert2.js";
import Loading from "@/components/kt-datatable/table-partials/Loading.vue";

export default defineComponent({
  name: "EditProjectModal",
  components: {
    Loading,
  },
  props: {
    project: {
      type: Object as () => Project | null,
      default: null,
    },
    closeModal: {
      type: Function,
      required: false,
      default: undefined,
    },
  },
  emits: ["project-updated"],
  setup(props, { emit }) {
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
      requiredHardSkills: [] as Array<{ id?: string; name: string; minProficiencyLevel: string; isMandatory: boolean }>,
      requiredSoftSkills: [] as any[],
    });

    const editHardSkillIndex = ref<number|null>(null);
    const editHardSkill = reactive<{ id?: string; name: string; minProficiencyLevel: string; isMandatory: boolean }>({ name: '', minProficiencyLevel: '', isMandatory: false });

    // Watch for changes in project prop and populate form
    watch(() => props.project, (newProject) => {
      if (newProject) {
        form.name = newProject.name || "";
        form.description = newProject.description || "";
        form.managerId = newProject.manager_id || newProject['managerId'] || "";
        form.startDate = newProject.start_date 
          ? new Date(newProject.start_date).toISOString().split('T')[0]
          : (newProject['startDate'] ? new Date(newProject['startDate']).toISOString().split('T')[0] : "");
        form.endDate = newProject.end_date 
          ? new Date(newProject.end_date).toISOString().split('T')[0]
          : (newProject['endDate'] ? new Date(newProject['endDate']).toISOString().split('T')[0] : "");
        form.status = newProject.status || "";
        form.priority = newProject.priority || "";
        form.budget = newProject.budget?.toString() || "";
        // Hard skills
        const hardSkills = newProject.required_hard_skills || newProject['requiredHardSkills'] || [];
        form.requiredHardSkills = hardSkills.length > 0
          ? hardSkills.map((skill: any) => ({
              id: skill.id,
              name: skill.name || "",
              minProficiencyLevel: skill.min_proficiency_level?.toString() || skill.minProficiencyLevel?.toString() || "",
              isMandatory: skill.is_mandatory ?? skill.isMandatory ?? false,
            }))
          : [{ name: "", minProficiencyLevel: "", isMandatory: false }];
        // Soft skills: support array di stringhe o array di oggetti
        const softSkillsRaw = newProject.required_soft_skills || newProject['requiredSoftSkills'] || [];
        form.requiredSoftSkills = Array.isArray(softSkillsRaw) && typeof softSkillsRaw[0] === 'object'
          ? softSkillsRaw.map((skill: any) => ({
              name: skill.name || "",
              isMandatory: skill.isMandatory || skill.is_mandatory || false,
            }))
          : softSkillsRaw.map((name: string) => ({ name, isMandatory: false }));
      }
    }, { immediate: true });

    const addSkillRequirement = () => {
      form.requiredHardSkills.push({
        name: "",
        minProficiencyLevel: "",
        isMandatory: false,
      });
    };
    const removeHardSkillRequirement = async (index: number) => {
      const skill = form.requiredHardSkills[index];
      if (skill.id) {
        const ok = await Swal.fire({
          title: 'Are you sure?',
          text: 'This will permanently delete the skill.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
        });
        if (!ok.isConfirmed) return;
        const result = await deleteSkillRequirement(skill.id);
        if (!result) {
          Swal.fire('Error', 'Failed to delete skill', 'error');
          return;
        }
      }
      form.requiredHardSkills.splice(index, 1);
      Swal.fire('Deleted!', 'Skill has been deleted.', 'success');
    };
    const addSoftSkillRequirement = () => {
      form.requiredSoftSkills.push({
        name: '',
        isMandatory: false,
      });
    };
    const removeSoftSkillRequirement = (index: number) => {
      form.requiredSoftSkills.splice(index, 1);
    };

    function editHardSkillRow(index: number) {
      editHardSkillIndex.value = index;
      Object.assign(editHardSkill, form.requiredHardSkills[index]);
    }
    function addHardSkillEditRow() {
      editHardSkillIndex.value = form.requiredHardSkills.length;
      Object.assign(editHardSkill, { name: '', minProficiencyLevel: '', isMandatory: false });
      form.requiredHardSkills.push({ name: '', minProficiencyLevel: '', isMandatory: false });
    }
    async function saveHardSkill(index: number) {
      const skill = { ...editHardSkill };
      const projectId = props.project?.id;
      let result;
      if (!projectId) {
        Swal.fire('Error', 'Project ID missing', 'error');
        return;
      }
      if (skill.id) {
        result = await updateSkillRequirement(skill.id, skill);
      } else {
        result = await createSkillRequirement(projectId, skill);
      }
      if (result && result.id) {
        form.requiredHardSkills[index] = { ...result };
        Swal.fire('Success', 'Skill saved', 'success');
      } else {
        Swal.fire('Error', 'Failed to save skill', 'error');
        // Se era una nuova skill e fallisce, rimuovila
        if (!skill.id) form.requiredHardSkills.pop();
      }
      editHardSkillIndex.value = null;
      Object.assign(editHardSkill, { name: '', minProficiencyLevel: '', isMandatory: false });
    }
    function cancelHardSkillEdit() {
      if (editHardSkillIndex.value === form.requiredHardSkills.length - 1 && !form.requiredHardSkills[editHardSkillIndex.value].name) {
        // Se era una nuova skill vuota, rimuovila
        form.requiredHardSkills.pop();
      }
      editHardSkillIndex.value = null;
      Object.assign(editHardSkill, { name: '', minProficiencyLevel: '', isMandatory: false });
    }

    const onSubmit = async () => {
      if (!props.project) return;
      loading.value = true;
      try {
        const projectData: Partial<Project> = {
          name: form.name,
          description: form.description,
          manager_id: form.managerId || undefined,
          start_date: form.startDate ? new Date(form.startDate) : undefined,
          end_date: form.endDate ? new Date(form.endDate) : undefined,
          status: form.status,
          priority: form.priority || undefined,
          budget: form.budget ? parseFloat(form.budget) : undefined,
          required_hard_skills: form.requiredHardSkills.filter(skill => skill.name),
          required_soft_skills: form.requiredSoftSkills.filter(skill => skill.name),
        };
        const result = await updateProject(props.project.id, projectData as Project);
        if (result) {
          emit("project-updated", result);
          Swal.fire('Success', 'Project has been updated.', 'success');
          if (props.closeModal) props.closeModal();
        } else {
          Swal.fire('Error', 'Failed to update project.', 'error');
        }
      } catch (error) {
        console.error("Error updating project:", error);
        Swal.fire('Error', 'An error occurred while updating the project.', 'error');
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
      editHardSkillIndex,
      editHardSkill,
      editHardSkillRow,
      addHardSkillEditRow,
      saveHardSkill,
      cancelHardSkillEdit,
    };
  },
});
</script> 