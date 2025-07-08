<template>
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
      <VForm
        id="kt_account_profile_details_form"
        class="form"
        novalidate
        @submit="saveChanges1()"
        :validation-schema="profileDetailsValidator"
      >
        <!--begin::Card body-->
        <div class="card-body border-top p-9">
          <!--begin::Input group-->
          <div class="row mb-6">
            <!--begin::Label-->
            <label class="col-lg-4 col-form-label fw-semobold fs-6"
              >Avatar</label
            >
            <!--end::Label-->

            <!--begin::Col-->
            <div class="col-lg-8">
              <!--begin::Image input-->
              <div
                class="image-input image-input-outline"
                data-kt-image-input="true"
                :style="{
                  backgroundImage: `url(${getAssetPath(
                    '/media/avatars/blank.png'
                  )})`,
                }"
              >
                <!--begin::Preview existing avatar-->
                <div
                  class="image-input-wrapper w-125px h-125px"
                  :style="`background-image: url(${profileDetails.avatar})`"
                ></div>
                <!--end::Preview existing avatar-->

                <!--begin::Label-->
                <label
                  class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                  data-kt-image-input-action="change"
                  data-bs-toggle="tooltip"
                  title="Change avatar"
                >
                  <i class="bi bi-pencil-fill fs-7"></i>

                  <!--begin::Inputs-->
                  <input type="file" name="avatar" accept=".png, .jpg, .jpeg" />
                  <input type="hidden" name="avatar_remove" />
                  <!--end::Inputs-->
                </label>
                <!--end::Label-->

                <!--begin::Remove-->
                <span
                  class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                  data-kt-image-input-action="remove"
                  data-bs-toggle="tooltip"
                  @click="removeImage()"
                  title="Remove avatar"
                >
                  <i class="bi bi-x fs-2"></i>
                </span>
                <!--end::Remove-->
              </div>
              <!--end::Image input-->

              <!--begin::Hint-->
              <div class="form-text">Allowed file types: png, jpg, jpeg.</div>
              <!--end::Hint-->
            </div>
            <!--end::Col-->
          </div>
          <!--end::Input group-->

          <!--begin::Input group-->
          <div class="row mb-6">
            <label class="col-lg-4 col-form-label required fw-semobold fs-6">First Name</label>
            <div class="col-lg-8 fv-row">
              <Field
                type="text"
                name="firstName"
                class="form-control form-control-lg form-control-solid mb-3 mb-lg-0"
                placeholder="First name"
                v-model="profileDetails.firstName"
              />
              <div class="fv-plugins-message-container">
                <div class="fv-help-block">
                  <ErrorMessage name="firstName" />
                </div>
              </div>
            </div>
          </div>
          <!--end::Input group-->

          <div class="row mb-6">
            <label class="col-lg-4 col-form-label required fw-semobold fs-6">Last Name</label>
            <div class="col-lg-8 fv-row">
              <Field
                type="text"
                name="lastName"
                class="form-control form-control-lg form-control-solid"
                placeholder="Last name"
                v-model="profileDetails.lastName"
              />
              <div class="fv-plugins-message-container">
                <div class="fv-help-block">
                  <ErrorMessage name="lastName" />
                </div>
              </div>
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
              <Field
                type="text"
                name="department"
                class="form-control form-control-lg form-control-solid"
                placeholder="Department"
                v-model="profileDetails.department"
              />
              <div class="fv-plugins-message-container">
                <div class="fv-help-block">
                  <ErrorMessage name="department" />
                </div>
              </div>
            </div>
            <!--end::Col-->
          </div>
          <!--end::Input group-->

          <div class="row mb-6">
            <label class="col-lg-4 col-form-label fw-semobold fs-6">Contact Phone</label>
            <div class="col-lg-8 fv-row">
              <Field
                type="tel"
                name="phone"
                class="form-control form-control-lg form-control-solid"
                placeholder="Phone number"
                v-model="profileDetails.phone"
              />
              <div class="fv-plugins-message-container">
                <div class="fv-help-block">
                  <ErrorMessage name="phone" />
                </div>
              </div>
            </div>
          </div>
          <!--end::Input group-->

          <div class="row mb-6">
            <label class="col-lg-4 col-form-label fw-semobold fs-6">Current Role</label>
            <div class="col-lg-8 fv-row">
              <Field
                type="text"
                name="currentRole"
                class="form-control form-control-lg form-control-solid"
                placeholder="Current role"
                v-model="profileDetails.currentRole"
              />
              <div class="fv-plugins-message-container">
                <div class="fv-help-block">
                  <ErrorMessage name="currentRole" />
                </div>
              </div>
            </div>
          </div>
          <!--end::Input group-->

          <div class="row mb-6">
            <label class="col-lg-4 col-form-label fw-semobold fs-6">Available for assignments</label>
            <div class="col-lg-8 fv-row d-flex align-items-center">
              <Field
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
            <!--begin::Label-->
            <label class="col-lg-4 col-form-label fw-semobold fs-6"
              >Communication</label
            >
            <!--end::Label-->

            <!--begin::Col-->
            <div class="col-lg-8 fv-row">
              <!--begin::Options-->
              <div class="d-flex align-items-center mt-3">
                <!--begin::Option-->
                <label
                  class="form-check form-check-inline form-check-solid me-5"
                >
                  <input
                    class="form-check-input"
                    name="communication[]"
                    type="checkbox"
                  />
                  <span class="fw-semobold ps-2 fs-6"> Email </span>
                </label>
                <!--end::Option-->

                <!--begin::Option-->
                <label class="form-check form-check-inline form-check-solid">
                  <input
                    class="form-check-input"
                    name="communication[]"
                    type="checkbox"
                  />
                  <span class="fw-semobold ps-2 fs-6"> Phone </span>
                </label>
                <!--end::Option-->
              </div>
              <!--end::Options-->
            </div>
            <!--end::Col-->
          </div>
          <!--end::Input group-->

          <!--begin::Input group-->
          <div class="row mb-0">
            <!--begin::Label-->
            <label class="col-lg-4 col-form-label fw-semobold fs-6"
              >Allow Marketing</label
            >
            <!--begin::Label-->

            <!--begin::Label-->
            <div class="col-lg-8 d-flex align-items-center">
              <div class="form-check form-check-solid form-switch fv-row">
                <input
                  class="form-check-input w-45px h-30px"
                  type="checkbox"
                  id="allowmarketing"
                />
                <label class="form-check-label" for="allowmarketing"></label>
              </div>
            </div>
            <!--begin::Label-->
          </div>
          <!--end::Input group-->

          <!--begin::Input group-->
          <div class="row mb-6">
            <label class="col-lg-4 col-form-label required fw-semobold fs-6">Email</label>
            <div class="col-lg-8 fv-row">
              <Field
                type="email"
                name="email"
                class="form-control form-control-lg form-control-solid"
                placeholder="Email address"
                v-model="profileDetails.email"
              />
              <div class="fv-plugins-message-container">
                <div class="fv-help-block">
                  <ErrorMessage name="email" />
                </div>
              </div>
            </div>
          </div>
          <!-- Date of Birth & Place of Birth -->
          <div class="row mb-6">
            <div class="col-lg-6">
              <label class="col-form-label fw-semobold fs-6">Date of Birth</label>
              <Field
                type="date"
                name="dateOfBirth"
                class="form-control form-control-lg form-control-solid"
                v-model="profileDetails.dateOfBirth"
              />
              <div class="fv-plugins-message-container">
                <div class="fv-help-block">
                  <ErrorMessage name="dateOfBirth" />
                </div>
              </div>
            </div>
            <div class="col-lg-6">
              <label class="col-form-label fw-semobold fs-6">Place of Birth</label>
              <Field
                type="text"
                name="placeOfBirth"
                class="form-control form-control-lg form-control-solid"
                placeholder="Place of birth"
                v-model="profileDetails.placeOfBirth"
              />
              <div class="fv-plugins-message-container">
                <div class="fv-help-block">
                  <ErrorMessage name="placeOfBirth" />
                </div>
              </div>
            </div>
          </div>
          <!-- Address -->
          <div class="row mb-6">
            <label class="col-lg-4 col-form-label fw-semobold fs-6">Address</label>
            <div class="col-lg-8 fv-row">
              <Field
                as="textarea"
                name="address"
                class="form-control form-control-lg form-control-solid"
                placeholder="Address"
                rows="2"
                v-model="profileDetails.address"
              />
              <div class="fv-plugins-message-container">
                <div class="fv-help-block">
                  <ErrorMessage name="address" />
                </div>
              </div>
            </div>
          </div>
          <!-- CV Data -->
          <div class="row mb-6">
            <div class="col-lg-6">
              <label class="col-form-label fw-semobold fs-6">CV File Name</label>
              <Field
                type="text"
                name="cvData.fileName"
                class="form-control form-control-lg form-control-solid"
                placeholder="e.g. john_doe_cv.pdf"
                v-model="profileDetails.cvData.fileName"
              />
              <div class="fv-plugins-message-container">
                <div class="fv-help-block">
                  <ErrorMessage name="cvData.fileName" />
                </div>
              </div>
            </div>
            <div class="col-lg-6">
              <label class="col-form-label fw-semobold fs-6">CV URL</label>
              <Field
                type="url"
                name="cvData.storageUrl"
                class="form-control form-control-lg form-control-solid"
                placeholder="https://example.com/cv.pdf"
                v-model="profileDetails.cvData.storageUrl"
              />
              <div class="fv-plugins-message-container">
                <div class="fv-help-block">
                  <ErrorMessage name="cvData.storageUrl" />
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
      </VForm>
      <!--end::Form-->
    </div>
    <!--end::Content-->
  </div>
  <!--end::Basic info-->

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
              support@keenthemes.com
            </div>
          </div>

          <div
            id="kt_signin_email_edit"
            :class="{ 'd-none': !emailFormDisplay }"
            class="flex-row-fluid"
          >
            <!--begin::Form-->
            <VForm
              id="kt_signin_change_email"
              class="form"
              novalidate
              @submit="updateEmail()"
              :validation-schema="changeEmail"
            >
              <div class="row mb-6">
                <div class="col-lg-6 mb-4 mb-lg-0">
                  <div class="fv-row mb-0">
                    <label
                      for="emailaddress"
                      class="form-label fs-6 fw-bold mb-3"
                      >Enter New Email Address</label
                    >
                    <Field
                      type="email"
                      class="form-control form-control-lg form-control-solid fw-semobold fs-6"
                      id="emailaddress"
                      placeholder="Email Address"
                      name="emailaddress"
                      value="support@keenthemes.com"
                    />
                    <div class="fv-plugins-message-container">
                      <div class="fv-help-block">
                        <ErrorMessage name="emailaddress" />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-lg-6">
                  <div class="fv-row mb-0">
                    <label
                      for="confirmemailpassword"
                      class="form-label fs-6 fw-bold mb-3"
                      >Confirm Password</label
                    >
                    <Field
                      type="password"
                      class="form-control form-control-lg form-control-solid fw-semobold fs-6"
                      name="confirmemailpassword"
                      id="confirmemailpassword"
                    />
                    <div class="fv-plugins-message-container">
                      <div class="fv-help-block">
                        <ErrorMessage name="confirmemailpassword" />
                      </div>
                    </div>
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
            </VForm>
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
            <VForm
              id="kt_signin_change_password"
              class="form"
              novalidate
              @submit="updatePassword()"
              :validation-schema="changePassword"
            >
              <div class="row mb-6">
                <div class="col-lg-4">
                  <div class="fv-row mb-0">
                    <label
                      for="currentpassword"
                      class="form-label fs-6 fw-bold mb-3"
                      >Current Password</label
                    >
                    <Field
                      type="password"
                      class="form-control form-control-lg form-control-solid fw-semobold fs-6"
                      name="currentpassword"
                      id="currentpassword"
                    />
                    <div class="fv-plugins-message-container">
                      <div class="fv-help-block">
                        <ErrorMessage name="currentpassword" />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-lg-4">
                  <div class="fv-row mb-0">
                    <label
                      for="newpassword"
                      class="form-label fs-6 fw-bold mb-3"
                      >New Password</label
                    >
                    <Field
                      type="password"
                      class="form-control form-control-lg form-control-solid fw-semobold fs-6"
                      name="newpassword"
                      id="newpassword"
                    />
                    <div class="fv-plugins-message-container">
                      <div class="fv-help-block">
                        <ErrorMessage name="newpassword" />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-lg-4">
                  <div class="fv-row mb-0">
                    <label
                      for="confirmpassword"
                      class="form-label fs-6 fw-bold mb-3"
                      >Confirm New Password</label
                    >
                    <Field
                      type="password"
                      class="form-control form-control-lg form-control-solid fw-semobold fs-6"
                      name="confirmpassword"
                      id="confirmpassword"
                    />
                    <div class="fv-plugins-message-container">
                      <div class="fv-help-block">
                        <ErrorMessage name="confirmpassword" />
                      </div>
                    </div>
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
            </VForm>
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

  <!--begin::Connected Accounts-->
  <div class="card mb-5 mb-xl-10">
    <!--begin::Card header-->
    <div
      class="card-header border-0 cursor-pointer"
      role="button"
      data-bs-toggle="collapse"
      data-bs-target="#kt_account_connected_accounts"
      aria-expanded="true"
      aria-controls="kt_account_connected_accounts"
    >
      <div class="card-title m-0">
        <h3 class="fw-bold m-0">Connected Accounts</h3>
      </div>
    </div>
    <!--end::Card header-->

    <!--begin::Content-->
    <div id="kt_account_connected_accounts" class="collapse show">
      <!--begin::Card body-->
      <div class="card-body border-top p-9">
        <div
          class="notice d-flex bg-light-primary rounded border-primary border border-dashed mb-9 p-6"
        >
          <KTIcon
            icon-name="design-frame"
            icon-class="fs-2tx text-primary me-4"
          />

          <!--begin::Wrapper-->
          <div class="d-flex flex-stack flex-grow-1">
            <!--begin::Content-->
            <div class="fw-semobold">
              <div class="fs-6 text-gray-600">
                Two-factor authentication adds an extra layer of security to
                your account. To log in, in you'll need to provide a 4 digit
                amazing code. <a href="#" class="fw-bold">Learn More</a>
              </div>
            </div>
            <!--end::Content-->
          </div>
          <!--end::Wrapper-->
        </div>

        <!--begin::Items-->
        <div class="py-2">
          <!--begin::Item-->
          <div class="d-flex flex-stack">
            <div class="d-flex">
              <img
                :src="getAssetPath('media/svg/brand-logos/google-icon.svg')"
                class="w-30px me-6"
                alt=""
              />

              <div class="d-flex flex-column">
                <a href="#" class="fs-5 text-dark text-hover-primary fw-bold"
                  >Google</a
                >
                <div class="fs-6 fw-semobold text-gray-400">
                  Plan properly your workflow
                </div>
              </div>
            </div>
            <div class="d-flex justify-content-end">
              <div class="form-check form-check-solid form-switch">
                <input
                  class="form-check-input w-45px h-30px"
                  type="checkbox"
                  id="googleswitch"
                  checked
                />
                <label class="form-check-label" for="googleswitch"></label>
              </div>
            </div>
          </div>
          <!--end::Item-->

          <div class="separator separator-dashed my-5"></div>

          <!--begin::Item-->
          <div class="d-flex flex-stack">
            <div class="d-flex">
              <img
                :src="getAssetPath('media/svg/brand-logos/github.svg')"
                class="w-30px me-6"
                alt=""
              />

              <div class="d-flex flex-column">
                <a href="#" class="fs-5 text-dark text-hover-primary fw-bold"
                  >Github</a
                >
                <div class="fs-6 fw-semobold text-gray-400">
                  Keep eye on on your Repositories
                </div>
              </div>
            </div>
            <div class="d-flex justify-content-end">
              <div class="form-check form-check-solid form-switch">
                <input
                  class="form-check-input w-45px h-30px"
                  type="checkbox"
                  id="githubswitch"
                  checked
                />
                <label class="form-check-label" for="githubswitch"></label>
              </div>
            </div>
          </div>
          <!--end::Item-->

          <div class="separator separator-dashed my-5"></div>

          <!--begin::Item-->
          <div class="d-flex flex-stack">
            <div class="d-flex">
              <img
                :src="getAssetPath('media/svg/brand-logos/slack-icon.svg')"
                class="w-30px me-6"
                alt=""
              />

              <div class="d-flex flex-column">
                <a href="#" class="fs-5 text-dark text-hover-primary fw-bold"
                  >Slack</a
                >
                <div class="fs-6 fw-semobold text-gray-400">
                  Integrate Projects Discussions
                </div>
              </div>
            </div>
            <div class="d-flex justify-content-end">
              <div class="form-check form-check-solid form-switch">
                <input
                  class="form-check-input w-45px h-30px"
                  type="checkbox"
                  id="slackswitch"
                />
                <label class="form-check-label" for="slackswitch"></label>
              </div>
            </div>
          </div>
          <!--end::Item-->
        </div>
        <!--end::Items-->
      </div>
      <!--end::Card body-->

      <!--begin::Card footer-->
      <div class="card-footer d-flex justify-content-end py-6 px-9">
        <button class="btn btn-light btn-active-light-primary me-2">
          Discard
        </button>
        <button
          ref="submitButton2"
          class="btn btn-primary"
          @click="saveChanges2()"
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
      <!--end::Card footer-->
    </div>
    <!--end::Content-->
  </div>
  <!--end::Connected Accounts-->

  <!--begin::Notifications-->
  <div class="card mb-5 mb-xl-10">
    <!--begin::Card header-->
    <div
      class="card-header border-0 cursor-pointer"
      role="button"
      data-bs-toggle="collapse"
      data-bs-target="#kt_account_email_preferences"
      aria-expanded="true"
      aria-controls="kt_account_email_preferences"
    >
      <div class="card-title m-0">
        <h3 class="fw-bold m-0">Email Preferences</h3>
      </div>
    </div>
    <!--begin::Card header-->

    <!--begin::Content-->
    <div id="kt_account_email_preferences" class="collapse show">
      <!--begin::Form-->
      <form class="form" @submit.prevent="saveChanges3()">
        <!--begin::Card body-->
        <div class="card-body border-top px-9 py-9">
          <!--begin::Option-->
          <label
            class="form-check form-check-custom form-check-solid align-items-start"
          >
            <!--begin::Input-->
            <input
              class="form-check-input me-3"
              type="checkbox"
              name="email-preferences1"
              value="1"
            />
            <!--end::Input-->

            <!--begin::Label-->
            <span class="form-check-label d-flex flex-column align-items-start">
              <span class="fw-bold fs-5 mb-0">Successful Payments</span>
              <span class="text-muted fs-6"
                >Receive a notification for every successful payment.</span
              >
            </span>
            <!--end::Label-->
          </label>
          <!--end::Option-->
          <!--begin::Option-->
          <div class="separator separator-dashed my-6"></div>
          <!--end::Option-->

          <!--begin::Option-->
          <label
            class="form-check form-check-custom form-check-solid align-items-start"
          >
            <!--begin::Input-->
            <input
              class="form-check-input me-3"
              type="checkbox"
              name="email-preferences1"
              checked
              value="1"
            />
            <!--end::Input-->

            <!--begin::Label-->
            <span class="form-check-label d-flex flex-column align-items-start">
              <span class="fw-bold fs-5 mb-0">Payouts</span>
              <span class="text-muted fs-6"
                >Receive a notification for every initiated payout.</span
              >
            </span>
            <!--end::Label-->
          </label>
          <!--end::Option-->
          <!--begin::Option-->
          <div class="separator separator-dashed my-6"></div>
          <!--end::Option-->

          <!--begin::Option-->
          <label
            class="form-check form-check-custom form-check-solid align-items-start"
          >
            <!--begin::Input-->
            <input
              class="form-check-input me-3"
              type="checkbox"
              name="email-preferences1"
              value="1"
            />
            <!--end::Input-->

            <!--begin::Label-->
            <span class="form-check-label d-flex flex-column align-items-start">
              <span class="fw-bold fs-5 mb-0">Fee Collection</span>
              <span class="text-muted fs-6"
                >Receive a notification each time you collect a fee from
                sales</span
              >
            </span>
            <!--end::Label-->
          </label>
          <!--end::Option-->
          <!--begin::Option-->
          <div class="separator separator-dashed my-6"></div>
          <!--end::Option-->

          <!--begin::Option-->
          <label
            class="form-check form-check-custom form-check-solid align-items-start"
          >
            <!--begin::Input-->
            <input
              class="form-check-input me-3"
              type="checkbox"
              name="email-preferences1"
              checked
              value="1"
            />
            <!--end::Input-->

            <!--begin::Label-->
            <span class="form-check-label d-flex flex-column align-items-start">
              <span class="fw-bold fs-5 mb-0">Customer Payment Dispute</span>
              <span class="text-muted fs-6"
                >Receive a notification if a payment is disputed by a customer
                and for dispute purposes.</span
              >
            </span>
            <!--end::Label-->
          </label>
          <!--end::Option-->
          <!--begin::Option-->
          <div class="separator separator-dashed my-6"></div>
          <!--end::Option-->

          <!--begin::Option-->
          <label
            class="form-check form-check-custom form-check-solid align-items-start"
          >
            <!--begin::Input-->
            <input
              class="form-check-input me-3"
              type="checkbox"
              name="email-preferences1"
              value="1"
            />
            <!--end::Input-->

            <!--begin::Label-->
            <span class="form-check-label d-flex flex-column align-items-start">
              <span class="fw-bold fs-5 mb-0">Refund Alerts</span>
              <span class="text-muted fs-6"
                >Receive a notification if a payment is stated as risk by the
                Finance Department.</span
              >
            </span>
            <!--end::Label-->
          </label>
          <!--end::Option-->
          <!--begin::Option-->
          <div class="separator separator-dashed my-6"></div>
          <!--end::Option-->

          <!--begin::Option-->
          <label
            class="form-check form-check-custom form-check-solid align-items-start"
          >
            <!--begin::Input-->
            <input
              class="form-check-input me-3"
              type="checkbox"
              name="email-preferences1"
              checked
              value="1"
            />
            <!--end::Input-->

            <!--begin::Label-->
            <span class="form-check-label d-flex flex-column align-items-start">
              <span class="fw-bold fs-5 mb-0">Invoice Payments</span>
              <span class="text-muted fs-6"
                >Receive a notification if a customer sends an incorrect amount
                to pay their invoice.</span
              >
            </span>
            <!--end::Label-->
          </label>
          <!--end::Option-->
          <!--begin::Option-->
          <div class="separator separator-dashed my-6"></div>
          <!--end::Option-->

          <!--begin::Option-->
          <label
            class="form-check form-check-custom form-check-solid align-items-start"
          >
            <!--begin::Input-->
            <input
              class="form-check-input me-3"
              type="checkbox"
              name="email-preferences1"
              value="1"
            />
            <!--end::Input-->

            <!--begin::Label-->
            <span class="form-check-label d-flex flex-column align-items-start">
              <span class="fw-bold fs-5 mb-0">Webhook API Endpoints</span>
              <span class="text-muted fs-6"
                >Receive notifications for consistently failing webhook API
                endpoints.</span
              >
            </span>
            <!--end::Label-->
          </label>
          <!--end::Option-->
          <!--begin::Option-->
          <div class="separator separator-dashed my-6"></div>
          <!--end::Option-->
        </div>
        <!--end::Card body-->

        <!--begin::Card footer-->
        <div class="card-footer d-flex justify-content-end py-6 px-9">
          <button class="btn btn-light btn-active-light-primary me-2">
            Discard
          </button>
          <button
            ref="submitButton3"
            type="submit"
            class="btn btn-primary px-6"
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
        <!--end::Card footer-->
      </form>
      <!--end::Form-->
    </div>
    <!--end::Content-->
  </div>
  <!--end::Notifications-->

  <!--begin::Notifications-->
  <div class="card mb-5 mb-xl-10">
    <!--begin::Card header-->
    <div
      class="card-header border-0 cursor-pointer"
      role="button"
      data-bs-toggle="collapse"
      data-bs-target="#kt_account_notifications"
      aria-expanded="true"
      aria-controls="kt_account_notifications"
    >
      <div class="card-title m-0">
        <h3 class="fw-bold m-0">Notifications</h3>
      </div>
    </div>
    <!--begin::Card header-->

    <!--begin::Content-->
    <div id="kt_account_notifications" class="collapse show">
      <!--begin::Form-->
      <form class="form" @submit.prevent="saveChanges4()">
        <!--begin::Card body-->
        <div class="card-body border-top px-9 pt-3 pb-4">
          <!--begin::Table-->
          <div class="table-responsive">
            <table
              class="table table-row-dashed border-gray-300 align-middle gy-6"
            >
              <tbody class="fs-6 fw-semobold">
                <!--begin::Table row-->
                <tr>
                  <td class="min-w-250px fs-4 fw-bold">Notifications</td>
                  <td class="w-125px">
                    <div class="form-check form-check-solid">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="kt_settings_notification_email"
                        checked
                        data-kt-check="true"
                        data-kt-check-target="[data-kt-settings-notification=email]"
                      />
                      <label
                        class="form-check-label ps-2"
                        for="kt_settings_notification_email"
                      >
                        Email
                      </label>
                    </div>
                  </td>
                  <td class="w-125px">
                    <div class="form-check form-check-solid">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="kt_settings_notification_phone"
                        checked
                        data-kt-check="true"
                        data-kt-check-target="[data-kt-settings-notification=phone]"
                      />
                      <label
                        class="form-check-label ps-2"
                        for="kt_settings_notification_phone"
                      >
                        Phone
                      </label>
                    </div>
                  </td>
                </tr>
                <!--begin::Table row-->

                <!--begin::Table row-->
                <tr>
                  <td>Billing Updates</td>
                  <td>
                    <div class="form-check form-check-solid">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="1"
                        id="billing1"
                        checked
                        data-kt-settings-notification="email"
                      />
                      <label
                        class="form-check-label ps-2"
                        for="billing1"
                      ></label>
                    </div>
                  </td>
                  <td>
                    <div class="form-check form-check-solid">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="billing2"
                        checked
                        data-kt-settings-notification="phone"
                      />
                      <label
                        class="form-check-label ps-2"
                        for="billing2"
                      ></label>
                    </div>
                  </td>
                </tr>
                <!--begin::Table row-->

                <!--begin::Table row-->
                <tr>
                  <td>New Team Members</td>
                  <td>
                    <div class="form-check form-check-solid">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="team1"
                        checked
                        data-kt-settings-notification="email"
                      />
                      <label class="form-check-label ps-2" for="team1"></label>
                    </div>
                  </td>
                  <td>
                    <div class="form-check form-check-solid">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="team2"
                        data-kt-settings-notification="phone"
                      />
                      <label class="form-check-label ps-2" for="team2"></label>
                    </div>
                  </td>
                </tr>
                <!--begin::Table row-->

                <!--begin::Table row-->
                <tr>
                  <td>Completed Projects</td>
                  <td>
                    <div class="form-check form-check-solid">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="project1"
                        data-kt-settings-notification="email"
                      />
                      <label
                        class="form-check-label ps-2"
                        for="project1"
                      ></label>
                    </div>
                  </td>
                  <td>
                    <div class="form-check form-check-solid">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="project2"
                        checked
                        data-kt-settings-notification="phone"
                      />
                      <label
                        class="form-check-label ps-2"
                        for="project2"
                      ></label>
                    </div>
                  </td>
                </tr>
                <!--begin::Table row-->

                <!--begin::Table row-->
                <tr>
                  <td class="border-bottom-0">Newsletters</td>
                  <td class="border-bottom-0">
                    <div class="form-check form-check-solid">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="newsletter1"
                        data-kt-settings-notification="email"
                      />
                      <label
                        class="form-check-label ps-2"
                        for="newsletter1"
                      ></label>
                    </div>
                  </td>
                  <td class="border-bottom-0">
                    <div class="form-check form-check-solid">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="newsletter2"
                        data-kt-settings-notification="phone"
                      />
                      <label
                        class="form-check-label ps-2"
                        for="newsletter2"
                      ></label>
                    </div>
                  </td>
                </tr>
                <!--begin::Table row-->
              </tbody>
            </table>
          </div>
          <!--end::Table-->
        </div>
        <!--end::Card body-->

        <!--begin::Card footer-->
        <div class="card-footer d-flex justify-content-end py-6 px-9">
          <button class="btn btn-light btn-active-light-primary me-2">
            Discard
          </button>
          <button
            ref="submitButton4"
            type="submit"
            class="btn btn-primary px-6"
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
        <!--end::Card footer-->
      </form>
      <!--end::Form-->
    </div>
    <!--end::Content-->
  </div>
  <!--end::Notifications-->

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
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, ref, inject, watch, onMounted } from "vue";
import { ErrorMessage, Field, Form as VForm } from "vee-validate";
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as Yup from "yup";
import ApiService from "@/core/services/ApiService";
import { useAuthStore } from "@/stores/auth";
import { getEmployee, updateEmployee } from "@/core/services/businessServices/Employee";
import { useRoute } from "vue-router";
import { createSkill, updateSkill, deleteSkill } from "@/core/services/businessServices/Skill";
import { createExperience, updateExperience, deleteExperience } from "@/core/services/businessServices/Experience";

