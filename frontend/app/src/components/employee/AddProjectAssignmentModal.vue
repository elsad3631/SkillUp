<template>
  <div
    class="modal fade"
    id="kt_modal_add_project_assignment"
    ref="addProjectAssignmentModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content">
        <div class="modal-header" id="kt_modal_add_project_assignment_header">
          <h2 class="fw-bold">Assign Projects to Employee</h2>
          <div
            id="kt_modal_add_project_assignment_close"
            data-bs-dismiss="modal"
            class="btn btn-icon btn-sm btn-active-icon-primary"
          >
            <KTIcon icon-name="cross" icon-class="fs-1" />
          </div>
        </div>

        <div class="modal-body px-5 my-7">
          <!--begin::Form-->
          <form
            id="kt_modal_add_project_assignment_form"
            class="form"
            @submit.prevent="submit()"
          >
            <!--begin::Scroll-->
            <div
              class="d-flex flex-column scroll-y me-n7 pe-7"
              id="kt_modal_add_project_assignment_scroll"
              data-kt-scroll="true"
              data-kt-scroll-activate="{default: false, lg: true}"
              data-kt-scroll-max-height="auto"
              data-kt-scroll-dependencies="#kt_modal_add_project_assignment_header"
              data-kt-scroll-wrappers="#kt_modal_add_project_assignment_scroll"
              data-kt-scroll-offset="300px"
            >
              <!--begin::Input group-->
              <div class="fv-row mb-7">
                <label class="required fw-semobold fs-6 mb-2">Available Projects</label>
                
                <!--begin::Loading state-->
                <div v-if="projectsLoading" class="d-flex align-items-center">
                  <div class="spinner-border spinner-border-sm me-3" role="status"></div>
                  <span>Loading projects...</span>
                </div>
                <!--end::Loading state-->
                
                <!--begin::Projects list-->
                <div v-else class="border rounded p-3" style="max-height: 250px; overflow-y: auto;">
                  <div 
                    v-for="project in availableProjects" 
                    :key="project.id"
                    class="form-check mb-3"
                  >
                    <input 
                      :id="`project_${project.id}`"
                      v-model="formData.selectedProjects"
                      :value="project.id"
                      class="form-check-input" 
                      type="checkbox"
                    />
                    <label 
                      :for="`project_${project.id}`" 
                      class="form-check-label d-flex flex-column"
                    >
                      <span class="fw-bold">{{ project.name }}</span>
                      <span class="text-muted fs-7">{{ project.description }}</span>
                      <span class="text-gray-600 fs-8">
                        Status: {{ project.status }} | 
                        Budget: {{ formatBudget(project.budget) }}
                      </span>
                    </label>
                  </div>
                  
                  <div v-if="availableProjects.length === 0" class="text-center text-muted py-3">
                    No projects available for assignment
                  </div>
                </div>
                <!--end::Projects list-->
              </div>
              <!--end::Input group-->

              <!--begin::Assignment details (shown when projects selected)-->
              <div v-if="formData.selectedProjects.length > 0">
                <!--begin::Role-->
                <div class="fv-row mb-7">
                  <label class="required fw-semobold fs-6 mb-2">Role on Project(s)</label>
                  <select
                    v-model="formData.roleOnProject"
                    class="form-select"
                    data-control="select2"
                    data-placeholder="Select a role..."
                  >
                    <option value="">Select role...</option>
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

                <!--begin::Start Date-->
                <div class="fv-row mb-7">
                  <label class="required fw-semobold fs-6 mb-2">Assignment Start Date</label>
                  <input
                    v-model="formData.assignmentStartDate"
                    type="date"
                    class="form-control"
                    placeholder="Start date"
                  />
                </div>
                <!--end::Start Date-->

                <!--begin::End Date-->
                <div class="fv-row mb-7">
                  <label class="fw-semobold fs-6 mb-2">Assignment End Date (Optional)</label>
                  <input
                    v-model="formData.assignmentEndDate"
                    type="date"
                    class="form-control"
                    placeholder="End date (optional)"
                  />
                </div>
                <!--end::End Date-->

                <!--begin::Allocation Percentage-->
                <div class="fv-row mb-7">
                  <label class="required fw-semobold fs-6 mb-2">Allocation Percentage</label>
                  <div class="input-group">
                    <input
                      v-model.number="formData.allocationPercentage"
                      type="number"
                      min="1"
                      max="100"
                      class="form-control"
                      placeholder="50"
                    />
                    <span class="input-group-text">%</span>
                  </div>
                  <div class="form-text">Percentage of time allocated to this project</div>
                </div>
                <!--end::Allocation Percentage-->

                <!--begin::Status-->
                <div class="fv-row mb-7">
                  <label class="required fw-semobold fs-6 mb-2">Assignment Status</label>
                  <select
                    v-model="formData.status"
                    class="form-select"
                    data-control="select2"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>
                <!--end::Status-->
              </div>
              <!--end::Assignment details-->
            </div>
            <!--end::Scroll-->

            <!--begin::Actions-->
            <div class="text-center pt-15">
              <button
                type="reset"
                id="kt_modal_add_project_assignment_cancel"
                class="btn btn-light me-3"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>

              <button
                :disabled="!isFormValid || isLoading"
                type="submit"
                id="kt_modal_add_project_assignment_submit"
                class="btn btn-primary"
              >
                <span v-if="!isLoading" class="indicator-label">
                  Assign {{ formData.selectedProjects.length }} Project(s)
                </span>
                <span v-if="isLoading" class="indicator-progress">
                  Please wait...
                  <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
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
import { defineComponent, ref, onMounted, computed, watch } from "vue";
import { getProjects, assignProjectToEmployee } from "@/core/services/businessServices/Project";
import type { Project } from "@/core/models/Project";
import { hideModal } from "@/core/helpers/dom";
import Swal from "sweetalert2/dist/sweetalert2.js";

