<template>
  <div
    class="modal fade"
    id="kt_modal_create_certification"
    ref="certificationModalRef"
    tabindex="-1"
    aria-hidden="true"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
  >
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content">
        <div class="modal-header" id="kt_modal_create_certification_header">
          <h2 class="fw-bold">{{ isEditing ? 'Edit Certification' : 'New Certification' }}</h2>
          <div
            id="kt_modal_create_certification_close"
            data-bs-dismiss="modal"
            class="btn btn-icon btn-sm btn-active-icon-primary"
          >
            <KTIcon icon-name="cross" icon-class="fs-1" />
          </div>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="modal-body py-10 px-lg-17">
            <div
              class="scroll-y me-n7 pe-7"
              id="kt_modal_create_certification_scroll"
              data-kt-scroll="true"
              data-kt-scroll-activate="{default: false, lg: true}"
              data-kt-scroll-max-height="auto"
              data-kt-scroll-dependencies="#kt_modal_create_certification_header"
              data-kt-scroll-wrappers="#kt_modal_create_certification_scroll"
              data-kt-scroll-offset="300px"
            >
              <!-- User -->
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-semibold mb-2">User</label>
                <div class="fv-plugins-icon-container">
                  <select v-model="formData.userId" class="form-select" required>
                    <option value="">Select User</option>
                    <option v-for="user in users" :key="user.id" :value="user.id">
                      {{ user.firstName }} {{ user.lastName }} ({{ user.email }})
                    </option>
                  </select>
                </div>
              </div>

              <!-- Certification Name -->
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-semibold mb-2">Certification Name</label>
                <div class="fv-plugins-icon-container">
                  <input v-model="formData.name" type="text" class="form-control" placeholder="Enter certification name" required />
                </div>
              </div>

              <!-- Issuing Authority -->
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-semibold mb-2">Issuing Authority</label>
                <div class="fv-plugins-icon-container">
                  <input v-model="formData.issuingAuthority" type="text" class="form-control" placeholder="Enter issuing authority" required />
                </div>
              </div>

              <!-- Certificate Number -->
              <div class="fv-row mb-7">
                <label class="fs-6 fw-semibold mb-2">Certificate Number</label>
                <div class="fv-plugins-icon-container">
                  <input v-model="formData.certificateNumber" type="text" class="form-control" placeholder="Enter certificate number (optional)" />
                </div>
              </div>

              <!-- Issue Date and Expiry Date -->
              <div class="row g-9 mb-7">
                <div class="col-md-6 fv-row">
                  <label class="required fs-6 fw-semibold mb-2">Issue Date</label>
                  <div class="fv-plugins-icon-container">
                    <input v-model="formData.issueDate" type="date" class="form-control" required />
                  </div>
                </div>
                <div class="col-md-6 fv-row">
                  <label class="fs-6 fw-semibold mb-2">Expiry Date</label>
                  <div class="fv-plugins-icon-container">
                    <input v-model="formData.expiryDate" type="date" class="form-control" />
                  </div>
                </div>
              </div>

              <!-- Status -->
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-semibold mb-2">Status</label>
                <div class="fv-plugins-icon-container">
                  <select v-model="formData.status" class="form-select" required>
                    <option v-for="status in Object.values(CertificationStatus)" :key="status" :value="status">
                      {{ getStatusLabel(status) }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Credential URL -->
              <div class="fv-row mb-7">
                <label class="fs-6 fw-semibold mb-2">Credential URL</label>
                <div class="fv-plugins-icon-container">
                  <input v-model="formData.credentialUrl" type="url" class="form-control" placeholder="Enter credential URL (optional)" />
                </div>
              </div>

              <!-- Description -->
              <div class="fv-row mb-7">
                <label class="fs-6 fw-semibold mb-2">Description</label>
                <div class="fv-plugins-icon-container">
                  <textarea v-model="formData.description" class="form-control" rows="3" placeholder="Enter certification description"></textarea>
                </div>
              </div>

              <!-- Tags -->
              <div class="fv-row mb-7">
                <label class="fs-6 fw-semibold mb-2">Tags</label>
                <div class="fv-plugins-icon-container">
                  <input v-model="tagsInput" type="text" class="form-control" placeholder="Enter tags separated by commas" @blur="updateTags" />
                  <div v-if="formData.tags.length > 0" class="mt-2">
                    <span 
                      v-for="tag in formData.tags" 
                      :key="tag"
                      class="badge badge-light-primary me-1 mb-1"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer flex-center">
            <button
              type="button"
              class="btn btn-light me-3"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button
              :data-kt-indicator="loading ? 'on' : null"
              class="btn btn-lg btn-primary"
              type="submit"
            >
              <span v-if="!loading" class="indicator-label">
                {{ isEditing ? 'Update' : 'Create' }}
                <KTIcon icon-name="arrow-right" icon-class="fs-2 me-2 me-0" />
              </span>
              <span v-if="loading" class="indicator-progress">
                Please wait...
                <span
                  class="spinner-border spinner-border-sm align-middle ms-2"
                ></span>
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, onUnmounted } from "vue";
import KTIcon from "@/core/helpers/kt-icon/KTIcon.vue";
import { CertificationStatus } from "@/core/models/enums";
import type { Certification } from "@/core/services/businessServices/Training";

