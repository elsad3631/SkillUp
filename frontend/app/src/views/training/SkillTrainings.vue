<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        <h3 class="fw-bold">Skill Trainings</h3>
        <span class="text-muted fs-6">({{ trainings.length }})</span>
      </div>
      <div class="card-toolbar">
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#kt_modal_training" @click="editingTraining = null">
          <KTIcon icon-name="plus" icon-class="fs-2" />
          New Training
        </button>
      </div>
    </div>

    <div class="card-body">
      <!-- Filters -->
      <div class="row mb-6">
        <div class="col-md-4">
          <label class="form-label">Difficulty Level</label>
          <select v-model="filters.level" class="form-select">
            <option value="">All Levels</option>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
            <option value="EXPERT">Expert</option>
          </select>
        </div>
        <div class="col-md-4">
          <label class="form-label">Provider</label>
          <input v-model="filters.provider" type="text" class="form-control" placeholder="Search by provider..." />
        </div>
        <div class="col-md-4 d-flex align-items-end">
          <button @click="clearFilters" class="btn btn-light me-2">Clear</button>
          <button @click="applyFilters" class="btn btn-primary">Apply</button>
        </div>
      </div>

      <!-- Trainings Table -->
      <div class="table-responsive">
        <table class="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
          <thead>
            <tr class="fw-bold text-muted">
              <th class="w-25px">
                <div class="form-check form-check-sm form-check-custom form-check-solid">
                  <input class="form-check-input" type="checkbox" v-model="selectAll" @change="toggleSelectAll" />
                </div>
              </th>
              <th class="min-w-200px">Training</th>
              <th class="min-w-150px">Provider</th>
              <th class="min-w-100px">Level</th>
              <th class="min-w-100px">Duration</th>
              <th class="min-w-100px">Cost</th>
              <th class="text-end min-w-100px">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="training in filteredTrainings" :key="training.id">
              <td>
                <div class="form-check form-check-sm form-check-custom form-check-solid">
                  <input class="form-check-input" type="checkbox" v-model="selectedTrainings" :value="training.id" />
                </div>
              </td>
              <td>
                <div class="d-flex flex-column">
                  <span class="text-dark fw-bold text-h6 mb-1">{{ training.title }}</span>
                  <span v-if="training.description" class="text-muted fw-semibold text-muted d-block fs-7">
                    {{ training.description }}
                  </span>
                </div>
              </td>
              <td>
                <span class="text-dark fw-bold text-h6 mb-1">{{ training.provider || 'N/A' }}</span>
              </td>
              <td>
                <span :class="getLevelBadgeClass(training.level || 'BEGINNER')" class="badge">
                  {{ getDifficultyLabel(training.level || 'BEGINNER') }}
                </span>
              </td>
              <td>
                <span class="fw-bold fs-7">{{ training.estimatedDurationHours }}h</span>
              </td>
              <td>
                <span v-if="training.cost" class="fw-bold fs-7">€{{ training.cost }}</span>
                <span v-else class="text-muted fs-7">Free</span>
              </td>
              <td class="text-end">
                <button @click="editTraining(training)" type="button" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-2" data-bs-toggle="modal" data-bs-target="#kt_modal_training">
                  <KTIcon icon-name="pencil" icon-class="fs-3" />
                </button>
                <button @click="handleDeleteTraining(training.id)" class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm">
                  <KTIcon icon-name="trash" icon-class="fs-3" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="filteredTrainings.length === 0" class="text-center py-10">
        <KTIcon icon-name="education" icon-class="fs-2hx text-muted mb-5" />
        <h3 class="text-muted mb-2">No trainings found</h3>
        <p class="text-muted">Create your first training program to get started.</p>
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#kt_modal_training" @click="editingTraining = null">
          <KTIcon icon-name="plus" icon-class="fs-2" />
          Create Training
        </button>
      </div>
    </div>

    <!-- Training Modal -->
    <TrainingModal
      :is-editing="!!editingTraining"
      :training="editingTraining"
      :loading="saving"
      :close-modal="() => closeModal('kt_modal_training')"
      @close="closeTrainingModal"
      @submit="saveTraining"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import KTIcon from "@/core/helpers/kt-icon/KTIcon.vue";
