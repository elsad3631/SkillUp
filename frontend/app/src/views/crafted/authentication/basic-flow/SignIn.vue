<template>
  <!--begin::Wrapper-->
  <div class="w-lg-500px p-10">
    <!--begin::Form-->
    <VForm
      class="form w-100"
      id="kt_login_signin_form"
      @submit="onSubmitLogin"
      :validation-schema="login"
      :initial-values="{ email: '', password: '' }"
    >
      <!--begin::Heading-->
      <div class="text-center mb-10">
        <!--begin::Title-->
        <h1 class="text-dark mb-3">Welcome Back!</h1>
        <!--end::Title-->

        <!--begin::Subtitle-->
        <p class="text-gray-600 fs-6 mb-5">Sign in to your account to continue</p>
        <!--end::Subtitle-->

        <!--begin::Link-->
        <div class="text-gray-400 fw-semobold fs-4">
          New Here?

          <router-link to="/sign-up" class="link-primary fw-bold">
            Create an Account
          </router-link>
        </div>
        <!--end::Link-->
      </div>
      <!--begin::Heading-->

      <!--begin::Demo Account Info-->
      <div class="mb-10 bg-light-info p-8 rounded border border-info border-dashed">
        <div class="d-flex align-items-center mb-3">
          <i class="ki-duotone ki-information-5 fs-2 text-info me-3">
            <span class="path1"></span>
            <span class="path2"></span>
            <span class="path3"></span>
          </i>
          <h6 class="text-info mb-0">Demo Account</h6>
        </div>
        <div class="text-info fs-7">
          <p class="mb-2">Use these credentials to test the application:</p>
          <div class="d-flex flex-column gap-1">
            <span><strong>Email:</strong> s@demo.com</span>
            <span><strong>Password:</strong> demo</span>
          </div>
          <button 
            type="button" 
            class="btn btn-sm btn-outline-info mt-3"
            @click="fillDemoCredentials"
          >
            <i class="ki-duotone ki-copy fs-6 me-2"></i>
            Fill Demo Credentials
          </button>
        </div>
      </div>
      <!--end::Demo Account Info-->

      <!--begin::Input group-->
      <div class="fv-row mb-10">
        <!--begin::Label-->
        <label class="form-label fs-6 fw-bold text-dark">
          <i class="ki-duotone ki-sms fs-5 text-primary me-2"></i>
          Email Address
        </label>
        <!--end::Label-->

        <!--begin::Input-->
        <Field
          tabindex="1"
          class="form-control form-control-lg form-control-solid"
          type="email"
          name="email"
          placeholder="Enter your email address"
          autocomplete="email"
        />
        <!--end::Input-->
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="email" />
          </div>
        </div>
      </div>
      <!--end::Input group-->

      <!--begin::Input group-->
      <div class="fv-row mb-10">
        <!--begin::Wrapper-->
        <div class="d-flex flex-stack mb-2">
          <!--begin::Label-->
          <label class="form-label fw-bold text-dark fs-6 mb-0">
            <i class="ki-duotone ki-lock fs-5 text-primary me-2"></i>
            Password
          </label>
          <!--end::Label-->

          <!--begin::Link-->
          <router-link to="/password-reset" class="link-primary fs-6 fw-bold">
            Forgot Password?
          </router-link>
          <!--end::Link-->
        </div>
        <!--end::Wrapper-->

        <!--begin::Input-->
        <Field
          tabindex="2"
          class="form-control form-control-lg form-control-solid"
          type="password"
          name="password"
          placeholder="Enter your password"
          autocomplete="current-password"
        />
        <!--end::Input-->
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="password" />
          </div>
        </div>
      </div>
      <!--end::Input group-->

      <!--begin::Actions-->
      <div class="text-center">
        <!--begin::Submit button-->
        <button
          tabindex="3"
          type="submit"
          ref="submitButton"
          id="kt_sign_in_submit"
          class="btn btn-lg btn-primary w-100 mb-5"
          :disabled="isLoading"
        >
          <span class="indicator-label">
            <i class="ki-duotone ki-arrow-right fs-3 me-2"></i>
            Sign In
          </span>

          <span class="indicator-progress">
            <span class="spinner-border spinner-border-sm align-middle me-2"></span>
            Signing in...
          </span>
        </button>
        <!--end::Submit button-->

        <!--begin::Separator-->
        <div class="text-center text-muted text-uppercase fw-bold mb-5">
          <span class="bg-white px-3">or continue with</span>
        </div>
        <!--end::Separator-->

        <!--begin::Social Login Buttons-->
        <div class="d-flex flex-column gap-3">
          <!--begin::Google link-->
          <button
            type="button"
            class="btn btn-flex flex-center btn-light btn-lg w-100"
            @click="handleSocialLogin('google')"
            :disabled="isLoading"
          >
            <img
              alt="Google"
              :src="getAssetPath('media/svg/brand-logos/google-icon.svg')"
              class="h-20px me-3"
            />
            Continue with Google
          </button>
          <!--end::Google link-->

          <!--begin::Facebook link-->
          <button
            type="button"
            class="btn btn-flex flex-center btn-light btn-lg w-100"
            @click="handleSocialLogin('facebook')"
            :disabled="isLoading"
          >
            <img
              alt="Facebook"
              :src="getAssetPath('media/svg/brand-logos/facebook-4.svg')"
              class="h-20px me-3"
            />
            Continue with Facebook
          </button>
          <!--end::Facebook link-->

          <!--begin::Apple link-->
          <button
            type="button"
            class="btn btn-flex flex-center btn-light btn-lg w-100"
            @click="handleSocialLogin('apple')"
            :disabled="isLoading"
          >
            <img
              alt="Apple"
              :src="getAssetPath('media/svg/brand-logos/apple-black.svg')"
              class="h-20px me-3"
            />
            Continue with Apple
          </button>
          <!--end::Apple link-->
        </div>
        <!--end::Social Login Buttons-->
      </div>
      <!--end::Actions-->
    </VForm>
    <!--end::Form-->
  </div>
  <!--end::Wrapper-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, ref } from "vue";
