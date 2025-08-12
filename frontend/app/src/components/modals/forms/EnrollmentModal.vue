<template>
  <div
    class="modal fade"
    id="kt_modal_enrollment"
    ref="enrollmentModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content">
        <div class="modal-header" id="kt_modal_enrollment_header">
          <h2 class="fw-bold">{{ isEditing ? 'Edit Enrollment' : 'New Enrollment' }}</h2>
          <div
            id="kt_modal_enrollment_close"
            data-bs-dismiss="modal"
            class="btn btn-icon btn-sm btn-active-icon-primary"
            @click="handleClose"
          >
            <KTIcon icon-name="cross" icon-class="fs-1" />
          </div>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="modal-body py-10 px-lg-17">
            <div
              class="scroll-y me-n7 pe-7"
              id="kt_modal_enrollment_scroll"
              data-kt-scroll="true"
              data-kt-scroll-activate="{default: false, lg: true}"
              data-kt-scroll-max-height="auto"
              data-kt-scroll-dependencies="#kt_modal_enrollment_header"
              data-kt-scroll-wrappers="#kt_modal_enrollment_scroll"
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

              <!-- Training -->
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-semibold mb-2">Training</label>
                <div class="fv-plugins-icon-container">
                  <select v-model="formData.trainingId" class="form-select" required>
                    <option value="">Select Training</option>
                    <option v-for="training in trainings" :key="training.id" :value="training.id">
                      {{ training.title }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Status -->
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-semibold mb-2">Status</label>
                <div class="fv-plugins-icon-container">
                  <select v-model="formData.status" class="form-select" required>
                    <option v-for="status in Object.values(TrainingEnrollmentStatus)" :key="status" :value="status">
                      {{ getStatusLabel(status) }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Progress and Score -->
              <div class="row g-9 mb-7">
                <div class="col-md-6 fv-row">
                  <label class="fs-6 fw-semibold mb-2">Progress (%)</label>
                  <div class="fv-plugins-icon-container">
                    <input v-model="formData.progress" type="number" min="0" max="100" class="form-control" />
                  </div>
                </div>
                <div class="col-md-6 fv-row">
                  <label class="fs-6 fw-semibold mb-2">Score</label>
                  <div class="fv-plugins-icon-container">
                    <input v-model="formData.score" type="number" min="0" max="100" class="form-control" />
                  </div>
                </div>
              </div>

              <!-- Notes -->
              <div class="fv-row mb-7">
                <label class="fs-6 fw-semibold mb-2">Notes</label>
                <div class="fv-plugins-icon-container">
                  <textarea v-model="formData.notes" class="form-control" rows="3" placeholder="Enter enrollment notes"></textarea>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer flex-center">
            <button
              type="button"
              class="btn btn-light me-3"
              @click="handleClose"
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
import { defineComponent, ref, watch } from "vue";
import KTIcon from "@/core/helpers/kt-icon/KTIcon.vue";
import { TrainingEnrollmentStatus } from "@/core/models/enums";
import type { TrainingEnrollment } from "@/core/services/businessServices/Training";

interface EnrollmentFormData {
  userId: string;
  trainingId: string;
  status: TrainingEnrollmentStatus;
  progress: number;
  score?: number;
  notes: string;
}

export default defineComponent({
  name: "enrollment-modal",
  components: {
    KTIcon,
  },
  props: {
    isEditing: {
      type: Boolean,
      default: false,
    },
    enrollment: {
      type: Object as () => TrainingEnrollment | null,
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
    trainings: {
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
    const enrollmentModalRef = ref<null | HTMLElement>(null);

    const formData = ref<EnrollmentFormData>({
      userId: "",
      trainingId: "",
      status: TrainingEnrollmentStatus.ENROLLED,
      progress: 0,
      score: undefined,
      notes: "",
    });

    // Reset form when enrollment prop changes
    watch(() => props.enrollment, (newEnrollment) => {
      if (newEnrollment) {
        formData.value = {
          userId: newEnrollment.userId || "",
          trainingId: newEnrollment.trainingId || "",
          status: (newEnrollment.status as TrainingEnrollmentStatus) || TrainingEnrollmentStatus.ENROLLED,
          progress: newEnrollment.progress || 0,
          score: newEnrollment.score,
          notes: newEnrollment.notes || "",
        };
      } else {
        // Reset form for new enrollment
        formData.value = {
          userId: "",
          trainingId: "",
          status: TrainingEnrollmentStatus.ENROLLED,
          progress: 0,
          score: undefined,
          notes: "",
        };
      }
    }, { immediate: true });

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

    const handleClose = () => {
      emit('close');
      props.closeModal();
    };

    const handleSubmit = () => {
      if (!formData.value.userId || !formData.value.trainingId) {
        alert('Please fill in all required fields.');
        return;
      }
      emit('submit', formData.value);
      // Non chiudere immediatamente - lascia che il componente padre gestisca la chiusura
      // dopo aver completato l'operazione API
    };

    return {
      enrollmentModalRef,
      formData,
      TrainingEnrollmentStatus,
      getStatusLabel,
      handleClose,
      handleSubmit,
    };
  },
});
</script>
