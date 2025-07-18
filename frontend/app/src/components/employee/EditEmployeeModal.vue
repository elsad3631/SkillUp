<template>
  <div class="modal fade" id="kt_modal_edit_employee" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered mw-900px">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Edit User</h2>
          <div class="btn btn-icon btn-sm btn-active-icon-primary" data-bs-dismiss="modal">
            <KTIcon icon-name="cross" icon-class="fs-1" />
          </div>
        </div>

        <div class="modal-body scroll-y mx-5 mx-xl-15 my-7" style="position:relative;min-height:200px;">
          <Loading v-if="editModalLoading" />
          <form v-else @submit.prevent="onSubmit" class="form" v-if="employee">
            <!-- Account Information -->
            <div class="card mb-6">
              <div class="card-header">
                <h3 class="card-title">Account Information</h3>
              </div>
              <div class="card-body">
                <div class="row mb-6">
                  <div class="col-md-6">
                    <label class="form-label required">Username</label>
                    <input
                      v-model="form.username"
                      type="text"
                      class="form-control"
                      required
                    />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label required">Email</label>
                    <input
                      v-model="form.email"
                      type="email"
                      class="form-control"
                      required
                    />
                  </div>
                </div>

                <div class="row mb-6">
                  <div class="col-md-6">
                    <label class="form-label">Password</label>
                    <input
                      v-model="form.password"
                      type="password"
                      class="form-control"
                      placeholder="Leave empty to keep current password"
                    />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label required">Role</label>
                    <select v-model="form.roles" class="form-select" multiple>
                      <option value="employee">Employee</option>
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="hr">HR</option>
                    </select>
                    <div class="form-text">Hold Ctrl/Cmd to select multiple roles</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Basic Information -->
            <div class="card mb-6">
              <div class="card-header">
                <h3 class="card-title">Personal Information</h3>
              </div>
              <div class="card-body">
                <div class="row mb-6">
                  <div class="col-md-6">
                    <label class="form-label required">First Name</label>
                    <input
                      v-model="form.firstName"
                      type="text"
                      class="form-control"
                      required
                    />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label required">Last Name</label>
                    <input
                      v-model="form.lastName"
                      type="text"
                      class="form-control"
                      required
                    />
                  </div>
                </div>

                <div class="row mb-6">
                  <div class="col-md-6">
                    <label class="form-label required">Email</label>
                    <input
                      v-model="form.email"
                      type="email"
                      class="form-control"
                      required
                    />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Phone</label>
                    <input
                      v-model="form.phone"
                      type="tel"
                      class="form-control"
                    />
                  </div>
                </div>

                <div class="row mb-6">
                  <div class="col-md-6">
                    <label class="form-label">Date of Birth</label>
                    <input
                      v-model="form.dateOfBirth"
                      type="date"
                      class="form-control"
                    />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Place of Birth</label>
                    <input
                      v-model="form.placeOfBirth"
                      type="text"
                      class="form-control"
                    />
                  </div>
                </div>

                <div class="mb-6">
                  <label class="form-label">Address</label>
                  <textarea
                    v-model="form.address"
                    class="form-control"
                    rows="3"
                  ></textarea>
                </div>

                <div class="row mb-6">
                  <div class="col-md-6">
                    <label class="form-label">Current Role</label>
                    <input
                      v-model="form.currentRole"
                      type="text"
                      class="form-control"
                    />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Department</label>
                    <input
                      v-model="form.department"
                      type="text"
                      class="form-control"
                    />
                  </div>
                </div>

                <div class="mb-6">
                  <label class="form-check form-switch">
                    <input
                      v-model="form.isAvailable"
                      class="form-check-input"
                      type="checkbox"
                    />
                    <span class="form-check-label">Available for assignments</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Skills Section -->
            <div class="card mb-6">
              <div class="card-header">
                <h3 class="card-title">Skills</h3>
                <div class="card-toolbar">
                  <button type="button" class="btn btn-sm btn-primary me-2" @click="addHardSkill">
                    <KTIcon icon-name="plus" icon-class="fs-2" />
                    Add Hard Skill
                  </button>
                  <button type="button" class="btn btn-sm btn-secondary" @click="addSoftSkill">
                    <KTIcon icon-name="plus" icon-class="fs-2" />
                    Add Soft Skill
                  </button>
                </div>
              </div>
              <div class="card-body">
                <div class="mb-6">
                  <h4>Hard Skills</h4>
                  <div v-for="(skill, index) in form.hardSkills" :key="`hard-${index}`" class="mb-3 p-3 border rounded">
                    <template v-if="editingHardSkill === index">
                      <div class="row">
                        <div class="col-md-4">
                          <input v-model="skillEdit.name" placeholder="Skill name" class="form-control" />
                        </div>
                        <div class="col-md-3">
                          <select v-model="skillEdit.proficiencyLevel" class="form-select">
                            <option value="">Level</option>
                            <option value="1">1 - Beginner</option>
                            <option value="2">2 - Intermediate</option>
                            <option value="3">3 - Advanced</option>
                            <option value="4">4 - Expert</option>
                            <option value="5">5 - Master</option>
                          </select>
                        </div>
                        <div class="col-md-3">
                          <input v-model="skillEdit.certification" placeholder="Certification" class="form-control" />
                        </div>
                        <div class="col-md-2 d-flex gap-2">
                          <button type="button" class="btn btn-sm btn-success" @click="saveHardSkill(index)">
                            <KTIcon icon-name="check" icon-class="fs-2" />
                          </button>
                          <button type="button" class="btn btn-sm btn-light" @click="cancelEditHardSkill()">
                            <KTIcon icon-name="cross" icon-class="fs-2" />
                          </button>
                        </div>
                      </div>
                    </template>
                    <template v-else>
                      <div class="row align-items-center">
                        <div class="col-md-4">{{ skill.name }}</div>
                        <div class="col-md-3">{{ skill.proficiencyLevel }}</div>
                        <div class="col-md-3">{{ skill.certification }}</div>
                        <div class="col-md-2 d-flex gap-2">
                          <button type="button" class="btn btn-sm btn-warning" @click="editHardSkill(index)">
                            <KTIcon icon-name="pencil" icon-class="fs-2" />
                          </button>
                          <button type="button" class="btn btn-sm btn-danger" @click="deleteHardSkill(index)">
                            <KTIcon icon-name="trash" icon-class="fs-2" />
                          </button>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
                <div class="mb-6">
                  <h4>Soft Skills</h4>
                  <div v-for="(skill, index) in form.softSkills" :key="`soft-${index}`" class="mb-3 p-3 border rounded">
                    <template v-if="editingSoftSkill === index">
                      <div class="row">
                        <div class="col-md-4">
                          <input v-model="softSkillEdit.name" placeholder="Skill name" class="form-control" />
                        </div>
                        <div class="col-md-3">
                          <select v-model="softSkillEdit.proficiencyLevel" class="form-select">
                            <option value="">Level</option>
                            <option value="1">1 - Beginner</option>
                            <option value="2">2 - Intermediate</option>
                            <option value="3">3 - Advanced</option>
                            <option value="4">4 - Expert</option>
                            <option value="5">5 - Master</option>
                          </select>
                        </div>
                        <div class="col-md-3">
                          <input v-model="softSkillEdit.certification" placeholder="Certification" class="form-control" />
                        </div>
                        <div class="col-md-2 d-flex gap-2">
                          <button type="button" class="btn btn-sm btn-success" @click="saveSoftSkill(index)">
                            <KTIcon icon-name="check" icon-class="fs-2" />
                          </button>
                          <button type="button" class="btn btn-sm btn-light" @click="cancelEditSoftSkill()">
                            <KTIcon icon-name="cross" icon-class="fs-2" />
                          </button>
                        </div>
                      </div>
                    </template>
                    <template v-else>
                      <div class="row align-items-center">
                        <div class="col-md-4">{{ skill.name }}</div>
                        <div class="col-md-3">{{ skill.proficiencyLevel }}</div>
                        <div class="col-md-3">{{ skill.certification }}</div>
                        <div class="col-md-2 d-flex gap-2">
                          <button type="button" class="btn btn-sm btn-warning" @click="editSoftSkill(index)">
                            <KTIcon icon-name="pencil" icon-class="fs-2" />
                          </button>
                          <button type="button" class="btn btn-sm btn-danger" @click="deleteSoftSkill(index)">
                            <KTIcon icon-name="trash" icon-class="fs-2" />
                          </button>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>

            <!-- Experience Section -->
            <div class="card mb-6">
              <div class="card-header">
                <h3 class="card-title">Work Experience</h3>
                <div class="card-toolbar">
                  <button type="button" class="btn btn-sm btn-primary" @click="addExperience">
                    <KTIcon icon-name="plus" icon-class="fs-2" />
                    Add Experience
                  </button>
                </div>
              </div>
              <div class="card-body">
                <div v-for="(exp, index) in form.experiences" :key="index" class="mb-4 p-4 border rounded">
                  <template v-if="editingExperience === index">
                    <div class="row mb-3">
                      <div class="col-md-6">
                        <label class="form-label">Job Title</label>
                        <input v-model="experienceEdit.jobTitle" class="form-control" placeholder="e.g. Senior Developer" />
                      </div>
                      <div class="col-md-6">
                        <label class="form-label">Company Name</label>
                        <input v-model="experienceEdit.companyName" class="form-control" placeholder="e.g. Tech Corp" />
                      </div>
                    </div>
                    <div class="row mb-3">
                      <div class="col-md-6">
                        <label class="form-label">Start Date</label>
                        <input v-model="experienceEdit.startDate" type="date" class="form-control" />
                      </div>
                      <div class="col-md-6">
                        <label class="form-label">End Date</label>
                        <input v-model="experienceEdit.endDate" type="date" class="form-control" />
                      </div>
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Description</label>
                      <textarea v-model="experienceEdit.description" class="form-control" rows="3" placeholder="Describe your role and responsibilities..."></textarea>
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Technologies Used</label>
                      <input v-model="experienceEdit.technologiesInput" class="form-control" placeholder="e.g. JavaScript, Vue.js, Node.js" @blur="updateTechnologiesEdit()" />
                    </div>
                    <div class="text-end">
                      <button type="button" class="btn btn-sm btn-success me-2" @click="saveExperience(index)">
                        <KTIcon icon-name="check" icon-class="fs-2" />
                        Save
                      </button>
                      <button type="button" class="btn btn-sm btn-light" @click="cancelEditExperience()">
                        <KTIcon icon-name="cross" icon-class="fs-2" />
                        Cancel
                      </button>
                    </div>
                  </template>
                  <template v-else>
                    <div class="row mb-3">
                      <div class="col-md-6"><strong>{{ exp.jobTitle }}</strong></div>
                      <div class="col-md-6"><strong>{{ exp.companyName }}</strong></div>
                    </div>
                    <div class="row mb-3">
                      <div class="col-md-6">{{ exp.startDate }}</div>
                      <div class="col-md-6">{{ exp.endDate }}</div>
                    </div>
                    <div class="mb-3">{{ exp.description }}</div>
                    <div class="mb-3">{{ exp.technologiesUsed?.join(', ') }}</div>
                    <div class="text-end">
                      <button type="button" class="btn btn-sm btn-warning me-2" @click="editExperience(index)">
                        <KTIcon icon-name="pencil" icon-class="fs-2" />
                        Edit
                      </button>
                      <button type="button" class="btn btn-sm btn-danger" @click="deleteExperience(index)">
                        <KTIcon icon-name="trash" icon-class="fs-2" />
                        Delete
                      </button>
                    </div>
                  </template>
                </div>
              </div>
            </div>

            <!-- CV Data Section -->
            <div class="card mb-6">
              <div class="card-header">
                <h3 class="card-title">CV Information</h3>
              </div>
              <div class="card-body">
                <div class="row mb-6">
                  <div class="col-md-6">
                    <label class="form-label">CV File Name</label>
                    <input
                      v-model="form.cvData.fileName"
                      type="text"
                      class="form-control"
                      placeholder="e.g. john_doe_cv.pdf"
                    />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">CV URL</label>
                    <input
                      v-model="form.cvData.storageUrl"
                      type="url"
                      class="form-control"
                      placeholder="https://example.com/cv.pdf"
                    />
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
                <span v-else class="indicator-label">Update Employee</span>
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
import { updateEmployee } from "@/core/services/businessServices/Employee";
import type { Employee } from "@/core/models/Employee";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { updateSkill, deleteSkill, createSkill } from "@/core/services/businessServices/Skill";
import { updateExperience, deleteExperience, createExperience } from "@/core/services/businessServices/Experience";
import type { Skill } from "@/core/models/Skill";
import type { Experience } from "@/core/models/Experience";
import Loading from "@/components/kt-datatable/table-partials/Loading.vue";

