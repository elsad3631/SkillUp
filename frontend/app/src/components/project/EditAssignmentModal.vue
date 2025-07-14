<template>
  <div
    class="modal fade"
    id="kt_modal_edit_assignment"
    ref="editAssignmentModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content rounded-3 overflow-hidden">
        <!--begin::Header with gradient-->
        <div class="modal-header bg-gradient-warning text-white position-relative border-0 py-8">
          <div class="d-flex align-items-center">
            <div class="symbol symbol-50px me-4">
              <div class="symbol-label bg-white bg-opacity-20">
                <i class="ki-duotone ki-setting-3 fs-2x text-white">
                  <span class="path1"></span>
                  <span class="path2"></span>
                  <span class="path3"></span>
                  <span class="path4"></span>
                  <span class="path5"></span>
                </i>
              </div>
            </div>
            <div>
              <h2 class="fw-bold text-white mb-1">Edit Assignment</h2>
              <p class="text-white-75 mb-0 fs-6">Modify project assignment details</p>
            </div>
          </div>
          <button
            type="button"
            class="btn btn-icon btn-sm btn-color-white btn-active-color-primary ms-2"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i class="ki-duotone ki-cross fs-1">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
          </button>
          
          <!--begin::Decorative elements-->
          <div class="position-absolute top-0 end-0 opacity-20">
            <i class="ki-duotone ki-abstract-13 fs-8x text-white">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
          </div>
          <!--end::Decorative elements-->
        </div>
        <!--end::Header-->

        <div class="modal-body p-8">
          <!--begin::Form-->
          <form @submit.prevent="submit()" class="form">
            <!--begin::Assignment Details Form-->
            <div class="card border-0 shadow-sm">
              <div class="card-header bg-light-warning border-0 py-4">
                <div class="card-title">
                  <i class="ki-duotone ki-setting-3 fs-2 text-warning me-2">
                    <span class="path1"></span>
                    <span class="path2"></span>
                    <span class="path3"></span>
                    <span class="path4"></span>
                    <span class="path5"></span>
                  </i>
                  <h4 class="fw-bold text-gray-800 mb-0">Assignment Details</h4>
                </div>
              </div>
              
              <div class="card-body p-6">
                <!--begin::Role-->
                <div class="mb-6">
                  <label class="form-label fw-semibold fs-6 mb-2">
                    <i class="ki-duotone ki-profile-user fs-6 text-warning me-2">
                      <span class="path1"></span>
                      <span class="path2"></span>
                      <span class="path3"></span>
                      <span class="path4"></span>
                    </i>
                    Role on Project <span class="text-danger">*</span>
                  </label>
                  <select
                    v-model="formData.roleOnProject"
                    class="form-select form-select-solid"
                  >
                    <option value="Developer">Developer</option>
                    <option value="Senior Developer">Senior Developer</option>
                    <option value="Tech Lead">Tech Lead</option>
                    <option value="Project Manager">Project Manager</option>
                    <option value="Designer">Designer</option>
                    <option value="QA Engineer">QA Engineer</option>
                    <option value="DevOps Engineer">DevOps Engineer</option>
                    <option value="Business Analyst">Business Analyst</option>
                  </select>
                </div>
                <!--end::Role-->

                <!--begin::Assignment Dates-->
                <div class="row mb-6">
                  <div class="col-md-6">
                    <label class="form-label fw-semibold fs-6 mb-2">
                      <i class="ki-duotone ki-calendar fs-6 text-warning me-2">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                      Start Date <span class="text-danger">*</span>
                    </label>
                    <input
                      v-model="formData.assignmentStartDate"
                      type="date"
                      class="form-control form-control-solid"
                      required
                    />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-semibold fs-6 mb-2">
                      <i class="ki-duotone ki-calendar fs-6 text-warning me-2">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                      End Date
                    </label>
                    <input
                      v-model="formData.assignmentEndDate"
                      type="date"
                      class="form-control form-control-solid"
                    />
                  </div>
                </div>
                <!--end::Assignment Dates-->

                <!--begin::Allocation Percentage with visual indicator-->
                <div class="mb-6">
                  <label class="form-label fw-semibold fs-6 mb-2">
                    <i class="ki-duotone ki-chart-pie-4 fs-6 text-info me-2">
                      <span class="path1"></span>
                      <span class="path2"></span>
                      <span class="path3"></span>
                    </i>
                    Allocation Percentage <span class="text-danger">*</span>
                  </label>
                  
                  <div class="input-group input-group-solid">
                    <input
                      v-model.number="formData.allocationPercentage"
                      type="range"
                      min="1"
                      max="100"
                      class="form-range me-3"
                    />
                    <input
                      v-model.number="formData.allocationPercentage"
                      type="number"
                      min="1"
                      max="100"
                      class="form-control form-control-solid w-80px"
                    />
                    <span class="input-group-text">%</span>
                  </div>
                  
                  <!--begin::Progress visualization-->
                  <div class="mt-3">
                    <div class="d-flex justify-content-between mb-2">
                      <span class="fs-7 text-muted">Allocation Progress</span>
                      <span class="fs-7 fw-bold text-gray-800">{{ formData.allocationPercentage }}%</span>
                    </div>
                    <div class="progress h-8px">
                      <div
                        class="progress-bar bg-warning"
                        role="progressbar"
                        :style="{ width: formData.allocationPercentage + '%' }"
                        :aria-valuenow="formData.allocationPercentage"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>
                  <!--end::Progress visualization-->
                </div>
                <!--end::Allocation Percentage-->

                <!--begin::Status-->
                <div class="mb-6">
                  <label class="form-label fw-semibold fs-6 mb-2">
                    <i class="ki-duotone ki-status fs-6 text-warning me-2">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                    Assignment Status <span class="text-danger">*</span>
                  </label>
                  <select
                    v-model="formData.status"
                    class="form-select form-select-solid"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>
                <!--end::Status-->

                <!--begin::Feedback-->
                <div class="mb-6">
                  <label class="form-label fw-semibold fs-6 mb-2">
                    <i class="ki-duotone ki-message-text-2 fs-6 text-warning me-2">
                      <span class="path1"></span>
                      <span class="path2"></span>
                      <span class="path3"></span>
                    </i>
                    Feedback Received
                  </label>
                  <textarea
                    v-model="formData.feedbackReceived"
                    class="form-control form-control-solid"
                    rows="3"
                    placeholder="Enter feedback about this assignment..."
                  ></textarea>
                </div>
                <!--end::Feedback-->
              </div>
            </div>
            <!--end::Assignment Details Form-->

            <!--begin::Actions-->
            <div class="d-flex justify-content-end pt-6 border-top mt-6">
              <button
                type="button"
                class="btn btn-light-warning me-3"
                data-bs-dismiss="modal"
                @click="resetForm"
              >
                <i class="ki-duotone ki-cross fs-6 me-1">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
                Cancel
              </button>

              <button
                :disabled="!isFormValid || isLoading"
                type="submit"
                class="btn btn-warning"
              >
                <span v-if="!isLoading" class="indicator-label">
                  <i class="ki-duotone ki-check fs-6 me-2">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                  Update Assignment
                </span>
                <span v-if="isLoading" class="indicator-progress">
                  <span class="spinner-border spinner-border-sm align-middle me-2"></span>
                  Updating...
                </span>
              </button>
            </div>
            <!--end::Actions-->
          </form>
          <!--end::Form-->
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from "vue";
import { hideModal } from "@/core/helpers/dom";
import { updateProjectAssignment } from "@/core/services/businessServices/Project";
import Swal from "sweetalert2/dist/sweetalert2.js";