export default defineComponent({
  name: "AddProjectAssignmentModal",
  props: {
    employeeId: {
      type: String,
      required: true,
    },
    assignedProjectIds: {
      type: Array as () => string[],
      default: () => [],
    },
  },
  emits: {
    assignmentCreated: () => true,
  },
  setup(props, { emit }) {
    const addProjectAssignmentModalRef = ref<HTMLElement | null>(null);
    const isLoading = ref(false);
    const projectsLoading = ref(false);
    const availableProjects = ref<Project[]>([]);
    
    const formData = ref({
      selectedProjects: [] as string[],
      roleOnProject: "Developer",
      assignmentStartDate: "",
      assignmentEndDate: "",
      allocationPercentage: 50,
      status: "Active",
    });

    // Computed property per validazione form
    const isFormValid = computed(() => {
      return (
        formData.value.selectedProjects.length > 0 &&
        formData.value.roleOnProject &&
        formData.value.assignmentStartDate &&
        formData.value.allocationPercentage > 0 &&
        formData.value.allocationPercentage <= 100 &&
        formData.value.status
      );
    });

    // Carica progetti disponibili
    const loadAvailableProjects = async () => {
      projectsLoading.value = true;
      try {
        const projects = await getProjects();
        if (projects) {
          // Filtra progetti già assegnati
          availableProjects.value = projects.filter(
            (project) => !props.assignedProjectIds.includes(project.id || "")
          );
        }
      } catch (error) {
        console.error("Error loading projects:", error);
      } finally {
        projectsLoading.value = false;
      }
    };

    // Formatta budget
    const formatBudget = (budget: number | undefined) => {
      if (!budget) return "N/A";
      return new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "EUR",
      }).format(budget);
    };

    // Reset form quando si chiude la modal
    const resetForm = () => {
      formData.value = {
        selectedProjects: [],
        roleOnProject: "Developer",
        assignmentStartDate: "",
        assignmentEndDate: "",
        allocationPercentage: 50,
        status: "Active",
      };
    };

    // Submit form
    const submit = async () => {
      if (!isFormValid.value) return;

      isLoading.value = true;
      
      try {
        let successCount = 0;
        
        // Crea un'assegnazione per ogni progetto selezionato
        for (const projectId of formData.value.selectedProjects) {
          const assignmentData = {
            applicationUserId: props.employeeId,
            projectId: projectId,
            roleOnProject: formData.value.roleOnProject,
            assignmentStartDate: formData.value.assignmentStartDate,
            assignmentEndDate: formData.value.assignmentEndDate || undefined,
            allocationPercentage: formData.value.allocationPercentage,
            status: formData.value.status,
          };

          const result = await assignProjectToEmployee(assignmentData);
          if (result) {
            successCount++;
          }
        }

        if (successCount > 0) {
          // Chiudi modal
          hideModal(addProjectAssignmentModalRef.value);
          
          // Mostra messaggio di successo
          Swal.fire({
            title: "Success!",
            text: `Successfully assigned ${successCount} project(s) to employee`,
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });

          // Emetti evento per aggiornare la lista
          emit("assignmentCreated");
          
          // Reset form
          resetForm();
        } else {
          throw new Error("Failed to create assignments");
        }
      } catch (error) {
        console.error("Error creating assignments:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to assign projects. Please try again.",
          icon: "error",
        });
      } finally {
        isLoading.value = false;
      }
    };

    // Watch per ricaricare progetti quando cambiano quelli assegnati
    watch(() => props.assignedProjectIds, loadAvailableProjects, { deep: true });

    onMounted(() => {
      loadAvailableProjects();
      
      // Imposta data di inizio di default a oggi
      const today = new Date().toISOString().split('T')[0];
      formData.value.assignmentStartDate = today;
    });

    return {
      addProjectAssignmentModalRef,
      isLoading,
      projectsLoading,
      availableProjects,
      formData,
      isFormValid,
      submit,
      resetForm,
      formatBudget,
    };
  },
});
</script> 