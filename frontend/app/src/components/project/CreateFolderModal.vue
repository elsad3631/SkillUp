<template>
  <div
    class="modal fade"
    id="kt_modal_create_folder"
    tabindex="-1"
    aria-hidden="true"
    @hidden.bs.modal="handleModalHidden"
  >
    <!--begin::Modal dialog-->
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <!--begin::Modal content-->
      <div class="modal-content">
        <!--begin::Modal header-->
        <div class="modal-header" id="kt_modal_create_folder_header">
          <!--begin::Modal title-->
          <h2 class="fw-bold">Create New Folder</h2>
          <!--end::Modal title-->

          <!--begin::Close-->
          <div
            id="kt_modal_create_folder_close"
            data-bs-dismiss="modal"
            class="btn btn-icon btn-sm btn-active-icon-primary"
          >
            <KTIcon icon-name="cross" icon-class="fs-1" />
          </div>
          <!--end::Close-->
        </div>
        <!--end::Modal header-->

        <!--begin::Modal body-->
        <div class="modal-body py-10 px-lg-17">
          <!--begin::Scroll-->
          <div
            class="scroll-y me-n7 pe-7"
            id="kt_modal_create_folder_scroll"
            data-kt-scroll="true"
            data-kt-scroll-activate="{default: false, lg: true}"
            data-kt-scroll-max-height="auto"
            data-kt-scroll-dependencies="#kt_modal_create_folder_header"
            data-kt-scroll-wrappers="#kt_modal_create_folder_scroll"
            data-kt-scroll-offset="300px"
          >
            <!--begin::Input group-->
            <div class="fv-row mb-7">
              <!--begin::Label-->
              <label class="required fs-6 fw-semibold mb-2">Folder Name</label>
              <!--end::Label-->

              <!--begin::Input-->
              <input
                ref="folderNameInput"
                type="text"
                v-model="folderName"
                class="form-control form-control-solid"
                placeholder="Enter folder name"
                name="folderName"
                @keyup.enter="handleSubmit"
                :class="{ 'is-invalid': hasError }"
              />
              <!--end::Input-->
              
              <!--begin::Error message-->
              <div v-if="hasError" class="invalid-feedback">
                {{ errorMessage }}
              </div>
              <!--end::Error message-->
            </div>
            <!--end::Input group-->

            <!--begin::Current path info-->
            <div v-if="currentPath" class="alert alert-info">
              <div class="d-flex align-items-center">
                <KTIcon icon-name="information-5" icon-class="fs-2x text-info me-4" />
                <div>
                  <h4 class="alert-heading">Creating folder in:</h4>
                  <p class="mb-0">{{ currentPath }}</p>
                </div>
              </div>
            </div>
            <!--end::Current path info-->
          </div>
          <!--end::Scroll-->
        </div>
        <!--end::Modal body-->

        <!--begin::Modal footer-->
        <div class="modal-footer flex-center">
          <!--begin::Button-->
          <button
            ref="cancelButton"
            type="reset"
            data-bs-dismiss="modal"
            class="btn btn-light me-3"
          >
            Cancel
          </button>
          <!--end::Button-->

          <!--begin::Button-->
          <button
            ref="submitButton"
            type="submit"
            class="btn btn-primary"
            @click="handleSubmit"
            :disabled="isLoading || !folderName.trim()"
          >
            <span v-if="!isLoading" class="indicator-label">
              <KTIcon icon-name="plus" icon-class="fs-2 me-2" />
              Create Folder
            </span>
            <span v-if="isLoading" class="indicator-progress">
              Please wait...
              <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
            </span>
          </button>
          <!--end::Button-->
        </div>
        <!--end::Modal footer-->
      </div>
      <!--end::Modal content-->
    </div>
    <!--end::Modal dialog-->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick } from "vue";
import KTIcon from "@/core/helpers/kt-icon/KTIcon.vue";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { Modal } from "bootstrap";

export default defineComponent({
  name: "CreateFolderModal",
  components: {
    KTIcon,
  },
  props: {
    currentPath: {
      type: String,
      default: '',
    },
  },
  emits: ['folder-created'],
  setup(props, { emit }) {
    const folderName = ref('');
    const isLoading = ref(false);
    const hasError = ref(false);
    const errorMessage = ref('');
    const folderNameInput = ref<HTMLInputElement | null>(null);
    const submitButton = ref<HTMLButtonElement | null>(null);
    const cancelButton = ref<HTMLButtonElement | null>(null);

    const validateFolderName = (): boolean => {
      const name = folderName.value.trim();
      
      // Reset error state
      hasError.value = false;
      errorMessage.value = '';
      
      if (!name) {
        hasError.value = true;
        errorMessage.value = 'Folder name is required';
        return false;
      }
      
      if (name.length < 2) {
        hasError.value = true;
        errorMessage.value = 'Folder name must be at least 2 characters';
        return false;
      }
      
      if (name.length > 100) {
        hasError.value = true;
        errorMessage.value = 'Folder name must be less than 100 characters';
        return false;
      }
      
      // Check for invalid characters
      const invalidChars = /[<>:"/\\|?*\x00-\x1f]/;
      if (invalidChars.test(name)) {
        hasError.value = true;
        errorMessage.value = 'Folder name contains invalid characters';
        return false;
      }
      
      // Check for reserved names
      const reservedNames = ['CON', 'PRN', 'AUX', 'NUL', 'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9', 'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'];
      if (reservedNames.includes(name.toUpperCase())) {
        hasError.value = true;
        errorMessage.value = 'This folder name is reserved and cannot be used';
        return false;
      }
      
      return true;
    };

    const handleSubmit = async () => {
      if (!validateFolderName()) {
        return;
      }

      try {
        isLoading.value = true;
        
        // Emit the folder creation event
        emit('folder-created', {
          name: folderName.value.trim(),
          path: props.currentPath,
        });

        // Reset form
        folderName.value = '';
        hasError.value = false;
        errorMessage.value = '';
        
        // Remove focus from input to prevent accessibility warning
        if (folderNameInput.value) {
          folderNameInput.value.blur();
        }
        
        // Close modal
        const modal = document.getElementById('kt_modal_create_folder');
        if (modal) {
          const bootstrapModal = Modal.getInstance(modal);
          if (bootstrapModal) {
            bootstrapModal.hide();
          }
        }
        
      } catch (error) {
        console.error('Error in handleSubmit:', error);
        Swal.fire({
          title: 'Error!',
          text: 'An unexpected error occurred while creating the folder.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      } finally {
        isLoading.value = false;
      }
    };

    const resetForm = () => {
      folderName.value = '';
      hasError.value = false;
      errorMessage.value = '';
      isLoading.value = false;
    };

    // Focus input when modal is shown
    const focusInput = () => {
      nextTick(() => {
        if (folderNameInput.value) {
          folderNameInput.value.focus();
        }
      });
    };

    // Handle modal hidden event to clean up focus
    const handleModalHidden = () => {
      if (folderNameInput.value) {
        folderNameInput.value.blur();
      }
    };

    return {
      folderName,
      isLoading,
      hasError,
      errorMessage,
      folderNameInput,
      submitButton,
      cancelButton,
      handleSubmit,
      resetForm,
      focusInput,
      handleModalHidden,
    };
  },
});
</script> 