export default defineComponent({
  name: "EditAssignmentModal",
  props: {
    assignment: {
      type: Object,
      default: null,
    },
  },
  emits: {
    assignmentUpdated: () => true,
  },
  setup(props, { emit }) {
    const editAssignmentModalRef = ref<HTMLElement | null>(null);
    const isLoading = ref(false);
    
    const formData = ref({
      roleOnProject: "",
      assignmentStartDate: "",
      assignmentEndDate: "",
      allocationPercentage: 50,
      status: "Active",
      feedbackReceived: "",
    });

    // Computed property per validazione form
    const isFormValid = computed(() => {
      return (
        formData.value.roleOnProject &&
        formData.value.assignmentStartDate &&
        formData.value.allocationPercentage > 0 &&
        formData.value.allocationPercentage <= 100 &&
        formData.value.status
      );
    });



    // Popola il form quando cambia l'assignment
    const populateForm = () => {
      if (props.assignment) {
        formData.value = {
          roleOnProject: props.assignment.roleOnProject || "",
          assignmentStartDate: props.assignment.assignmentStartDate 
            ? new Date(props.assignment.assignmentStartDate).toISOString().split('T')[0]
            : "",
          assignmentEndDate: props.assignment.assignmentEndDate 
            ? new Date(props.assignment.assignmentEndDate).toISOString().split('T')[0]
            : "",
          allocationPercentage: props.assignment.allocationPercentage || 50,
          status: props.assignment.status || "Active",
          feedbackReceived: props.assignment.feedbackReceived || "",
        };
      }
    };

    // Reset form
    const resetForm = () => {
      formData.value = {
        roleOnProject: "",
        assignmentStartDate: "",
        assignmentEndDate: "",
        allocationPercentage: 50,
        status: "Active",
        feedbackReceived: "",
      };
    };

    // Submit form
    const submit = async () => {
      if (!isFormValid.value || !props.assignment?.id) return;

      isLoading.value = true;
      
      try {
        const updateData = {
          roleOnProject: formData.value.roleOnProject,
          assignmentStartDate: formData.value.assignmentStartDate,
          assignmentEndDate: formData.value.assignmentEndDate || undefined,
          allocationPercentage: formData.value.allocationPercentage,
          status: formData.value.status,
          feedbackReceived: formData.value.feedbackReceived || undefined,
        };

        const result = await updateProjectAssignment(props.assignment.id, updateData);

        if (result) {
          // Chiudi modal
          hideModal(editAssignmentModalRef.value);
          
          // Mostra messaggio di successo
          Swal.fire({
            title: "Assignment Updated!",
            text: "The assignment has been updated successfully.",
            icon: "success",
            timer: 3000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
          });

          // Emetti evento per aggiornare la lista
          emit("assignmentUpdated");
          
          // Reset form
          resetForm();
        } else {
          throw new Error('Failed to update assignment');
        }
      } catch (error) {
        console.error("Error updating assignment:", error);
        Swal.fire({
          title: "Error!",
          text: "Unable to update the assignment. Please try again.",
          icon: "error",
          confirmButtonText: "OK"
        });
      } finally {
        isLoading.value = false;
      }
    };

    // Watch per popolare il form quando cambia l'assignment
    watch(() => props.assignment, populateForm, { immediate: true });

    return {
      editAssignmentModalRef,
      isLoading,
      formData,
      isFormValid,
      submit,
      resetForm,
    };
  },
});
</script>

<style scoped>
.bg-gradient-warning {
  background: linear-gradient(135deg, #FFC700 0%, #F1C40F 100%);
}

.form-range::-webkit-slider-thumb {
  background-color: #FFC700;
}

.form-range::-moz-range-thumb {
  background-color: #FFC700;
  border: none;
}
</style> 