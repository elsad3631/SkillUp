<template>
  <!--begin::Form-->
  <VForm
    class="form w-100"
    id="kt_login_signin_form"
    @submit="onSubmitLogin"
    :validation-schema="login"
    :initial-values="{ email: '', password: '' }"
  >
    <!--begin::Heading-->
    <div class="text-center mb-8">
      <!--begin::Title-->
      <h1 class="auth-title">Welcome Back!</h1>
      <!--end::Title-->

      <!--begin::Subtitle-->
      <p class="auth-subtitle">Sign in to your account to continue</p>
      <!--end::Subtitle-->

      <!--begin::Link-->
      <div class="auth-link-container">
        New Here?
        <router-link to="/sign-up" class="auth-link">
          Create an Account
        </router-link>
      </div>
      <!--end::Link-->
    </div>
    <!--begin::Heading-->

    <!--begin::Input group-->
    <div class="form-group mb-6">
      <!--begin::Label-->
      <label class="form-label">
        Email Address
      </label>
      <!--end::Label-->

      <!--begin::Input-->
      <Field
        tabindex="1"
        class="form-input"
        type="email"
        name="email"
        placeholder="Enter your email address"
        autocomplete="email"
      />
      <!--end::Input-->
      <div class="error-container">
        <ErrorMessage name="email" />
      </div>
    </div>
    <!--end::Input group-->

    <!--begin::Input group-->
    <div class="form-group mb-8">
      <!--begin::Wrapper-->
      <div class="label-container">
        <!--begin::Label-->
        <label class="form-label">
          Password
        </label>
        <!--end::Label-->

        <!--begin::Link-->
        <router-link to="/password-reset" class="forgot-link">
          Forgot Password?
        </router-link>
        <!--end::Link-->
      </div>
      <!--end::Wrapper-->

      <!--begin::Input-->
      <Field
        tabindex="2"
        class="form-input"
        type="password"
        name="password"
        placeholder="Enter your password"
        autocomplete="current-password"
      />
      <!--end::Input-->
      <div class="error-container">
        <ErrorMessage name="password" />
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
        class="submit-button"
        :disabled="isLoading"
      >
        <span class="indicator-label">
          Sign In
        </span>

        <span class="indicator-progress">
          <span class="spinner-border spinner-border-sm align-middle me-2"></span>
          Signing in...
        </span>
      </button>
      <!--end::Submit button-->
    </div>
    <!--end::Actions-->
  </VForm>
  <!--end::Form-->
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
    };
  },
});
</script>

<style scoped>
.auth-title {
  color: white;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.auth-subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  margin-bottom: 1.5rem;
}

.auth-link-container {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  font-weight: 500;
}

.auth-link {
  color: #6366f1;
  text-decoration: none;
  font-weight: 600;
  margin-left: 0.5rem;
  transition: color 0.3s ease;
}

.auth-link:hover {
  color: #4f46e5;
  text-decoration: none;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  display: block;
}

.form-input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.form-input:focus {
  outline: none;
  border-color: #6366f1;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.form-input:focus::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.label-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.forgot-link {
  color: #6366f1;
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 500;
  transition: color 0.3s ease;
}

.forgot-link:hover {
  color: #4f46e5;
  text-decoration: none;
}

.error-container {
  margin-top: 0.25rem;
}

.error-container :deep(.fv-help-block) {
  color: #ef4444;
  font-size: 0.8rem;
  margin: 0;
}

.submit-button {
  width: 100%;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.indicator-progress {
  display: none;
}

.submit-button[data-kt-indicator="on"] .indicator-label {
  display: none;
}

.submit-button[data-kt-indicator="on"] .indicator-progress {
  display: inline-flex;
  align-items: center;
}

@media (max-width: 768px) {
  .auth-title {
    font-size: 1.75rem;
  }
  
  .form-input {
    padding: 0.75rem 0.875rem;
  }
  
  .submit-button {
    padding: 0.75rem 1.25rem;
  }
}
</style>
