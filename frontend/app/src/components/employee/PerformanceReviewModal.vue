<template>
  <div class="modal fade" id="kt_modal_performance_review" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ isEditing ? 'Edit Performance Review' : 'Create New Performance Review' }}</h2>
          <div class="btn btn-icon btn-sm btn-active-icon-primary" data-bs-dismiss="modal">
            <KTIcon icon-name="cross" icon-class="fs-1" />
          </div>
        </div>

        <div class="modal-body scroll-y mx-5 mx-xl-15 my-7">
          <form @submit.prevent="onSubmit" class="form">
            <div class="row g-4">
              <!-- Basic Information -->
              <div class="col-md-6">
                <h6 class="fw-bold mb-3">Basic Information</h6>
                                   <div class="mb-3">
                     <label for="reviewPeriod" class="form-label">Review Period *</label>
                     <select
                       id="reviewPeriod"
                       v-model="form.reviewPeriod"
                       class="form-select"
                       required
                     >
                       <option value="">Select a review period</option>
                       <option 
                         v-for="option in performanceReviewPeriodOptions" 
                         :key="option.value" 
                         :value="option.value"
                       >
                         {{ option.label }}
                       </option>
                     </select>
                   </div>
                <div class="mb-3">
                  <label for="reviewDate" class="form-label">Review Date *</label>
                  <input
                    id="reviewDate"
                    v-model="form.reviewDate"
                    type="date"
                    class="form-control"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label for="nextReviewDate" class="form-label">Next Review Date</label>
                  <input
                    id="nextReviewDate"
                    v-model="form.nextReviewDate"
                    type="date"
                    class="form-control"
                  />
                </div>
                <div class="mb-3">
                  <label for="status" class="form-label">Status *</label>
                  <select
                    id="status"
                    v-model="form.status"
                    class="form-select"
                    required
                  >
                    <option value="">Select status</option>
                    <option 
                      v-for="option in availableStatusOptions" 
                      :key="option.value" 
                      :value="option.value"
                    >
                      {{ option.label }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Scores -->
              <div class="col-md-6">
                <h6 class="fw-bold mb-3">Scores (1-5 scale)</h6>
                                   <div class="mb-3">
                     <label for="overallScore" class="form-label">Overall Score</label>
                     <select
                       id="overallScore"
                       v-model.number="form.overallScore"
                       class="form-select"
                     >
                       <option value="">Select overall score</option>
                       <option 
                         v-for="option in performanceReviewScoreOptions" 
                         :key="option.value" 
                         :value="option.value"
                       >
                         {{ option.label }}
                       </option>
                     </select>
                   </div>
                                   <div class="mb-3">
                     <label for="technicalScore" class="form-label">Technical Skills</label>
                     <select
                       id="technicalScore"
                       v-model.number="form.technicalScore"
                       class="form-select"
                     >
                       <option value="">Select technical skills score</option>
                       <option 
                         v-for="option in performanceReviewScoreOptions" 
                         :key="option.value" 
                         :value="option.value"
                       >
                         {{ option.label }}
                       </option>
                     </select>
                   </div>
                   <div class="mb-3">
                     <label for="softSkillScore" class="form-label">Soft Skills</label>
                     <select
                       id="softSkillScore"
                       v-model.number="form.softSkillScore"
                       class="form-select"
                     >
                       <option value="">Select soft skills score</option>
                       <option 
                         v-for="option in performanceReviewScoreOptions" 
                         :key="option.value" 
                         :value="option.value"
                       >
                         {{ option.label }}
                       </option>
                     </select>
                   </div>
                   <div class="mb-3">
                     <label for="leadershipScore" class="form-label">Leadership</label>
                     <select
                       id="leadershipScore"
                       v-model.number="form.leadershipScore"
                       class="form-select"
                     >
                       <option value="">Select leadership score</option>
                       <option 
                         v-for="option in performanceReviewScoreOptions" 
                         :key="option.value" 
                         :value="option.value"
                       >
                         {{ option.label }}
                       </option>
                     </select>
                   </div>
              </div>

              <!-- Feedback -->
              <div class="col-12">
                <h6 class="fw-bold mb-3">Feedback</h6>
                <div class="mb-3">
                  <label for="feedback" class="form-label">Detailed Feedback</label>
                  <textarea
                    id="feedback"
                    v-model="form.feedback"
                    class="form-control"
                    rows="4"
                    placeholder="Provide detailed feedback about the employee's performance..."
                  ></textarea>
                </div>
              </div>

              <!-- Strengths -->
              <div class="col-md-6">
                <h6 class="fw-bold mb-3">Strengths</h6>
                <div class="mb-3">
                  <div class="d-flex gap-2 mb-2">
                    <input
                      v-model="newStrength"
                      type="text"
                      class="form-control"
                      placeholder="Add a strength"
                      @keyup.enter="addStrength"
                    />
                    <button
                      type="button"
                      @click="addStrength"
                      class="btn btn-primary"
                      :disabled="!newStrength.trim()"
                    >
                      <i class="bi bi-plus"></i>
                    </button>
                  </div>
                  <div v-if="form.strengths.length > 0" class="d-flex flex-wrap gap-1">
                    <span
                      v-for="(strength, index) in form.strengths"
                      :key="index"
                      class="badge badge-light-success d-flex align-items-center"
                    >
                      {{ strength }}
                      <button
                        type="button"
                        @click="removeStrength(index)"
                        class="btn-close btn-close-white ms-2"
                        style="font-size: 0.5rem;"
                      ></button>
                    </span>
                  </div>
                </div>
              </div>

              <!-- Areas for Improvement -->
              <div class="col-md-6">
                <h6 class="fw-bold mb-3">Areas for Improvement</h6>
                <div class="mb-3">
                  <div class="d-flex gap-2 mb-2">
                    <input
                      v-model="newAreaForImprovement"
                      type="text"
                      class="form-control"
                      placeholder="Add an area for improvement"
                      @keyup.enter="addAreaForImprovement"
                    />
                    <button
                      type="button"
                      @click="addAreaForImprovement"
                      class="btn btn-warning"
                      :disabled="!newAreaForImprovement.trim()"
                    >
                      <i class="bi bi-plus"></i>
                    </button>
                  </div>
                  <div v-if="form.areasForImprovement.length > 0" class="d-flex flex-wrap gap-1">
                    <span
                      v-for="(area, index) in form.areasForImprovement"
                      :key="index"
                      class="badge badge-light-warning d-flex align-items-center"
                    >
                      {{ area }}
                      <button
                        type="button"
                        @click="removeAreaForImprovement(index)"
                        class="btn-close btn-close-white ms-2"
                        style="font-size: 0.5rem;"
                      ></button>
                    </span>
                  </div>
                </div>
              </div>

              <!-- Goals -->
              <div class="col-12">
                <h6 class="fw-bold mb-3">Goals</h6>
                <div class="mb-3">
                  <label for="goals" class="form-label">Goals for Next Period</label>
                  <textarea
                    id="goals"
                    v-model="form.goals"
                    class="form-control"
                    rows="3"
                    placeholder="Define specific goals and objectives for the next review period..."
                  ></textarea>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Cancel
          </button>
          <button
            type="button"
            @click="onSubmit"
            class="btn btn-primary"
            :disabled="loading"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            {{ loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Review' : 'Create Review') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import { useCurrentUser } from '@/core/composables/useCurrentUser';
import { 
  createPerformanceReview,
  updatePerformanceReview,
  type PerformanceReview
} from '@/core/services/businessServices/PerformanceReview';
import { 
  performanceReviewPeriodOptions,
  performanceReviewScoreOptions,
  performanceReviewStatusOptions,
  getPeriodLabel,
  getScoreLabel
} from '@/core/utils/performanceReviewOptions';
import { PerformanceReviewStatus } from '@/core/models/enums';
import Swal from 'sweetalert2';

export default defineComponent({
  name: "PerformanceReviewModal",
  props: {
    employeeId: {
      type: String,
      required: true
    },
    review: {
      type: Object as () => PerformanceReview | null,
      default: null
    },
    closeModal: {
      type: Function,
      required: true
    }
  },
  emits: ['review-created', 'review-updated'],
  setup(props, { emit }) {
    const { currentUser } = useCurrentUser();
    
    const loading = ref(false);
    const newStrength = ref('');
    const newAreaForImprovement = ref('');

    const isEditing = computed(() => !!props.review);

    // Filter available status options based on user role
    const availableStatusOptions = computed(() => {
      const isAdmin = currentUser.value?.userRoles?.some(role => 
        role.name === 'admin' || role.name === 'superadmin'
      );
      
      if (isAdmin) {
        // Admins can set any status
        return performanceReviewStatusOptions;
      } else {
        // Regular users can only set DRAFT and SUBMITTED
        return performanceReviewStatusOptions.filter(option => 
          option.value === PerformanceReviewStatus.DRAFT || 
          option.value === PerformanceReviewStatus.SUBMITTED
        );
      }
    });

    const form = ref({
      reviewPeriod: '',
      reviewDate: new Date().toISOString().split('T')[0],
      nextReviewDate: '',
      status: 'DRAFT' as string,
      overallScore: null as number | null,
      technicalScore: null as number | null,
      softSkillScore: null as number | null,
      leadershipScore: null as number | null,
      feedback: '',
      strengths: [] as string[],
      areasForImprovement: [] as string[],
      goals: ''
    });

    // Watch for review changes to populate form when editing
    watch(() => props.review, (newReview) => {
      if (newReview) {
        form.value = {
          reviewPeriod: newReview.reviewPeriod,
          reviewDate: newReview.reviewDate ? new Date(newReview.reviewDate).toISOString().split('T')[0] : '',
          nextReviewDate: newReview.nextReviewDate ? new Date(newReview.nextReviewDate).toISOString().split('T')[0] : '',
          status: newReview.status || 'DRAFT',
          overallScore: newReview.overallScore || null,
          technicalScore: newReview.technicalScore || null,
          softSkillScore: newReview.softSkillScore || null,
          leadershipScore: newReview.leadershipScore || null,
          feedback: newReview.feedback || '',
          strengths: [...newReview.strengths],
          areasForImprovement: [...newReview.areasForImprovement],
          goals: newReview.goals || ''
        };
      } else {
        // Reset form for new review
        form.value = {
          reviewPeriod: '',
          reviewDate: new Date().toISOString().split('T')[0],
          nextReviewDate: '',
          status: 'DRAFT',
          overallScore: null,
          technicalScore: null,
          softSkillScore: null,
          leadershipScore: null,
          feedback: '',
          strengths: [],
          areasForImprovement: [],
          goals: ''
        };
      }
      newStrength.value = '';
      newAreaForImprovement.value = '';
    }, { immediate: true });

    const addStrength = () => {
      if (newStrength.value.trim()) {
        form.value.strengths.push(newStrength.value.trim());
        newStrength.value = '';
      }
    };

    const removeStrength = (index: number) => {
      form.value.strengths.splice(index, 1);
    };

    const addAreaForImprovement = () => {
      if (newAreaForImprovement.value.trim()) {
        form.value.areasForImprovement.push(newAreaForImprovement.value.trim());
        newAreaForImprovement.value = '';
      }
    };

    const removeAreaForImprovement = (index: number) => {
      form.value.areasForImprovement.splice(index, 1);
    };

    const onSubmit = async () => {
      if (!form.value.reviewPeriod || !form.value.reviewDate || !form.value.status) {
        Swal.fire({
          title: 'Validation Error',
          text: 'Please fill in all required fields (Review Period, Review Date, and Status).',
          icon: 'warning'
        });
        return;
      }

      loading.value = true;

      try {
        const reviewData = {
          employeeId: props.employeeId,
          reviewerId: currentUser.value?.id || '',
          reviewPeriod: form.value.reviewPeriod,
          reviewDate: form.value.reviewDate ? new Date(form.value.reviewDate).toISOString() : undefined,
          nextReviewDate: form.value.nextReviewDate ? new Date(form.value.nextReviewDate).toISOString() : undefined,
          overallScore: form.value.overallScore || undefined,
          technicalScore: form.value.technicalScore || undefined,
          softSkillScore: form.value.softSkillScore || undefined,
          leadershipScore: form.value.leadershipScore || undefined,
          feedback: form.value.feedback || undefined,
          strengths: form.value.strengths,
          areasForImprovement: form.value.areasForImprovement,
          goals: form.value.goals || undefined,
          status: form.value.status as PerformanceReviewStatus
        };

        let result;
        if (isEditing.value && props.review) {
          // Update existing review
          result = await updatePerformanceReview(props.review.id, reviewData);
          if (result) {
            Swal.fire({
              title: 'Success!',
              text: 'Performance review has been updated successfully.',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false
            });
            emit('review-updated', result);
          }
        } else {
          // Create new review
          result = await createPerformanceReview(reviewData);
          if (result) {
            Swal.fire({
              title: 'Success!',
              text: 'Performance review has been created successfully.',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false
            });
            emit('review-created', result);
          }
        }

        if (result) {
          props.closeModal();
        } else {
          throw new Error(isEditing.value ? 'Failed to update review' : 'Failed to create review');
        }
      } catch (error) {
        console.error('Failed to save review:', error);
        Swal.fire({
          title: 'Error!',
          text: `Failed to ${isEditing.value ? 'update' : 'create'} performance review. Please try again.`,
          icon: 'error'
        });
      } finally {
        loading.value = false;
      }
    };

         return {
       loading,
       form,
       newStrength,
       newAreaForImprovement,
       isEditing,
       availableStatusOptions,
       performanceReviewPeriodOptions,
       performanceReviewScoreOptions,
       performanceReviewStatusOptions,
       addStrength,
       removeStrength,
       addAreaForImprovement,
       removeAreaForImprovement,
       onSubmit
     };
  }
});
</script>

<style scoped>
.modal-xl {
  max-width: 1140px;
}
</style> 