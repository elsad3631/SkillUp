<template>
  <div class="modal fade" id="kt_modal_add_employee" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered mw-900px">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Aggiungi Nuovo Utente</h2>
          <div class="btn btn-icon btn-sm btn-active-icon-primary" data-bs-dismiss="modal">
            <KTIcon icon-name="cross" icon-class="fs-1" />
          </div>
        </div>

        <div class="modal-body scroll-y mx-5 mx-xl-15 my-7">
          <!-- Tabs -->
          <ul class="nav nav-tabs mb-5" role="tablist">
            <li class="nav-item" role="presentation">
              <button class="nav-link" :class="{active: activeTab==='manual'}" @click="activeTab='manual'" type="button" role="tab">Manuale</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" :class="{active: activeTab==='cv'}" @click="activeTab='cv'" type="button" role="tab">Da CV</button>
            </li>
          </ul>

          <div v-if="activeTab==='cv'">
            <div class="mb-4">
              <label class="form-label">Carica CV (.pdf, .docx)</label>
              <input type="file" class="form-control" accept=".pdf,.docx" @change="onFileChange" />
              <div class="form-text mt-2">
                <strong>Nota:</strong> Caricando il CV, l'utente verrà creato automaticamente nel sistema con le credenziali temporanee.
              </div>
            </div>
            <button class="btn btn-primary" :disabled="cvLoading || !cvFile" @click="extractFromCV">
              <span v-if="cvLoading" class="spinner-border spinner-border-sm me-2"></span>
              Crea utente da CV
            </button>
          </div>

          <form v-if="activeTab==='manual'" @submit.prevent="onSubmit" class="form">
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
                    <label class="form-label required">Password</label>
                    <input
                      v-model="form.password"
                      type="password"
                      class="form-control"
                      required
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
                  <div class="col-md-12">
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
            <!--
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
                <div class="row mb-6">
                  <div class="col-md-6">
                    <h4>Hard Skills</h4>
                    <div v-for="(skill, index) in form.hardSkills" :key="`hard-${index}`" class="mb-3 p-3 border rounded">
                      <div class="row">
                        <div class="col-md-4">
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
                          <button type="button" class="btn btn-sm btn-danger" @click="removeHardSkill(index)">
                            <KTIcon icon-name="trash" icon-class="fs-2" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <h4>Soft Skills</h4>
                    <div v-for="(skill, index) in form.softSkills" :key="`soft-${index}`" class="mb-3 p-3 border rounded">
                      <div class="row">
                        <div class="col-md-4">
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
                          <button type="button" class="btn btn-sm btn-danger" @click="removeSoftSkill(index)">
                            <KTIcon icon-name="trash" icon-class="fs-2" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            -->

            <!-- Experience Section -->
            <!--
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
                  <div class="row mb-3">
                    <div class="col-md-6">
                      <label class="form-label">Job Title</label>
                      <input v-model="exp.jobTitle" class="form-control" placeholder="e.g. Senior Developer" />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Company Name</label>
                      <input v-model="exp.companyName" class="form-control" placeholder="e.g. Tech Corp" />
                    </div>
                  </div>
                  <div class="row mb-3">
                    <div class="col-md-6">
                      <label class="form-label">Start Date</label>
                      <input v-model="exp.startDate" type="date" class="form-control" />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">End Date</label>
                      <input v-model="exp.endDate" type="date" class="form-control" />
                      <div class="form-check mt-2">
                        <input v-model="exp.current" class="form-check-input" type="checkbox" />
                        <label class="form-check-label">Current Position</label>
                      </div>
                    </div>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Description</label>
                    <textarea v-model="exp.description" class="form-control" rows="3" placeholder="Describe your role and responsibilities..."></textarea>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Technologies Used</label>
                    <input v-model="exp.technologiesInput" class="form-control" placeholder="e.g. JavaScript, Vue.js, Node.js" @blur="updateTechnologies(index)" />
                  </div>
                  <div class="text-end">
                    <button type="button" class="btn btn-sm btn-danger" @click="removeExperience(index)">
                      <KTIcon icon-name="trash" icon-class="fs-2" />
                      Remove Experience
                    </button>
                  </div>
                </div>
              </div>
            </div>
            -->

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
                <span v-else class="indicator-label">Add Employee</span>
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
import { createEmployee } from "@/core/services/businessServices/Employee";
import type { Employee } from "@/core/models/Employee";
import Swal from "sweetalert2/dist/sweetalert2.js";
import axios from "axios";