export default defineComponent({
  name: "EditEmployeeModal",
  components: {
    Loading,
  },
  props: {
    employee: {
      type: Object as () => Employee | null,
      default: null,
    },
    closeModal: {
      type: Function,
      required: false,
      default: undefined,
    },
    editModalLoading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["employee-updated"],
  setup(props, { emit }) {
    const loading = ref(false);

    const form = reactive({
      username: "",
      email: "",
      password: "",
      roles: [] as string[],
      firstName: "",
      lastName: "",
      phone: "",
      dateOfBirth: "",
      placeOfBirth: "",
      address: "",
      currentRole: "",
      department: "",
      isAvailable: true,
      hardSkills: [] as any[],
      softSkills: [] as any[],
      experiences: [] as any[],
      cvData: {
        fileName: "",
        storageUrl: "",
      },
    });

    const editingHardSkill = ref<number|null>(null);
    const skillEdit = reactive({ name: '', proficiencyLevel: '', certification: '' });
    const editingSoftSkill = ref<number|null>(null);
    const softSkillEdit = reactive({ name: '', proficiencyLevel: '', certification: '' });
    const editingExperience = ref<number|null>(null);
    const experienceEdit = reactive({ jobTitle: '', companyName: '', startDate: '', endDate: '', description: '', technologiesInput: '', technologiesUsed: [] as string[] });

    // Watch for changes in employee prop and populate form
    watch(() => props.employee, (newEmployee) => {
      if (newEmployee) {
        form.username = (newEmployee as any).username || "";
        form.email = newEmployee.email || "";
        form.password = ""; // Never populate password field
        form.roles = (newEmployee as any).roles || ["employee"];
        form.firstName = newEmployee.first_name || newEmployee['firstName'] || "";
        form.lastName = newEmployee.last_name || newEmployee['lastName'] || "";
        form.phone = newEmployee.phone || "";
        form.dateOfBirth = newEmployee.date_of_birth
          ? new Date(newEmployee.date_of_birth).toISOString().split('T')[0]
          : (newEmployee['dateOfBirth'] ? new Date(newEmployee['dateOfBirth']).toISOString().split('T')[0] : "");
        form.placeOfBirth = newEmployee.place_of_birth || newEmployee['placeOfBirth'] || "";
        form.address = newEmployee.address || "";
        form.currentRole = newEmployee.current_role || newEmployee['currentRole'] || "";
        form.department = newEmployee.department || "";
        form.isAvailable = newEmployee.is_available ?? newEmployee['isAvailable'] ?? true;
        // Skills
        const hardSkills = newEmployee.hard_skills || newEmployee['hardSkills'];
        form.hardSkills = hardSkills?.map(skill => ({
          id: skill.id, // aggiunto id
          name: skill.name || "",
          proficiencyLevel: skill.proficiency_level?.toString() || skill['proficiencyLevel']?.toString() || "",
          certification: skill.certification || "",
        })) || [];
        const softSkills = newEmployee.soft_skills || newEmployee['softSkills'];
        form.softSkills = softSkills?.map(skill => ({
          id: skill.id, // aggiunto id anche qui per coerenza futura
          name: skill.name || "",
          proficiencyLevel: skill.proficiency_level?.toString() || skill['proficiencyLevel']?.toString() || "",
          certification: skill.certification || "",
        })) || [];
        // Experience
        const experiences = newEmployee.experiences;
        form.experiences = experiences?.map(exp => ({
          jobTitle: exp.job_title || exp['jobTitle'] || '',
          companyName: exp.company_name || exp['companyName'] || '',
          startDate: exp.start_date || exp['startDate'] || '',
          endDate: exp.end_date || exp['endDate'] || '',
          description: exp.description || '',
          technologiesUsed: exp['technologiesUsed'] || exp.technologies_used || [],
        })) || [];
        // CV data
        const cvData = newEmployee.cv_data || newEmployee['cvData'];
        form.cvData = {
          fileName: cvData?.file_name || cvData?.['fileName'] || "",
          storageUrl: cvData?.storage_url || cvData?.['storageUrl'] || "",
        };
      }
    }, { immediate: true });

    const addHardSkill = () => {
      form.hardSkills.push({
        name: "",
        proficiencyLevel: "",
        certification: "",
      });
      editingHardSkill.value = form.hardSkills.length - 1;
      Object.assign(skillEdit, form.hardSkills[editingHardSkill.value]);
    };

    const removeHardSkill = (index: number) => {
      form.hardSkills.splice(index, 1);
    };

    const addSoftSkill = () => {
      form.softSkills.push({
        name: "",
        proficiencyLevel: "",
        certification: "",
      });
      editingSoftSkill.value = form.softSkills.length - 1;
      Object.assign(softSkillEdit, form.softSkills[editingSoftSkill.value]);
    };

    const removeSoftSkill = (index: number) => {
      form.softSkills.splice(index, 1);
    };

    const addExperience = () => {
      form.experiences.push({
        jobTitle: "",
        companyName: "",
        startDate: "",
        endDate: "",
        description: "",
        technologiesInput: "",
        technologiesUsed: [],
      });
      editingExperience.value = form.experiences.length - 1;
      Object.assign(experienceEdit, form.experiences[editingExperience.value]);
    };

    const removeExperience = (index: number) => {
      form.experiences.splice(index, 1);
    };

    const updateTechnologies = (index: number) => {
      const exp = form.experiences[index];
      if (exp.technologiesInput) {
        exp.technologiesUsed = exp.technologiesInput
          .split(',')
          .map(tech => tech.trim())
          .filter(tech => tech.length > 0);
      }
    };

    function editHardSkill(index: number) {
      editingHardSkill.value = index;
      Object.assign(skillEdit, form.hardSkills[index]);
    }
    function cancelEditHardSkill() {
      editingHardSkill.value = null;
    }
    async function saveHardSkill(index: number) {
      const skill = form.hardSkills[index];
      try {
        if (skill.id) {
          await updateSkill(skill.id, { name: skillEdit.name, proficiencyLevel: Number(skillEdit.proficiencyLevel), certification: skillEdit.certification } as Partial<Skill>);
          Object.assign(skill, skillEdit);
        } else {
          // Nuova skill: chiama createSkill
          const created = await createSkill({
            name: skillEdit.name,
            proficiencyLevel: Number(skillEdit.proficiencyLevel),
            certification: skillEdit.certification,
            // Associa la skill all'employee giusto
            employeeHardId: props.employee?.id,
          });
          if (created && created.id) {
            Object.assign(skill, { ...skillEdit, id: created.id });
          } else {
            throw new Error('Skill not created');
          }
        }
        editingHardSkill.value = null;
        Swal.fire({ icon: 'success', title: 'Skill saved!' });
      } catch (e) {
        Swal.fire({ icon: 'error', title: 'Error saving skill' });
      }
    }
    async function deleteHardSkill(index: number) {
      const skill = form.hardSkills[index];
      if (skill.id) {
        try {
          await deleteSkill(skill.id);
          form.hardSkills.splice(index, 1);
          Swal.fire({ icon: 'success', title: 'Skill deleted!' });
        } catch (e) {
          Swal.fire({ icon: 'error', title: 'Error deleting skill' });
        }
      } else {
        form.hardSkills.splice(index, 1);
      }
    }
    // Soft skills analoghi
    function editSoftSkill(index: number) {
      editingSoftSkill.value = index;
      Object.assign(softSkillEdit, form.softSkills[index]);
    }
    function cancelEditSoftSkill() {
      editingSoftSkill.value = null;
    }
    async function saveSoftSkill(index: number) {
      const skill = form.softSkills[index];
      try {
        if (skill.id) {
          await updateSkill(skill.id, { name: softSkillEdit.name, proficiencyLevel: Number(softSkillEdit.proficiencyLevel), certification: softSkillEdit.certification } as Partial<Skill>);
          Object.assign(skill, softSkillEdit);
        } else {
          // Nuova skill: chiama createSkill
          const created = await createSkill({
            name: softSkillEdit.name,
            proficiencyLevel: Number(softSkillEdit.proficiencyLevel),
            certification: softSkillEdit.certification,
            employeeSoftId: props.employee?.id,
          });
          if (created && created.id) {
            Object.assign(skill, { ...softSkillEdit, id: created.id });
          } else {
            throw new Error('Skill not created');
          }
        }
        editingSoftSkill.value = null;
        Swal.fire({ icon: 'success', title: 'Skill saved!' });
      } catch (e) {
        Swal.fire({ icon: 'error', title: 'Error saving skill' });
      }
    }
    async function deleteSoftSkill(index: number) {
      const skill = form.softSkills[index];
      if (skill.id) {
        try {
          await deleteSkill(skill.id);
          form.softSkills.splice(index, 1);
          Swal.fire({ icon: 'success', title: 'Skill deleted!' });
        } catch (e) {
          Swal.fire({ icon: 'error', title: 'Error deleting skill' });
        }
      } else {
        form.softSkills.splice(index, 1);
      }
    }
    // Experience analoghi
    function editExperience(index: number) {
      editingExperience.value = index;
      Object.assign(experienceEdit, form.experiences[index]);
    }
    function cancelEditExperience() {
      editingExperience.value = null;
    }
    function updateTechnologiesEdit() {
      if (experienceEdit.technologiesInput) {
        experienceEdit.technologiesUsed = experienceEdit.technologiesInput.split(',').map(t => t.trim()).filter(t => t.length > 0) as string[];
      }
    }
    async function saveExperience(index: number) {
      const exp = form.experiences[index];
      try {
        if (exp.id) {
          await updateExperience(exp.id, {
            jobTitle: experienceEdit.jobTitle,
            companyName: experienceEdit.companyName,
            startDate: experienceEdit.startDate ? new Date(experienceEdit.startDate) : undefined,
            endDate: experienceEdit.endDate ? new Date(experienceEdit.endDate) : undefined,
            description: experienceEdit.description,
            technologiesUsed: experienceEdit.technologiesUsed,
          });
          Object.assign(exp, experienceEdit);
        } else {
          // Nuova experience: chiama createExperience
          const created = await createExperience({
            jobTitle: experienceEdit.jobTitle,
            companyName: experienceEdit.companyName,
            startDate: experienceEdit.startDate ? new Date(experienceEdit.startDate) : undefined,
            endDate: experienceEdit.endDate ? new Date(experienceEdit.endDate) : undefined,
            description: experienceEdit.description,
            technologiesUsed: experienceEdit.technologiesUsed,
            employeeId: props.employee?.id || '',
          });
          if (created && created.id) {
            Object.assign(exp, { ...experienceEdit, id: created.id });
          } else {
            throw new Error('Experience not created');
          }
        }
        editingExperience.value = null;
        Swal.fire({ icon: 'success', title: 'Experience saved!' });
      } catch (e) {
        Swal.fire({ icon: 'error', title: 'Error saving experience' });
      }
    }
    async function deleteExperience(index: number) {
      const exp = form.experiences[index];
      if (exp.id) {
        try {
          await deleteExperience(exp.id);
          form.experiences.splice(index, 1);
          Swal.fire({ icon: 'success', title: 'Experience deleted!' });
        } catch (e) {
          Swal.fire({ icon: 'error', title: 'Error deleting experience' });
        }
      } else {
        form.experiences.splice(index, 1);
      }
    }

    const onSubmit = async () => {
      if (!props.employee) return;
      
      loading.value = true;
      try {
        // Process experiences
        const processedExperiences = form.experiences.map(exp => ({
          jobTitle: exp.jobTitle,
          companyName: exp.companyName,
          startDate: exp.startDate || '',
          endDate: exp.endDate || '',
          description: exp.description,
          technologiesUsed: exp.technologiesUsed,
        }));

        const applicationUserData: any = {
          username: form.username,
          email: form.email,
          roles: form.roles,
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
          dateOfBirth: form.dateOfBirth ? new Date(form.dateOfBirth) : undefined,
          placeOfBirth: form.placeOfBirth,
          address: form.address,
          currentRole: form.currentRole,
          department: form.department,
          isAvailable: form.isAvailable,
          hardSkills: form.hardSkills.filter(skill => skill.name),
          softSkills: form.softSkills.filter(skill => skill.name),
          experiences: processedExperiences,
          cvData: form.cvData.fileName || form.cvData.storageUrl ? {
            fileName: form.cvData.fileName,
            storageUrl: form.cvData.storageUrl,
          } : undefined,
        };

        // Add password only if provided
        if (form.password && form.password.trim()) {
          applicationUserData.passwordHash = form.password;
        }

        // Call ApplicationUser API using the service
        const result = await updateEmployee(props.employee.id, applicationUserData);
        emit("employee-updated", result);
        Swal.fire({
          icon: 'success',
          title: 'User updated!',
          text: 'The user has been updated successfully.'
        });
        if (props.closeModal) props.closeModal();
        // La modale si chiude solo tramite data-bs-dismiss o pulsante Cancel
      } catch (error) {
        console.error("Error updating employee:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an error updating the employee.'
        });
      } finally {
        loading.value = false;
      }
    };

    return {
      form,
      loading,
      onSubmit,
      addHardSkill,
      addSoftSkill,
      removeHardSkill,
      removeSoftSkill,
      addExperience,
      removeExperience,
      updateTechnologies,
      editingHardSkill,
      skillEdit,
      editingSoftSkill,
      softSkillEdit,
      editingExperience,
      experienceEdit,
      updateTechnologiesEdit,
      editHardSkill,
      cancelEditHardSkill,
      saveHardSkill,
      deleteHardSkill,
      editSoftSkill,
      cancelEditSoftSkill,
      saveSoftSkill,
      deleteSoftSkill,
      editExperience,
      cancelEditExperience,
      saveExperience,
      deleteExperience,
    };
  },
});
</script> 