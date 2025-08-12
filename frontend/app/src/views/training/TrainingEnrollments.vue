<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        <h3 class="fw-bold">Training Enrollments</h3>
        <span class="text-muted fs-6">({{ enrollments.length }})</span>
      </div>
      <div class="card-toolbar">
        <button class="btn btn-light-primary me-3" data-bs-toggle="modal" data-bs-target="#kt_modal_add_training">
          <KTIcon icon-name="education" icon-class="fs-2" />
          New Training
        </button>
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#kt_modal_enrollment" @click="editingEnrollment = null">
          <KTIcon icon-name="plus" icon-class="fs-2" />
          New Enrollment
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
            <option v-for="status in Object.values(TrainingEnrollmentStatus)" :key="status" :value="status">
              {{ getStatusLabel(status) }}
            </option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">User</label>
          <input v-model="filters.user" type="text" class="form-control" placeholder="Search by user..." />
        </div>
        <div class="col-md-3">
          <label class="form-label">Training</label>
          <input v-model="filters.training" type="text" class="form-control" placeholder="Search by training..." />
        </div>
        <div class="col-md-3 d-flex align-items-end">
          <button @click="clearFilters" class="btn btn-light me-2">Clear</button>
          <button @click="applyFilters" class="btn btn-primary">Apply</button>
        </div>
      </div>

      <!-- Enrollments Table -->
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
              <th class="min-w-200px">Training</th>
              <th class="min-w-100px">Status</th>
              <th class="min-w-100px">Progress</th>
              <th class="min-w-100px">Score</th>
              <th class="min-w-100px">Enrollment Date</th>
              <th class="min-w-100px">Completion Date</th>
              <th class="text-end min-w-100px">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="enrollment in filteredEnrollments" :key="enrollment.id">
              <td>
                <div class="form-check form-check-sm form-check-custom form-check-solid">
                  <input class="form-check-input" type="checkbox" v-model="selectedEnrollments" :value="enrollment.id" />
                </div>
              </td>
              <td>
                <div class="d-flex align-items-center">
                  <div class="symbol symbol-45px me-5">
                    <div class="symbol-label bg-light-primary d-flex align-items-center justify-content-center">
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
                <span :class="getStatusBadgeClass(enrollment.status)" class="badge">
                  {{ enrollment.status }}
                </span>
              </td>
              <td>
                <div class="d-flex align-items-center">
                  <div class="progress h-6px w-100px me-3">
                    <div class="progress-bar" :style="{ width: enrollment.progress + '%' }"></div>
                  </div>
                  <span class="fw-bold fs-7">{{ enrollment.progress }}%</span>
                </div>
              </td>
              <td>
                <span v-if="enrollment.score" class="fw-bold fs-7">{{ enrollment.score }}/100</span>
                <span v-else class="text-muted fs-7">-</span>
              </td>
              <td>{{ formatDate(enrollment.enrollmentDate) }}</td>
              <td>{{ enrollment.completionDate ? formatDate(enrollment.completionDate) : '-' }}</td>
              <td class="text-end">
                <button @click="editEnrollment(enrollment)" type="button" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1" data-bs-toggle="modal" data-bs-target="#kt_modal_enrollment">
                  <KTIcon icon-name="pencil" icon-class="fs-3" />
                </button>
                <button @click="deleteEnrollment(enrollment.id)" class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm">
                  <KTIcon icon-name="trash" icon-class="fs-3" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="filteredEnrollments.length === 0" class="text-center py-8">
        <KTIcon icon-name="education" icon-class="fs-2 text-muted" />
        <p class="text-muted mt-3">No training enrollments found.</p>
      </div>
    </div>
  </div>

    <!-- Enrollment Modal -->
    <EnrollmentModal
      :is-editing="!!editingEnrollment"
      :enrollment="editingEnrollment"
      :loading="saving"
      :users="users"
      :trainings="trainings"
      :close-modal="() => closeModal('kt_modal_enrollment')"
      @close="closeEnrollmentModal"
      @submit="saveEnrollment"
    />

    <!-- Add Training Modal -->
    <AddTrainingModal @training-created="onTrainingCreated" />
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import KTIcon from "@/core/helpers/kt-icon/KTIcon.vue";
import AddTrainingModal from "@/components/training/AddTrainingModal.vue";
import EnrollmentModal from "@/components/modals/forms/EnrollmentModal.vue";
import { Modal } from "bootstrap";
import { 
  getTrainingEnrollments, 
  createTrainingEnrollment, 
  updateTrainingEnrollment, 
  deleteTrainingEnrollment,
  getTrainings,
  getUsers,
  type TrainingEnrollment
} from "@/core/services/businessServices/Training";
import { TrainingEnrollmentStatus } from "@/core/models/enums";
import Swal from "sweetalert2/dist/sweetalert2.js";

