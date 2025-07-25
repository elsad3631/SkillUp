<template>
  <!--begin::Wrapper-->
  <div class="w-lg-500px p-10">
    <!--begin::Form-->
    <VForm
      class="form w-100 fv-plugins-bootstrap5 fv-plugins-framework"
      novalidate
      @submit="onSubmitRegister"
      id="kt_login_signup_form"
      :validation-schema="registration"
    >
      <!--begin::Heading-->
      <div class="mb-10 text-center">
        <!--begin::Title-->
        <h1 class="text-dark mb-3">Join Our Community</h1>
        <!--end::Title-->

        <!--begin::Subtitle-->
        <p class="text-gray-600 fs-6 mb-5">Create your account to get started</p>
        <!--end::Subtitle-->

        <!--begin::Link-->
        <div class="text-gray-400 fw-semobold fs-4">
          Already have an account?

          <router-link to="/sign-in" class="link-primary fw-bold">
            Sign in here
          </router-link>
        </div>
        <!--end::Link-->
      </div>
      <!--end::Heading-->

      <!--begin::Social Login Section-->
      <div class="mb-10">
        <!--begin::Action-->
        <button 
          type="button" 
          class="btn btn-light-primary fw-bold w-100 mb-3"
          @click="handleSocialLogin('google')"
          :disabled="isLoading"
        >
          <img
            alt="Google"
            :src="getAssetPath('media/svg/brand-logos/google-icon.svg')"
            class="h-20px me-3"
          />
          Sign up with Google
        </button>
        <!--end::Action-->

        <!--begin::Separator-->
        <div class="d-flex align-items-center mb-5">
          <div class="border-bottom border-gray-300 mw-50 w-100"></div>
          <span class="fw-semobold text-gray-400 fs-7 mx-2">OR</span>
          <div class="border-bottom border-gray-300 mw-50 w-100"></div>
        </div>
        <!--end::Separator-->
      </div>
      <!--end::Social Login Section-->

      <!--begin::Input group-->
      <div class="row fv-row mb-7">
        <!--begin::Col-->
        <div class="col-xl-6">
          <label class="form-label fw-bold text-dark fs-6">
            <i class="ki-duotone ki-user fs-5 text-primary me-2"></i>
            First Name
          </label>
          <Field
            class="form-control form-control-lg form-control-solid"
            type="text"
            placeholder="Enter your first name"
            name="first_name"
            autocomplete="given-name"
          />
          <div class="fv-plugins-message-container">
            <div class="fv-help-block">
              <ErrorMessage name="first_name" />
            </div>
          </div>
        </div>
        <!--end::Col-->

        <!--begin::Col-->
        <div class="col-xl-6">
          <label class="form-label fw-bold text-dark fs-6">
            <i class="ki-duotone ki-user fs-5 text-primary me-2"></i>
            Last Name
          </label>
          <Field
            class="form-control form-control-lg form-control-solid"
            type="text"
            placeholder="Enter your last name"
            name="last_name"
            autocomplete="family-name"
          />
          <div class="fv-plugins-message-container">
            <div class="fv-help-block">
              <ErrorMessage name="last_name" />
            </div>
          </div>
        </div>
        <!--end::Col-->
      </div>
      <!--end::Input group-->

      <!--begin::Input group-->
      <div class="fv-row mb-7">
        <label class="form-label fw-bold text-dark fs-6">
          <i class="ki-duotone ki-sms fs-5 text-primary me-2"></i>
          Email Address
        </label>
        <Field
          class="form-control form-control-lg form-control-solid"
          type="email"
          placeholder="Enter your email address"
          name="email"
          autocomplete="email"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="email" />
          </div>
        </div>
      </div>
      <!--end::Input group-->

      <!--begin::Input group-->
      <div class="mb-10 fv-row" data-kt-password-meter="true">
        <!--begin::Wrapper-->
        <div class="mb-1">
          <!--begin::Label-->
          <label class="form-label fw-bold text-dark fs-6">
            <i class="ki-duotone ki-lock fs-5 text-primary me-2"></i>
            Password
          </label>
          <!--end::Label-->

          <!--begin::Input wrapper-->
          <div class="position-relative mb-3">
            <Field
              class="form-control form-control-lg form-control-solid"
              type="password"
              placeholder="Create a strong password"
              name="password"
              autocomplete="new-password"
            />
            <div class="fv-plugins-message-container">
              <div class="fv-help-block">
                <ErrorMessage name="password" />
              </div>
            </div>
          </div>
          <!--end::Input wrapper-->
          
          <!--begin::Meter-->
          <div
            class="d-flex align-items-center mb-3"
            data-kt-password-meter-control="highlight"
          >
            <div
              class="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"
            ></div>
            <div
              class="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"
            ></div>
            <div
              class="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"
            ></div>
            <div
              class="flex-grow-1 bg-secondary bg-active-success rounded h-5px"
            ></div>
          </div>
          <!--end::Meter-->
        </div>
        <!--end::Wrapper-->
        
        <!--begin::Hint-->
        <div class="text-muted fs-7">
          <i class="ki-duotone ki-information-5 fs-6 text-info me-1"></i>
          Use 8 or more characters with a mix of letters, numbers & symbols for better security.
        </div>
        <!--end::Hint-->
      </div>
      <!--end::Input group--->

      <!--begin::Input group-->
      <div class="fv-row mb-5">
        <label class="form-label fw-bold text-dark fs-6">
          <i class="ki-duotone ki-lock fs-5 text-primary me-2"></i>
          Confirm Password
        </label>
        <Field
          class="form-control form-control-lg form-control-solid"
          type="password"
          placeholder="Confirm your password"
          name="password_confirmation"
          autocomplete="new-password"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="password_confirmation" />
          </div>
        </div>
      </div>
      <!--end::Input group-->

      <!--begin::Input group-->
      <div class="fv-row mb-10">
        <label class="form-check form-check-custom form-check-solid">
          <Field
            class="form-check-input"
            type="checkbox"
            name="toc"
            value="1"
          />
          <span class="form-check-label fw-semobold text-gray-700 fs-6">
            I agree to the
            <a href="#" class="ms-1 link-primary">Terms and Conditions</a>
            and
            <a href="#" class="ms-1 link-primary">Privacy Policy</a>
          </span>
        </label>
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="toc" />
          </div>
        </div>
      </div>
      <!--end::Input group-->

      <!--begin::Actions-->
      <div class="text-center">
        <button
          id="kt_sign_up_submit"
          ref="submitButton"
          type="submit"
          class="btn btn-lg btn-primary w-100"
          :disabled="isLoading"
        >
          <span class="indicator-label">
            <i class="ki-duotone ki-user-plus fs-3 me-2"></i>
            Create Account
          </span>
          <span class="indicator-progress">
            <span class="spinner-border spinner-border-sm align-middle me-2"></span>
            Creating your account...
          </span>
        </button>
      </div>
      <!--end::Actions-->
    </VForm>
    <!--end::Form-->
  </div>
  <!--end::Wrapper-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, nextTick, onMounted, ref } from "vue";