import { ErrorMessage, Field, Form as VForm, useForm } from "vee-validate";
import { useAuthStore, type User } from "@/stores/auth";
import { useRouter } from "vue-router";
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as Yup from "yup";

export default defineComponent({
  name: "sign-in",
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

    //Create form validation object
    const login = Yup.object().shape({
      email: Yup.string().email("Please enter a valid email address").required("Email is required").label("Email"),
      password: Yup.string().min(4, "Password must be at least 4 characters").required("Password is required").label("Password"),
    });

    // Get form instance for programmatic access
    const { setFieldValue } = useForm();

    // Fill demo credentials
    const fillDemoCredentials = () => {
      setFieldValue('email', 's@demo.com');
      setFieldValue('password', 'demo');
    };

    // Handle social login
    const handleSocialLogin = (provider: string) => {
      Swal.fire({
        title: 'Coming Soon!',
        text: `${provider.charAt(0).toUpperCase() + provider.slice(1)} login will be available soon.`,
        icon: 'info',
        buttonsStyling: false,
        confirmButtonText: 'Got it!',
        customClass: {
          confirmButton: 'btn fw-semobold btn-light-primary',
        },
      });
    };

    //Form submit function
    const onSubmitLogin = async (values: any) => {
      values = values as User;
      
      // Clear existing errors
      store.logout();
      isLoading.value = true;

      if (submitButton.value) {
        submitButton.value.disabled = true;
        submitButton.value.setAttribute("data-kt-indicator", "on");
      }

      try {
        // Send login request
        await store.login(values);
        const error = Object.values(store.errors);

        if (error.length === 0) {
          Swal.fire({
            title: "Welcome Back!",
            text: "You have successfully signed in to your account.",
            icon: "success",
            buttonsStyling: false,
            confirmButtonText: "Continue",
            heightAuto: false,
            customClass: {
              confirmButton: "btn fw-semobold btn-light-primary",
            },
          }).then(() => {
            // Go to page after successfully login
            router.push({ name: "dashboard" });
          });
        } else {
          Swal.fire({
            title: "Sign In Failed",
            text: error[0] as string,
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Try Again",
            heightAuto: false,
            customClass: {
              confirmButton: "btn fw-semobold btn-light-danger",
            },
          }).then(() => {
            store.errors = {};
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
        //Deactivate indicator
        submitButton.value?.removeAttribute("data-kt-indicator");
        submitButton.value!.disabled = false;
        isLoading.value = false;
      }
    };

    return {
      onSubmitLogin,
      login,
      submitButton,
      isLoading,
      getAssetPath,
      fillDemoCredentials,
      handleSocialLogin,
    };
  },
});
</script>
