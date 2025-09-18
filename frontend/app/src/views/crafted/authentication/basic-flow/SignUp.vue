<template>
  <!--begin::Form-->
  <VForm
    class="form w-100 fv-plugins-bootstrap5 fv-plugins-framework p-3 p-md-4"
    novalidate
    @submit="onSubmitRegister"
    id="kt_login_signup_form"
    :validation-schema="registration"
  >
    <!--begin::Heading-->
    <div class="text-center mb-3 mb-md-4">
      <!--begin::Title-->
      <h1 class="auth-title mb-2">Join Our Community</h1>
      <!--end::Title-->

      <!--begin::Subtitle-->
      <p class="auth-subtitle mb-2">Create your account to get started</p>
      <!--end::Subtitle-->

      <!--begin::Link-->
      <div class="auth-link-container">
        Already have an account?
        <router-link to="/sign-in" class="auth-link">
          Sign in here
        </router-link>
      </div>
      <!--end::Link-->
    </div>
    <!--end::Heading-->

    <!--begin::Input group-->
    <div class="row mb-3">
      <!--begin::Col-->
      <div class="col-md-6 mb-3 mb-md-0">
        <Field
          class="form-control form-input"
          type="text"
          placeholder="First Name"
          name="first_name"
          autocomplete="given-name"
        />
        <div class="error-container">
          <ErrorMessage name="first_name" />
        </div>
      </div>
      <!--end::Col-->

      <!--begin::Col-->
      <div class="col-md-6">
        <Field
          class="form-control form-input"
          type="text"
          placeholder="Last Name"
          name="last_name"
          autocomplete="family-name"
        />
        <div class="error-container">
          <ErrorMessage name="last_name" />
        </div>
      </div>
      <!--end::Col-->
    </div>
    <!--end::Input group-->

    <!--begin::Input group-->
    <div class="mb-3">
      <Field
        class="form-control form-input"
        type="email"
        placeholder="Email Address"
        name="email"
        autocomplete="email"
      />
      <div class="error-container">
        <ErrorMessage name="email" />
      </div>
    </div>
    <!--end::Input group-->

    <!--begin::Input group-->
    <div class="mb-3">
      <Field
        name="sector"
        class="form-select form-select"
        data-control="select2"
        data-placeholder="Settore della Società"
        data-allow-clear="true"
        as="select"
      >
        <option value="" disabled>Settore della Società</option>
        <option value="Settore_Tecnologia_Informazione">Tecnologia e Informazione</option>
        <option value="Settore_Finanza_e_Bancario">Finanza e Bancario</option>
        <option value="Settore_Sanitario_e_Biomedicale">Sanitario e Biomedicale</option>
        <option value="Settore_Industriale_e_Manifatturiero">Industriale e Manifatturiero</option>
        <option value="Settore_Vendite_e_Marketing">Vendite e Marketing</option>
        <option value="Settore_Amministrazione_e_Risorse_Umane">Amministrazione e Risorse Umane</option>
        <option value="Settore_Educazione_e_Formazione">Educazione e Formazione</option>
        <option value="Settore_Hospitality_e_Turismo">Hospitality e Turismo</option>
        <option value="Settore_Logistica_e_Trasporti">Logistica e Trasporti</option>
      </Field>
      <div class="error-container">
        <ErrorMessage name="sector" />
      </div>
      <div class="form-hint">
        La selezione del settore permetterà di assegnare automaticamente le competenze specifiche del settore al tuo profilo.
      </div>
    </div>
    <!--end::Input group-->

    <!--begin::Input group-->
    <div class="mb-3" data-kt-password-meter="true">
      <!--begin::Wrapper-->
      <div class="mb-2">
        <!--begin::Input wrapper-->
        <div class="position-relative mb-2">
          <Field
            class="form-control form-input"
            type="password"
            placeholder="Password"
            name="password"
            autocomplete="new-password"
          />
          <div class="error-container">
            <ErrorMessage name="password" />
          </div>
        </div>
        <!--end::Input wrapper-->
        
        <!--begin::Meter-->
        <div
          class="d-flex align-items-center mb-2"
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
      <div class="form-hint">
        Use 8 or more characters with a mix of letters, numbers & symbols for better security.
      </div>
      <!--end::Hint-->
    </div>
    <!--end::Input group--->

    <!--begin::Input group-->
    <div class="mb-3">
      <Field
        class="form-control form-input"
        type="password"
        placeholder="Confirm Password"
        name="password_confirmation"
        autocomplete="new-password"
      />
      <div class="error-container">
        <ErrorMessage name="password_confirmation" />
      </div>
    </div>
    <!--end::Input group-->

    <!--begin::Input group-->
    <div class="mb-3">
      <div class="form-check">
        <Field
          class="form-check-input"
          type="checkbox"
          name="toc"
          value="1"
        />
        <label class="form-check-label form-check-label">
          I agree to the
          <a href="#" class="ms-1 link-primary">Terms and Conditions</a>
          and
          <a href="#" class="ms-1 link-primary">Privacy Policy</a>
        </label>
      </div>
      <div class="error-container">
        <ErrorMessage name="toc" />
      </div>
    </div>
    <!--end::Input group-->

    <!--begin::Actions-->
    <div class="text-center">
      <button
        id="kt_sign_up_submit"
        ref="submitButton"
        type="submit"
        class="btn btn-primary btn-lg w-100 submit-button"
        :disabled="isLoading"
      >
        <span class="indicator-label">
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
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, nextTick, onMounted, ref } from "vue";
import { ErrorMessage, Field, Form as VForm } from "vee-validate";
import * as Yup from "yup";
import { useAuthStore, type User } from "@/stores/auth";
import { useRouter } from "vue-router";
import { PasswordMeterComponent } from "@/assets/ts/components";
import { useToast } from "vue-toastification";

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
    const toast = useToast();

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
      sector: Yup.string()
        .required("Settore is required")
        .label("Settore"),
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
          toast.success("Welcome to Our Community! Your account has been created successfully and you are now signed in.");
          // Go to page after successfully registration
          router.push({ name: "dashboard" });
        } else {
          const errorMessage = typeof store.errors === 'string' ? 
            store.errors : 
            Object.values(store.errors)[0] as string;
            
          toast.error(errorMessage || "An error occurred during registration. Please try again.");
        }
      } catch (error) {
        toast.error("Unable to connect to the server. Please check your internet connection and try again.");
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
    };
  },
});
</script>

