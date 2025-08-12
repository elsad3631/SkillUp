<template>
  <div class="d-flex flex-column flex-lg-row">
    <div class="flex-lg-row-fluid mb-10 mb-lg-0">
      <div class="card">
        <div class="card-header border-0">
          <div class="card-title m-0">
            <h3 class="fw-bold m-0">Training Programs</h3>
          </div>
                     <div class="card-toolbar">
             <button @click="openCreateTrainingModal()" class="btn btn-primary">
               <KTIcon icon-name="plus" icon-class="fs-2" />
               New Training
             </button>
           </div>
        </div>
        <div class="card-body">
          <div class="row g-6 g-xl-9 mb-6 mb-xl-9">
            <div 
              v-for="training in trainings" 
              :key="training.id"
              class="col-md-6 col-xl-4"
            >
              <div class="card border border-2 border-dashed border-gray-300 h-100">
                <div class="card-body">
                  <div class="d-flex flex-stack mb-3">
                    <div class="badge badge-light-primary">
                      {{ training.level || 'N/A' }}
                    </div>
                    <div class="ms-2">
                                             <button 
                         @click="openEditTrainingModal(training)"
                         class="btn btn-sm btn-icon btn-color-gray-400 btn-active-color-primary"
                       >
                        <KTIcon icon-name="pencil" icon-class="fs-6" />
                      </button>
                      <button 
                        @click="deleteTrainingProgram(training.id)"
                        class="btn btn-sm btn-icon btn-color-gray-400 btn-active-color-danger"
                      >
                        <KTIcon icon-name="trash" icon-class="fs-6" />
                      </button>
                    </div>
                  </div>
                  
                  <div class="mb-2">
                    <h4 class="fs-3 fw-bold text-dark mb-1">{{ training.title }}</h4>
                    <div class="fs-6 fw-semibold text-gray-400 mb-5">
                      {{ training.provider || 'No provider' }}
                    </div>
                  </div>
                  
                  <div class="mb-3">
                    <p class="text-gray-600 fs-6 mb-0">
                      {{ truncateText(training.description || 'No description available', 120) }}
                    </p>
                  </div>
                  
                  <div class="separator separator-dashed my-4"></div>
                  
                  <div class="row mb-3">
                    <div class="col-6">
                      <div class="d-flex align-items-center">
                        <KTIcon icon-name="time" icon-class="fs-4 text-primary me-2" />
                        <span class="fw-bold fs-6">{{ training.estimatedDurationHours }}h</span>
                      </div>
                    </div>
                    <div class="col-6">
                      <div class="d-flex align-items-center">
                        <KTIcon icon-name="euro" icon-class="fs-4 text-success me-2" />
                        <span class="fw-bold fs-6">
                          {{ training.cost !== null && training.cost !== undefined ? `€${training.cost.toFixed(2)}` : 'Free' }}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div v-if="training.skillsDeveloped && training.skillsDeveloped.length > 0" class="mb-3">
                    <div class="fs-7 fw-semibold text-gray-400 mb-2">Skills Developed:</div>
                    <div class="d-flex flex-wrap">
                      <span 
                        v-for="skill in training.skillsDeveloped.slice(0, 3)" 
                        :key="skill"
                        class="badge badge-light-info me-1 mb-1"
                      >
                        {{ skill }}
                      </span>
                      <span 
                        v-if="training.skillsDeveloped.length > 3"
                        class="badge badge-light-secondary"
                      >
                        +{{ training.skillsDeveloped.length - 3 }}
                      </span>
                    </div>
                  </div>
                  
                  <div v-if="training.url" class="mt-auto">
                    <a 
                      :href="training.url" 
                      target="_blank" 
                      class="btn btn-light-primary btn-sm w-100"
                    >
                      View Training
                      <KTIcon icon-name="external-link" icon-class="fs-6 ms-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Empty State -->
          <div v-if="trainings.length === 0" class="text-center py-10">
            <KTIcon icon-name="education" icon-class="fs-2hx text-gray-400 mb-5" />
            <h3 class="text-gray-800 mb-5">No Training Programs</h3>
            <p class="text-gray-600 mb-5">
              Start by creating your first training program to help your team develop new skills.
            </p>
                         <button @click="openCreateTrainingModal()" class="btn btn-primary">
               <KTIcon icon-name="plus" icon-class="fs-2" />
               Create First Training
             </button>
          </div>
        </div>
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
import { defineComponent, ref, onMounted } from "vue";
import KTIcon from "@/core/helpers/kt-icon/KTIcon.vue";
import CreateTrainingModal from "@/components/modals/forms/CreateTrainingModal.vue";
import EditTrainingModal from "@/components/modals/forms/EditTrainingModal.vue";
import { 
  getTrainings,
  createTraining,
  updateTraining,
  deleteTraining,
  getTrainingEnrollmentsByTraining,
  type Training 
} from "@/core/services/businessServices/Training";
import { Modal } from "bootstrap";
import Swal from "sweetalert2/dist/sweetalert2.js";