export default defineComponent({
  name: "training-enrollments",
  components: {
    KTIcon,
    AddTrainingModal,
    EnrollmentModal,
  },
  setup() {
    const enrollments = ref<TrainingEnrollment[]>([]);
    const users = ref<any[]>([]);
    const trainings = ref<any[]>([]);
    const selectedEnrollments = ref<string[]>([]);
    const editingEnrollment = ref<TrainingEnrollment | null>(null);
    const saving = ref(false);

    const filters = ref({
      status: "",
      user: "",
      training: "",
    });

    const selectAll = computed({
      get: () => selectedEnrollments.value.length === filteredEnrollments.value.length && filteredEnrollments.value.length > 0,
      set: (value: boolean) => {
        if (value) {
          selectedEnrollments.value = filteredEnrollments.value.map(e => e.id);
        } else {
          selectedEnrollments.value = [];
        }
      }
    });

    const filteredEnrollments = computed(() => {
      return enrollments.value.filter(enrollment => {
        const statusMatch = !filters.value.status || enrollment.status === filters.value.status;
        const userMatch = !filters.value.user || 
          `${enrollment.user?.firstName} ${enrollment.user?.lastName}`.toLowerCase().includes(filters.value.user.toLowerCase()) ||
          enrollment.user?.email?.toLowerCase().includes(filters.value.user.toLowerCase());
        const trainingMatch = !filters.value.training || 
          enrollment.training?.title?.toLowerCase().includes(filters.value.training.toLowerCase());
        
        return statusMatch && userMatch && trainingMatch;
      });
    });

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

    const editEnrollment = (enrollment: TrainingEnrollment) => {
      editingEnrollment.value = enrollment;
    };

    const saveEnrollment = async (formData: any) => {
      if (!formData.userId || !formData.trainingId) {
        Swal.fire('Error', 'Please fill in all required fields.', 'error');
        return;
      }

      saving.value = true;
      try {
        if (editingEnrollment.value) {
          const result = await updateTrainingEnrollment(editingEnrollment.value.id, formData);
          
          if (result) {
            const index = enrollments.value.findIndex(e => e.id === editingEnrollment.value!.id);
            if (index !== -1) {
              enrollments.value[index] = result;
            }
            await Swal.fire('Success', 'Enrollment updated successfully!', 'success');
            closeEnrollmentModal();
          } else {
            console.error('Update result is undefined or falsy');
            await Swal.fire('Error', 'Failed to update enrollment. Please try again.', 'error');
          }
        } else {
          console.log('Creating enrollment with data:', formData);
          const result = await createTrainingEnrollment(formData);
          console.log('Create result:', result);
          
          if (result) {
            enrollments.value.unshift(result);
            await Swal.fire('Success', 'Enrollment created successfully!', 'success');
            closeEnrollmentModal();
          } else {
            console.error('Create result is undefined or falsy');
            await Swal.fire('Error', 'Failed to create enrollment. Please try again.', 'error');
          }
        }
      } catch (error) {
        console.error('Failed to save enrollment:', error);
        Swal.fire('Error', 'Failed to save enrollment.', 'error');
      } finally {
        saving.value = false;
      }
    };

    const deleteEnrollment = async (id: string) => {
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
          const success = await deleteTrainingEnrollment(id);
          if (success) {
            enrollments.value = enrollments.value.filter(e => e.id !== id);
            Swal.fire('Deleted!', 'Enrollment has been deleted.', 'success');
          }
        } catch (error) {
          console.error('Failed to delete enrollment:', error);
          Swal.fire('Error', 'Failed to delete enrollment.', 'error');
        }
      }
    };

    const closeEnrollmentModal = () => {
      // Prima rimuovi il focus da qualsiasi elemento focalizzato nella modale
      const modal = document.getElementById('kt_modal_enrollment');
      if (modal) {
        const focusedElement = modal.querySelector(':focus') as HTMLElement;
        if (focusedElement) {
          focusedElement.blur();
        }
      }
      
      // Poi chiudi la modale Bootstrap
      closeModal('kt_modal_enrollment');
      
      // Infine resetta lo stato
      editingEnrollment.value = null;
    };

    const closeModal = (modalId: string) => {
      const modal = document.getElementById(modalId);
      if (modal) {
        const dismissBtn = modal.querySelector('[data-bs-dismiss="modal"]') as HTMLElement;
        if (dismissBtn) {
          dismissBtn.click();
        }
      }
    };

    const toggleSelectAll = () => {
      if (selectAll.value) {
        selectedEnrollments.value = filteredEnrollments.value.map(e => e.id);
      } else {
        selectedEnrollments.value = [];
      }
    };

    const clearFilters = () => {
      filters.value = {
        status: "",
        user: "",
        training: "",
      };
    };

    const applyFilters = () => {
      // Filters are applied automatically through computed property
    };

    const getStatusLabel = (status: string) => {
      switch (status) {
        case TrainingEnrollmentStatus.ENROLLED:
          return 'Enrolled';
        case TrainingEnrollmentStatus.IN_PROGRESS:
          return 'In Progress';
        case TrainingEnrollmentStatus.COMPLETED:
          return 'Completed';
        case TrainingEnrollmentStatus.CANCELLED:
          return 'Cancelled';
        case TrainingEnrollmentStatus.FAILED:
          return 'Failed';
        default:
          return status;
      }
    };

    const getStatusBadgeClass = (status: string) => {
      switch (status) {
        case TrainingEnrollmentStatus.ENROLLED:
          return 'badge-light-warning';
        case TrainingEnrollmentStatus.IN_PROGRESS:
          return 'badge-light-primary';
        case TrainingEnrollmentStatus.COMPLETED:
          return 'badge-light-success';
        case TrainingEnrollmentStatus.CANCELLED:
          return 'badge-light-danger';
        case TrainingEnrollmentStatus.FAILED:
          return 'badge-light-danger';
        default:
          return 'badge-light-secondary';
      }
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

    const onTrainingCreated = (training: any) => {
      // Aggiungi il nuovo training alla lista
      trainings.value.unshift(training);
      // Chiudi il modale usando Bootstrap
      const modal = document.getElementById('kt_modal_add_training');
      if (modal) {
        const bootstrapModal = Modal.getInstance(modal);
        if (bootstrapModal) {
          bootstrapModal.hide();
        }
      }
    };

    onMounted(() => {
      fetchEnrollments();
      fetchUsers();
      fetchTrainings();
    });

    return {
      enrollments,
      users,
      trainings,
      selectedEnrollments,
      editingEnrollment,
      saving,
      filters,
      selectAll,
      filteredEnrollments,
      editEnrollment,
      saveEnrollment,
      deleteEnrollment,
      closeEnrollmentModal,
      closeModal,
      onTrainingCreated,
      toggleSelectAll,
      clearFilters,
      applyFilters,
      getStatusBadgeClass,
      getStatusLabel,
      formatDate,
      getInitials,
      TrainingEnrollmentStatus,
    };
  },
});
</script>

<style scoped>
.modal.show {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