<style scoped>
/* Solo stili essenziali per il tema personalizzato */
.form {
  min-height: auto;
  overflow: visible;
}

.auth-title {
  color: white;
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.auth-subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
  margin-bottom: 1rem;
}

.auth-link-container {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;
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

.form-input,
.form-select {
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  font-size: 1rem;
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
  font-size: 1rem;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #6366f1;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.form-select {
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
  font-size: 1rem;
}

.form-select option {
  background: #1f2937;
  color: white;
}

.form-select option[disabled] {
  color: rgba(255, 255, 255, 0.7);
  font-style: italic;
}

.form-hint {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
  margin-top: 0.25rem;
  line-height: 1.3;
}

.error-container :deep(.fv-help-block) {
  color: #ef4444;
  font-size: 0.85rem;
  margin: 0;
}

.form-check-input {
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
}

.form-check-input:checked {
  background: #6366f1;
  border-color: #6366f1;
}

.form-check-label {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  line-height: 1.3;
}

.link-primary {
  color: #6366f1;
  text-decoration: none;
  transition: color 0.3s ease;
}

.link-primary:hover {
  color: #4f46e5;
  text-decoration: none;
}

.submit-button {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 600;
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

/* Responsive con Bootstrap */
@media (max-width: 768px) {
  .auth-title {
    font-size: 1.5rem;
  }
  
  .auth-subtitle {
    font-size: 0.85rem;
  }
  
  .form-input,
  .form-select {
    font-size: 0.95rem;
  }
  
  .form-input::placeholder {
    font-size: 0.95rem;
  }
  
  .form-check-label {
    font-size: 0.85rem;
  }
  
  .form-hint {
    font-size: 0.8rem;
  }
  
  .error-container :deep(.fv-help-block) {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .auth-title {
    font-size: 1.375rem;
  }
  
  .auth-subtitle {
    font-size: 0.8rem;
  }
  
  .form-input,
  .form-select {
    font-size: 0.9rem;
  }
  
  .form-input::placeholder {
    font-size: 0.9rem;
  }
  
  .form-check-label {
    font-size: 0.8rem;
  }
  
  .form-hint {
    font-size: 0.75rem;
  }
  
  .error-container :deep(.fv-help-block) {
    font-size: 0.75rem;
  }
}
</style>