import TrainingModal from "@/components/modals/forms/TrainingModal.vue";
import { 
  getTrainings, 
  createTraining, 
  updateTraining, 
  deleteTraining,
  type Training 
} from "@/core/services/businessServices/Training";
import Swal from "sweetalert2/dist/sweetalert2.js";

export default defineComponent({
  name: "skill-trainings",
  components: {
    KTIcon,
    TrainingModal,
  },
  setup() {
    const trainings = ref<Training[]>([]);
    const editingTraining = ref<Training | null>(null);
    const saving = ref(false);
    const selectedTrainings = ref<string[]>([]);
    const selectAll = ref(false);

    const filters = ref({
      level: "",
      provider: "",
    });

    const filteredTrainings = computed(() => {
      let filtered = trainings.value;

      if (filters.value.level) {
        filtered = filtered.filter(t => t.level === filters.value.level);
      }
      if (filters.value.provider) {
        filtered = filtered.filter(t => 
          t.provider?.toLowerCase().includes(filters.value.provider.toLowerCase())
        );
      }

      return filtered;
    });

    const getDifficultyLabel = (level: string): string => {
      switch (level) {
        case 'BEGINNER': return 'Beginner';
        case 'INTERMEDIATE': return 'Intermediate';
        case 'ADVANCED': return 'Advanced';
        case 'EXPERT': return 'Expert';
        default: return level;
      }
    };

    const getLevelBadgeClass = (level: string): string => {
      switch (level) {
        case 'BEGINNER': return 'badge-light-success';
        case 'INTERMEDIATE': return 'badge-light-primary';
        case 'ADVANCED': return 'badge-light-warning';
        case 'EXPERT': return 'badge-light-danger';
        default: return 'badge-light-secondary';
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
        Swal.fire('Error', 'Failed to fetch trainings.', 'error');
      }
    };

    const editTraining = (training: Training) => {
      editingTraining.value = training;
    };

    const saveTraining = async (formData: any) => {
      if (!formData.title || !formData.level) {
        Swal.fire('Error', 'Please fill in all required fields.', 'error');
        return;
      }

      saving.value = true;
      try {
        if (editingTraining.value) {
          // Update existing training
          const result = await updateTraining(editingTraining.value.id, formData);
          if (result) {
            const index = trainings.value.findIndex(t => t.id === editingTraining.value!.id);
            if (index !== -1) {
              trainings.value[index] = result;
            }
            Swal.fire('Success', 'Training updated successfully!', 'success');
          }
        } else {
          // Create new training
          const result = await createTraining(formData);
          if (result) {
            trainings.value.unshift(result);
            Swal.fire('Success', 'Training created successfully!', 'success');
          }
        }
        
        closeTrainingModal();
      } catch (error) {
        console.error('Failed to save training:', error);
        Swal.fire('Error', 'Failed to save training.', 'error');
      } finally {
        saving.value = false;
      }
    };

    const handleDeleteTraining = async (id: string) => {
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
          const success = await deleteTraining(id);
          if (success) {
            trainings.value = trainings.value.filter(t => t.id !== id);
            Swal.fire('Deleted!', 'Training has been deleted.', 'success');
          }
        } catch (error) {
          console.error('Failed to delete training:', error);
          Swal.fire('Error', 'Failed to delete training.', 'error');
        }
      }
    };

    const closeTrainingModal = () => {
      editingTraining.value = null;
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



    const clearFilters = () => {
      filters.value = {
        level: "",
        provider: "",
      };
    };

    const applyFilters = () => {
      // Filters are applied automatically via computed property
    };

    const toggleSelectAll = () => {
      if (selectAll.value) {
        selectedTrainings.value = filteredTrainings.value.map(t => t.id);
      } else {
        selectedTrainings.value = [];
      }
    };

    onMounted(() => {
      fetchTrainings();
    });

    return {
      trainings,
      editingTraining,
      saving,
      selectedTrainings,
      selectAll,
      filters,
      filteredTrainings,
      getDifficultyLabel,
      getLevelBadgeClass,
      fetchTrainings,
      editTraining,
      saveTraining,
      handleDeleteTraining,
      closeTrainingModal,
      closeModal,
      clearFilters,
      applyFilters,
      toggleSelectAll,
    };
  },
});
</script>

<style scoped>
.modal.show {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