import { ErrorMessage, Field, Form as VForm } from "vee-validate";
import * as Yup from "yup";
import { useAuthStore, type User } from "@/stores/auth";
import { useRouter } from "vue-router";
import { PasswordMeterComponent } from "@/assets/ts/components";
import Swal from "sweetalert2/dist/sweetalert2.js";

export default defineComponent({
  name: "sign-up",
  components: {
    Field,
    VForm,
    ErrorMessage,
  },
  setup() {
    const store = useAuthStore();
    const router = useRouter();

    const submitButton = ref<HTMLButtonElement | null>(null);
    const isLoading = ref(false);

    const registration = Yup.object().shape({
      first_name: Yup.string()
        .required("First name is required")
        .min(2, "First name must be at least 2 characters")
        .label("First Name"),
      last_name: Yup.string()
        .required("Last name is required")
        .min(2, "Last name must be at least 2 characters")
        .label("Last Name"),
      email: Yup.string()
        .required("Email is required")
        .email("Please enter a valid email address")
        .label("Email"),
      password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        )
        .label("Password"),
      password_confirmation: Yup.string()
        .required("Password confirmation is required")
        .oneOf([Yup.ref("password")], "Passwords must match")
        .label("Password Confirmation"),
      toc: Yup.boolean()
        .oneOf([true], "You must agree to the Terms and Conditions")
        .label("Terms and Conditions"),
    });

    onMounted(() => {
      nextTick(() => {
        PasswordMeterComponent.bootstrap();
      });
    });

    // Handle social login
    const handleSocialLogin = (provider: string) => {
      Swal.fire({
        title: 'Coming Soon!',
        text: `${provider.charAt(0).toUpperCase() + provider.slice(1)} sign up will be available soon.`,
        icon: 'info',
        buttonsStyling: false,
        confirmButtonText: 'Got it!',
        customClass: {
          confirmButton: 'btn fw-semobold btn-light-primary',
        },
      });
    };

    const onSubmitRegister = async (values: any) => {
      values = values as User;

      // Clear existing errors
      store.logout();
      isLoading.value = true;

      submitButton.value!.disabled = true;
      submitButton.value?.setAttribute("data-kt-indicator", "on");

      try {
        // Send registration request
        await store.register(values);

        // Check if there are errors
        const hasErrors = store.errors && 
          (typeof store.errors === 'string' || 
           (typeof store.errors === 'object' && Object.keys(store.errors).length > 0));

        if (!hasErrors) {
          Swal.fire({
            title: "Welcome to Our Community!",
            text: "Your account has been created successfully and you are now signed in.",
            icon: "success",
            buttonsStyling: false,
            confirmButtonText: "Get Started",
            heightAuto: false,
            customClass: {
              confirmButton: "btn fw-semobold btn-light-primary",
            },
          }).then(function () {
            // Go to page after successfully registration
            router.push({ name: "dashboard" });
          });
        } else {
          const errorMessage = typeof store.errors === 'string' ? 
            store.errors : 
            Object.values(store.errors)[0] as string;
            
          Swal.fire({
            title: "Registration Failed",
            text: errorMessage || "An error occurred during registration. Please try again.",
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Try Again",
            heightAuto: false,
            customClass: {
              confirmButton: "btn fw-semobold btn-light-danger",
            },
          });
        }
      } catch (error) {
        Swal.fire({
          title: "Connection Error",
          text: "Unable to connect to the server. Please check your internet connection and try again.",
          icon: "error",
          buttonsStyling: false,
          confirmButtonText: "Try Again",
          heightAuto: false,
          customClass: {
            confirmButton: "btn fw-semobold btn-light-danger",
          },
        });
      } finally {
        submitButton.value?.removeAttribute("data-kt-indicator");
        submitButton.value!.disabled = false;
        isLoading.value = false;
      }
    };

    return {
      registration,
      onSubmitRegister,
      submitButton,
      isLoading,
      getAssetPath,
      handleSocialLogin,
    };
  },
});
</script>