export default defineComponent({
  name: "AddEmployeeModal",
  emits: ["employee-created"],
  props: {
    closeModal: {
      type: Function,
      required: false,
      default: undefined,
    },
  },
  setup(props, { emit }) {
    const loading = ref(false);
    const activeTab = ref<'manual'|'cv'>('manual');
    const cvFile = ref<File|null>(null);
    const cvLoading = ref(false);
    const cvPrompt = ref('');
    const skillsList = ref('');

    const form = reactive({
      username: "mario.rossi",
      email: "mario.rossi@example.com",
      password: "",
      roles: ["employee"],
      firstName: "Mario",
      lastName: "Rossi",
      phone: "+391234567890",
      dateOfBirth: "1990-01-01",
      placeOfBirth: "Roma",
      address: "Via Roma 1, 00100 Roma",
      currentRole: "Frontend Developer",
      department: "IT",
      isAvailable: true,
      hardSkills: [
        { name: "JavaScript", proficiencyLevel: "4", certification: "" },
        { name: "Vue.js", proficiencyLevel: "3", certification: "" }
      ],
      softSkills: [
        { name: "Teamwork", proficiencyLevel: "5", certification: "" },
        { name: "Problem Solving", proficiencyLevel: "4", certification: "" }
      ],
      experiences: [
        {
          jobTitle: "Frontend Developer",
          companyName: "Web Agency",
          startDate: "2018-01-01",
          endDate: "2022-12-31",
          current: false,
          description: "Sviluppo di applicazioni web in Vue.js",
          technologiesInput: "JavaScript, Vue.js, HTML, CSS",
          technologiesUsed: ["JavaScript", "Vue.js", "HTML", "CSS"]
        }
      ],
      cvData: {
        fileName: "mario_rossi_cv.pdf",
        storageUrl: "https://example.com/mario_rossi_cv.pdf",
      },
    });

    const addHardSkill = () => {
      form.hardSkills.push({
        name: "",
        proficiencyLevel: "",
        certification: "",
      });
    };
    const addSoftSkill = () => {
      form.softSkills.push({
        name: "",
        proficiencyLevel: "",
        certification: "",
      });
    };

    const removeHardSkill = (index: number) => {
      form.hardSkills.splice(index, 1);
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
        current: false,
        description: "",
        technologiesInput: "",
        technologiesUsed: [],
      });
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

    const onFileChange = (e: Event) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        cvFile.value = files[0];
      } else {
        cvFile.value = null;
      }
    };

    const extractFromCV = async () => {
      if (!cvFile.value) return;
      cvLoading.value = true;
      try {
        const data = new FormData();
        data.append('cv', cvFile.value);
        const res = await axios.post('http://localhost:7071/api/ExtractCVData', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        const result = res.data;
        
        if (result.success) {
          // L'utente è stato creato automaticamente nel database
          emit("employee-created", result.data);
          
          // Mostra messaggio di successo con le credenziali temporanee
          await Swal.fire({
            icon: 'success',
            title: 'Utente creato con successo!',
            html: `
              <p><strong>L'utente è stato creato automaticamente dal CV.</strong></p>
              <br>
              <p><strong>Credenziali di accesso:</strong></p>
              <p>Username: <code>${result.data.username}</code></p>
              <p>Password temporanea: <code>${result.data.temporaryPassword}</code></p>
              <br>
              <p><em>Comunicare queste credenziali all'utente per il primo accesso.</em></p>
            `,
            confirmButtonText: 'Ho preso nota delle credenziali',
            allowOutsideClick: false,
          });
          
          // Chiudi il modal
          if (props.closeModal) props.closeModal();
          
          // Reset del form e ritorna al tab manuale per eventuali future operazioni
          activeTab.value = 'manual';
          cvFile.value = null;
          
          // Reset form
          Object.assign(form, {
            username: "",
            email: "",
            password: "",
            roles: ["employee"],
            firstName: "",
            lastName: "",
            phone: "",
            dateOfBirth: "",
            placeOfBirth: "",
            address: "",
            currentRole: "",
            department: "",
            isAvailable: true,
            hardSkills: [],
            softSkills: [],
            experiences: [],
            cvData: { fileName: "", storageUrl: "" },
          });
        } else {
          throw new Error(result.message || 'Errore nella creazione utente');
        }
      } catch (err: any) {
        console.error('Errore estrazione CV:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Estrazione dati dal CV fallita.';
        Swal.fire({ 
          icon: 'error', 
          title: 'Errore', 
          text: errorMessage 
        });
      } finally {
        cvLoading.value = false;
      }
    };

    const onSubmit = async () => {
      loading.value = true;
      try {
        // Process experiences (solo se valorizzate)
        const processedExperiences = form.experiences
          .filter(exp => exp.jobTitle && exp.companyName && exp.startDate)
          .map(exp => ({
            jobTitle: exp.jobTitle?.trim(),
            companyName: exp.companyName?.trim(),
            startDate: exp.startDate ? new Date(exp.startDate) : undefined,
            endDate: exp.current ? undefined : (exp.endDate ? new Date(exp.endDate) : undefined),
            description: exp.description?.trim(),
            technologiesUsed: exp.technologiesUsed?.map(t => t.trim()),
          }));

        // Skills (solo se valorizzate)
        const processedHardSkills = form.hardSkills
          .filter(skill => skill.name)
          .map(skill => ({
            name: skill.name?.trim(),
            proficiencyLevel: skill.proficiencyLevel ? Number(skill.proficiencyLevel) : undefined,
            certification: skill.certification?.trim(),
          }));
        const processedSoftSkills = form.softSkills
          .filter(skill => skill.name)
          .map(skill => ({
            name: skill.name?.trim(),
            proficiencyLevel: skill.proficiencyLevel ? Number(skill.proficiencyLevel) : undefined,
            certification: skill.certification?.trim(),
          }));

        // CV Data (solo se valorizzato)
        const processedCvData = (form.cvData.fileName || form.cvData.storageUrl) ? {
          fileName: form.cvData.fileName?.trim(),
          storageUrl: form.cvData.storageUrl?.trim(),
        } : undefined;

        // Costruisco l'oggetto applicationUser con nomi camelCase e solo campi valorizzati
        const applicationUserData: any = {
          username: form.username?.trim(),
          email: form.email?.trim(),
          passwordHash: form.password, // In production, this should be hashed on server
          roles: form.roles || ["employee"],
          firstName: form.firstName?.trim(),
          lastName: form.lastName?.trim(),
          isAvailable: form.isAvailable,
        };
        if (form.phone) applicationUserData.phone = form.phone.trim();
        if (form.dateOfBirth) applicationUserData.dateOfBirth = new Date(form.dateOfBirth);
        if (form.placeOfBirth) applicationUserData.placeOfBirth = form.placeOfBirth.trim();
        if (form.address) applicationUserData.address = form.address.trim();
        if (form.currentRole) applicationUserData.currentRole = form.currentRole.trim();
        if (form.department) applicationUserData.department = form.department.trim();
        if (processedHardSkills.length > 0) applicationUserData.hardSkills = processedHardSkills;
        if (processedSoftSkills.length > 0) applicationUserData.softSkills = processedSoftSkills;
        if (processedExperiences.length > 0) applicationUserData.experiences = processedExperiences;
        if (processedCvData) applicationUserData.cvData = processedCvData;

        // Call ApplicationUser API
        const response = await fetch('/api/applicationuser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(applicationUserData),
        });
        
        if (!response.ok) {
          throw new Error('Failed to create user');
        }
        
        const result = await response.json();
        emit("employee-created", result); // Keep same event name for compatibility
        Swal.fire({
          icon: 'success',
          title: 'User created!',
          text: 'The user has been added successfully.'
        });
        if (props.closeModal) props.closeModal();
        // Reset form
        Object.assign(form, {
          username: "",
          email: "",
          password: "",
          roles: ["employee"],
          firstName: "",
          lastName: "",
          phone: "",
          dateOfBirth: "",
          placeOfBirth: "",
          address: "",
          currentRole: "",
          department: "",
          isAvailable: true,
          hardSkills: [],
          softSkills: [],
          experiences: [],
          cvData: { fileName: "", storageUrl: "" },
        });
      } catch (error) {
        console.error("Error creating employee:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an error creating the employee.'
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
      activeTab,
      cvFile,
      cvLoading,
      cvPrompt,
      skillsList,
      onFileChange,
      extractFromCV,
    };
  },
});
</script> 