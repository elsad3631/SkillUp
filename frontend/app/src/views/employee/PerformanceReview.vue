<template>
  <div class="card">
    <!--begin::Header-->
    <div class="card-header border-0 pt-5">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label fw-bold fs-3 mb-1">Performance Reviews</span>
        <span class="text-muted mt-1 fw-semobold fs-7">
          Employee performance evaluation history and statistics
        </span>
      </h3>
      <div class="card-toolbar">
        <!--begin::Add Review Button (Admin/Super Admin only)-->
                 <button
           v-if="canManageReviews"
           type="button"
           class="btn btn-primary"
           data-bs-toggle="modal"
           data-bs-target="#kt_modal_performance_review"
           :disabled="loading"
         >
           <i class="bi bi-plus-circle me-2"></i>
           Add Review
         </button>
        <!--end::Add Review Button-->
      </div>
    </div>
    <!--end::Header-->

    <!--begin::Loading State-->
    <div v-if="loading" class="d-flex justify-content-center align-items-center py-10">
      <div class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <div class="mt-3">
          <span class="fw-semobold text-gray-600">Loading performance reviews...</span>
        </div>
      </div>
    </div>
    <!--end::Loading State-->

    <!--begin::Error State-->
    <div v-else-if="error" class="d-flex justify-content-center align-items-center py-10">
      <div class="text-center">
        <div class="mb-4">
          <i class="bi bi-exclamation-triangle text-danger" style="font-size: 3rem;"></i>
        </div>
        <div class="mb-3">
          <h4 class="text-danger">Unable to Load Reviews</h4>
          <p class="text-gray-600 mb-3">{{ error }}</p>
        </div>
        <button @click="loadReviews" class="btn btn-primary">
          <i class="bi bi-arrow-clockwise me-2"></i>Try Again
        </button>
      </div>
    </div>
    <!--end::Error State-->

    <!--begin::Content-->
    <div v-else>
      <!--begin::Stats Cards-->
      <div class="row g-5 g-xl-8 mb-5">
        <div class="col-xl-3">
          <div class="card bg-light-primary card-xl-stretch mb-xl-8">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="symbol symbol-50px me-3">
                  <div class="symbol-label bg-primary">
                    <i class="bi bi-star-fill text-white fs-2x"></i>
                  </div>
                </div>
                <div class="d-flex flex-column">
                  <span class="text-gray-800 fw-bold fs-6">Average Score</span>
                  <span class="text-gray-600 fw-semobold fs-7">
                    {{ stats.averageOverallScore?.toFixed(1) || 'N/A' }} / 5.0
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-3">
          <div class="card bg-light-success card-xl-stretch mb-xl-8">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="symbol symbol-50px me-3">
                  <div class="symbol-label bg-success">
                    <i class="bi bi-check-circle-fill text-white fs-2x"></i>
                  </div>
                </div>
                <div class="d-flex flex-column">
                  <span class="text-gray-800 fw-bold fs-6">Completed Reviews</span>
                  <span class="text-gray-600 fw-semobold fs-7">
                    {{ stats.completedReviews || 0 }} of {{ stats.totalReviews || 0 }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-3">
          <div class="card bg-light-warning card-xl-stretch mb-xl-8">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="symbol symbol-50px me-3">
                  <div class="symbol-label bg-warning">
                    <i class="bi bi-clock-fill text-white fs-2x"></i>
                  </div>
                </div>
                <div class="d-flex flex-column">
                  <span class="text-gray-800 fw-bold fs-6">Pending Reviews</span>
                  <span class="text-gray-600 fw-semobold fs-7">
                    {{ stats.pendingReviews || 0 }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-3">
          <div class="card bg-light-info card-xl-stretch mb-xl-8">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="symbol symbol-50px me-3">
                  <div class="symbol-label bg-info">
                    <i class="bi bi-calendar-event-fill text-white fs-2x"></i>
                  </div>
                </div>
                <div class="d-flex flex-column">
                  <span class="text-gray-800 fw-bold fs-6">Next Review</span>
                  <span class="text-gray-600 fw-semobold fs-7">
                    {{ formatDate(stats.nextReviewDate) || 'Not scheduled' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--end::Stats Cards-->

      <!--begin::Detailed Stats-->
      <div class="row g-5 g-xl-8 mb-5">
        <div class="col-xl-6">
          <div class="card card-xl-stretch mb-xl-8">
            <div class="card-header border-0 pt-5">
              <h3 class="card-title align-items-start flex-column">
                <span class="card-label fw-bold fs-3 mb-1">Score Breakdown</span>
              </h3>
            </div>
            <div class="card-body">
              <div class="d-flex flex-column gap-3">
                <div class="d-flex justify-content-between align-items-center">
                  <span class="fw-semobold">Technical Skills</span>
                  <div class="d-flex align-items-center">
                    <div class="progress h-8px w-100px me-3">
                      <div 
                        class="progress-bar bg-primary" 
                        :style="{ width: `${(stats.averageTechnicalScore || 0) * 20}%` }"
                      ></div>
                    </div>
                    <span class="fw-bold">{{ stats.averageTechnicalScore?.toFixed(1) || 'N/A' }}/5.0</span>
                  </div>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                  <span class="fw-semobold">Soft Skills</span>
                  <div class="d-flex align-items-center">
                    <div class="progress h-8px w-100px me-3">
                      <div 
                        class="progress-bar bg-success" 
                        :style="{ width: `${(stats.averageSoftSkillScore || 0) * 20}%` }"
                      ></div>
                    </div>
                    <span class="fw-bold">{{ stats.averageSoftSkillScore?.toFixed(1) || 'N/A' }}/5.0</span>
                  </div>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                  <span class="fw-semobold">Leadership</span>
                  <div class="d-flex align-items-center">
                    <div class="progress h-8px w-100px me-3">
                      <div 
                        class="progress-bar bg-warning" 
                        :style="{ width: `${(stats.averageLeadershipScore || 0) * 20}%` }"
                      ></div>
                    </div>
                    <span class="fw-bold">{{ stats.averageLeadershipScore?.toFixed(1) || 'N/A' }}/5.0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-6">
          <div class="card card-xl-stretch mb-xl-8">
            <div class="card-header border-0 pt-5">
              <h3 class="card-title align-items-start flex-column">
                <span class="card-label fw-bold fs-3 mb-1">Recent Activity</span>
              </h3>
            </div>
            <div class="card-body">
              <div v-if="recentReviews.length === 0" class="text-center py-5">
                <i class="bi bi-inbox text-gray-400" style="font-size: 3rem;"></i>
                <p class="text-gray-600 mt-3">No recent reviews</p>
              </div>
              <div v-else class="d-flex flex-column gap-3">
                <div 
                  v-for="review in recentReviews.slice(0, 3)" 
                  :key="review.id"
                  class="d-flex align-items-center p-3 border rounded"
                >
                  <div class="symbol symbol-40px me-3">
                    <div class="symbol-label" :class="getStatusColor(review.status)">
                      <i class="bi" :class="getStatusIcon(review.status)"></i>
                    </div>
                  </div>
                  <div class="d-flex flex-column flex-grow-1">
                    <span class="fw-bold">{{ review.reviewPeriod }}</span>
                    <span class="text-muted fs-7">{{ formatDate(review.reviewDate) }}</span>
                  </div>
                  <div class="d-flex align-items-center">
                    <span class="badge" :class="getStatusBadgeClass(review.status)">
                      {{ review.status }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--end::Detailed Stats-->

      <!--begin::Reviews Table-->
      <div class="card">
        <div class="card-header border-0 pt-5">
          <h3 class="card-title align-items-start flex-column">
            <span class="card-label fw-bold fs-3 mb-1">All Reviews</span>
          </h3>
          <div class="card-toolbar">
            <div class="d-flex align-items-center position-relative">
              <i class="bi bi-search position-absolute ms-3"></i>
              <input
                v-model="searchTerm"
                type="text"
                class="form-control form-control-solid w-250px ps-9"
                placeholder="Search reviews..."
              />
            </div>
          </div>
        </div>
        <div class="card-body">
          <div v-if="filteredReviews.length === 0" class="text-center py-10">
            <i class="bi bi-inbox text-gray-400" style="font-size: 4rem;"></i>
            <h4 class="text-gray-600 mt-3">No reviews found</h4>
            <p class="text-gray-500">No performance reviews match your search criteria.</p>
          </div>
          <div v-else class="table-responsive">
            <table class="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
              <thead>
                <tr class="fw-bold text-muted">
                  <th class="min-w-150px">Review Period</th>
                  <th class="min-w-100px">Reviewer</th>
                  <th class="min-w-100px">Overall Score</th>
                  <th class="min-w-100px">Status</th>
                  <th class="min-w-100px">Review Date</th>
                  <th class="min-w-100px">Next Review</th>
                  <th class="min-w-100px text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="review in filteredReviews" :key="review.id">
                  <td>
                    <div class="d-flex align-items-center">
                      <div class="d-flex justify-content-start flex-column">
                        <span class="text-dark fw-bold text-hover-primary mb-1 fs-6">
                          {{ review.reviewPeriod }}
                        </span>
                        <span class="text-muted fw-semobold d-block fs-7">
                          {{ review.reviewer?.firstName }} {{ review.reviewer?.lastName }}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="text-dark fw-bold text-hover-primary d-block fs-6">
                      {{ review.reviewer?.firstName }} {{ review.reviewer?.lastName }}
                    </span>
                    <span class="text-muted fw-semobold d-block fs-7">
                      {{ review.reviewer?.email }}
                    </span>
                  </td>
                  <td>
                    <div class="d-flex align-items-center">
                      <div class="d-flex align-items-center">
                        <div class="progress h-8px w-50px me-3">
                          <div 
                            class="progress-bar" 
                            :class="getScoreColor(review.overallScore)"
                            :style="{ width: `${(review.overallScore || 0) * 20}%` }"
                          ></div>
                        </div>
                        <span class="fw-bold">{{ review.overallScore?.toFixed(1) || 'N/A' }}/5.0</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="badge" :class="getStatusBadgeClass(review.status)">
                      {{ review.status }}
                    </span>
                  </td>
                  <td>
                    <span class="text-dark fw-bold text-hover-primary d-block fs-6">
                      {{ formatDate(review.reviewDate) }}
                    </span>
                  </td>
                  <td>
                    <span class="text-dark fw-bold text-hover-primary d-block fs-6">
                      {{ formatDate(review.nextReviewDate) || 'Not scheduled' }}
                    </span>
                  </td>
                  <td class="text-end">
                                         <button
                       @click="viewReview(review)"
                       class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                       title="View Details"
                       data-bs-toggle="modal"
                       data-bs-target="#kt_modal_performance_review_details"
                     >
                       <i class="bi bi-eye"></i>
                     </button>
                     <button
                       v-if="canManageReviews"
                       @click="editReview(review)"
                       class="btn btn-icon btn-bg-light btn-active-color-warning btn-sm me-1"
                       :title="review.status !== 'DRAFT' ? `Edit ${review.status} Review (Admin Only)` : 'Edit Review'"
                       data-bs-toggle="modal"
                       data-bs-target="#kt_modal_performance_review"
                     >
                       <i class="bi bi-pencil"></i>
                     </button>
                    <button
                      v-if="canManageReviews"
                      @click="deleteReview(review)"
                      class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm"
                      :title="review.status !== 'DRAFT' ? `Delete ${review.status} Review (Admin Only)` : 'Delete Review'"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <!--end::Reviews Table-->
    </div>
    <!--end::Content-->

         <!-- Modals -->
     <PerformanceReviewModal 
       :employee-id="employeeId"
       :review="editingReview"
       :close-modal="() => closeModal('kt_modal_performance_review')"
       @review-created="onReviewCreated"
       @review-updated="onReviewUpdated"
     />
     <PerformanceReviewDetailsModal 
       :review="selectedReview"
     />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, inject } from 'vue';
import { useRoute } from 'vue-router';
import { useCurrentUser } from '@/core/composables/useCurrentUser';
import { 
  getPerformanceReviewsByEmployee, 
  getEmployeePerformanceStats,
  deletePerformanceReview,
  getPerformanceReviewById,
  type PerformanceReview,
  type PerformanceReviewStats
} from '@/core/services/businessServices/PerformanceReview';
import { 
  getStatusLabel,
  getStatusClass,
  getScoreLabel
} from '@/core/utils/performanceReviewOptions';
import { PerformanceReviewStatus } from '@/core/models/enums';
import Swal from 'sweetalert2';
import PerformanceReviewModal from '@/components/employee/PerformanceReviewModal.vue';
import PerformanceReviewDetailsModal from '@/components/employee/PerformanceReviewDetailsModal.vue';

export default defineComponent({
  name: 'EmployeePerformanceReview',
  components: {
    PerformanceReviewModal,
    PerformanceReviewDetailsModal,
  },
  setup() {
    const route = useRoute();
    const { currentUser } = useCurrentUser();
    
    // Inject employee data from parent
    const employee = inject('employee', ref(null));
    
    // Reactive data
    const loading = ref(false);
    const error = ref<string | null>(null);
    const reviews = ref<PerformanceReview[]>([]);
    const stats = ref<PerformanceReviewStats>({
      averageOverallScore: 0,
      averageTechnicalScore: 0,
      averageSoftSkillScore: 0,
      averageLeadershipScore: 0,
      totalReviews: 0,
      completedReviews: 0,
      pendingReviews: 0
    });
    const searchTerm = ref('');
         const selectedReview = ref<PerformanceReview | null>(null);
     const editingReview = ref<PerformanceReview | null>(null);

    // Computed properties
    const employeeId = computed(() => route.params.id as string);
    
    const canManageReviews = computed(() => {
      try {
        if (!currentUser.value || !currentUser.value.userRoles || !Array.isArray(currentUser.value.userRoles)) return false;
        return currentUser.value.userRoles.some(role => role.name === 'admin' || role.name === 'superadmin');
      } catch (error) {
        console.error('Error checking performance review management permissions:', error);
        return false;
      }
    });

    const filteredReviews = computed(() => {
      if (!searchTerm.value) return reviews.value;
      
      const term = searchTerm.value.toLowerCase();
      return reviews.value.filter(review => 
        review.reviewPeriod.toLowerCase().includes(term) ||
        review.reviewer?.firstName?.toLowerCase().includes(term) ||
        review.reviewer?.lastName?.toLowerCase().includes(term) ||
        review.status.toLowerCase().includes(term)
      );
    });

         const recentReviews = computed(() => {
       return reviews.value
         .sort((a, b) => new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime())
         .slice(0, 5);
     });

    // Methods
    const loadReviews = async () => {
      if (!employeeId.value) return;
      
      loading.value = true;
      error.value = null;
      
      try {
        const [reviewsData, statsData] = await Promise.all([
          getPerformanceReviewsByEmployee(employeeId.value),
          getEmployeePerformanceStats(employeeId.value)
        ]);
        
        if (reviewsData) {
          reviews.value = reviewsData;
        }
        
        if (statsData) {
          stats.value = statsData;
        }
      } catch (err) {
        console.error('Failed to load performance reviews:', err);
        error.value = 'Failed to load performance reviews. Please try again.';
      } finally {
        loading.value = false;
      }
    };

    const formatDate = (dateString: string | undefined) => {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'COMPLETED': return 'bg-success';
        case 'APPROVED': return 'bg-primary';
        case 'SUBMITTED': return 'bg-warning';
        case 'DRAFT': return 'bg-gray-300';
        default: return 'bg-gray-300';
      }
    };

    const getStatusIcon = (status: string) => {
      switch (status) {
        case 'COMPLETED': return 'bi-check-circle-fill';
        case 'APPROVED': return 'bi-check-circle';
        case 'SUBMITTED': return 'bi-clock-fill';
        case 'DRAFT': return 'bi-pencil';
        default: return 'bi-question-circle';
      }
    };

         const getStatusBadgeClass = (status: string) => {
       return getStatusClass(status as PerformanceReviewStatus);
     };

    const getScoreColor = (score: number | undefined) => {
      if (!score) return 'bg-gray-300';
      if (score >= 4) return 'bg-success';
      if (score >= 3) return 'bg-warning';
      return 'bg-danger';
    };

              const viewReview = (review: PerformanceReview) => {
       selectedReview.value = review;
     };

     const editReview = async (review: PerformanceReview) => {
       try {
         // Get the full review data
         const fullReview = await getPerformanceReviewById(review.id);
         if (!fullReview) {
           Swal.fire({
             title: 'Error!',
             text: 'Failed to load review details for editing.',
             icon: 'error'
           });
           return;
         }
         editingReview.value = fullReview;
       } catch (error) {
         console.error('Failed to load review for editing:', error);
         Swal.fire({
           title: 'Error!',
           text: 'Failed to load review details for editing.',
           icon: 'error'
         });
       }
     };

    const deleteReview = async (review: PerformanceReview) => {
      const isAdvancedStatus = review.status !== 'DRAFT';
      const result = await Swal.fire({
        title: 'Delete Review?',
        text: isAdvancedStatus 
          ? `Are you sure you want to delete this ${review.status.toLowerCase()} performance review? This action cannot be undone and will remove all progress.`
          : 'Are you sure you want to delete this performance review? This action cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it',
        cancelButtonText: 'Cancel'
      });

      if (!result.isConfirmed) return;

      try {
        const success = await deletePerformanceReview(review.id);
        if (success) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Performance review has been deleted.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          });
          await loadReviews();
        } else {
          throw new Error('Failed to delete review');
        }
      } catch (error) {
        console.error('Failed to delete review:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete performance review. Please try again.',
          icon: 'error'
        });
      }
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

     const onReviewCreated = (review: PerformanceReview) => {
       loadReviews();
     };

     const onReviewUpdated = (review: PerformanceReview) => {
       loadReviews();
     };

              // Lifecycle
     onMounted(() => {
       loadReviews();
     });

         return {
       loading,
       error,
       reviews,
       stats,
       searchTerm,
       selectedReview,
       employeeId,
       canManageReviews,
       filteredReviews,
       recentReviews,
       editingReview,
       loadReviews,
       formatDate,
       getStatusColor,
       getStatusIcon,
       getStatusBadgeClass,
       getScoreColor,
       viewReview,
       editReview,
       deleteReview,
       closeModal,
       onReviewCreated,
       onReviewUpdated
     };
  }
});
</script>

<style scoped>
.progress {
  background-color: #f1f1f2;
}

.progress-bar {
  transition: width 0.6s ease;
}

.badge {
  font-size: 0.75rem;
}

.table > :not(caption) > * > * {
  padding: 1rem 0.75rem;
}

.modal-dialog {
  max-width: 800px;
}

.modal-xl {
  max-width: 1140px;
}
</style> 