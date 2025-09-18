<template>
  <div class="row g-5 g-xl-10 mb-5 mb-xl-10">
    <!-- Training Enrollments Overview -->
    <div class="col-xl-6">
      <div class="card card-flush h-xl-100 hover-card">
        <div class="card-header pt-5">
          <div class="card-title d-flex flex-column">
            <div class="d-flex align-items-center">
              <span class="fs-4 fw-semibold text-gray-400 me-1 align-self-start">Training Enrollments</span>
            </div>
            <span class="text-gray-400 pt-1 fw-semibold fs-6">{{ enrollments.length }} total enrollments</span>
          </div>
        </div>
        <div class="card-body pt-2 pb-4 d-flex align-items-center">
          <div class="d-flex flex-column content-justify-center flex-row-fluid">
            <div class="d-flex fw-semibold align-items-center hover-item">
              <div class="bullet bullet-dot bg-primary me-2 transition-all"></div>
              <div class="text-gray-600">In Progress</div>
              <div class="ms-auto fw-bold fs-6 text-gray-400 counter">{{ inProgressCount }}</div>
            </div>
            <div class="d-flex fw-semibold align-items-center my-3 hover-item">
              <div class="bullet bullet-dot bg-success me-2 transition-all"></div>
              <div class="text-gray-600">Completed</div>
              <div class="ms-auto fw-bold fs-6 text-gray-400 counter">{{ completedCount }}</div>
            </div>
            <div class="d-flex fw-semibold align-items-center hover-item">
              <div class="bullet bullet-dot bg-warning me-2 transition-all"></div>
              <div class="text-gray-600">Enrolled</div>
              <div class="ms-auto fw-bold fs-6 text-gray-400 counter">{{ plannedCount }}</div>
            </div>
          </div>
          <div class="w-100px w-sm-150px flex-shrink-0">
            <div class="d-flex align-items-center justify-content-center rounded bg-light-primary w-100 h-100 icon-container">
              <KTIcon icon-name="education" icon-class="fs-2hx text-primary transition-all" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Certifications Overview -->
    <div class="col-xl-6">
      <div class="card card-flush h-xl-100 hover-card">
        <div class="card-header pt-5">
          <div class="card-title d-flex flex-column">
            <div class="d-flex align-items-center">
              <span class="fs-4 fw-semibold text-gray-400 me-1 align-self-start">Certifications</span>
            </div>
            <span class="text-gray-400 pt-1 fw-semibold fs-6">{{ certifications.length }} total certifications</span>
          </div>
        </div>
        <div class="card-body pt-2 pb-4 d-flex align-items-center">
          <div class="d-flex flex-column content-justify-center flex-row-fluid">
            <div class="d-flex fw-semibold align-items-center hover-item">
              <div class="bullet bullet-dot bg-success me-2 transition-all"></div>
              <div class="text-gray-600">Active</div>
              <div class="ms-auto fw-bold fs-6 text-gray-400 counter">{{ activeCertCount }}</div>
            </div>
            <div class="d-flex fw-semibold align-items-center my-3 hover-item">
              <div class="bullet bullet-dot bg-warning me-2 transition-all"></div>
              <div class="text-gray-600">Expired</div>
              <div class="ms-auto fw-bold fs-6 text-gray-400 counter">{{ expiredCertCount }}</div>
            </div>
            <div class="d-flex fw-semibold align-items-center hover-item">
              <div class="bullet bullet-dot bg-danger me-2 transition-all"></div>
              <div class="text-gray-600">Revoked</div>
              <div class="ms-auto fw-bold fs-6 text-gray-400 counter">{{ revokedCertCount }}</div>
            </div>
          </div>
          <div class="w-100px w-sm-150px flex-shrink-0">
            <div class="d-flex align-items-center justify-content-center rounded bg-light-success w-100 h-100 icon-container">
              <KTIcon icon-name="award" icon-class="fs-2hx text-success transition-all" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Training Enrollments Section -->
  <div class="card mb-5 mb-xl-10 hover-card">
    <div class="card-header border-0">
      <div class="card-title m-0">
        <h3 class="fw-bold m-0">Training Enrollments</h3>
      </div>
      <div class="card-toolbar">
        <router-link to="/training/enrollments" class="btn btn-sm btn-light-primary me-2 modern-btn">
          <KTIcon icon-name="eye" icon-class="fs-2 me-1" />
          View Enrollments
        </router-link>
      </div>
    </div>
    <div class="card-body">
      <div class="table-responsive">
        <table class="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3 modern-table">
          <thead>
            <tr class="fw-bold text-muted">
              <th class="min-w-150px">User</th>
              <th class="min-w-200px">Training</th>
              <th class="min-w-100px">Status</th>
              <th class="min-w-100px">Progress</th>
              <th class="min-w-100px">Enrollment Date</th>
              <th class="text-end min-w-100px">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="enrollment in recentEnrollments" :key="enrollment.id" class="table-row-hover">
              <td>
                <div class="d-flex align-items-center">
                  <div class="symbol symbol-45px me-5">
                    <div class="symbol-label bg-light-primary d-flex align-items-center justify-content-center transition-all">
                      <span class="fw-bold fs-6 text-primary">
                        {{ getInitials(enrollment.user?.firstName, enrollment.user?.lastName) }}
                      </span>
                    </div>
                  </div>
                  <div class="d-flex justify-content-start flex-column">
                    <span class="text-dark fw-bold text-h6 mb-1">
                      {{ enrollment.user?.firstName }} {{ enrollment.user?.lastName }}
                    </span>
                    <span class="text-muted fw-semibold text-muted d-block fs-7">
                      {{ enrollment.user?.email }}
                    </span>
                  </div>
                </div>
              </td>
              <td>
                <span class="text-dark fw-bold text-h6 mb-1">{{ enrollment.training?.title }}</span>
                <span class="text-muted fw-semibold text-muted d-block fs-7">
                  {{ enrollment.training?.description }}
                </span>
              </td>
              <td>
                <span :class="getStatusBadgeClass(enrollment.status)" class="badge transition-all">
                  {{ enrollment.status }}
                </span>
              </td>
              <td>
                <div class="d-flex align-items-center">
                  <div class="progress h-6px w-100px me-3">
                    <div class="progress-bar transition-all" :style="{ width: enrollment.progress + '%' }"></div>
                  </div>
                  <span class="fw-bold fs-7">{{ enrollment.progress }}%</span>
                </div>
              </td>
              <td>{{ formatDate(enrollment.enrollmentDate) }}</td>
              <td class="text-end">
                <router-link :to="`/training/enrollments/${enrollment.id}`" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm modern-btn">
                  <KTIcon icon-name="eye" icon-class="fs-3" />
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Training Programs Section -->
  <div class="card mb-5 mb-xl-10 hover-card">
    <div class="card-header border-0">
      <div class="card-title m-0">
        <h3 class="fw-bold m-0">Training Programs</h3>
      </div>
      <div class="card-toolbar">
        <button @click="openCreateTrainingModal()" class="btn btn-sm btn-primary me-2 modern-btn">
          <KTIcon icon-name="plus" icon-class="fs-2 me-1" />
          New Training
        </button>
        <router-link to="/training/programs" class="btn btn-sm btn-light-primary modern-btn">
          <KTIcon icon-name="eye" icon-class="fs-2 me-1" />
          View All
        </router-link>
      </div>
    </div>
    <div class="card-body">
      <div class="table-responsive">
        <table class="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3 modern-table">
          <thead>
            <tr class="fw-bold text-muted">
              <th class="min-w-200px">Title</th>
              <th class="min-w-150px">Provider</th>
              <th class="min-w-100px">Level</th>
              <th class="min-w-100px">Duration</th>
              <th class="min-w-100px">Cost</th>
              <th class="min-w-150px">Skills Developed</th>
              <th class="text-end min-w-100px">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="training in recentTrainings" :key="training.id" class="table-row-hover">
              <td>
                <div class="d-flex flex-column">
                  <span class="text-dark fw-bold text-h6 mb-1">{{ training.title }}</span>
                  <span v-if="training.description" class="text-muted fw-semibold text-muted d-block fs-7">
                    {{ truncateText(training.description, 80) }}
                  </span>
                </div>
              </td>
              <td>
                <span class="text-dark fw-bold">{{ training.provider || '-' }}</span>
              </td>
              <td>
                <span :class="getLevelBadgeClass(training.level || '')" class="badge transition-all">
                  {{ training.level || 'N/A' }}
                </span>
              </td>
              <td>
                <span class="text-dark fw-bold">{{ training.estimatedDurationHours }}h</span>
              </td>
              <td>
                <span v-if="training.cost !== null && training.cost !== undefined" class="text-dark fw-bold">
                  €{{ training.cost.toFixed(2) }}
                </span>
                <span v-else class="text-muted">Free</span>
              </td>
              <td>
                <div class="d-flex flex-wrap">
                  <span 
                    v-for="skill in training.skillsDeveloped?.slice(0, 2)" 
                    :key="skill"
                    class="badge badge-light-info me-1 mb-1 transition-all"
                  >
                    {{ skill }}
                  </span>
                  <span 
                    v-if="training.skillsDeveloped && training.skillsDeveloped.length > 2"
                    class="badge badge-light-secondary transition-all"
                  >
                    +{{ training.skillsDeveloped.length - 2 }}
                  </span>
                </div>
              </td>
              <td class="text-end">
                <div class="d-flex justify-content-end flex-shrink-0">
                  <button @click="openEditTrainingModal(training)" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1 modern-btn">
                    <KTIcon icon-name="pencil" icon-class="fs-3" />
                  </button>
                  <button @click="deleteTrainingProgram(training.id)" class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm modern-btn">
                    <KTIcon icon-name="trash" icon-class="fs-3" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Certifications Section -->
  <div class="card mb-5 mb-xl-10 hover-card">
    <div class="card-header border-0">
      <div class="card-title m-0">
        <h3 class="fw-bold m-0">Recent Certifications</h3>
      </div>
      <div class="card-toolbar">
        <router-link to="/training/certifications" class="btn btn-sm btn-light-primary modern-btn">
          <KTIcon icon-name="eye" icon-class="fs-2 me-1" />
          View All
        </router-link>
      </div>
    </div>
    <div class="card-body">
      <div class="table-responsive">
        <table class="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3 modern-table">
          <thead>
            <tr class="fw-bold text-muted">
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
            <tr v-for="certification in recentCertifications" :key="certification.id" class="table-row-hover">
              <td>
                <div class="d-flex align-items-center">
                  <div class="symbol symbol-45px me-5">
                    <div class="symbol-label bg-light-primary d-flex align-items-center justify-content-center transition-all">
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
                <span :class="getStatusBadgeClass(certification.status)" class="badge transition-all">
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
                <router-link :to="`/training/certifications/${certification.id}`" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm modern-btn">
                  <KTIcon icon-name="eye" icon-class="fs-3" />
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Create Training Modal -->
  <CreateTrainingModal
    :loading="createModalLoading"
    :close-modal="closeCreateTrainingModal"
    :show="showCreateModal"
    @close="closeCreateTrainingModal"
    @submit="handleCreateTrainingSubmit"
  />

  <!-- Edit Training Modal -->
  <EditTrainingModal
    :training="selectedTraining"
    :loading="editModalLoading"
    :close-modal="closeEditTrainingModal"
    :show="showEditModal"
    @close="closeEditTrainingModal"
    @submit="handleEditTrainingSubmit"
  />
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import KTIcon from "@/core/helpers/kt-icon/KTIcon.vue";
import CreateTrainingModal from "@/components/modals/forms/CreateTrainingModal.vue";
import EditTrainingModal from "@/components/modals/forms/EditTrainingModal.vue";
import { 
  getTrainingEnrollments, 
  getCertifications,
  getTrainings,
  createTraining,
  updateTraining,
  deleteTraining,
  type TrainingEnrollment,
  type Certification,
  type Training 
} from "@/core/services/businessServices/Training";
import { TrainingEnrollmentStatus, CertificationStatus, TrainingDifficulty } from "@/core/models/enums";
import { Modal } from "bootstrap";
import Swal from "sweetalert2/dist/sweetalert2.js";

