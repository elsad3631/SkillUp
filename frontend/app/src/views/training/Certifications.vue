<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        <h3 class="fw-bold">Certifications</h3>
        <span class="text-muted fs-6">({{ certifications.length }})</span>
      </div>
      <div class="card-toolbar">
        <button @click="showCertificationModal = true" class="btn btn-primary">
          <KTIcon icon-name="plus" icon-class="fs-2" />
          New Certification
        </button>
      </div>
    </div>

    <div class="card-body">
      <!-- Filters -->
      <div class="row mb-6">
        <div class="col-md-3">
          <label class="form-label">Status</label>
          <select v-model="filters.status" class="form-select">
            <option value="">All Statuses</option>
            <option v-for="status in Object.values(CertificationStatus)" :key="status" :value="status">
              {{ getStatusLabel(status) }}
            </option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">User</label>
          <input v-model="filters.user" type="text" class="form-control" placeholder="Search by user..." />
        </div>
        <div class="col-md-3">
          <label class="form-label">Issuing Authority</label>
          <input v-model="filters.authority" type="text" class="form-control" placeholder="Search by authority..." />
        </div>
        <div class="col-md-3 d-flex align-items-end">
          <button @click="clearFilters" class="btn btn-light me-2">Clear</button>
          <button @click="applyFilters" class="btn btn-primary">Apply</button>
        </div>
      </div>

      <!-- Certifications Table -->
      <div class="table-responsive">
        <table class="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
          <thead>
            <tr class="fw-bold text-muted">
              <th class="w-25px">
                <div class="form-check form-check-sm form-check-custom form-check-solid">
                  <input class="form-check-input" type="checkbox" v-model="selectAll" @change="toggleSelectAll" />
                </div>
              </th>
              <th class="min-w-150px">User</th>
              <th class="min-w-200px">Certification</th>
              <th class="min-w-150px">Issuing Authority</th>
              <th class="min-w-100px">Status</th>
              <th class="min-w-100px">Issue Date</th>
              <th class="min-w-100px">Expiry Date</th>
              <th class="text-end min-w-100px">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="certification in filteredCertifications" :key="certification.id">
              <td>
                <div class="form-check form-check-sm form-check-custom form-check-solid">
                  <input class="form-check-input" type="checkbox" v-model="selectedCertifications" :value="certification.id" />
                </div>
              </td>
              <td>
                <div class="d-flex align-items-center">
                  <div class="symbol symbol-45px me-5">
                    <div class="symbol-label bg-light-primary d-flex align-items-center justify-content-center">
                      <span class="fw-bold fs-6 text-primary">
                        {{ getInitials(certification.user?.firstName, certification.user?.lastName) }}
                      </span>
                    </div>
                  </div>
                  <div class="d-flex justify-content-start flex-column">
                    <span class="text-dark fw-bold text-h6 mb-1">
                      {{ certification.user?.firstName }} {{ certification.user?.lastName }}
                    </span>
                    <span class="text-muted fw-semibold text-muted d-block fs-7">
                      {{ certification.user?.email }}
                    </span>
                  </div>
                </div>
              </td>
              <td>
                <span class="text-dark fw-bold text-h6 mb-1">{{ certification.name }}</span>
                <span v-if="certification.certificateNumber" class="text-muted fw-semibold text-muted d-block fs-7">
                  #{{ certification.certificateNumber }}
                </span>
              </td>
              <td>
                <span class="text-dark fw-bold text-h6 mb-1">{{ certification.issuingAuthority }}</span>
              </td>
              <td>
                <span :class="getStatusBadgeClass(certification.status)" class="badge">
                  {{ certification.status }}
                </span>
              </td>
              <td>{{ formatDate(certification.issueDate) }}</td>
              <td>
                <span v-if="certification.expiryDate" :class="getExpiryDateClass(certification.expiryDate)">
                  {{ formatDate(certification.expiryDate) }}
                </span>
                <span v-else class="text-muted fs-7">-</span>
              </td>
              <td class="text-end">
                <button @click="editCertification(certification)" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1">
                  <KTIcon icon-name="pencil" icon-class="fs-3" />
                </button>
                <button @click="handleDeleteCertification(certification.id)" class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm">
                  <KTIcon icon-name="trash" icon-class="fs-3" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="filteredCertifications.length === 0" class="text-center py-8">
        <KTIcon icon-name="award" icon-class="fs-2 text-muted" />
        <p class="text-muted mt-3">No certifications found.</p>
      </div>
    </div>
  </div>

  <!-- Certification Modal -->
  <div v-if="showCertificationModal" class="modal fade show d-block" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ editingCertification ? 'Edit Certification' : 'New Certification' }}</h5>
          <button @click="closeCertificationModal" type="button" class="btn-close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveCertification">
            <div class="mb-3">
              <label class="form-label">User</label>
              <select v-model="certificationForm.userId" class="form-select" required>
                <option value="">Select User</option>
                <option v-for="user in users" :key="user.id" :value="user.id">
                  {{ user.firstName }} {{ user.lastName }} ({{ user.email }})
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Certification Name</label>
              <input v-model="certificationForm.name" type="text" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Issuing Authority</label>
              <input v-model="certificationForm.issuingAuthority" type="text" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Certificate Number</label>
              <input v-model="certificationForm.certificateNumber" type="text" class="form-control" />
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Issue Date</label>
                  <input v-model="certificationForm.issueDate" type="date" class="form-control" required />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Expiry Date</label>
                  <input v-model="certificationForm.expiryDate" type="date" class="form-control" />
                </div>
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Status</label>
              <select v-model="certificationForm.status" class="form-select" required>
                <option v-for="status in Object.values(CertificationStatus)" :key="status" :value="status">
                  {{ getStatusLabel(status) }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Credential URL</label>
              <input v-model="certificationForm.credentialUrl" type="url" class="form-control" />
            </div>
            <div class="mb-3">
              <label class="form-label">Description</label>
              <textarea v-model="certificationForm.description" class="form-control" rows="3"></textarea>
            </div>
            <div class="mb-3">
              <label class="form-label">Tags</label>
              <input v-model="certificationForm.tags" type="text" class="form-control" placeholder="Comma-separated tags" />
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button @click="closeCertificationModal" type="button" class="btn btn-light">Cancel</button>
          <button @click="saveCertification" type="button" class="btn btn-primary" :disabled="saving">
            <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
            {{ editingCertification ? 'Update' : 'Create' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import KTIcon from "@/core/helpers/kt-icon/KTIcon.vue";
import { 
  getCertifications, 
  createCertification, 
  updateCertification, 
  deleteCertification,
  getUsers,
  type Certification 
} from "@/core/services/businessServices/Training";
import { CertificationStatus } from "@/core/models/enums";
import Swal from "sweetalert2/dist/sweetalert2.js";

export default defineComponent({
  name: "certifications",
  components: {
    KTIcon,
  },
  setup() {
    const certifications = ref<Certification[]>([]);
    const users = ref<any[]>([]);
    const selectedCertifications = ref<string[]>([]);
    const showCertificationModal = ref(false);
    const editingCertification = ref<Certification | null>(null);
    const saving = ref(false);

    const filters = ref({
      status: "",
      user: "",
      authority: "",
    });

    const certificationForm = ref({
      userId: "",
      name: "",
      issuingAuthority: "",
      certificateNumber: "",
      issueDate: "",
      expiryDate: "",
      status: CertificationStatus.ACTIVE,
      credentialUrl: "",
      description: "",
      tags: "",
    });

    const selectAll = computed({
      get: () => selectedCertifications.value.length === filteredCertifications.value.length && filteredCertifications.value.length > 0,
      set: (value: boolean) => {
        if (value) {
          selectedCertifications.value = filteredCertifications.value.map(c => c.id);
        } else {
          selectedCertifications.value = [];
        }
      }
    });

    const filteredCertifications = computed(() => {
      return certifications.value.filter(certification => {
        const statusMatch = !filters.value.status || certification.status === filters.value.status;
        const userMatch = !filters.value.user || 
          `${certification.user?.firstName} ${certification.user?.lastName}`.toLowerCase().includes(filters.value.user.toLowerCase()) ||
          certification.user?.email?.toLowerCase().includes(filters.value.user.toLowerCase());
        const authorityMatch = !filters.value.authority || 
          certification.issuingAuthority?.toLowerCase().includes(filters.value.authority.toLowerCase());
        
        return statusMatch && userMatch && authorityMatch;
      });
    });

    const fetchCertifications = async () => {
      try {
        const result = await getCertifications();
        if (result) {
          certifications.value = result;
        }
      } catch (error) {
        console.error('Failed to fetch certifications:', error);
      }
    };

    const fetchUsers = async () => {
      try {
        const result = await getUsers();
        if (result) {
          users.value = result;
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    const editCertification = (certification: Certification) => {
      editingCertification.value = certification;
      certificationForm.value = {
        userId: certification.userId,
        name: certification.name,
        issuingAuthority: certification.issuingAuthority,
        certificateNumber: certification.certificateNumber || "",
        issueDate: certification.issueDate ? new Date(certification.issueDate).toISOString().split('T')[0] : "",
        expiryDate: certification.expiryDate ? new Date(certification.expiryDate).toISOString().split('T')[0] : "",
        status: certification.status as CertificationStatus,
        credentialUrl: certification.credentialUrl || "",
        description: certification.description || "",
        tags: certification.tags ? certification.tags.join(', ') : "",
      };
      showCertificationModal.value = true;
    };

    const saveCertification = async () => {
      if (!certificationForm.value.userId || !certificationForm.value.name || !certificationForm.value.issuingAuthority || !certificationForm.value.issueDate) {
        Swal.fire('Error', 'Please fill in all required fields.', 'error');
        return;
      }

      saving.value = true;
      try {
        const formData = {
          ...certificationForm.value,
          issueDate: new Date(certificationForm.value.issueDate),
          expiryDate: certificationForm.value.expiryDate ? new Date(certificationForm.value.expiryDate) : undefined,
          tags: certificationForm.value.tags ? certificationForm.value.tags.split(',').map(tag => tag.trim()) : [],
        };

        if (editingCertification.value) {
          const result = await updateCertification(editingCertification.value.id, formData);
          if (result) {
            const index = certifications.value.findIndex(c => c.id === editingCertification.value!.id);
            if (index !== -1) {
              certifications.value[index] = result;
            }
            Swal.fire('Success', 'Certification updated successfully!', 'success');
          }
        } else {
          const result = await createCertification(formData);
          if (result) {
            certifications.value.unshift(result);
            Swal.fire('Success', 'Certification created successfully!', 'success');
          }
        }
        closeCertificationModal();
      } catch (error) {
        console.error('Failed to save certification:', error);
        Swal.fire('Error', 'Failed to save certification.', 'error');
      } finally {
        saving.value = false;
      }
    };

    const handleDeleteCertification = async (id: string) => {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        try {
          const success = await deleteCertification(id);
          if (success) {
            certifications.value = certifications.value.filter(c => c.id !== id);
            Swal.fire('Deleted!', 'Certification has been deleted.', 'success');
          } else {
            Swal.fire('Error', 'Failed to delete certification.', 'error');
          }
        } catch (error) {
          console.error('Failed to delete certification:', error);
          Swal.fire('Error', 'Failed to delete certification.', 'error');
        }
      }
    };

    const closeCertificationModal = () => {
      showCertificationModal.value = false;
      editingCertification.value = null;
      certificationForm.value = {
        userId: "",
        name: "",
        issuingAuthority: "",
        certificateNumber: "",
        issueDate: "",
        expiryDate: "",
        status: CertificationStatus.ACTIVE,
        credentialUrl: "",
        description: "",
        tags: "",
      };
    };

    const toggleSelectAll = () => {
      if (selectAll.value) {
        selectedCertifications.value = filteredCertifications.value.map(c => c.id);
      } else {
        selectedCertifications.value = [];
      }
    };

    const clearFilters = () => {
      filters.value = {
        status: "",
        user: "",
        authority: "",
      };
    };

    const applyFilters = () => {
      // Filters are applied automatically through computed property
    };

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

    const getStatusBadgeClass = (status: string) => {
      switch (status) {
        case CertificationStatus.ACTIVE:
          return 'badge-light-success';
        case CertificationStatus.EXPIRED:
          return 'badge-light-warning';
        case CertificationStatus.REVOKED:
          return 'badge-light-danger';
        case CertificationStatus.PENDING:
          return 'badge-light-info';
        default:
          return 'badge-light-secondary';
      }
    };

    const getExpiryDateClass = (expiryDate: Date | string) => {
      if (!expiryDate) return '';
      const expiry = new Date(expiryDate);
      const today = new Date();
      const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilExpiry < 0) return 'text-danger fw-bold';
      if (daysUntilExpiry <= 30) return 'text-warning fw-bold';
      return '';
    };

    const formatDate = (date: Date | string) => {
      if (!date) return 'N/A';
      try {
        return new Date(date).toLocaleDateString();
      } catch (error) {
        return 'Invalid Date';
      }
    };

    const getInitials = (firstName: string = '', lastName: string = ''): string => {
      const first = firstName ? firstName.charAt(0).toUpperCase() : '';
      const last = lastName ? lastName.charAt(0).toUpperCase() : '';
      return first + last;
    };

    onMounted(() => {
      fetchCertifications();
      fetchUsers();
    });

    return {
      certifications,
      users,
      selectedCertifications,
      showCertificationModal,
      editingCertification,
      saving,
      filters,
      certificationForm,
      selectAll,
      filteredCertifications,
      editCertification,
      saveCertification,
      handleDeleteCertification,
      closeCertificationModal,
      toggleSelectAll,
      clearFilters,
      applyFilters,
      getStatusBadgeClass,
      getStatusLabel,
      getExpiryDateClass,
      formatDate,
      getInitials,
      CertificationStatus,
    };
  },
});
</script>

<style scoped>
.modal.show {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
