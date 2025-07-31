<template>
  <!--begin::Loading State for Settings-->
  <div v-if="!employee" class="d-flex justify-content-center align-items-center" style="min-height: 300px;">
    <div class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="mt-3">
        <span class="fw-semobold text-gray-600">Loading employee settings...</span>
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
          <h1 class="fw-bold mb-1">Employee Settings</h1>
          <p class="text-muted mb-0">Manage employee profile, skills, and preferences</p>
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
      data-bs-target="#kt_account_profile_details"
      aria-expanded="true"
      aria-controls="kt_account_profile_details"
    >
      <!--begin::Card title-->
      <div class="card-title m-0">
        <div class="d-flex align-items-center">
          <KTIcon icon-name="user" icon-class="fs-2 text-primary me-3" />
          <h3 class="fw-bold m-0">Profile Details</h3>
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
            <label class="col-lg-4 col-form-label required fw-semobold fs-6">
              <KTIcon icon-name="user" icon-class="fs-6 me-2" />
              First Name
            </label>
            <!--end::Label-->

            <!--begin::Col-->
            <div class="col-lg-8 fv-row">
              <input
                type="text"
                name="firstName"
                class="form-control form-control-lg form-control-solid mb-3 mb-lg-0"
                placeholder="Enter first name"
                v-model="profileDetails.firstName"
                :class="{ 'is-invalid': !profileDetails.firstName }"
              />
              <div class="invalid-feedback" v-if="!profileDetails.firstName">
                First name is required
              </div>
              <div class="form-text">
                <KTIcon icon-name="information-5" icon-class="fs-6 me-1" />
                Enter your legal first name as it appears on official documents
              </div>
            </div>
          </div>
          <!--end::Input group-->

          <div class="row mb-6">
            <label class="col-lg-4 col-form-label required fw-semobold fs-6">
              <KTIcon icon-name="user" icon-class="fs-6 me-2" />
              Last Name
            </label>
            <div class="col-lg-8 fv-row">
              <input
                type="text"
                name="lastName"
                class="form-control form-control-lg form-control-solid"
                placeholder="Enter last name"
                v-model="profileDetails.lastName"
                :class="{ 'is-invalid': !profileDetails.lastName }"
              />
              <div class="invalid-feedback" v-if="!profileDetails.lastName">
                Last name is required
              </div>
              <div class="form-text">
                <KTIcon icon-name="information-5" icon-class="fs-6 me-1" />
                Enter your legal last name as it appears on official documents
              </div>
            </div>
          </div>
          <!--end::Input group-->

          <!--begin::Input group-->
          <div class="row mb-6">
            <!--begin::Label-->
            <label class="col-lg-4 col-form-label fw-semobold fs-6">
              <KTIcon icon-name="building" icon-class="fs-6 me-2" />
              Department
            </label>
            <!--end::Label-->

            <!--begin::Col-->
            <div class="col-lg-8 fv-row">
              <input
                type="text"
                name="department"
                class="form-control form-control-lg form-control-solid"
                placeholder="e.g., Engineering, Marketing, HR"
                v-model="profileDetails.department"
              />
              <div class="form-text">
                <KTIcon icon-name="information-5" icon-class="fs-6 me-1" />
                Your organizational department or team
              </div>
            </div>
            <!--end::Col-->
          </div>
          <!--end::Input group-->

          <div class="row mb-6">
            <label class="col-lg-4 col-form-label fw-semobold fs-6">
              <KTIcon icon-name="phone" icon-class="fs-6 me-2" />
              Contact Phone
            </label>
            <div class="col-lg-8 fv-row">
              <input
                type="tel"
                name="phone"
                class="form-control form-control-lg form-control-solid"
                placeholder="+1 (555) 123-4567"
                v-model="profileDetails.phone"
              />
              <div class="form-text">
                <KTIcon icon-name="information-5" icon-class="fs-6 me-1" />
                Your primary contact number for work-related communications
              </div>
            </div>
          </div>
          <!--end::Input group-->

          <div class="row mb-6">
            <label class="col-lg-4 col-form-label fw-semobold fs-6">
              <KTIcon icon-name="briefcase" icon-class="fs-6 me-2" />
              Current Role
            </label>
            <div class="col-lg-8 fv-row">
              <input
                type="text"
                name="currentRole"
                class="form-control form-control-lg form-control-solid"
                placeholder="e.g., Senior Developer, Project Manager"
                v-model="profileDetails.currentRole"
              />
              <div class="form-text">
                <KTIcon icon-name="information-5" icon-class="fs-6 me-1" />
                Your current job title or position within the organization
              </div>
            </div>
          </div>
          <!--end::Input group-->

          <div class="row mb-6">
            <label class="col-lg-4 col-form-label fw-semobold fs-6">
              <KTIcon icon-name="check-circle" icon-class="fs-6 me-2" />
              Available for assignments
            </label>
            <div class="col-lg-8 fv-row d-flex align-items-center">
              <div class="form-check form-switch">
                <input
                  type="checkbox"
                  name="isAvailable"
                  class="form-check-input"
                  v-model="profileDetails.isAvailable"
                  id="availabilitySwitch"
                />
                <label class="form-check-label" for="availabilitySwitch">
                  <span :class="profileDetails.isAvailable ? 'text-success' : 'text-muted'">
                    {{ profileDetails.isAvailable ? 'Available' : 'Not Available' }}
                  </span>
                </label>
              </div>
              <div class="form-text ms-3">
                <KTIcon icon-name="information-5" icon-class="fs-6 me-1" />
                Indicates if you're available for new project assignments
              </div>
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
          <!-- CV Management -->
          <div class="row mb-6">
            <label class="col-lg-4 col-form-label fw-semobold fs-6">CV Document</label>
            <div class="col-lg-8 fv-row">
              <!-- CV not uploaded yet -->
              <div v-if="!profileDetails.cvData.fileName && !profileDetails.cvData.storageUrl" class="text-center p-4 border-2 border-dashed border-gray-300 rounded">
                <KTIcon icon-name="document" icon-class="fs-2x text-muted mb-3" />
                <p class="text-muted mb-3">No CV uploaded yet</p>
                <button type="button" class="btn btn-primary" @click="showCvUploadModal = true">
                  <KTIcon icon-name="plus" icon-class="fs-2 me-2" />
                  Upload CV
                </button>
              </div>
              
              <!-- CV already uploaded -->
              <div v-else class="d-flex align-items-center justify-content-between p-3 border rounded bg-light">
                <div class="d-flex align-items-center">
                  <KTIcon icon-name="document" icon-class="fs-2 text-primary me-3" />
                  <div>
                    <p class="fw-semobold mb-1">{{ profileDetails.cvData.fileName }}</p>
                    <small class="text-muted">CV uploaded</small>
                  </div>
                </div>
                <div class="d-flex gap-2">
                  <button type="button" class="btn btn-sm btn-outline-primary" @click="downloadCV">
                    <KTIcon icon-name="download" icon-class="fs-3" />
                    Download
                  </button>
                  <button type="button" class="btn btn-sm btn-outline-warning" @click="showCvUploadModal = true">
                    <KTIcon icon-name="pencil" icon-class="fs-3" />
                    Replace
                  </button>
                  <button type="button" class="btn btn-sm btn-outline-danger" @click="deleteCV">
                    <KTIcon icon-name="trash" icon-class="fs-3" />
                    Delete
                  </button>
                </div>
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
          >
            Discard
          </button>

          <button
            type="submit"
            id="kt_account_profile_details_submit"
            ref="submitButton1"
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

  
  <!-- Sezione Change Password -->
  <div class="card mb-6">
    <div class="card-header">
      <div class="card-title d-flex align-items-center">
        <KTIcon icon-name="shield-tick" icon-class="fs-2 me-2 text-primary" />
        <h3 class="m-0">Change Password</h3>
      </div>
      <div class="card-toolbar">
        <span class="badge badge-light-primary fs-7">
          <KTIcon icon-name="information-5" icon-class="fs-6 me-1" />
          Secure
        </span>
      </div>
    </div>
    <div class="card-body">
      <!-- Info Alert -->
      <div class="alert alert-info d-flex align-items-center mb-6">
        <KTIcon icon-name="information-5" icon-class="fs-2 me-3" />
        <div>
          <strong>Password Requirements:</strong>
          <ul class="mb-0 mt-2">
            <li>At least 8 characters long</li>
            <li>Use a mix of letters, numbers, and symbols for better security</li>
            <li>Don't reuse passwords from other accounts</li>
          </ul>
        </div>
      </div>

      <form @submit.prevent="changePassword">
        <!-- Current Password -->
        <div class="row mb-6">
          <label class="col-lg-4 col-form-label required fw-semobold fs-6">
            <KTIcon icon-name="lock" icon-class="fs-6 me-2" />
            Current Password
          </label>
          <div class="col-lg-8 fv-row">
            <div class="position-relative">
              <input
                :type="showCurrentPassword ? 'text' : 'password'"
                name="currentPassword"
                class="form-control form-control-lg form-control-solid"
                placeholder="Enter your current password"
                v-model="passwordForm.currentPassword"
                required
              />
              <button
                type="button"
                class="btn btn-icon btn-sm position-absolute end-0 top-0 h-100"
                @click="showCurrentPassword = !showCurrentPassword"
              >
                <KTIcon :icon-name="showCurrentPassword ? 'eye-slash' : 'eye'" icon-class="fs-2" />
              </button>
            </div>
          </div>
        </div>

        <!-- New Password -->
        <div class="row mb-6">
          <label class="col-lg-4 col-form-label required fw-semobold fs-6">
            <KTIcon icon-name="key" icon-class="fs-6 me-2" />
            New Password
          </label>
          <div class="col-lg-8 fv-row">
            <div class="position-relative mb-3">
              <input
                :type="showNewPassword ? 'text' : 'password'"
                name="newPassword"
                class="form-control form-control-lg form-control-solid"
                placeholder="Enter your new password"
                v-model="passwordForm.newPassword"
                required
                minlength="8"
              />
              <button
                type="button"
                class="btn btn-icon btn-sm position-absolute end-0 top-0 h-100"
                @click="showNewPassword = !showNewPassword"
              >
                <KTIcon :icon-name="showNewPassword ? 'eye-slash' : 'eye'" icon-class="fs-2" />
              </button>
            </div>
            
            <!-- Password Strength Indicator -->
            <div v-if="passwordForm.newPassword" class="mb-3">
              <div class="d-flex align-items-center mb-2">
                <span class="fw-semobold me-2">Password Strength:</span>
                <span :class="passwordStrengthClass">{{ passwordStrengthText }}</span>
              </div>
              <div class="progress h-8px">
                <div 
                  class="progress-bar" 
                  :class="passwordStrengthBarClass"
                  :style="{ width: passwordStrengthPercentage + '%' }"
                ></div>
              </div>
            </div>

            <!-- Password Requirements Checklist -->
            <div v-if="passwordForm.newPassword" class="mb-3">
              <div class="row">
                <div class="col-md-6">
                  <div class="d-flex align-items-center mb-2">
                    <KTIcon 
                      :icon-name="passwordRequirements.length ? 'check' : 'cross'" 
                      :icon-class="passwordRequirements.length ? 'fs-6 text-success me-2' : 'fs-6 text-danger me-2'" 
                    />
                    <span :class="passwordRequirements.length ? 'text-success' : 'text-muted'">
                      At least 8 characters
                    </span>
                  </div>
                  <div class="d-flex align-items-center mb-2">
                    <KTIcon 
                      :icon-name="passwordRequirements.uppercase ? 'check' : 'cross'" 
                      :icon-class="passwordRequirements.uppercase ? 'fs-6 text-success me-2' : 'fs-6 text-danger me-2'" 
                    />
                    <span :class="passwordRequirements.uppercase ? 'text-success' : 'text-muted'">
                      One uppercase letter
                    </span>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="d-flex align-items-center mb-2">
                    <KTIcon 
                      :icon-name="passwordRequirements.lowercase ? 'check' : 'cross'" 
                      :icon-class="passwordRequirements.lowercase ? 'fs-6 text-success me-2' : 'fs-6 text-danger me-2'" 
                    />
                    <span :class="passwordRequirements.lowercase ? 'text-success' : 'text-muted'">
                      One lowercase letter
                    </span>
                  </div>
                  <div class="d-flex align-items-center mb-2">
                    <KTIcon 
                      :icon-name="passwordRequirements.number ? 'check' : 'cross'" 
                      :icon-class="passwordRequirements.number ? 'fs-6 text-success me-2' : 'fs-6 text-danger me-2'" 
                    />
                    <span :class="passwordRequirements.number ? 'text-success' : 'text-muted'">
                      One number
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Confirm New Password -->
        <div class="row mb-6">
          <label class="col-lg-4 col-form-label required fw-semobold fs-6">
            <KTIcon icon-name="shield-tick" icon-class="fs-6 me-2" />
            Confirm New Password
          </label>
          <div class="col-lg-8 fv-row">
            <div class="position-relative">
              <input
                :type="showConfirmPassword ? 'text' : 'password'"
                name="confirmPassword"
                class="form-control form-control-lg form-control-solid"
                placeholder="Confirm your new password"
                v-model="passwordForm.confirmPassword"
                required
              />
              <button
                type="button"
                class="btn btn-icon btn-sm position-absolute end-0 top-0 h-100"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <KTIcon :icon-name="showConfirmPassword ? 'eye-slash' : 'eye'" icon-class="fs-2" />
              </button>
            </div>
            
            <!-- Password Match Indicator -->
            <div v-if="passwordForm.newPassword && passwordForm.confirmPassword" class="mt-2">
              <div v-if="passwordForm.newPassword === passwordForm.confirmPassword" class="d-flex align-items-center text-success">
                <KTIcon icon-name="check-circle" icon-class="fs-6 me-2" />
                <span class="fw-semobold">Passwords match!</span>
              </div>
              <div v-else class="d-flex align-items-center text-danger">
                <KTIcon icon-name="cross-circle" icon-class="fs-6 me-2" />
                <span class="fw-semobold">Passwords do not match</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="card-footer d-flex justify-content-end py-6 px-9">
          <button
            type="button"
            class="btn btn-light btn-active-light-primary me-2"
            @click="resetPasswordForm"
          >
            <KTIcon icon-name="refresh" icon-class="fs-2 me-2" />
            Reset Form
          </button>
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="!isPasswordFormValid || changingPassword"
          >
            <span v-if="changingPassword" class="indicator-progress">
              <span class="spinner-border spinner-border-sm me-2"></span>
              Updating Password...
            </span>
            <span v-else class="indicator-label">
              <KTIcon icon-name="shield-tick" icon-class="fs-2 me-2" />
              Update Password
            </span>
          </button>
        </div>
      </form>
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

  <!-- Modal per caricamento CV -->
  <div v-if="showCvUploadModal" class="modal fade show" style="display: block; background-color: rgba(0,0,0,0.5);" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ profileDetails.cvData.fileName ? 'Replace CV' : 'Upload CV' }}</h5>
          <button type="button" class="btn-close" @click="showCvUploadModal = false"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label">Select CV File (.pdf, .docx)</label>
            <input 
              type="file" 
              class="form-control" 
              accept=".pdf,.docx" 
              @change="onCvFileChange"
              ref="cvFileInput"
            />
            <div class="form-text">Supported formats: PDF, DOCX (max 10MB)</div>
          </div>
          <div v-if="selectedCvFile" class="alert alert-info">
            <strong>Selected file:</strong> {{ selectedCvFile.name }} ({{ formatFileSize(selectedCvFile.size) }})
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="showCvUploadModal = false">Cancel</button>
          <button 
            type="button" 
            class="btn btn-primary" 
            @click="uploadCV" 
            :disabled="!selectedCvFile || uploadingCV"
          >
            <span v-if="uploadingCV" class="spinner-border spinner-border-sm me-2"></span>
            {{ profileDetails.cvData.fileName ? 'Replace CV' : 'Upload CV' }}
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
import { getAvailableRolesForUser, getUserRoles, assignRoleToUser, removeRoleFromUser, type Role } from "@/core/services/businessServices/Role";
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

    // Form validation
    const isFormValid = computed(() => {
      return profileDetails.value.firstName && profileDetails.value.lastName && profileDetails.value.email;
    });

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

    // CV management
    const showCvUploadModal = ref(false);
    const selectedCvFile = ref<File | null>(null);
    const uploadingCV = ref(false);
    const cvFileInput = ref<HTMLInputElement | null>(null);

    // Password change management
    const passwordForm = ref({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    const changingPassword = ref(false);

    // Password visibility toggles
    const showCurrentPassword = ref(false);
    const showNewPassword = ref(false);
    const showConfirmPassword = ref(false);

    // Password strength calculation
    const calculatePasswordStrength = (password: string) => {
      if (!password) return { score: 0, text: '', percentage: 0, class: '', barClass: '' };
      
      let score = 0;
      const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
      };

      // Calculate score
      if (requirements.length) score += 1;
      if (requirements.uppercase) score += 1;
      if (requirements.lowercase) score += 1;
      if (requirements.number) score += 1;
      if (requirements.special) score += 1;
      if (password.length >= 12) score += 1;

      // Determine strength level
      let text, class_name, barClass;
      if (score <= 2) {
        text = 'Weak';
        class_name = 'text-danger';
        barClass = 'bg-danger';
      } else if (score <= 4) {
        text = 'Fair';
        class_name = 'text-warning';
        barClass = 'bg-warning';
      } else if (score <= 5) {
        text = 'Good';
        class_name = 'text-info';
        barClass = 'bg-info';
      } else {
        text = 'Strong';
        class_name = 'text-success';
        barClass = 'bg-success';
      }

      return {
        score,
        text,
        class: class_name,
        barClass,
        percentage: Math.min((score / 6) * 100, 100)
      };
    };

    // Computed properties for password strength
    const passwordStrength = computed(() => calculatePasswordStrength(passwordForm.value.newPassword));
    const passwordStrengthText = computed(() => passwordStrength.value.text);
    const passwordStrengthClass = computed(() => passwordStrength.value.class);
    const passwordStrengthBarClass = computed(() => passwordStrength.value.barClass);
    const passwordStrengthPercentage = computed(() => passwordStrength.value.percentage);

    // Password requirements
    const passwordRequirements = computed(() => {
      const password = passwordForm.value.newPassword;
      if (!password) return { length: false, uppercase: false, lowercase: false, number: false };
      
      return {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password)
      };
    });

    // Computed property for password form validation
    const isPasswordFormValid = computed(() => {
      return passwordForm.value.currentPassword &&
             passwordForm.value.newPassword &&
             passwordForm.value.confirmPassword &&
             passwordForm.value.newPassword === passwordForm.value.confirmPassword &&
             passwordForm.value.newPassword.length >= 8;
    });

    // Computed property for available roles (server-side filtered)
    const availableRoles = computed(() => {
      return allRoles.value;
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
        const roles = await getAvailableRolesForUser(userData.value?.id);
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
      if (submitButton1.value && isFormValid.value) {
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
            title: 'Profile updated successfully!',
            text: 'Your profile settings have been saved.',
            confirmButtonText: 'Great!',
            confirmButtonColor: '#3699FF'
          });
        } catch (error) {
          console.error("Error updating profile:", error);
          Swal.fire({
            icon: 'error',
            title: 'Update failed',
            text: 'There was an error updating your profile. Please try again.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#F64E60'
          });
        } finally {
          setTimeout(() => {
            submitButton1.value?.removeAttribute("data-kt-indicator");
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
        
        // Reload user roles and available roles
        await loadUserRoles();
        await loadAvailableRoles();
        
        // Reset form
        selectedRoleId.value = '';
        roleExpirationDate.value = '';
        showAddRoleModal.value = false;
        
        Swal.fire({
          icon: 'success',
          title: 'Role assigned!',
          text: 'The role has been assigned successfully.'
        });
      } catch (error: any) {
        console.error("Error assigning role:", error);
        
        // Gestisci specificamente l'errore di ruolo già assegnato
        if (error.response?.data?.code === 'ROLE_ALREADY_ASSIGNED' || 
            (error.message && error.message.includes('already assigned'))) {
          Swal.fire({
            icon: 'warning',
            title: 'Role already assigned',
            text: 'This role is already assigned to the user.'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.error || error.message || 'There was an error assigning the role.'
          });
        }
      } finally {
        addingRole.value = false;
      }
    };

    // Password change functions
    const changePassword = async () => {
      if (!isPasswordFormValid.value || !userData.value?.id) return;
      
      changingPassword.value = true;
      try {
        const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:3000';
        
        // Use the auth service endpoint for password change
        const response = await fetch(`${API_URL}/auth/update-password`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            userId: userData.value.id,
            currentPassword: passwordForm.value.currentPassword,
            newPassword: passwordForm.value.newPassword,
            confirmPassword: passwordForm.value.confirmPassword
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || errorData.message || 'Failed to change password');
        }
        
        // Reset form
        resetPasswordForm();
        
        Swal.fire({
          icon: 'success',
          title: 'Password changed!',
          text: 'Your password has been changed successfully.'
        });
      } catch (error: any) {
        console.error("Error changing password:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'There was an error changing your password.'
        });
      } finally {
        changingPassword.value = false;
      }
    };

    const resetPasswordForm = () => {
      passwordForm.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
      // Reset visibility toggles
      showCurrentPassword.value = false;
      showNewPassword.value = false;
      showConfirmPassword.value = false;
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
          
          // Reload user roles and available roles
          await loadUserRoles();
          await loadAvailableRoles();
          
          Swal.fire({
            icon: 'success',
            title: 'Role removed!',
            text: 'The role has been removed successfully.'
          });
        } catch (error: any) {
          console.error("Error removing role:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.error || error.message || 'There was an error removing the role.'
          });
        }
      }
    };

    // CV management functions
    const formatFileSize = (bytes: number): string => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const onCvFileChange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        // Validate file type
        const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type)) {
          Swal.fire({
            icon: 'error',
            title: 'Invalid file type',
            text: 'Please select a PDF or DOCX file.'
          });
          return;
        }
        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
          Swal.fire({
            icon: 'error',
            title: 'File too large',
            text: 'Please select a file smaller than 10MB.'
          });
          return;
        }
        selectedCvFile.value = file;
      }
    };

    const uploadCV = async () => {
      if (!selectedCvFile.value || !userData.value?.id) return;
      
      uploadingCV.value = true;
      try {
        const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:3000';
        
        // If replacing an existing CV, delete the old file first
        if (profileDetails.value.cvData.storageUrl) {
          try {
            // Extract the blob name from the storage URL
            const url = new URL(profileDetails.value.cvData.storageUrl);
            const pathParts = url.pathname.split('/').filter(part => part.length > 0);
            
            // The URL format should be: /container-name/blob-path
            // We need to get everything after the container name
            if (pathParts.length >= 2) {
              // Skip the first part (container name) and join the rest
              const blobName = pathParts.slice(1).join('/');
              
              // Delete old file from blob storage
              const deleteResponse = await fetch(`${API_URL}/blobstorage/${encodeURIComponent(blobName)}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
              });
              
              if (!deleteResponse.ok) {
                console.warn('Failed to delete old CV from blob storage:', deleteResponse.statusText);
              } else {
                console.log('Old CV deleted from blob storage successfully');
              }
            }
          } catch (blobError) {
            console.warn('Error deleting old CV from blob storage:', blobError);
            // Continue with upload even if old file deletion fails
          }
        }
        
        // Create form data
        const formData = new FormData();
        formData.append('file', selectedCvFile.value);
        formData.append('prefix', `cv/${userData.value.id}`);
        // Don't use customName - let the service generate the filename with the prefix
        
        // Add metadata
        const metadata = {
          metadata_storage_name: selectedCvFile.value.name,
          metadata_creation_date: new Date().toISOString(),
          entity_type: 'employee',
          entity_id: userData.value.id,
          document_type: 'employee_cv'
        };
        formData.append('metadata', JSON.stringify(metadata));
        
        // Upload file
        const response = await fetch(`${API_URL}/blobstorage/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });
        
        if (!response.ok) {
          throw new Error('Failed to upload CV');
        }
        
        const result = await response.json();
        
        // Update profile details with new CV data
        profileDetails.value.cvData = {
          fileName: selectedCvFile.value.name,
          storageUrl: result.fileUrl
        };
        
        // Update user in database
        const updateData = {
          cvData: {
            fileName: selectedCvFile.value.name,
            storageUrl: result.fileUrl
          }
        };
        
        if (isEmployeeView.value && route.params.id) {
          // Update employee
          const employeeResponse = await fetch(`${API_URL}/applicationuser/${route.params.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
          });
          
          if (!employeeResponse.ok) {
            throw new Error('Failed to update employee CV data');
          }
          
          // Refresh employee data
          if (refreshEmployee) {
            await refreshEmployee();
          }
        } else {
          // Update current user - only update cvData if it exists
          if (result.fileUrl) {
            await updateCurrentUser({
              cvData: {
                fileName: selectedCvFile.value.name,
                storageUrl: result.fileUrl
              }
            } as any);
          }
        }
        
        // Close modal and reset
        showCvUploadModal.value = false;
        selectedCvFile.value = null;
        if (cvFileInput.value) {
          cvFileInput.value.value = '';
        }
        
        Swal.fire({
          icon: 'success',
          title: 'CV uploaded successfully!',
          text: 'Your CV has been uploaded and saved.'
        });
        
      } catch (error: any) {
        console.error("Error uploading CV:", error);
        Swal.fire({
          icon: 'error',
          title: 'Upload failed',
          text: error.message || 'There was an error uploading your CV.'
        });
      } finally {
        uploadingCV.value = false;
      }
    };

    const downloadCV = async () => {
      if (profileDetails.value.cvData.storageUrl && profileDetails.value.cvData.fileName) {
        try {
          const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:3000';
          
          // Extract the blob name from the storage URL
          const url = new URL(profileDetails.value.cvData.storageUrl);
          const pathParts = url.pathname.split('/').filter(part => part.length > 0);
          
          // The URL format should be: /container-name/blob-path
          // We need to get everything after the container name
          if (pathParts.length >= 2) {
            // Skip the first part (container name) and join the rest
            const blobName = pathParts.slice(1).join('/');
            
            // Download from blob storage via backend
            const downloadResponse = await fetch(`${API_URL}/blobstorage/download/${encodeURIComponent(blobName)}`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            });
            
            if (!downloadResponse.ok) {
              throw new Error(`Failed to download file: ${downloadResponse.statusText}`);
            }
            
            // Get the file as blob
            const blob = await downloadResponse.blob();
            
            // Create download link
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = profileDetails.value.cvData.fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
            
          } else {
            throw new Error('Invalid storage URL format');
          }
        } catch (error: any) {
          console.error("Error downloading CV:", error);
          Swal.fire({
            icon: 'error',
            title: 'Download failed',
            text: error.message || 'There was an error downloading your CV.'
          });
        }
      }
    };

    const deleteCV = async () => {
      const confirm = await Swal.fire({
        title: 'Delete CV?',
        text: 'Are you sure you want to delete your CV? This action cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
      });
      
      if (confirm.isConfirmed) {
        try {
          const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:3000';
          
          // First, delete the file from blob storage if we have a storage URL
          if (profileDetails.value.cvData.storageUrl) {
            try {
              // Extract the blob name from the storage URL
              const url = new URL(profileDetails.value.cvData.storageUrl);
              const pathParts = url.pathname.split('/').filter(part => part.length > 0);
              
              // The URL format should be: /container-name/blob-path
              // We need to get everything after the container name
              if (pathParts.length >= 2) {
                // Skip the first part (container name) and join the rest
                const blobName = pathParts.slice(1).join('/');
                
                // Delete from blob storage
                const deleteResponse = await fetch(`${API_URL}/blobstorage/${encodeURIComponent(blobName)}`, {
                  method: 'DELETE',
                  headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                  }
                });
                
                if (!deleteResponse.ok) {
                  console.warn('Failed to delete file from blob storage:', deleteResponse.statusText);
                  const errorText = await deleteResponse.text();
                  console.warn('Error details:', errorText);
                } else {
                  console.log('File deleted from blob storage successfully');
                }
              } else {
                console.warn('Could not extract blob name from URL:', profileDetails.value.cvData.storageUrl);
              }
            } catch (blobError) {
              console.warn('Error deleting from blob storage:', blobError);
              // Continue with database update even if blob deletion fails
            }
          }
          
          // Clear CV data from database
          const updateData = {
            cvData: {
              fileName: '',
              storageUrl: ''
            }
          };
          
          if (isEmployeeView.value && route.params.id) {
            // Update employee
            const response = await fetch(`${API_URL}/applicationuser/${route.params.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updateData)
            });
            
            if (!response.ok) {
              throw new Error('Failed to delete CV from database');
            }
            
            // Refresh employee data
            if (refreshEmployee) {
              await refreshEmployee();
            }
          } else {
            // Update current user - clear cvData
            await updateCurrentUser({
              cvData: {
                fileName: '',
                storageUrl: ''
              }
            } as any);
          }
          
          // Update local state
          profileDetails.value.cvData = {
            fileName: '',
            storageUrl: ''
          };
          
          Swal.fire({
            icon: 'success',
            title: 'CV deleted!',
            text: 'Your CV has been deleted successfully from both storage and database.'
          });
          
        } catch (error: any) {
          console.error("Error deleting CV:", error);
          Swal.fire({
            icon: 'error',
            title: 'Delete failed',
            text: error.message || 'There was an error deleting your CV.'
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
      isFormValid,
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
      // Password management
      passwordForm,
      changingPassword,
      isPasswordFormValid,
      changePassword,
      resetPasswordForm,
      // Password visibility
      showCurrentPassword,
      showNewPassword,
      showConfirmPassword,
      // Password strength
      passwordStrengthText,
      passwordStrengthClass,
      passwordStrengthBarClass,
      passwordStrengthPercentage,
      passwordRequirements,
      // CV management
      showCvUploadModal,
      selectedCvFile,
      uploadingCV,
      cvFileInput,
      onCvFileChange,
      uploadCV,
      downloadCV,
      deleteCV,
      formatFileSize,
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

/* Switch styling */
.form-switch .form-check-input {
  width: 3rem;
  height: 1.5rem;
  margin-top: 0.125rem;
}

.form-switch .form-check-input:checked {
  background-color: #3699FF;
  border-color: #3699FF;
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
</style>
