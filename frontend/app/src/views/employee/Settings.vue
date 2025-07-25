<template>
  <!--begin::Loading State for Settings-->
  <div v-if="!employee" class="d-flex justify-content-center align-items-center" style="min-height: 300px;">
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
      data-bs-target="#kt_account_profile_details"
      aria-expanded="true"
      aria-controls="kt_account_profile_details"
    >
      <!--begin::Card title-->
      <div class="card-title m-0">
        <h3 class="fw-bold m-0">Profile Details</h3>
      </div>
      <!--end::Card title-->
    </div>
    <!--begin::Card header-->

    <!--begin::Content-->
    <div id="kt_account_profile_details" class="collapse show">
      <!--begin::Form-->
      <form
        id="kt_account_profile_details_form"
        class="form"
        @submit.prevent="saveChanges1()"
      >
        <!--begin::Card body-->
        <div class="card-body border-top p-9">
          <!--begin::Input group-->
          <div class="row mb-6">
            <!--begin::Label-->
            <label class="col-lg-4 col-form-label required fw-semobold fs-6">First Name</label>
            <!--end::Label-->

            <!--begin::Col-->
            <div class="col-lg-8 fv-row">
              <input
                type="text"
                name="firstName"
                class="form-control form-control-lg form-control-solid mb-3 mb-lg-0"
                placeholder="First name"
                v-model="profileDetails.firstName"
              />
            </div>
          </div>
          <!--end::Input group-->

          <div class="row mb-6">
            <label class="col-lg-4 col-form-label required fw-semobold fs-6">Last Name</label>
            <div class="col-lg-8 fv-row">
              <input
                type="text"
                name="lastName"
                class="form-control form-control-lg form-control-solid"
                placeholder="Last name"
                v-model="profileDetails.lastName"
              />
            </div>
          </div>
          <!--end::Input group-->

          <!--begin::Input group-->
          <div class="row mb-6">
            <!--begin::Label-->
            <label class="col-lg-4 col-form-label fw-semobold fs-6"
              >Department</label
            >
            <!--end::Label-->

            <!--begin::Col-->
            <div class="col-lg-8 fv-row">
              <input
                type="text"
                name="department"
                class="form-control form-control-lg form-control-solid"
                placeholder="Department"
                v-model="profileDetails.department"
              />
            </div>
            <!--end::Col-->
          </div>
          <!--end::Input group-->

          <div class="row mb-6">
            <label class="col-lg-4 col-form-label fw-semobold fs-6">Contact Phone</label>
            <div class="col-lg-8 fv-row">
              <input
                type="tel"
                name="phone"
                class="form-control form-control-lg form-control-solid"
                placeholder="Phone number"
                v-model="profileDetails.phone"
              />
            </div>
          </div>
          <!--end::Input group-->

          <div class="row mb-6">
            <label class="col-lg-4 col-form-label fw-semobold fs-6">Current Role</label>
            <div class="col-lg-8 fv-row">
              <input
                type="text"
                name="currentRole"
                class="form-control form-control-lg form-control-solid"
                placeholder="Current role"
                v-model="profileDetails.currentRole"
              />
            </div>
          </div>
          <!--end::Input group-->

          <div class="row mb-6">
            <label class="col-lg-4 col-form-label fw-semobold fs-6">Available for assignments</label>
            <div class="col-lg-8 fv-row d-flex align-items-center">
              <input
                type="checkbox"
                name="isAvailable"
                class="form-check-input me-2"
                v-model="profileDetails.isAvailable"
              />
              <span class="form-check-label">Available</span>
            </div>
          </div>
          <!--end::Input group-->

          <!--begin::Input group-->
          <div class="row mb-6">
            <label class="col-lg-4 col-form-label required fw-semobold fs-6">Email</label>
            <div class="col-lg-8 fv-row">
              <input
                type="email"
                name="email"
                class="form-control form-control-lg form-control-solid"
                placeholder="Email address"
                v-model="profileDetails.email"
              />
            </div>
          </div>
          <!-- Date of Birth & Place of Birth -->
          <div class="row mb-6">
            <div class="col-lg-6">
              <label class="col-form-label fw-semobold fs-6">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                class="form-control form-control-lg form-control-solid"
                v-model="profileDetails.dateOfBirth"
              />
            </div>
            <div class="col-lg-6">
              <label class="col-form-label fw-semobold fs-6">Place of Birth</label>
              <input
                type="text"
                name="placeOfBirth"
                class="form-control form-control-lg form-control-solid"
                placeholder="Place of birth"
                v-model="profileDetails.placeOfBirth"
              />
            </div>
          </div>
          <!-- Address -->
          <div class="row mb-6">
            <label class="col-lg-4 col-form-label fw-semobold fs-6">Address</label>
            <div class="col-lg-8 fv-row">
              <textarea
                name="address"
                class="form-control form-control-lg form-control-solid"
                placeholder="Address"
                rows="2"
                v-model="profileDetails.address"
              ></textarea>
            </div>
          </div>
          <!-- CV Data -->
          <div class="row mb-6">
            <div class="col-lg-6">
              <label class="col-form-label fw-semobold fs-6">CV File Name</label>
              <input
                type="text"
                name="cvData.fileName"
                class="form-control form-control-lg form-control-solid"
                placeholder="e.g. john_doe_cv.pdf"
                v-model="profileDetails.cvData.fileName"
              />
            </div>
            <div class="col-lg-6">
              <label class="col-form-label fw-semobold fs-6">CV URL</label>
              <input
                type="text"
                name="cvData.storageUrl"
                class="form-control form-control-lg form-control-solid"
                placeholder="https://example.com/cv.pdf"
                v-model="profileDetails.cvData.storageUrl"
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
          >
            Discard
          </button>

          <button
            type="submit"
            id="kt_account_profile_details_submit"
            ref="submitButton1"
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
        <button type="button" class="btn btn-sm btn-secondary" @click="addSoftSkill">
          Add Soft Skill
        </button>
      </div>
    </div>
    <div class="card-body">
      <div v-if="profileDetails.hardSkills && profileDetails.hardSkills.length">
        <h4>Hard Skills</h4>
        <div v-for="(skill, index) in profileDetails.hardSkills" :key="'hard-' + index" class="mb-3 p-3 border rounded">
          <div class="row align-items-center">
            <template v-if="editingHardSkillIndex === index">
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
              <div class="col-md-2 d-flex gap-2">
                <button type="button" class="btn btn-sm btn-success" @click="saveHardSkill(skill, index)">
                  <KTIcon icon-name="check" icon-class="fs-3" />
                </button>
                <button type="button" class="btn btn-sm btn-danger" @click="deleteHardSkill(skill, index)">
                  <KTIcon icon-name="trash" icon-class="fs-3" />
                </button>
              </div>
            </template>
            <template v-else>
              <div class="col-md-4">
                {{ skill.name }}
              </div>
              <div class="col-md-3">
                {{ skill.proficiencyLevel }}
              </div>
              <div class="col-md-3">
                {{ skill.certification }}
              </div>
              <div class="col-md-2 d-flex gap-2">
                <button type="button" class="btn btn-sm btn-warning" @click="editHardSkill(index)">
                  <KTIcon icon-name="pencil" icon-class="fs-3" />
                </button>
                <button type="button" class="btn btn-sm btn-danger" @click="deleteHardSkill(skill, index)">
                  <KTIcon icon-name="trash" icon-class="fs-3" />
                </button>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div v-if="profileDetails.softSkills && profileDetails.softSkills.length">
        <h4>Soft Skills</h4>
        <div v-for="(skill, index) in profileDetails.softSkills" :key="'soft-' + index" class="mb-3 p-3 border rounded">
          <div class="row align-items-center">
            <template v-if="editingSoftSkillIndex === index">
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
              <div class="col-md-2 d-flex gap-2">
                <button type="button" class="btn btn-sm btn-success" @click="saveSoftSkill(skill, index)">
                  <KTIcon icon-name="check" icon-class="fs-3" />
                </button>
                <button type="button" class="btn btn-sm btn-danger" @click="deleteSoftSkill(skill, index)">
                  <KTIcon icon-name="trash" icon-class="fs-3" />
                </button>
              </div>
            </template>
            <template v-else>
              <div class="col-md-4">
                {{ skill.name }}
              </div>
              <div class="col-md-3">
                {{ skill.proficiencyLevel }}
              </div>
              <div class="col-md-3">
                {{ skill.certification }}
              </div>
              <div class="col-md-2 d-flex gap-2">
                <button type="button" class="btn btn-sm btn-warning" @click="editSoftSkill(index)">
                  <KTIcon icon-name="pencil" icon-class="fs-3" />
                </button>
                <button type="button" class="btn btn-sm btn-danger" @click="deleteSoftSkill(skill, index)">
                  <KTIcon icon-name="trash" icon-class="fs-3" />
                </button>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Sezione Experience -->
  <div class="card mb-6">
    <div class="card-header">
      <h3 class="card-title">Work Experience</h3>
      <div class="card-toolbar">
        <button type="button" class="btn btn-sm btn-primary" @click="addExperience">
          Add Experience
        </button>
      </div>
    </div>
    <div class="card-body">
      <div v-if="profileDetails.experiences && profileDetails.experiences.length">
        <div v-for="(exp, index) in profileDetails.experiences" :key="'exp-' + index" class="mb-4 p-4 border rounded">
          <template v-if="editingExperienceIndex === index">
            <div class="row mb-3">
              <div class="col-md-6">
                <input v-model="exp.jobTitle" class="form-control" placeholder="Job Title" />
              </div>
              <div class="col-md-6">
                <input v-model="exp.companyName" class="form-control" placeholder="Company Name" />
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-md-6">
                <input v-model="exp.startDate" type="date" class="form-control" placeholder="Start Date" />
              </div>
              <div class="col-md-6">
                <input v-model="exp.endDate" type="date" class="form-control" placeholder="End Date" />
              </div>
            </div>
            <div class="mb-3">
              <textarea v-model="exp.description" class="form-control" rows="2" placeholder="Description"></textarea>
            </div>
            <div class="mb-3">
              <input v-model="exp.technologiesUsed" class="form-control" placeholder="Technologies (comma separated)" />
            </div>
            <div class="text-end">
              <button type="button" class="btn btn-sm btn-success me-2" @click="saveExperience(exp, index)">
                <KTIcon icon-name="check" icon-class="fs-3" />
              </button>
              <button type="button" class="btn btn-sm btn-danger" @click="deleteExperience(exp, index)">
                <KTIcon icon-name="trash" icon-class="fs-3" />
              </button>
            </div>
          </template>
          <template v-else>
            <div class="row mb-3">
              <div class="col-md-6">{{ exp.jobTitle }}</div>
              <div class="col-md-6">{{ exp.companyName }}</div>
            </div>
            <div class="row mb-3">
              <div class="col-md-6">{{ exp.startDate }}</div>
              <div class="col-md-6">{{ exp.endDate }}</div>
            </div>
            <div class="mb-3">{{ exp.description }}</div>
            <div class="mb-3">{{ Array.isArray(exp.technologiesUsed) ? exp.technologiesUsed.join(', ') : exp.technologiesUsed }}</div>
            <div class="text-end">
              <button type="button" class="btn btn-sm btn-warning me-2" @click="editExperience(index)">
                <KTIcon icon-name="pencil" icon-class="fs-3" />
              </button>
              <button type="button" class="btn btn-sm btn-danger" @click="deleteExperience(exp, index)">
                <KTIcon icon-name="trash" icon-class="fs-3" />
              </button>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>

  <!-- Sezione Roles -->
  <div class="card mb-6">
    <div class="card-header">
      <h3 class="card-title">User Roles</h3>
      <div class="card-toolbar">
        <button type="button" class="btn btn-sm btn-primary" @click="showAddRoleModal = true">
          <KTIcon icon-name="plus" icon-class="fs-2" />
          Add Role
        </button>
      </div>
    </div>
    <div class="card-body">
      <div v-if="userRoles && userRoles.length > 0">
        <div v-for="role in userRoles" :key="role.id" class="mb-3 p-3 border rounded d-flex justify-content-between align-items-center">
          <div>
            <span class="badge badge-light-primary fs-6">
              <KTIcon icon-name="shield-tick" icon-class="fs-7 me-1" />
              {{ role.description || role.name }}
            </span>
            <small class="text-muted d-block mt-1">Role ID: {{ role.id }}</small>
          </div>
          <button type="button" class="btn btn-sm btn-danger" @click="removeRole(role)">
            <KTIcon icon-name="trash" icon-class="fs-3" />
            Remove
          </button>
        </div>
      </div>
      <div v-else class="text-center text-muted py-4">
        <KTIcon icon-name="shield-cross" icon-class="fs-2x mb-2" />
        <p>No roles assigned to this user</p>
      </div>
    </div>
  </div>

  <!-- Modal per aggiungere ruolo -->
  <div v-if="showAddRoleModal" class="modal fade show" style="display: block; background-color: rgba(0,0,0,0.5);" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add Role to User</h5>
          <button type="button" class="btn-close" @click="showAddRoleModal = false"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label">Select Role</label>
            <select v-model="selectedRoleId" class="form-select">
              <option value="">Choose a role...</option>
              <option v-for="role in availableRoles" :key="role.id" :value="role.id">
                {{ role.description || role.name }}
              </option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">Expiration Date (Optional)</label>
            <input type="date" v-model="roleExpirationDate" class="form-control" />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="showAddRoleModal = false">Cancel</button>
          <button type="button" class="btn btn-primary" @click="addRole" :disabled="!selectedRoleId || addingRole">
            <span v-if="addingRole" class="spinner-border spinner-border-sm me-2"></span>
            Add Role
          </button>
        </div>
      </div>
    </div>
  </div>



  </div>
  <!--end::Settings Content-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, ref, inject, watch, onMounted, computed } from "vue";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { useRoute } from "vue-router";
