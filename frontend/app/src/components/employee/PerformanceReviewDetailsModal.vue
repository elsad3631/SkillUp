<template>
  <div class="modal fade" id="kt_modal_performance_review_details" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Performance Review Details</h2>
          <div class="btn btn-icon btn-sm btn-active-icon-primary" data-bs-dismiss="modal">
            <KTIcon icon-name="cross" icon-class="fs-1" />
          </div>
        </div>

        <div class="modal-body scroll-y mx-5 mx-xl-15 my-7" v-if="review">
          <div class="row g-4">
            <div class="col-md-6">
              <h6 class="fw-bold mb-3">Review Information</h6>
              <div class="d-flex flex-column gap-2">
                <div class="d-flex justify-content-between">
                  <span class="fw-semobold">Period:</span>
                  <span>{{ review.reviewPeriod }}</span>
                </div>
                                   <div class="d-flex justify-content-between">
                     <span class="fw-semobold">Status:</span>
                     <span class="badge" :class="getStatusClass(review.status as PerformanceReviewStatus)">
                       {{ getStatusLabel(review.status as PerformanceReviewStatus) }}
                     </span>
                   </div>
                <div class="d-flex justify-content-between">
                  <span class="fw-semobold">Review Date:</span>
                  <span>{{ formatDate(review.reviewDate) }}</span>
                </div>
                <div class="d-flex justify-content-between">
                  <span class="fw-semobold">Next Review:</span>
                  <span>{{ formatDate(review.nextReviewDate) || 'Not scheduled' }}</span>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <h6 class="fw-bold mb-3">Scores</h6>
              <div class="d-flex flex-column gap-2">
                                   <div class="d-flex justify-content-between">
                     <span class="fw-semobold">Overall Score:</span>
                     <span>{{ review.overallScore ? getScoreLabel(review.overallScore) : 'N/A' }}</span>
                   </div>
                   <div class="d-flex justify-content-between">
                     <span class="fw-semobold">Technical Skills:</span>
                     <span>{{ review.technicalScore ? getScoreLabel(review.technicalScore) : 'N/A' }}</span>
                   </div>
                   <div class="d-flex justify-content-between">
                     <span class="fw-semobold">Soft Skills:</span>
                     <span>{{ review.softSkillScore ? getScoreLabel(review.softSkillScore) : 'N/A' }}</span>
                   </div>
                   <div class="d-flex justify-content-between">
                     <span class="fw-semobold">Leadership:</span>
                     <span>{{ review.leadershipScore ? getScoreLabel(review.leadershipScore) : 'N/A' }}</span>
                   </div>
              </div>
            </div>
          </div>

          <div class="row mt-4">
            <div class="col-12">
              <h6 class="fw-bold mb-3">Feedback</h6>
              <div class="bg-light-primary p-3 rounded">
                <p class="mb-0">{{ review.feedback || 'No feedback provided.' }}</p>
              </div>
            </div>
          </div>

          <div class="row mt-4">
            <div class="col-md-6">
              <h6 class="fw-bold mb-3">Strengths</h6>
              <div v-if="review.strengths?.length" class="d-flex flex-column gap-1">
                <span 
                  v-for="strength in review.strengths" 
                  :key="strength"
                  class="badge badge-light-success me-1 mb-1"
                >
                  {{ strength }}
                </span>
              </div>
              <span v-else class="text-muted">No strengths listed.</span>
            </div>
            <div class="col-md-6">
              <h6 class="fw-bold mb-3">Areas for Improvement</h6>
              <div v-if="review.areasForImprovement?.length" class="d-flex flex-column gap-1">
                <span 
                  v-for="area in review.areasForImprovement" 
                  :key="area"
                  class="badge badge-light-warning me-1 mb-1"
                >
                  {{ area }}
                </span>
              </div>
              <span v-else class="text-muted">No areas for improvement listed.</span>
            </div>
          </div>

          <div class="row mt-4" v-if="review.goals">
            <div class="col-12">
              <h6 class="fw-bold mb-3">Goals</h6>
              <div class="bg-light-info p-3 rounded">
                <p class="mb-0">{{ review.goals }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PerformanceReview } from '@/core/services/businessServices/PerformanceReview';
import { 
  performanceReviewStatusOptions,
  performanceReviewScoreOptions,
  getStatusLabel,
  getStatusClass,
  getScoreLabel
} from '@/core/utils/performanceReviewOptions';
import { PerformanceReviewStatus } from '@/core/models/enums';

export default defineComponent({
  name: "PerformanceReviewDetailsModal",
  props: {
    review: {
      type: Object as () => PerformanceReview | null,
      default: null
    }
  },
  setup() {
    const formatDate = (dateString: string | undefined) => {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    const getStatusBadgeClass = (status: string) => {
      switch (status) {
        case 'COMPLETED': return 'badge-light-success';
        case 'APPROVED': return 'badge-light-primary';
        case 'SUBMITTED': return 'badge-light-warning';
        case 'DRAFT': return 'badge-light-gray';
        default: return 'badge-light-gray';
      }
    };

         return {
       formatDate,
       getStatusLabel,
       getStatusClass,
       getScoreLabel,
       PerformanceReviewStatus
     };
  }
});
</script> 