interface CertificationFormData {
  userId: string;
  name: string;
  issuingAuthority: string;
  certificateNumber?: string;
  issueDate: string;
  expiryDate?: string;
  status: string;
  credentialUrl?: string;
  description?: string;
  tags: string[];
}

export default defineComponent({
  name: "create-certification-modal",
  components: {
    KTIcon,
  },
  props: {
    isEditing: {
      type: Boolean,
      default: false,
    },
    certification: {
      type: Object as () => Certification | null,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    users: {
      type: Array as () => any[],
      default: () => [],
    },
    closeModal: {
      type: Function,
      required: true,
    },
  },
  emits: ['close', 'submit'],
  setup(props, { emit }) {
    const certificationModalRef = ref<null | HTMLElement>(null);
    const tagsInput = ref('');

    const formData = ref<CertificationFormData>({
      userId: "",
      name: "",
      issuingAuthority: "",
      certificateNumber: "",
      issueDate: "",
      expiryDate: "",
      status: CertificationStatus.ACTIVE,
      credentialUrl: "",
      description: "",
      tags: [],
    });

    // Function to populate form data
    const populateFormData = (certification: Certification | null) => {
      if (certification) {
        formData.value = {
          userId: certification.userId || "",
          name: certification.name || "",
          issuingAuthority: certification.issuingAuthority || "",
          certificateNumber: certification.certificateNumber || "",
          issueDate: certification.issueDate ? new Date(certification.issueDate).toISOString().split('T')[0] : "",
          expiryDate: certification.expiryDate ? new Date(certification.expiryDate).toISOString().split('T')[0] : "",
          status: certification.status || CertificationStatus.ACTIVE,
          credentialUrl: certification.credentialUrl || "",
          description: certification.description || "",
          tags: certification.tags || [],
        };
        tagsInput.value = certification.tags ? certification.tags.join(', ') : '';
      } else {
        // Reset form for new certification
        formData.value = {
          userId: "",
          name: "",
          issuingAuthority: "",
          certificateNumber: "",
          issueDate: "",
          expiryDate: "",
          status: CertificationStatus.ACTIVE,
          credentialUrl: "",
          description: "",
          tags: [],
        };
        tagsInput.value = '';
      }
    };

    // Reset form when certification prop changes
    watch(() => props.certification, (newCertification) => {
      populateFormData(newCertification);
    }, { immediate: true });

    const getStatusLabel = (status: string) => {
      switch (status) {
        case CertificationStatus.ACTIVE:
          return 'Active';
        case CertificationStatus.EXPIRED:
          return 'Expired';
        case CertificationStatus.REVOKED:
          return 'Revoked';
        case CertificationStatus.PENDING:
          return 'Pending';
        default:
          return status;
      }
    };

    const updateTags = () => {
      if (tagsInput.value.trim()) {
        const tags = tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        formData.value.tags = [...new Set(tags)]; // Remove duplicates
        tagsInput.value = '';
      }
    };

    const handleClose = () => {
      // Reset form
      formData.value = {
        userId: "",
        name: "",
        issuingAuthority: "",
        certificateNumber: "",
        issueDate: "",
        expiryDate: "",
        status: CertificationStatus.ACTIVE,
        credentialUrl: "",
        description: "",
        tags: [],
      };
      tagsInput.value = '';
      emit('close');
      props.closeModal();
    };

    // Bootstrap modal event handlers
    const handleModalHidden = () => {
      handleClose();
    };

    const handleModalShow = () => {
      // Ensure form data is populated when modal is shown
      populateFormData(props.certification);
    };

    onMounted(() => {
      const modalElement = certificationModalRef.value;
      if (modalElement) {
        modalElement.addEventListener('hidden.bs.modal', handleModalHidden);
        modalElement.addEventListener('show.bs.modal', handleModalShow);
      }
    });

    onUnmounted(() => {
      const modalElement = certificationModalRef.value;
      if (modalElement) {
        modalElement.removeEventListener('hidden.bs.modal', handleModalHidden);
        modalElement.removeEventListener('show.bs.modal', handleModalShow);
      }
    });

    const handleSubmit = () => {
      if (!formData.value.userId || !formData.value.name || !formData.value.issuingAuthority || !formData.value.issueDate) {
        alert('Please fill in all required fields.');
        return;
      }
      emit('submit', formData.value);
    };

    return {
      certificationModalRef,
      formData,
      tagsInput,
      CertificationStatus,
      getStatusLabel,
      updateTags,
      handleClose,
      handleSubmit,
      populateFormData,
    };
  },
});
</script>