import { createSkill, updateSkill, deleteSkill } from "@/core/services/businessServices/Skill";
import { createExperience, updateExperience, deleteExperience } from "@/core/services/businessServices/Experience";
import { useCurrentUser } from "@/core/composables/useCurrentUser";
import { getAllRoles, getUserRoles, assignRoleToUser, removeRoleFromUser, type Role } from "@/core/services/businessServices/Role";
import type { Employee } from "@/core/models/Employee";

interface CvData {
  fileName: string;
  storageUrl: string;
}

interface ProfileDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  placeOfBirth: string;
  address: string;
  currentRole: string;
  department: string;
  isAvailable: boolean;
  hardSkills: Array<any>;
  softSkills: Array<any>;
  experiences: Array<any>;
  cvData: CvData;
}

export default defineComponent({
  name: "account-settings",
  components: {
  },
  setup() {
    const route = useRoute();
    const submitButton1 = ref<HTMLElement | null>(null);

    // Reactive states
    const editingHardSkillIndex = ref<number | null>(null);
    const editingSoftSkillIndex = ref<number | null>(null);
    const editingExperienceIndex = ref<number | null>(null);

    // Role management
    const userRoles = ref<Role[]>([]);
    const allRoles = ref<Role[]>([]);
    const showAddRoleModal = ref(false);
    const selectedRoleId = ref('');
    const roleExpirationDate = ref('');
    const addingRole = ref(false);

    // Computed property for available roles (filtered)
    const availableRoles = computed(() => {
      const assignedRoleIds = userRoles.value.map(role => role.id);
      return allRoles.value.filter(role => !assignedRoleIds.includes(role.id));
    });

    // Determina se siamo in modalità employee view o account view
    const isEmployeeView = computed(() => !!route.params.id);

    // Get current user composable for account mode
    const { currentUser, updateCurrentUser, refreshCurrentUser } = useCurrentUser();

    const employee = inject<any>('employee');
    const refreshEmployee = inject<any>('refreshEmployee');

    // Unified user data - use employee in employee mode, currentUser in account mode
    const userData = computed(() => {
      if (isEmployeeView.value) {
        return employee.value;
      } else {
        return currentUser.value;
      }
    });

    // Profile details reactive object
    const profileDetails = ref({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      placeOfBirth: '',
      address: '',
      currentRole: '',
      department: '',
      isAvailable: false,
      hardSkills: [] as Array<any>,
      softSkills: [] as Array<any>,
      experiences: [] as Array<any>,
      cvData: {
        fileName: '',
        storageUrl: ''
      }
    });

    // Role management functions - defined before watcher
    const loadUserRoles = async () => {
      try {
        if (userData.value?.id) {
          const roles = await getUserRoles(userData.value.id);
          userRoles.value = roles || [];
        } else {
          userRoles.value = [];
        }
      } catch (error) {
        console.error("Error loading user roles:", error);
        userRoles.value = [];
      }
    };

    const loadAvailableRoles = async () => {
      try {
        const roles = await getAllRoles();
        allRoles.value = roles;
      } catch (error) {
        console.error("Error loading available roles:", error);
      }
    };

    // Watch for user data changes and update profile details
    watch(userData, async (val) => {
      if (val) {
        profileDetails.value = {
          firstName: val.firstName || val.first_name || '',
          lastName: val.lastName || val.last_name || '',
          email: val.email || '',
          phone: val.phone || '',
          dateOfBirth: val.dateOfBirth || val.date_of_birth ? 
            (typeof val.dateOfBirth === 'string' || typeof val.date_of_birth === 'string' ? 
              (val.dateOfBirth || val.date_of_birth).split('T')[0] : 
              new Date(val.dateOfBirth || val.date_of_birth).toISOString().split('T')[0]
            ) : '',
          placeOfBirth: val.placeOfBirth || val.place_of_birth || '',
          address: val.address || '',
          currentRole: val.currentRole || val.current_role || '',
          department: val.department || '',
          isAvailable: val.isAvailable ?? val.is_available ?? false,
          hardSkills: val.hardSkills || [],
          softSkills: val.softSkills || [],
          experiences: val.experiences || [],
          cvData: {
            fileName: val.cvData?.fileName || val.cv_data?.file_name || '',
            storageUrl: val.cvData?.storageUrl || val.cv_data?.storage_url || ''
          }
        };
        
        // Reload roles when user changes
        await loadUserRoles();
      }
    }, { immediate: true });

    const saveChanges1 = async () => {
      if (submitButton1.value) {
        // Activate indicator
        submitButton1.value.setAttribute("data-kt-indicator", "on");
        
        try {
          if (isEmployeeView.value && route.params.id) {
            // Employee mode: update specific employee
            const employeeData: Partial<Employee> = {
              first_name: profileDetails.value.firstName,
              last_name: profileDetails.value.lastName,
              email: profileDetails.value.email,
              phone: profileDetails.value.phone,
              date_of_birth: profileDetails.value.dateOfBirth ? new Date(profileDetails.value.dateOfBirth) : undefined,
              place_of_birth: profileDetails.value.placeOfBirth,
              address: profileDetails.value.address,
              current_role: profileDetails.value.currentRole,
              department: profileDetails.value.department,
              is_available: profileDetails.value.isAvailable,
              cv_data: profileDetails.value.cvData.fileName || profileDetails.value.cvData.storageUrl ? {
                file_name: profileDetails.value.cvData.fileName,
                storage_url: profileDetails.value.cvData.storageUrl,
              } : undefined,
            };

            const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:3000';
            const response = await fetch(`${API_URL}/applicationuser/${route.params.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(employeeData)
            });
            
            if (!response.ok) {
              throw new Error('Failed to update user');
            }
            
            // Get the updated employee data from the response
            const updatedEmployee = await response.json();
            
            // Emit custom event for employee data update
            window.dispatchEvent(new CustomEvent('employeeUpdated', {
              detail: { 
                employeeId: route.params.id, 
                updatedData: updatedEmployee 
              }
            }));
            
            // Refresh employee data
            if (refreshEmployee) {
              await refreshEmployee();
            }
          } else {
            // Account mode: update current user
            const userData = {
              firstName: profileDetails.value.firstName,
              lastName: profileDetails.value.lastName,
              email: profileDetails.value.email,
              phone: profileDetails.value.phone,
              dateOfBirth: profileDetails.value.dateOfBirth ? new Date(profileDetails.value.dateOfBirth).toISOString() : undefined,
              placeOfBirth: profileDetails.value.placeOfBirth,
              address: profileDetails.value.address,
              currentRole: profileDetails.value.currentRole,
              department: profileDetails.value.department,
              isAvailable: profileDetails.value.isAvailable,
            };

            // Update the current user
            await updateCurrentUser(userData);
          }
          
          // Show success message
          Swal.fire({
            icon: 'success',
            title: 'Profile updated!',
            text: 'Your profile has been updated successfully.'
          });
        } catch (error) {
          console.error("Error updating profile:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'There was an error updating your profile.'
          });
        } finally {
          setTimeout(() => {
            submitButton1.value?.removeAttribute("data-kt-indicator");
          }, 1000);
        }
      }
    };

    // Skills
    const addHardSkill = () => {
      if (!profileDetails.value.hardSkills) profileDetails.value.hardSkills = [];
      profileDetails.value.hardSkills.push({ name: '', proficiencyLevel: '', certification: '' });
      editingHardSkillIndex.value = profileDetails.value.hardSkills.length - 1;
    };
    const addSoftSkill = () => {
      if (!profileDetails.value.softSkills) profileDetails.value.softSkills = [];
      profileDetails.value.softSkills.push({ name: '', proficiencyLevel: '', certification: '' });
      editingSoftSkillIndex.value = profileDetails.value.softSkills.length - 1;
    };
    const saveHardSkill = async (skill, index) => {
      try {
        if (!profileDetails.value.hardSkills) profileDetails.value.hardSkills = [];
        // Preparo solo i campi accettati dal backend
        const dataToSend = {
          name: skill.name,
          proficiencyLevel: skill.proficiencyLevel ? parseInt(skill.proficiencyLevel) : undefined,
          certification: skill.certification,
          ...(isEmployeeView.value 
            ? { employeeHard: { connect: { id: route.params.id } } }
            : { applicationUserHard: { connect: { id: userData.value?.id } } }
          ),
        };
        if (skill.id) {
          await updateSkill(skill.id, dataToSend);
        } else {
          const created = await createSkill(dataToSend);
          if (created) profileDetails.value.hardSkills[index] = created;
        }
        editingHardSkillIndex.value = null;
        Swal.fire({
          icon: 'success',
          title: 'Hard skill saved!',
          text: 'The skill has been saved successfully.'
        });
      } catch (error) {
        console.error("Error saving hard skill:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an error saving the skill.'
        });
      }
    };
    
    const editHardSkill = (index) => {
      editingHardSkillIndex.value = index;
    };
    const deleteHardSkill = async (skill, index) => {
      try {
        if (skill.id) await deleteSkill(skill.id);
        profileDetails.value.hardSkills?.splice(index, 1);
        Swal.fire({
          icon: 'success',
          title: 'Hard skill deleted!',
          text: 'The skill has been deleted successfully.'
        });
      } catch (error) {
        console.error("Error deleting hard skill:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an error deleting the skill.'
        });
      }
    };

    const saveSoftSkill = async (skill, index) => {
      try {
        if (!profileDetails.value.softSkills) profileDetails.value.softSkills = [];
        // Preparo solo i campi accettati dal backend
        const dataToSend = {
          name: skill.name,
          proficiencyLevel: skill.proficiencyLevel ? parseInt(skill.proficiencyLevel) : undefined,
          certification: skill.certification,
          ...(isEmployeeView.value 
            ? { employeeSoft: { connect: { id: route.params.id } } }
            : { applicationUserSoft: { connect: { id: userData.value?.id } } }
          ),
        };
        if (skill.id) {
          await updateSkill(skill.id, dataToSend);
        } else {
          const created = await createSkill(dataToSend);
          if (created) profileDetails.value.softSkills[index] = created;
        }
        editingSoftSkillIndex.value = null;
        Swal.fire({
          icon: 'success',
          title: 'Soft skill saved!',
          text: 'The skill has been saved successfully.'
        });
      } catch (error) {
        console.error("Error saving soft skill:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an error saving the skill.'
        });
      }
    };
    
    const editSoftSkill = (index) => {
      editingSoftSkillIndex.value = index;
    };
    const deleteSoftSkill = async (skill, index) => {
      try {
        if (skill.id) await deleteSkill(skill.id);
        profileDetails.value.softSkills?.splice(index, 1);
        Swal.fire({
          icon: 'success',
          title: 'Soft skill deleted!',
          text: 'The skill has been deleted successfully.'
        });
      } catch (error) {
        console.error("Error deleting soft skill:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an error deleting the skill.'
        });
      }
    };

    // Experience
    const addExperience = () => {
      if (!profileDetails.value.experiences) profileDetails.value.experiences = [];
      profileDetails.value.experiences.push({ jobTitle: '', companyName: '', startDate: '', endDate: '', description: '', technologiesUsed: '' });
      editingExperienceIndex.value = profileDetails.value.experiences.length - 1;
    };
    const saveExperience = async (exp, index) => {
      try {
        if (!profileDetails.value.experiences) profileDetails.value.experiences = [];
        if (typeof exp.technologiesUsed === 'string') {
          exp.technologiesUsed = exp.technologiesUsed.split(',').map(s => s.trim()).filter(Boolean);
        }
        if (exp.id) {
          await updateExperience(exp.id, exp);
        } else {
          const experienceData = isEmployeeView.value 
            ? { ...exp, employeeId: route.params.id }
            : { 
                ...exp, 
                applicationUser: { connect: { id: userData.value?.id } },
                startDate: exp.startDate ? new Date(exp.startDate) : undefined,
                endDate: exp.endDate ? new Date(exp.endDate) : undefined,
              };
          const created = await createExperience(experienceData);
          if (created) profileDetails.value.experiences[index] = created;
        }
        editingExperienceIndex.value = null;
        Swal.fire({
          icon: 'success',
          title: 'Experience saved!',
          text: 'The experience has been saved successfully.'
        });
      } catch (error) {
        console.error("Error saving experience:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an error saving the experience.'
        });
      }
    };

    const editExperience = (index) => {
      editingExperienceIndex.value = index;
    };
    const deleteExperienceFn = async (exp, index) => {
      try {
        if (exp.id) await deleteExperience(exp.id);
        profileDetails.value.experiences?.splice(index, 1);
        Swal.fire({
          icon: 'success',
          title: 'Experience deleted!',
          text: 'The experience has been deleted successfully.'
        });
      } catch (error) {
        console.error("Error deleting experience:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an error deleting the experience.'
        });
      }
    };



    const addRole = async () => {
      if (!selectedRoleId.value || !userData.value?.id) return;
      
      addingRole.value = true;
      try {
        await assignRoleToUser({
          userId: userData.value.id,
          roleId: selectedRoleId.value,
          expiresAt: roleExpirationDate.value || undefined
        });
        
        // Reload user roles
        await loadUserRoles();
        
        // Reset form
        selectedRoleId.value = '';
        roleExpirationDate.value = '';
        showAddRoleModal.value = false;
        
        Swal.fire({
          icon: 'success',
          title: 'Role assigned!',
          text: 'The role has been assigned successfully.'
        });
      } catch (error) {
        console.error("Error assigning role:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an error assigning the role.'
        });
      } finally {
        addingRole.value = false;
      }
    };

    const removeRole = async (role: Role) => {
      if (!userData.value?.id) return;
      
      const confirm = await Swal.fire({
        title: 'Remove Role?',
        text: `Are you sure you want to remove the role "${role.description || role.name}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, remove it!'
      });
      
      if (confirm.isConfirmed) {
        try {
          await removeRoleFromUser(userData.value.id, role.id);
          
          // Reload user roles
          await loadUserRoles();
          
          Swal.fire({
            icon: 'success',
            title: 'Role removed!',
            text: 'The role has been removed successfully.'
          });
        } catch (error) {
          console.error("Error removing role:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'There was an error removing the role.'
          });
        }
      }
    };

    // Load roles on mount
    onMounted(async () => {
      // Load roles on mount
      await loadUserRoles();
      await loadAvailableRoles();
    });

    return {
      submitButton1,
      saveChanges1,
      profileDetails,
      employee: userData, // Unified reference
      getAssetPath,
      // Skills management
      addHardSkill,
      addSoftSkill,
      saveHardSkill,
      deleteHardSkill,
      saveSoftSkill,
      deleteSoftSkill,
      editingHardSkillIndex,
      editingSoftSkillIndex,
      editHardSkill,
      editSoftSkill,
      // Experience management
      addExperience,
      saveExperience,
      deleteExperience: deleteExperienceFn,
      editingExperienceIndex,
      editExperience,
      // Role management
      userRoles,
      availableRoles,
      showAddRoleModal,
      selectedRoleId,
      roleExpirationDate,
      addingRole,
      addRole,
      removeRole,
    };
  },
});
</script>

<style scoped>
/* Avatar management has been moved to Account.vue */
</style>
