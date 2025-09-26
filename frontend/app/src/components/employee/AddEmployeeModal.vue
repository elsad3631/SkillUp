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
            
            <!-- Role Selection for CV Creation -->
            <div class="mb-4">
              <label class="form-label required">Ruolo</label>
              <select v-model="cvForm.roles" class="form-select" multiple>
                <option v-for="role in roles" :key="role.id" :value="role.name">
                  {{ role.description || role.name }}
                </option>
              </select>
              <div class="form-text">Hold Ctrl/Cmd to select multiple roles</div>
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
                      <option v-for="role in roles" :key="role.id" :value="role.name">
                        {{ role.description || role.name }}
                      </option>
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

                <div class="row mb-6">
                  <div class="col-md-6">
                    <label class="form-label">Codice Fiscale</label>
                    <input
                      v-model="form.fiscalCode"
                      type="text"
                      class="form-control"
                      placeholder="RSSMRA80A01H501Z"
                      maxlength="16"
                      @input="validateFiscalCode"
                      :class="{ 'is-invalid': fiscalCodeError }"
                    />
                    <div v-if="fiscalCodeError" class="invalid-feedback">
                      {{ fiscalCodeError }}
                    </div>
                    <div class="form-text">Formato: 16 caratteri alfanumerici (es. RSSMRA80A01H501Z)</div>
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

            <!-- CV Data Section - Only visible when CV is uploaded -->
            <div v-if="form.cvData.fileName || form.cvData.storageUrl" class="card mb-6">
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
                      readonly
                    />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">CV URL</label>
                    <input
                      v-model="form.cvData.storageUrl"
                      type="url"
                      class="form-control"
                      placeholder="https://example.com/cv.pdf"
                      readonly
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
import { defineComponent, ref, reactive, onMounted } from "vue";
import { createEmployee, extractCVData } from "@/core/services/businessServices/Employee";
import { getAvailableRolesForUser, type Role } from "@/core/services/businessServices/Role";
import type { Employee } from "@/core/models/Employee";
import { useToast } from "vue-toastification";
import { useCurrentUser } from "@/core/composables/useCurrentUser";

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
    const toast = useToast();
    const loading = ref(false);
    const activeTab = ref<'manual'|'cv'>('manual');
    const cvFile = ref<File|null>(null);
    const cvLoading = ref(false);
    const cvPrompt = ref('');
    const skillsList = ref('');
    const fiscalCodeError = ref('');
    const roles = ref<Role[]>([]);
    const { currentUser } = useCurrentUser();

    // Load roles from database
    const loadRoles = async () => {
      try {
        const loadedRoles = await getAvailableRolesForUser();
        roles.value = loadedRoles;
        
        // Set default roles for forms if they're empty
        if (loadedRoles.length > 0) {
          const defaultRole = loadedRoles[0].name;
          if (form.roles.length === 0) {
            form.roles = [defaultRole];
          }
          if (cvForm.roles.length === 0) {
            cvForm.roles = [defaultRole];
          }
        }
      } catch (error) {
        console.error('Error loading roles:', error);
        // Fallback to default roles if API fails
        roles.value = [
          { id: '1', name: 'employee', description: 'Employee', isActive: true, createdAt: new Date(), updatedAt: new Date() },
          { id: '2', name: 'admin', description: 'Administrator', isActive: true, createdAt: new Date(), updatedAt: new Date() },
          { id: '3', name: 'manager', description: 'Manager', isActive: true, createdAt: new Date(), updatedAt: new Date() },
          { id: '4', name: 'hr', description: 'Human Resources', isActive: true, createdAt: new Date(), updatedAt: new Date() }
        ];
        
        // Set default roles for forms
        if (form.roles.length === 0) {
          form.roles = ['employee'];
        }
        if (cvForm.roles.length === 0) {
          cvForm.roles = ['employee'];
        }
      }
    };

    // Load roles when component mounts
    onMounted(() => {
      loadRoles();
    });

    // Separate form for CV creation
    const cvForm = reactive({
      roles: [] as string[],
    });

    const form = reactive({
      username: "mario.rossi",
      email: "mario.rossi@example.com",
      password: "",
      roles: [] as string[],
      firstName: "Mario",
      lastName: "Rossi",
      phone: "+391234567890",
      dateOfBirth: "1990-01-01",
      placeOfBirth: "Roma",
      fiscalCode: "RSSMRA90A01H501Z",
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
        fileName: "",
        storageUrl: "",
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
        // Mostra messaggio di operazione in corso
        toast.info('Elaborazione CV in corso... L\'utente verrà creato in background. Riceverai una notifica quando l\'operazione sarà completata.');

        // Invia la richiesta in background senza attendere la risposta
        extractCVData(cvFile.value, currentUser.value?.id, cvForm.roles, currentUser.value?.company)
          .then((result) => {
            // Log del successo per debug
            console.log('CV elaborato con successo:', result);
            
            // Emetti l'evento per aggiornare la lista degli utenti
            emit("employee-created", result.user);
          })
          .catch((err) => {
            // Log dell'errore per debug
            console.error('Errore estrazione CV:', err);
          });
        
        // Reset del form e chiudi modal immediatamente
        resetForm();
        if (props.closeModal) props.closeModal();
        
      } catch (err: any) {
        // Log dell'errore per debug
        console.error('Errore preparazione CV:', err);
        
        // Mostra messaggio di errore solo per errori di preparazione
        toast.error(err.message || 'Si è verificato un errore durante la preparazione del CV.');
      } finally {
        cvLoading.value = false;
      }
    };

    const resetForm = () => {
      // Reset del form e ritorna al tab manuale per eventuali future operazioni
      activeTab.value = 'manual';
      cvFile.value = null;
      fiscalCodeError.value = '';
      
      // Reset cvForm - use first available role or empty array
      cvForm.roles = roles.value.length > 0 ? [roles.value[0].name] : [];
      
      // Reset form - use first available role or empty array
      const defaultRole = roles.value.length > 0 ? [roles.value[0].name] : [];
      Object.assign(form, {
        username: "",
        email: "",
        password: "",
        roles: defaultRole,
        firstName: "",
        lastName: "",
        phone: "",
        dateOfBirth: "",
        placeOfBirth: "",
        fiscalCode: "",
        address: "",
        currentRole: "",
        department: "",
        isAvailable: true,
        hardSkills: [],
        softSkills: [],
        experiences: [],
        cvData: { fileName: "", storageUrl: "" },
      });
    };

    const validateFiscalCode = () => {
      const fiscalCode = form.fiscalCode?.trim().toUpperCase();
      fiscalCodeError.value = '';
      
      if (!fiscalCode) {
        return; // Campo opzionale
      }
      
      // Regex per codice fiscale italiano
      const fiscalCodeRegex = /^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/;
      
      if (fiscalCode.length !== 16) {
        fiscalCodeError.value = 'Il codice fiscale deve essere di 16 caratteri';
        return;
      }
      
      if (!fiscalCodeRegex.test(fiscalCode)) {
        fiscalCodeError.value = 'Formato codice fiscale non valido';
        return;
      }
      
      // Aggiorna il valore nel form con il formato corretto
      form.fiscalCode = fiscalCode;
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

        // Determina il campo company basato sull'utente corrente
        let companyId: string | undefined;
        if (currentUser.value) {
          const userRoles = currentUser.value.userRoles || [];
          const isSuperAdmin = userRoles.some((ur: any) => ur.name === 'superadmin');
          
          if (isSuperAdmin) {
            // Se l'utente corrente è super admin, il nuovo utente viene associato alla sua società
            companyId = currentUser.value.company || currentUser.value.id;
          } else {
            // Se l'utente corrente non è super admin, il nuovo utente viene associato alla società dell'utente corrente
            companyId = currentUser.value.company;
          }
        }

        // Costruisco l'oggetto applicationUser con nomi camelCase e solo campi valorizzati
        const applicationUserData: any = {
          username: form.username?.trim(),
          email: form.email?.trim(),
          passwordHash: form.password, // Password in chiaro - verrà hashata dal backend
          roles: form.roles || ["employee"],
          firstName: form.firstName?.trim(),
          lastName: form.lastName?.trim(),
          isAvailable: form.isAvailable,
        };
        if (form.phone) applicationUserData.phone = form.phone.trim();
        if (form.dateOfBirth) applicationUserData.dateOfBirth = new Date(form.dateOfBirth);
        if (form.placeOfBirth) applicationUserData.placeOfBirth = form.placeOfBirth.trim();
        if (form.fiscalCode) applicationUserData.fiscalCode = form.fiscalCode.trim().toUpperCase();
        if (form.address) applicationUserData.address = form.address.trim();
        if (form.currentRole) applicationUserData.currentRole = form.currentRole.trim();
        if (form.department) applicationUserData.department = form.department.trim();
        if (companyId) applicationUserData.company = companyId;
        if (processedHardSkills.length > 0) applicationUserData.hardSkills = processedHardSkills;
        if (processedSoftSkills.length > 0) applicationUserData.softSkills = processedSoftSkills;
        if (processedExperiences.length > 0) applicationUserData.experiences = processedExperiences;
        if (processedCvData) applicationUserData.cvData = processedCvData;

        // Call ApplicationUser API using the service
        const result = await createEmployee(applicationUserData);
        emit("employee-created", result); // Keep same event name for compatibility
        toast.success('User created! The user has been added successfully.');
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
          fiscalCode: "",
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
        toast.error('There was an error creating the employee.');
      } finally {
        loading.value = false;
      }
    };

    return {
      form,
      cvForm,
      roles,
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
      resetForm,
      fiscalCodeError,
      validateFiscalCode,
    };
  },
});
</script> 