interface CvData {
  fileName: string;
  storageUrl: string;
}

interface ProfileDetails {
  avatar: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  placeOfBirth: string;
  address: string;
  phone: string;
  currentRole: string;
  department: string;
  isAvailable: boolean;
  cvData: CvData;
  experiences: any[];
  hardSkills: any[];
  softSkills: any[];
  // altri campi se servono
}

export default defineComponent({
  name: "account-settings",
  components: {
    ErrorMessage,
    Field,
    VForm,
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

    const emailFormDisplay = ref(false);
    const passwordFormDisplay = ref(false);

    const profileDetailsValidator = Yup.object().shape({
      fname: Yup.string().required().label("First name"),
      lname: Yup.string().required().label("Last name"),
      company: Yup.string().required().label("Company"),
      phone: Yup.string().required().label("Contact phone"),
      website: Yup.string().label("Webside"),
      country: Yup.string().required().label("Country"),
      language: Yup.string().required().label("Language"),
      timezone: Yup.string().required().label("Timezone"),
      currency: Yup.string().required().label("Currency"),
    });

    const changeEmail = Yup.object().shape({
      emailaddress: Yup.string().required().email().label("Email"),
      confirmemailpassword: Yup.string().required().label("Password"),
    });

    const changePassword = Yup.object().shape({
      currentpassword: Yup.string().required().label("Current password"),
      newpassword: Yup.string().min(4).required().label("Password"),
      confirmpassword: Yup.string()
        .min(4)
        .required()
        .oneOf([Yup.ref("newpassword")], "Passwords must match")
        .label("Password Confirmation"),
    });

    const employee = inject<any>('employee');
    const refreshEmployee = inject<any>('refreshEmployee');
    const profileDetails = ref<ProfileDetails>({
      avatar: '',
      firstName: '',
      lastName: '',
      email: '',
      dateOfBirth: '',
      placeOfBirth: '',
      address: '',
      phone: '',
      currentRole: '',
      department: '',
      isAvailable: false,
      cvData: { fileName: '', storageUrl: '' },
      experiences: [],
      hardSkills: [],
      softSkills: [],
    });
    // Popola profileDetails quando employee cambia
    watch(employee, (val) => {
      if (val) {
        profileDetails.value = {
          ...profileDetails.value,
          ...val,
          avatar: val.avatar || '',
          firstName: val.firstName || '',
          lastName: val.lastName || '',
          email: val.email || '',
          dateOfBirth: val.dateOfBirth || '',
          placeOfBirth: val.placeOfBirth || '',
          address: val.address || '',
          phone: val.phone || '',
          currentRole: val.currentRole || '',
          department: val.department || '',
          isAvailable: val.isAvailable ?? false,
          cvData: val.cvData || {},
          experiences: val.experiences || [],
          hardSkills: val.hardSkills || [],
          softSkills: val.softSkills || [],
        };
      }
    }, { immediate: true });

    const authStore = useAuthStore();

    const saveChanges1 = () => {
      if (submitButton1.value) {
        // Activate indicator
        submitButton1.value.setAttribute("data-kt-indicator", "on");
        // Salva avatar tramite API
        if (route.params.id) {
          ApiService.put(`users/${route.params.id}`, { avatar: profileDetails.value.avatar })
            .then(async () => {
              if (refreshEmployee) await refreshEmployee();
              setTimeout(() => {
                submitButton1.value?.removeAttribute("data-kt-indicator");
              }, 2000);
            });
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

    const updateEmail = () => {
      if (updateEmailButton.value) {
        // Activate indicator
        updateEmailButton.value.setAttribute("data-kt-indicator", "on");

        setTimeout(() => {
          updateEmailButton.value?.removeAttribute("data-kt-indicator");

          emailFormDisplay.value = false;
        }, 2000);
      }
    };

    const updatePassword = () => {
      if (updatePasswordButton.value) {
        // Activate indicator
        updatePasswordButton.value.setAttribute("data-kt-indicator", "on");

        setTimeout(() => {
          updatePasswordButton.value?.removeAttribute("data-kt-indicator");

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
        }, 2000);
      }
    };

    const removeImage = () => {
      profileDetails.value.avatar = "/media/avatars/blank.png";
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
      if (!profileDetails.value.hardSkills) profileDetails.value.hardSkills = [];
      // Preparo solo i campi accettati dal backend
      const dataToSend = {
        name: skill.name,
        proficiencyLevel: skill.proficiencyLevel ? parseInt(skill.proficiencyLevel) : undefined,
        certification: skill.certification,
        employeeHard: { connect: { id: route.params.id } },
      };
      if (skill.id) {
        await updateSkill(skill.id, dataToSend);
      } else {
        const created = await createSkill(dataToSend);
        if (created) profileDetails.value.hardSkills[index] = created;
      }
      editingHardSkillIndex.value = null;
    };
    const editHardSkill = (index) => {
      editingHardSkillIndex.value = index;
    };
    const deleteHardSkill = async (skill, index) => {
      if (skill.id) await deleteSkill(skill.id);
      profileDetails.value.hardSkills?.splice(index, 1);
    };
    const saveSoftSkill = async (skill, index) => {
      if (!profileDetails.value.softSkills) profileDetails.value.softSkills = [];
      // Preparo solo i campi accettati dal backend
      const dataToSend = {
        name: skill.name,
        proficiencyLevel: skill.proficiencyLevel ? parseInt(skill.proficiencyLevel) : undefined,
        certification: skill.certification,
        employeeSoft: { connect: { id: route.params.id } },
      };
      if (skill.id) {
        await updateSkill(skill.id, dataToSend);
      } else {
        const created = await createSkill(dataToSend);
        if (created) profileDetails.value.softSkills[index] = created;
      }
      editingSoftSkillIndex.value = null;
    };
    const editSoftSkill = (index) => {
      editingSoftSkillIndex.value = index;
    };
    const deleteSoftSkill = async (skill, index) => {
      if (skill.id) await deleteSkill(skill.id);
      profileDetails.value.softSkills?.splice(index, 1);
    };
    // Experience
    const addExperience = () => {
      if (!profileDetails.value.experiences) profileDetails.value.experiences = [];
      profileDetails.value.experiences.push({ jobTitle: '', companyName: '', startDate: '', endDate: '', description: '', technologiesUsed: '' });
      editingExperienceIndex.value = profileDetails.value.experiences.length - 1;
    };
    const saveExperience = async (exp, index) => {
      if (!profileDetails.value.experiences) profileDetails.value.experiences = [];
      if (typeof exp.technologiesUsed === 'string') {
        exp.technologiesUsed = exp.technologiesUsed.split(',').map(s => s.trim()).filter(Boolean);
      }
      if (exp.id) {
        await updateExperience(exp.id, exp);
      } else {
        const created = await createExperience({ ...exp, employeeId: route.params.id });
        if (created) profileDetails.value.experiences[index] = created;
      }
      editingExperienceIndex.value = null;
    };
    const editExperience = (index) => {
      editingExperienceIndex.value = index;
    };
    const deleteExperienceFn = async (exp, index) => {
      if (exp.id) await deleteExperience(exp.id);
      profileDetails.value.experiences?.splice(index, 1);
    };

    const editingHardSkillIndex = ref<number|null>(null);
    const editingSoftSkillIndex = ref<number|null>(null);
    const editingExperienceIndex = ref<number|null>(null);

    return {
      submitButton1,
      submitButton2,
      submitButton3,
      submitButton4,
      submitButton5,
      saveChanges1,
      saveChanges2,
      saveChanges3,
      saveChanges4,
      deactivateAccount,
      profileDetails,
      emailFormDisplay,
      passwordFormDisplay,
      removeImage,
      profileDetailsValidator,
      changeEmail,
      changePassword,
      updateEmailButton,
      updatePasswordButton,
      updateEmail,
      updatePassword,
      getAssetPath,
      addHardSkill,
      addSoftSkill,
      saveHardSkill,
      deleteHardSkill,
      saveSoftSkill,
      deleteSoftSkill,
      addExperience,
      saveExperience,
      deleteExperience: deleteExperienceFn,
      editingHardSkillIndex,
      editingSoftSkillIndex,
      editingExperienceIndex,
      editHardSkill,
      editSoftSkill,
      editExperience,
    };
  },
});
</script>