export default defineComponent({
  name: "training-programs",
  components: {
    KTIcon,
    CreateTrainingModal,
    EditTrainingModal,
  },
  setup() {
    const trainings = ref<Training[]>([]);
    
    // Training modal state
    const showCreateModal = ref(false);
    const showEditModal = ref(false);
    const selectedTraining = ref<Training | null>(null);
    const createModalLoading = ref(false);
    const editModalLoading = ref(false);
    let createModal: Modal;
    let editModal: Modal;

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
      try {
        // First, check if training has enrollments using the Training service
        const enrollments = await getTrainingEnrollmentsByTraining(trainingId);
        
        let hasEnrollments = false;
        let enrollmentCount = 0;

        if (enrollments) {
          hasEnrollments = enrollments.length > 0;
          enrollmentCount = enrollments.length;
        }

        let confirmationConfig;
        if (hasEnrollments) {
          confirmationConfig = {
            title: "Training has active enrollments!",
            html: `
              <div class="text-start">
                <p><strong>Warning:</strong> This training has <strong>${enrollmentCount} active enrollment(s)</strong>.</p>
                <p>Deleting this training will:</p>
                <ul class="text-muted">
                  <li>Permanently remove the training program</li>
                  <li>Delete all associated enrollment records</li>
                  <li>Remove progress and completion data</li>
                </ul>
                <p><strong>This action cannot be undone!</strong></p>
              </div>
            `,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete anyway!",
            cancelButtonText: "Cancel",
            reverseButtons: true,
          };
        } else {
          confirmationConfig = {
            title: "Are you sure?",
            text: "This training will be permanently deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
          };
        }

        const result = await Swal.fire(confirmationConfig);

        if (result.isConfirmed) {
          console.log('✅ User confirmed deletion, proceeding...');
          const deleteResult = await deleteTraining(trainingId);
          console.log('🗑️ Delete result:', deleteResult);
          if (deleteResult) {
            console.log('✅ Training deleted successfully, refreshing list...');
            await fetchTrainings();
            await Swal.fire({
              title: "Deleted!",
              text: hasEnrollments 
                ? `Training and ${enrollmentCount} enrollment(s) have been deleted.`
                : "Training has been deleted.",
              icon: "success",
            });
          } else {
            console.log('❌ Delete failed');
            await Swal.fire({
              title: "Error!",
              text: "Failed to delete training. Please try again.",
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        } else {
          // User cancelled - do nothing
          return;
        }
      } catch (error: any) {
        console.error('Error deleting training:', error);
        
        // Check if it's a constraint error from backend
        const errorMessage = error?.response?.data?.message || error?.message || '';
        
        if (errorMessage.includes('constraint') || errorMessage.includes('foreign key') || errorMessage.includes('reference')) {
          await Swal.fire({
            title: "Cannot Delete Training!",
            html: `
              <div class="text-start">
                <p><strong>This training cannot be deleted because:</strong></p>
                <ul class="text-muted">
                  <li>It has active enrollments or dependencies</li>
                  <li>Other records in the system reference this training</li>
                </ul>
                <p><strong>Suggestions:</strong></p>
                <ul class="text-muted">
                  <li>Cancel all enrollments first</li>
                  <li>Archive the training instead of deleting</li>
                  <li>Contact system administrator for assistance</li>
                </ul>
              </div>
            `,
            icon: "error",
            confirmButtonText: "Understood",
            confirmButtonColor: "#3085d6",
          });
        } else {
          await Swal.fire({
            title: "Error!",
            text: "Failed to delete training. Please try again or contact support.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    };

    onMounted(() => {
      fetchTrainings();
    });

    return {
      trainings,
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
    };
  },
});
</script>