export default defineComponent({
  name: "training-dashboard",
  components: {
    KTIcon,
    CreateTrainingModal,
    EditTrainingModal,
  },
  setup() {
    const enrollments = ref<TrainingEnrollment[]>([]);
    const certifications = ref<Certification[]>([]);
    const trainings = ref<Training[]>([]);
    
    // Training modal state
    const showCreateModal = ref(false);
    const showEditModal = ref(false);
    const selectedTraining = ref<Training | null>(null);
    const createModalLoading = ref(false);
    const editModalLoading = ref(false);
    let createModal: Modal;
    let editModal: Modal;

    const inProgressCount = computed(() => 
      enrollments.value.filter(e => e.status === TrainingEnrollmentStatus.IN_PROGRESS).length
    );

    const completedCount = computed(() => 
      enrollments.value.filter(e => e.status === TrainingEnrollmentStatus.COMPLETED).length
    );

    const plannedCount = computed(() => 
      enrollments.value.filter(e => e.status === TrainingEnrollmentStatus.ENROLLED).length
    );

    const activeCertCount = computed(() => 
      certifications.value.filter(c => c.status === CertificationStatus.ACTIVE).length
    );

    const expiredCertCount = computed(() => 
      certifications.value.filter(c => c.status === CertificationStatus.EXPIRED).length
    );

    const revokedCertCount = computed(() => 
      certifications.value.filter(c => c.status === CertificationStatus.REVOKED).length
    );

    const recentEnrollments = computed(() => 
      enrollments.value.slice(0, 5)
    );

    const recentCertifications = computed(() => 
      certifications.value.slice(0, 5)
    );

    const recentTrainings = computed(() => 
      trainings.value.slice(0, 5)
    );

    const fetchEnrollments = async () => {
      try {
        const result = await getTrainingEnrollments();
        if (result) {
          enrollments.value = result;
        }
      } catch (error) {
        console.error('Failed to fetch enrollments:', error);
      }
    };

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

    const fetchTrainings = async () => {
      try {
        const result = await getTrainings();
        if (result) {
          trainings.value = result;
        }
      } catch (error) {
        console.error('Failed to fetch trainings:', error);
      }
    };

    const getStatusBadgeClass = (status: string) => {
      switch (status) {
        case TrainingEnrollmentStatus.ENROLLED: return 'badge-light-warning';
        case TrainingEnrollmentStatus.IN_PROGRESS: return 'badge-light-primary';
        case TrainingEnrollmentStatus.COMPLETED: return 'badge-light-success';
        case TrainingEnrollmentStatus.CANCELLED: return 'badge-light-danger';
        case TrainingEnrollmentStatus.FAILED: return 'badge-light-danger';
        case CertificationStatus.ACTIVE: return 'badge-light-success';
        case CertificationStatus.EXPIRED: return 'badge-light-warning';
        case CertificationStatus.REVOKED: return 'badge-light-danger';
        case CertificationStatus.PENDING: return 'badge-light-info';
        default: return 'badge-light-secondary';
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

    const getLevelBadgeClass = (level: string) => {
      switch (level) {
        case TrainingDifficulty.BEGINNER: return 'badge-light-success';
        case TrainingDifficulty.INTERMEDIATE: return 'badge-light-primary';
        case TrainingDifficulty.ADVANCED: return 'badge-light-warning';
        case TrainingDifficulty.EXPERT: return 'badge-light-danger';
        default: return 'badge-light-secondary';
      }
    };

    const truncateText = (text: string, length: number): string => {
      if (!text) return '';
      return text.length > length ? text.substring(0, length) + '...' : text;
    };

    // Training Modal Functions
    const openCreateTrainingModal = () => {
      showCreateModal.value = true;
      
      if (!createModal) {
        const modalElement = document.getElementById('kt_modal_create_training');
        if (modalElement) {
          createModal = new Modal(modalElement);
        }
      }
      createModal?.show();
    };

    const openEditTrainingModal = (training: Training) => {
      selectedTraining.value = training;
      showEditModal.value = true;
      
      if (!editModal) {
        const modalElement = document.getElementById('kt_modal_edit_training');
        if (modalElement) {
          editModal = new Modal(modalElement);
        }
      }
      editModal?.show();
    };

    const closeCreateTrainingModal = () => {
      createModal?.hide();
      showCreateModal.value = false;
      createModalLoading.value = false;
    };

    const closeEditTrainingModal = () => {
      editModal?.hide();
      showEditModal.value = false;
      selectedTraining.value = null;
      editModalLoading.value = false;
    };

    const handleCreateTrainingSubmit = async (formData: any) => {
      createModalLoading.value = true;
      
      try {
        const result = await createTraining(formData);
        if (result) {
          await fetchTrainings();
          closeCreateTrainingModal();
          await Swal.fire({
            title: "Success!",
            text: "Training created successfully",
            icon: "success",
            confirmButtonText: "OK",
          });
        }
      } catch (error) {
        console.error('Error creating training:', error);
        await Swal.fire({
          title: "Error!",
          text: "Failed to create training",
          icon: "error",
          confirmButtonText: "OK",
        });
      } finally {
        createModalLoading.value = false;
      }
    };

    const handleEditTrainingSubmit = async (formData: any) => {
      editModalLoading.value = true;
      
      try {
        if (selectedTraining.value) {
          const result = await updateTraining(selectedTraining.value.id, formData);
          if (result) {
            await fetchTrainings();
            closeEditTrainingModal();
            await Swal.fire({
              title: "Success!",
              text: "Training updated successfully",
              icon: "success",
              confirmButtonText: "OK",
            });
          }
        }
      } catch (error) {
        console.error('Error updating training:', error);
        await Swal.fire({
          title: "Error!",
          text: "Failed to update training",
          icon: "error",
          confirmButtonText: "OK",
        });
      } finally {
        editModalLoading.value = false;
      }
    };

    const deleteTrainingProgram = async (trainingId: string) => {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        try {
          const deleteResult = await deleteTraining(trainingId);
          if (deleteResult) {
            await fetchTrainings();
            await Swal.fire({
              title: "Deleted!",
              text: "Training has been deleted.",
              icon: "success",
            });
          }
        } catch (error) {
          console.error('Error deleting training:', error);
          await Swal.fire({
            title: "Error!",
            text: "Failed to delete training",
            icon: "error",
          });
        }
      }
    };

    onMounted(() => {
      fetchEnrollments();
      fetchCertifications();
      fetchTrainings();
    });

    return {
      enrollments,
      certifications,
      trainings,
      inProgressCount,
      completedCount,
      plannedCount,
      activeCertCount,
      expiredCertCount,
      revokedCertCount,
      recentEnrollments,
      recentCertifications,
      recentTrainings,
      getStatusBadgeClass,
      getExpiryDateClass,
      formatDate,
      getInitials,
      getLevelBadgeClass,
      truncateText,
      // Training modals
      showCreateModal,
      showEditModal,
      selectedTraining,
      createModalLoading,
      editModalLoading,
      openCreateTrainingModal,
      openEditTrainingModal,
      closeCreateTrainingModal,
      closeEditTrainingModal,
      handleCreateTrainingSubmit,
      handleEditTrainingSubmit,
      deleteTrainingProgram,
      TrainingEnrollmentStatus,
      CertificationStatus,
    };
  },
});
</script>

<style scoped>
/* Modern hover effects for cards */
.hover-card {
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.hover-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border-color: rgba(var(--bs-primary-rgb), 0.2);
}

/* Hover effects for overview items */
.hover-item {
  transition: all 0.2s ease;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
}

.hover-item:hover {
  background-color: rgba(var(--bs-primary-rgb), 0.05);
  transform: translateX(4px);
}

.hover-item:hover .bullet {
  transform: scale(1.2);
}

.hover-item:hover .counter {
  color: var(--bs-primary) !important;
  font-weight: 700 !important;
}

/* Icon container animations */
.icon-container {
  transition: all 0.3s ease;
}

.hover-card:hover .icon-container {
  transform: scale(1.1);
  background: linear-gradient(135deg, rgba(var(--bs-primary-rgb), 0.1), rgba(var(--bs-primary-rgb), 0.2)) !important;
}

.hover-card:hover .icon-container i {
  transform: rotate(5deg);
}

/* Modern button styling */
.modern-btn {
  transition: all 0.3s ease;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

.modern-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.modern-btn:hover::before {
  left: 100%;
}

.modern-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Table row hover effects */
.table-row-hover {
  transition: all 0.2s ease;
}

.table-row-hover:hover {
  background-color: rgba(var(--bs-primary-rgb), 0.03);
  transform: scale(1.01);
}

.table-row-hover:hover td {
  border-color: rgba(var(--bs-primary-rgb), 0.1);
}

/* Modern table styling */
.modern-table {
  border-radius: 12px;
  overflow: hidden;
}

.modern-table thead th {
  background: linear-gradient(135deg, rgba(var(--bs-primary-rgb), 0.05), rgba(var(--bs-primary-rgb), 0.1));
  border-bottom: 2px solid rgba(var(--bs-primary-rgb), 0.1);
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}

/* Badge animations */
.badge {
  transition: all 0.2s ease;
}

.badge:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Progress bar animations */
.progress-bar {
  transition: width 0.6s ease;
}

.table-row-hover:hover .progress-bar {
  box-shadow: 0 0 10px rgba(var(--bs-primary-rgb), 0.3);
}

/* Symbol label animations */
.symbol-label {
  transition: all 0.3s ease;
}

.table-row-hover:hover .symbol-label {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(var(--bs-primary-rgb), 0.2);
}

/* Smooth transitions for all elements */
.transition-all {
  transition: all 0.3s ease;
}

/* Card header enhancements */
.card-header {
  background: linear-gradient(135deg, rgba(var(--bs-primary-rgb), 0.02), rgba(var(--bs-primary-rgb), 0.05));
  border-bottom: 1px solid rgba(var(--bs-primary-rgb), 0.1);
}

/* Loading animation for counters */
@keyframes countUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.counter {
  animation: countUp 0.6s ease-out;
}

/* Responsive improvements */
@media (max-width: 768px) {
  .hover-card:hover {
    transform: none;
  }
  
  .hover-item:hover {
    transform: none;
  }
  
  .modern-btn:hover {
    transform: none;
  }
  
  .table-row-hover:hover {
    transform: none;
  }
}

/* Focus states for accessibility */
.modern-btn:focus {
  outline: 2px solid var(--bs-primary);
  outline-offset: 2px;
}

.hover-item:focus {
  background-color: rgba(var(--bs-primary-rgb), 0.1);
  outline: 2px solid var(--bs-primary);
  outline-offset: 2px;
}
</style>

