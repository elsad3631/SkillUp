<template>
  <!--begin::Loading State for Settings-->
  <div v-if="!currentUser" class="d-flex justify-content-center align-items-center" style="min-height: 300px;">
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
                type="url"
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
                <button type="button" class="btn btn-sm btn-success" @click="saveHardSkill(skill, index)">Salva</button>
                <button type="button" class="btn btn-sm btn-danger" @click="deleteHardSkill(skill, index)">Delete</button>
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
                <button type="button" class="btn btn-sm btn-warning" @click="editHardSkill(index)">Edit</button>
                <button type="button" class="btn btn-sm btn-danger" @click="deleteHardSkill(skill, index)">Delete</button>
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
                <button type="button" class="btn btn-sm btn-success" @click="saveSoftSkill(skill, index)">Salva</button>
                <button type="button" class="btn btn-sm btn-danger" @click="deleteSoftSkill(skill, index)">Delete</button>
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
                <button type="button" class="btn btn-sm btn-warning" @click="editSoftSkill(index)">Edit</button>
                <button type="button" class="btn btn-sm btn-danger" @click="deleteSoftSkill(skill, index)">Delete</button>
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
              <button type="button" class="btn btn-sm btn-success me-2" @click="saveExperience(exp, index)">Salva</button>
              <button type="button" class="btn btn-sm btn-danger" @click="deleteExperience(exp, index)">Delete</button>
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
              <button type="button" class="btn btn-sm btn-warning me-2" @click="editExperience(index)">Edit</button>
              <button type="button" class="btn btn-sm btn-danger" @click="deleteExperience(exp, index)">Delete</button>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>

  <!--begin::Sign-in Method-->
  <div class="card mb-5 mb-xl-10">
    <!--begin::Card header-->
    <div
      class="card-header border-0 cursor-pointer"
      role="button"
      data-bs-toggle="collapse"
      data-bs-target="#kt_account_signin_method"
    >
      <div class="card-title m-0">
        <h3 class="fw-bolder m-0">Sign-in Method</h3>
      </div>
    </div>
    <!--end::Card header-->

    <!--begin::Content-->
    <div id="kt_account_signin_method" class="collapse show">
      <!--begin::Card body-->
      <div class="card-body border-top p-9">
        <!--begin::Email Address-->
        <div class="d-flex flex-wrap align-items-center mb-8">
          <div id="kt_signin_email" :class="{ 'd-none': emailFormDisplay }">
            <div class="fs-4 fw-bolder mb-1">Email Address</div>
            <div class="fs-6 fw-semobold text-gray-600">
              {{ currentUser?.email || 'No email set' }}
            </div>
          </div>

          <div
            id="kt_signin_email_edit"
            :class="{ 'd-none': !emailFormDisplay }"
            class="flex-row-fluid"
          >
            <!--begin::Form-->
            <form
              id="kt_signin_change_email"
              class="form"
              method="post"
              novalidate
              @submit.prevent="updateEmail()"
            >
              <div class="row mb-6">
                <div class="col-lg-6 mb-4 mb-lg-0">
                  <div class="fv-row mb-0">
                    <label
                      for="emailaddress"
                      class="form-label fs-6 fw-bold mb-3"
                      >Enter New Email Address</label
                    >
                    <input
                      type="email"
                      class="form-control form-control-lg form-control-solid fw-semobold fs-6"
                      id="emailaddress"
                      placeholder="Email Address"
                      name="emailaddress"
                      v-model="emailFormData.newEmail"
                    />
                    
                  </div>
                </div>
                <div class="col-lg-6">
                  <div class="fv-row mb-0">
                    <label
                      for="confirmemailpassword"
                      class="form-label fs-6 fw-bold mb-3"
                      >Confirm Password</label
                    >
                    <input
                      type="password"
                      class="form-control form-control-lg form-control-solid fw-semobold fs-6"
                      name="confirmemailpassword"
                      id="confirmemailpassword"
                      v-model="emailFormData.confirmEmailPassword"
                    />
                    
                  </div>
                </div>
              </div>
              <div class="d-flex">
                <button
                  id="kt_signin_submit"
                  type="submit"
                  ref="updateEmailButton"
                  class="btn btn-primary me-2 px-6"
                >
                  <span class="indicator-label"> Update Email </span>
                  <span class="indicator-progress">
                    Please wait...
                    <span
                      class="spinner-border spinner-border-sm align-middle ms-2"
                    ></span>
                  </span>
                </button>
                <button
                  id="kt_signin_cancel"
                  type="button"
                  class="btn btn-color-gray-400 btn-active-light-primary px-6"
                  @click="emailFormDisplay = !emailFormDisplay"
                >
                  Cancel
                </button>
              </div>
            </form>
            <!--end::Form-->
          </div>
          <div
            id="kt_signin_email_button"
            :class="{ 'd-none': emailFormDisplay }"
            class="ms-auto"
          >
            <button
              class="btn btn-light fw-bolder px-6"
              @click="emailFormDisplay = !emailFormDisplay"
            >
              Change Email
            </button>
          </div>
        </div>
        <!--end::Email Address-->

        <!--begin::Password-->
        <div class="d-flex flex-wrap align-items-center mb-8">
          <div
            id="kt_signin_password"
            :class="{ 'd-none': passwordFormDisplay }"
          >
            <div class="fs-4 fw-bolder mb-1">Password</div>
            <div class="fs-6 fw-semobold text-gray-600">************</div>
          </div>
          <div
            id="kt_signin_password_edit"
            class="flex-row-fluid"
            :class="{ 'd-none': !passwordFormDisplay }"
          >
            <div class="fs-6 fw-semobold text-gray-600 mb-4">
              Password must be at least 8 character and contain symbols
            </div>

            <!--begin::Form-->
            <form
              id="kt_signin_change_password"
              class="form"
              method="post"
              novalidate
              @submit.prevent="updatePassword()"
            >
              <div class="row mb-6">
                <div class="col-lg-4">
                  <div class="fv-row mb-0">
                    <label
                      for="currentpassword"
                      class="form-label fs-6 fw-bold mb-3"
                      >Current Password</label
                    >
                    <input
                      type="password"
                      class="form-control form-control-lg form-control-solid fw-semobold fs-6"
                      name="currentpassword"
                      id="currentpassword"
                      v-model="passwordFormData.currentPassword"
                    />
                    
                  </div>
                </div>
                <div class="col-lg-4">
                  <div class="fv-row mb-0">
                    <label
                      for="newpassword"
                      class="form-label fs-6 fw-bold mb-3"
                      >New Password</label
                    >
                    <input
                      type="password"
                      class="form-control form-control-lg form-control-solid fw-semobold fs-6"
                      name="newpassword"
                      id="newpassword"
                      v-model="passwordFormData.newPassword"
                    />
                    
                  </div>
                </div>
                <div class="col-lg-4">
                  <div class="fv-row mb-0">
                    <label
                      for="confirmpassword"
                      class="form-label fs-6 fw-bold mb-3"
                      >Confirm New Password</label
                    >
                    <input
                      type="password"
                      class="form-control form-control-lg form-control-solid fw-semobold fs-6"
                      name="confirmpassword"
                      id="confirmpassword"
                      v-model="passwordFormData.confirmPassword"
                    />
                    
                  </div>
                </div>
              </div>
              <div class="d-flex">
                <button
                  id="kt_password_submit"
                  type="submit"
                  ref="updatePasswordButton"
                  class="btn btn-primary me-2 px-6"
                >
                  <span class="indicator-label"> Update Password </span>
                  <span class="indicator-progress">
                    Please wait...
                    <span
                      class="spinner-border spinner-border-sm align-middle ms-2"
                    ></span>
                  </span>
                </button>
                <button
                  id="kt_password_cancel"
                  type="button"
                  @click="passwordFormDisplay = !passwordFormDisplay"
                  class="btn btn-color-gray-400 btn-active-light-primary px-6"
                >
                  Cancel
                </button>
              </div>
            </form>
            <!--end::Form-->
          </div>
          <div
            id="kt_signin_password_button"
            class="ms-auto"
            :class="{ 'd-none': passwordFormDisplay }"
          >
            <button
              @click="passwordFormDisplay = !passwordFormDisplay"
              class="btn btn-light fw-bolder"
            >
              Reset Password
            </button>
          </div>
        </div>
        <!--end::Password-->
      </div>
      <!--end::Card body-->
    </div>
    <!--end::Content-->
  </div>
  <!--end::Sign-in Method-->

  <!--begin::Deactivate Account-->
  <div class="card mb-5 mb-xl-10">
    <!--begin::Card header-->
    <div
      class="card-header border-0 cursor-pointer"
      role="button"
      data-bs-toggle="collapse"
      data-bs-target="#kt_account_deactivate"
      aria-expanded="true"
      aria-controls="kt_account_deactivate"
    >
      <div class="card-title m-0">
        <h3 class="fw-bolder m-0">Deactivate Account</h3>
      </div>
    </div>
    <!--end::Card header-->

    <!--begin::Content-->
    <div id="kt_account_deactivate" class="collapse show">
      <!--begin::Form-->
      <form
        id="kt_account_deactivate_form"
        class="form"
        @submit.prevent="deactivateAccount()"
      >
        <!--begin::Card body-->
        <div class="card-body border-top p-9">
          <div
            class="notice d-flex bg-light-warning rounded border-warning border border-dashed mb-9 p-6"
          >
            <KTIcon
              icon-name="information-5"
              icon-class="fs-2tx text-warning me-4"
            />
            <!--begin::Wrapper-->
            <div class="d-flex flex-stack flex-grow-1">
              <!--begin::Content-->
              <div class="fw-semobold">
                <h4 class="text-gray-800 fw-bold">
                  You Are Deactivating Your Account
                </h4>

                <div class="fs-6 text-gray-600">
                  For extra security, this requires you to confirm your email or
                  phone number when you reset yousignr password. <br /><a
                    class="fw-bold"
                    href="#"
                    >Learn more</a
                  >
                </div>
              </div>
              <!--end::Content-->
            </div>
            <!--end::Wrapper-->
          </div>

          <!--begin::Form input row-->
          <div class="form-check form-check-solid fv-row">
            <input
              name="deactivate"
              class="form-check-input"
              type="checkbox"
              value=""
              id="deactivate"
            />
            <label
              class="form-check-label fw-semobold ps-2 fs-6"
              for="deactivate"
              >Confirm Account Deactivation</label
            >
          </div>
          <!--end::Form input row-->
        </div>
        <!--end::Card body-->

        <!--begin::Card footer-->
        <div class="card-footer d-flex justify-content-end py-6 px-9">
          <button
            id="kt_account_deactivate_account_submit"
            ref="submitButton5"
            type="submit"
            class="btn btn-danger fw-semobold"
          >
            <span class="indicator-label"> Deactivate Account </span>
            <span class="indicator-progress">
              Please wait...
              <span
                class="spinner-border spinner-border-sm align-middle ms-2"
              ></span>
            </span>
          </button>
        </div>
        <!--end::Card footer-->
      </form>
      <!--end::Form-->
    </div>
    <!--end::Content-->
  </div>
  <!--end::Deactivate Account-->

  </div>
  <!--end::Settings Content-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, ref, inject, watch, onMounted, onUnmounted, computed, nextTick } from "vue";
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as Yup from "yup";
import ApiService from "@/core/services/ApiService";
import { useAuthStore } from "@/stores/auth";
// Updated to use ApplicationUser API calls
// import { getEmployee, updateEmployee } from "@/core/services/businessServices/Employee";
import { useRoute } from "vue-router";
import { createSkill, updateSkill, deleteSkill } from "@/core/services/businessServices/Skill";
import { createExperience, updateExperience, deleteExperience } from "@/core/services/businessServices/Experience";
import type { Employee } from "@/core/models/Employee";
import { useCurrentUser } from "@/core/composables/useCurrentUser";

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
    const submitButton2 = ref<HTMLElement | null>(null);
    const submitButton3 = ref<HTMLElement | null>(null);
    const submitButton4 = ref<HTMLElement | null>(null);
    const submitButton5 = ref<HTMLElement | null>(null);
    const updateEmailButton = ref<HTMLElement | null>(null);
    const updatePasswordButton = ref<HTMLElement | null>(null);

    // Reactive states
    const emailFormDisplay = ref(false);
    const passwordFormDisplay = ref(false);
    const editingHardSkillIndex = ref<number | null>(null);
    const editingSoftSkillIndex = ref<number | null>(null);
    const editingExperienceIndex = ref<number | null>(null);

    // Email change form data
    const emailFormData = ref({
      newEmail: '',
      confirmEmailPassword: ''
    });

    // Password change form data
    const passwordFormData = ref({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    const { currentUser, updateCurrentUser, refreshCurrentUser } = useCurrentUser();

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

    // Helper function to format date for HTML input
    const formatDateForInput = (dateValue: string | Date | null | undefined): string => {
      if (!dateValue) return '';
      try {
        const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
        return date.toISOString().split('T')[0]; // Convert to yyyy-MM-dd format
      } catch (error) {
        console.warn('Invalid date format:', dateValue);
        return '';
      }
    };

    // Helper function to convert form date (yyyy-MM-dd) to ISO format
    const formatDateForAPI = (dateString: string): string | undefined => {
      if (!dateString) return undefined;
      try {
        const date = new Date(dateString + 'T00:00:00.000Z');
        return date.toISOString();
      } catch (error) {
        console.warn('Invalid date format:', dateString);
        return undefined;
      }
    };

    // Watch for current user changes and update profile details
    watch(currentUser, (val) => {
      if (val) {
        profileDetails.value = {
          firstName: val.firstName || '',
          lastName: val.lastName || '',
          email: val.email || '',
          phone: val.phone || '',
          dateOfBirth: formatDateForInput(val.dateOfBirth),
          placeOfBirth: val.placeOfBirth || '',
          address: val.address || '',
          currentRole: val.currentRole || '',
          department: val.department || '',
          isAvailable: val.isAvailable ?? false,
          hardSkills: val.hardSkills || [],
          softSkills: val.softSkills || [],
          experiences: (val.experiences || []).map(exp => ({
            ...exp,
            startDate: formatDateForInput(exp.startDate),
            endDate: formatDateForInput(exp.endDate)
          })),
          cvData: {
            fileName: val.cvData?.fileName || '',
            storageUrl: val.cvData?.storageUrl || ''
          }
        };
      }
    }, { immediate: true });

    const authStore = useAuthStore();

    const saveChanges1 = async () => {
      if (submitButton1.value) {
        // Activate indicator
        submitButton1.value.setAttribute("data-kt-indicator", "on");
        
        try {
          // Preparo i dati da salvare per l'utente corrente
          const userData = {
            firstName: profileDetails.value.firstName,
            lastName: profileDetails.value.lastName,
            email: profileDetails.value.email,
            phone: profileDetails.value.phone,
            dateOfBirth: formatDateForAPI(profileDetails.value.dateOfBirth),
            placeOfBirth: profileDetails.value.placeOfBirth,
            address: profileDetails.value.address,
            currentRole: profileDetails.value.currentRole,
            department: profileDetails.value.department,
            isAvailable: profileDetails.value.isAvailable,
          };

          // Update the current user
          await updateCurrentUser(userData);
          
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

    const saveChanges2 = () => {
      if (submitButton2.value) {
        // Activate indicator
        submitButton2.value.setAttribute("data-kt-indicator", "on");

        setTimeout(() => {
          submitButton2.value?.removeAttribute("data-kt-indicator");
        }, 2000);
      }
    };

    const saveChanges3 = () => {
      if (submitButton3.value) {
        // Activate indicator
        submitButton3.value.setAttribute("data-kt-indicator", "on");

        setTimeout(() => {
          submitButton3.value?.removeAttribute("data-kt-indicator");
        }, 2000);
      }
    };

    const saveChanges4 = () => {
      if (submitButton4.value) {
        // Activate indicator
        submitButton4.value.setAttribute("data-kt-indicator", "on");

        setTimeout(() => {
          submitButton4.value?.removeAttribute("data-kt-indicator");
        }, 2000);
      }
    };

    const deactivateAccount = () => {
      if (submitButton5.value) {
        // Activate indicator
        submitButton5.value.setAttribute("data-kt-indicator", "on");

        setTimeout(() => {
          submitButton5.value?.removeAttribute("data-kt-indicator");

          Swal.fire({
            text: "Email is successfully changed!",
            icon: "success",
            confirmButtonText: "Ok",
            buttonsStyling: false,
            heightAuto: false,
            customClass: {
              confirmButton: "btn btn-light-primary",
            },
          }).then(() => {
            emailFormDisplay.value = false;
          });
        }, 2000);
      }
    };

    const updateEmail = async () => {
      if (updateEmailButton.value) {
        // Activate indicator
        updateEmailButton.value.setAttribute("data-kt-indicator", "on");

        try {
          // Validate form
          if (!emailFormData.value.newEmail || !emailFormData.value.confirmEmailPassword) {
            throw new Error('Please fill in all fields');
          }

          // Call API to update email
          const response = await ApiService.put('/auth/update-email', {
            newEmail: emailFormData.value.newEmail,
            currentPassword: emailFormData.value.confirmEmailPassword
          });

          if (response.data.user) {
            // Update current user email in the store and reactive data
            profileDetails.value.email = response.data.user.email;
            
            // Update auth store if needed
            if (authStore.user) {
              authStore.user.email = response.data.user.email;
            }

            // Refresh current user data to ensure UI is updated
            await refreshCurrentUser();
          }

          // Clear form
          emailFormData.value.newEmail = '';
          emailFormData.value.confirmEmailPassword = '';

          Swal.fire({
            text: "Email is successfully changed!",
            icon: "success",
            confirmButtonText: "Ok",
            buttonsStyling: false,
            heightAuto: false,
            customClass: {
              confirmButton: "btn btn-light-primary",
            },
          }).then(() => {
            emailFormDisplay.value = false;
          });

        } catch (error: any) {
          console.error("Error updating email:", error);
          
          let errorMessage = 'Failed to update email';
          if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          } else if (error.message) {
            errorMessage = error.message;
          }

          Swal.fire({
            text: errorMessage,
            icon: "error",
            confirmButtonText: "Ok",
            buttonsStyling: false,
            heightAuto: false,
            customClass: {
              confirmButton: "btn btn-light-primary",
            },
          });
        } finally {
          updateEmailButton.value?.removeAttribute("data-kt-indicator");
        }
      }
    };

    const updatePassword = async () => {
      if (updatePasswordButton.value) {
        // Activate indicator
        updatePasswordButton.value.setAttribute("data-kt-indicator", "on");

        try {
          // Validate form
          if (!passwordFormData.value.currentPassword || !passwordFormData.value.newPassword || !passwordFormData.value.confirmPassword) {
            throw new Error('Please fill in all fields');
          }

          if (passwordFormData.value.newPassword !== passwordFormData.value.confirmPassword) {
            throw new Error('New passwords do not match');
          }

          if (passwordFormData.value.newPassword.length < 8) {
            throw new Error('New password must be at least 8 characters long');
          }

          // Call API to update password
          await ApiService.put('/auth/update-password', {
            currentPassword: passwordFormData.value.currentPassword,
            newPassword: passwordFormData.value.newPassword,
            confirmPassword: passwordFormData.value.confirmPassword
          });

          // Clear form
          passwordFormData.value.currentPassword = '';
          passwordFormData.value.newPassword = '';
          passwordFormData.value.confirmPassword = '';

          Swal.fire({
            text: "Password is successfully changed!",
            icon: "success",
            confirmButtonText: "Ok",
            buttonsStyling: false,
            heightAuto: false,
            customClass: {
              confirmButton: "btn btn-light-primary",
            },
          }).then(() => {
            passwordFormDisplay.value = false;
          });

        } catch (error: any) {
          console.error("Error updating password:", error);
          
          let errorMessage = 'Failed to update password';
          if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          } else if (error.message) {
            errorMessage = error.message;
          }

          Swal.fire({
            text: errorMessage,
            icon: "error",
            confirmButtonText: "Ok",
            buttonsStyling: false,
            heightAuto: false,
            customClass: {
              confirmButton: "btn btn-light-primary",
            },
          });
        } finally {
          updatePasswordButton.value?.removeAttribute("data-kt-indicator");
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
        if (!currentUser.value?.id) {
          throw new Error('User not logged in');
        }
        
        // Preparo solo i campi accettati dal backend
        const dataToSend = {
          name: skill.name,
          proficiencyLevel: skill.proficiencyLevel ? parseInt(skill.proficiencyLevel) : undefined,
          certification: skill.certification,
          applicationUserHard: { connect: { id: currentUser.value.id } },
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
        if (!currentUser.value?.id) {
          throw new Error('User not logged in');
        }
        
        // Preparo solo i campi accettati dal backend
        const dataToSend = {
          name: skill.name,
          proficiencyLevel: skill.proficiencyLevel ? parseInt(skill.proficiencyLevel) : undefined,
          certification: skill.certification,
          applicationUserSoft: { connect: { id: currentUser.value.id } },
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
        if (!currentUser.value?.id) {
          throw new Error('User not logged in');
        }
        
        if (typeof exp.technologiesUsed === 'string') {
          exp.technologiesUsed = exp.technologiesUsed.split(',').map(s => s.trim()).filter(Boolean);
        }
        
        if (exp.id) {
          // Per l'update, prepariamo i dati con le date convertite
          const updateData = {
            ...exp,
            startDate: exp.startDate ? new Date(formatDateForAPI(exp.startDate) || exp.startDate) : undefined,
            endDate: exp.endDate ? new Date(formatDateForAPI(exp.endDate) || exp.endDate) : undefined,
          };
          await updateExperience(exp.id, updateData);
        } else {
          // Per la creazione, convertiamo le date usando la funzione helper
          const experienceData = {
            jobTitle: exp.jobTitle,
            companyName: exp.companyName,
            startDate: exp.startDate ? new Date(formatDateForAPI(exp.startDate) || exp.startDate) : undefined,
            endDate: exp.endDate ? new Date(formatDateForAPI(exp.endDate) || exp.endDate) : undefined,
            description: exp.description || undefined,
            technologiesUsed: exp.technologiesUsed || [],
            applicationUser: { connect: { id: currentUser.value.id } }
          };
          const created = await createExperience(experienceData);
          if (created) {
            // Format the returned dates back to form format
            const formattedCreated = {
              ...created,
              startDate: formatDateForInput(created.startDate),
              endDate: formatDateForInput(created.endDate)
            };
            profileDetails.value.experiences[index] = formattedCreated;
          }
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

    // Clean up temporary files on component unmount
    onMounted(() => {
      window.addEventListener('beforeunload', () => {
        // This cleanup is now handled by onUnmounted
      });
    });

    onUnmounted(async () => {
      // Cleanup is no longer needed since avatar management moved to Account.vue
    });

    return {
      submitButton1,
      submitButton2,
      submitButton3,
      submitButton4,
      submitButton5,
      updateEmailButton,
      updatePasswordButton,
      saveChanges1,
      saveChanges2,
      saveChanges3,
      saveChanges4,
      deactivateAccount,
      profileDetails,
      currentUser,
      emailFormDisplay,
      passwordFormDisplay,
      emailFormData,
      passwordFormData,
      updateEmail,
      updatePassword,
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
      // Date helper functions
      formatDateForInput,
      formatDateForAPI,
    };
  },
});
</script>

<style scoped>
/* Avatar management has been moved to Account.vue */
</style>
