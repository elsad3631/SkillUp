<template>
  <div
    class="modal fade"
    id="kt_modal_add_project_assignment"
    ref="addProjectAssignmentModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content rounded-3 overflow-hidden">
        <!--begin::Header with gradient-->
        <div class="modal-header bg-gradient-primary text-white position-relative border-0 py-8">
          <div class="d-flex align-items-center">
            <div class="symbol symbol-50px me-4">
              <div class="symbol-label bg-white bg-opacity-20">
                <i class="ki-duotone ki-abstract-26 fs-2x text-white">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
              </div>
            </div>
            <div>
              <h2 class="fw-bold text-white mb-1">Assign Projects</h2>
              <p class="text-white-75 mb-0 fs-6">Allocate projects to employee efficiently</p>
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
            <div class="row">
              <!--begin::Left Column - Projects Selection-->
              <div class="col-lg-7">
                <!--begin::Projects Section-->
                <div class="card border-0 shadow-sm mb-6">
                  <div class="card-header bg-light-primary border-0 py-4">
                    <div class="card-title">
                      <i class="ki-duotone ki-abstract-47 fs-2 text-primary me-2">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                      <h4 class="fw-bold text-gray-800 mb-0">Available Projects</h4>
                    </div>
                    <div class="card-toolbar">
                      <span class="badge badge-light-primary fs-7">
                        {{ filteredProjects.length }} of {{ availableProjects.length }} showing
                      </span>
                    </div>
                  </div>
                  
                  <!--begin::Filters-->
                  <div class="card-body border-bottom bg-light-primary bg-opacity-25 py-4">
                    <div class="row g-3">
                      <!--begin::Search-->
                      <div class="col-md-6">
                        <div class="position-relative">
                          <i class="ki-duotone ki-magnifier fs-3 position-absolute top-50 start-0 translate-middle-y ms-4 text-muted">
                            <span class="path1"></span>
                            <span class="path2"></span>
                          </i>
                          <input
                            v-model="filters.search"
                            type="text"
                            class="form-control form-control-solid ps-12"
                            placeholder="Search projects..."
                          />
                        </div>
                      </div>
                      <!--end::Search-->
                      
                      <!--begin::Status Filter-->
                      <div class="col-md-2">
                        <select
                          v-model="filters.status"
                          class="form-select form-select-solid"
                        >
                          <option value="">All Status</option>
                          <option value="PLANNING">Planning</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="ON_HOLD">On Hold</option>
                          <option value="COMPLETED">Completed</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </div>
                      <!--end::Status Filter-->
                      
                      <!--begin::Priority Filter-->
                      <div class="col-md-2">
                        <select
                          v-model="filters.priority"
                          class="form-select form-select-solid"
                        >
                          <option value="">All Priority</option>
                          <option value="LOW">Low</option>
                          <option value="MEDIUM">Medium</option>
                          <option value="HIGH">High</option>
                          <option value="CRITICAL">Critical</option>
                        </select>
                      </div>
                      <!--end::Priority Filter-->
                      
                      <!--begin::Budget Filter-->
                      <div class="col-md-2">
                        <select
                          v-model="filters.budget"
                          class="form-select form-select-solid"
                        >
                          <option value="">All Budget</option>
                          <option value="0-10000">€0 - €10k</option>
                          <option value="10000-50000">€10k - €50k</option>
                          <option value="50000-100000">€50k - €100k</option>
                          <option value="100000+">€100k+</option>
                        </select>
                      </div>
                      <!--end::Budget Filter-->
                    </div>
                    
                    <!--begin::Active Filters-->
                    <div v-if="hasActiveFilters" class="d-flex flex-wrap gap-2 mt-3">
                      <span class="badge badge-light-info me-2">
                        <i class="ki-duotone ki-filter fs-7 me-1">
                          <span class="path1"></span>
                          <span class="path2"></span>
                        </i>
                        Active Filters:
                      </span>
                      
                      <span v-if="filters.search" class="badge badge-light-primary">
                        Search: "{{ filters.search }}"
                        <i @click="filters.search = ''" class="ki-duotone ki-cross fs-7 ms-1 cursor-pointer">
                          <span class="path1"></span>
                          <span class="path2"></span>
                        </i>
                      </span>
                      
                      <span v-if="filters.status" class="badge badge-light-success">
                        Status: {{ filters.status }}
                        <i @click="filters.status = ''" class="ki-duotone ki-cross fs-7 ms-1 cursor-pointer">
                          <span class="path1"></span>
                          <span class="path2"></span>
                        </i>
                      </span>
                      
                      <span v-if="filters.priority" class="badge badge-light-warning">
                        Priority: {{ filters.priority }}
                        <i @click="filters.priority = ''" class="ki-duotone ki-cross fs-7 ms-1 cursor-pointer">
                          <span class="path1"></span>
                          <span class="path2"></span>
                        </i>
                      </span>
                      
                      <span v-if="filters.budget" class="badge badge-light-info">
                        Budget: {{ getBudgetLabel(filters.budget) }}
                        <i @click="filters.budget = ''" class="ki-duotone ki-cross fs-7 ms-1 cursor-pointer">
                          <span class="path1"></span>
                          <span class="path2"></span>
                        </i>
                      </span>
                      
                      <button @click="clearAllFilters" class="btn btn-sm btn-light-danger">
                        <i class="ki-duotone ki-trash fs-7 me-1">
                          <span class="path1"></span>
                          <span class="path2"></span>
                          <span class="path3"></span>
                          <span class="path4"></span>
                          <span class="path5"></span>
                        </i>
                        Clear All
                      </button>
                    </div>
                    <!--end::Active Filters-->
                  </div>
                  <!--end::Filters-->
                  
                  <div class="card-body p-4">
                    <!--begin::Loading state-->
                    <div v-if="projectsLoading" class="d-flex align-items-center justify-content-center py-10">
                      <div class="d-flex flex-column align-items-center">
                        <div class="spinner-border text-primary mb-3" role="status"></div>
                        <span class="text-muted fw-semibold">Loading projects...</span>
                      </div>
                    </div>
                    <!--end::Loading state-->
                    
                                        <!--begin::Projects grid-->
                    <div v-else class="project-grid" style="max-height: 400px; overflow-y: auto;">
                      <div 
                        v-for="project in filteredProjects" 
                        :key="project.id"
                        class="project-card mb-4"
                        :class="{ 'selected': project.id && formData.selectedProjects.includes(project.id) }"
                      >
                        <div class="form-check">
                          <input 
                            :id="`project_${project.id}`"
                            v-model="formData.selectedProjects"
                            :value="project.id || ''"
                            class="form-check-input" 
                            type="checkbox"
                          />
                          <label 
                            :for="`project_${project.id}`" 
                            class="form-check-label w-100 cursor-pointer"
                          >
                            <div class="d-flex align-items-start">
                              <!--begin::Project Icon-->
                              <div class="symbol symbol-50px me-4 flex-shrink-0">
                                <div class="symbol-label bg-light-info">
                                  <i class="ki-duotone ki-abstract-33 fs-2x text-info">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                  </i>
                                </div>
                              </div>
                              <!--end::Project Icon-->
                              
                              <!--begin::Project Info-->
                              <div class="flex-grow-1">
                                <div class="d-flex justify-content-between align-items-start mb-2">
                                  <h5 class="fw-bold text-gray-800 mb-1">{{ project.name }}</h5>
                                  <span :class="getStatusBadgeClass(project.status || '')" class="badge fs-8">
                                    {{ project.status || 'Unknown' }}
                                  </span>
                                </div>
                                
                                <p class="text-muted mb-2 fs-7 line-clamp-2">
                                  {{ project.description || 'No description available' }}
                                </p>
                                
                                <div class="d-flex flex-wrap gap-2">
                                  <span class="badge badge-light-success fs-8">
                                    <i class="ki-duotone ki-dollar fs-7 me-1">
                                      <span class="path1"></span>
                                      <span class="path2"></span>
                                      <span class="path3"></span>
                                    </i>
                                    {{ formatBudget(project.budget) }}
                                  </span>
                                  
                                  <span v-if="project.priority" class="badge badge-light-warning fs-8">
                                    <i class="ki-duotone ki-flag fs-7 me-1">
                                      <span class="path1"></span>
                                      <span class="path2"></span>
                                    </i>
                                    {{ project.priority }}
                                  </span>
                                </div>
                              </div>
                              <!--end::Project Info-->
                            </div>
                          </label>
                        </div>
                      </div>
                      
                      <!--begin::Empty state-->
                      <div v-if="filteredProjects.length === 0 && availableProjects.length === 0" class="text-center py-10">
                        <div class="mb-4">
                          <i class="ki-duotone ki-file-deleted fs-5x text-muted">
                            <span class="path1"></span>
                            <span class="path2"></span>
                          </i>
                        </div>
                        <h4 class="text-muted fw-semibold">No Projects Available</h4>
                        <p class="text-muted mb-0">All projects are already assigned to this employee</p>
                      </div>
                      
                      <!--begin::No filtered results-->
                      <div v-else-if="filteredProjects.length === 0 && availableProjects.length > 0" class="text-center py-10">
                        <div class="mb-4">
                          <i class="ki-duotone ki-filter-search fs-5x text-muted">
                            <span class="path1"></span>
                            <span class="path2"></span>
                          </i>
                        </div>
                        <h4 class="text-muted fw-semibold">No Projects Match Filters</h4>
                        <p class="text-muted mb-3">Try adjusting your search criteria or clear filters</p>
                        <button @click="clearAllFilters" class="btn btn-light-primary">
                          <i class="ki-duotone ki-eraser fs-6 me-1">
                            <span class="path1"></span>
                            <span class="path2"></span>
                            <span class="path3"></span>
                            <span class="path4"></span>
                          </i>
                          Clear Filters
                        </button>
                      </div>
                      <!--end::No filtered results-->
                    </div>
                    <!--end::Projects grid-->
                  </div>
                </div>
                <!--end::Projects Section-->
              </div>
              <!--end::Left Column-->

              <!--begin::Right Column - Assignment Details-->
              <div class="col-lg-5">
                <!--begin::Assignment Details Card-->
                <div class="card border-0 shadow-sm sticky-top" style="top: 20px;">
                  <div class="card-header bg-light-success border-0 py-4">
                    <div class="card-title">
                      <i class="ki-duotone ki-setting-3 fs-2 text-success me-2">
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
                    <!--begin::Selection Summary-->
                    <div v-if="formData.selectedProjects.length > 0" class="alert alert-primary d-flex align-items-center mb-6">
                      <i class="ki-duotone ki-information-5 fs-2x text-primary me-3">
                        <span class="path1"></span>
                        <span class="path2"></span>
                        <span class="path3"></span>
                      </i>
                      <div>
                        <h6 class="mb-1">{{ formData.selectedProjects.length }} Project(s) Selected</h6>
                        <span class="fs-7 text-muted">Configure assignment details below</span>
                      </div>
                    </div>
                    <!--end::Selection Summary-->

                    <!--begin::Assignment Form-->
                    <div :class="{ 'opacity-50': formData.selectedProjects.length === 0 }">
                      <!--begin::Role-->
                      <div class="mb-6">
                        <label class="form-label fw-semibold fs-6 mb-2">
                          <i class="ki-duotone ki-profile-user fs-6 text-primary me-2">
                            <span class="path1"></span>
                            <span class="path2"></span>
                            <span class="path3"></span>
                            <span class="path4"></span>
                          </i>
                          Role on Project(s) <span class="text-danger">*</span>
                        </label>
                        <select
                          v-model="formData.roleOnProject"
                          class="form-select form-select-solid"
                          :disabled="formData.selectedProjects.length === 0"
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

                      <!--begin::Date Range-->
                      <div class="row mb-6">
                        <div class="col-md-6">
                          <label class="form-label fw-semibold fs-6 mb-2">
                            <i class="ki-duotone ki-calendar-2 fs-6 text-success me-2">
                              <span class="path1"></span>
                              <span class="path2"></span>
                              <span class="path3"></span>
                              <span class="path4"></span>
                              <span class="path5"></span>
                            </i>
                            Start Date <span class="text-danger">*</span>
                          </label>
                          <input
                            v-model="formData.assignmentStartDate"
                            type="date"
                            class="form-control form-control-solid"
                            :disabled="formData.selectedProjects.length === 0"
                          />
                        </div>
                        <div class="col-md-6">
                          <label class="form-label fw-semibold fs-6 mb-2">
                            <i class="ki-duotone ki-calendar-8 fs-6 text-warning me-2">
                              <span class="path1"></span>
                              <span class="path2"></span>
                              <span class="path3"></span>
                              <span class="path4"></span>
                              <span class="path5"></span>
                              <span class="path6"></span>
                            </i>
                            End Date
                          </label>
                          <input
                            v-model="formData.assignmentEndDate"
                            type="date"
                            class="form-control form-control-solid"
                            :disabled="formData.selectedProjects.length === 0"
                          />
                        </div>
                      </div>
                      <!--end::Date Range-->

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
                            :disabled="formData.selectedProjects.length === 0"
                          />
                          <input
                            v-model.number="formData.allocationPercentage"
                            type="number"
                            min="1"
                            max="100"
                            class="form-control form-control-solid w-80px"
                            :disabled="formData.selectedProjects.length === 0"
                          />
                          <span class="input-group-text">%</span>
                        </div>
                        
                        <!--begin::Progress visualization-->
                        <div class="mt-3">
                          <div class="d-flex justify-content-between mb-2">
                            <span class="fs-7 text-muted">Time allocation</span>
                            <span class="fs-7 fw-bold">{{ formData.allocationPercentage }}%</span>
                          </div>
                          <div class="progress h-6px bg-light-primary">
                            <div 
                              class="progress-bar bg-primary" 
                              :style="{ width: formData.allocationPercentage + '%' }"
                            ></div>
                          </div>
                        </div>
                        <!--end::Progress visualization-->
                      </div>
                      <!--end::Allocation Percentage-->

                      <!--begin::Status-->
                      <div class="mb-6">
                        <label class="form-label fw-semibold fs-6 mb-2">
                          <i class="ki-duotone ki-status fs-6 text-primary me-2">
                            <span class="path1"></span>
                            <span class="path2"></span>
                          </i>
                          Assignment Status <span class="text-danger">*</span>
                        </label>
                        <select
                          v-model="formData.status"
                          class="form-select form-select-solid"
                          :disabled="formData.selectedProjects.length === 0"
                        >
                          <option value="Active">
                            <i class="ki-duotone ki-check-circle text-success me-2"></i>
                            Active
                          </option>
                          <option value="Pending">Pending</option>
                          <option value="Completed">Completed</option>
                          <option value="On Hold">On Hold</option>
                        </select>
                      </div>
                      <!--end::Status-->
                    </div>
                    <!--end::Assignment Form-->
                  </div>
                </div>
                <!--end::Assignment Details Card-->
              </div>
              <!--end::Right Column-->
            </div>

            <!--begin::Actions-->
            <div class="d-flex justify-content-end pt-6 border-top mt-6">
              <button
                type="button"
                class="btn btn-light-primary me-3"
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
                class="btn btn-primary"
              >
                <span v-if="!isLoading" class="indicator-label">
                  <i class="ki-duotone ki-check fs-6 me-2">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                  Assign {{ formData.selectedProjects.length || 0 }} Project{{ formData.selectedProjects.length !== 1 ? 's' : '' }}
                </span>
                <span v-if="isLoading" class="indicator-progress">
                  <span class="spinner-border spinner-border-sm align-middle me-2"></span>
                  Assigning...
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

    // Filtri per la ricerca progetti
    const filters = ref({
      search: "",
      status: "",
      priority: "",
      budget: "",
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

    // Computed properties per i filtri
    const filteredProjects = computed(() => {
      let projects = availableProjects.value;

      // Filtro per ricerca testuale
      if (filters.value.search) {
        const searchTerm = filters.value.search.toLowerCase();
        projects = projects.filter(project =>
          project.name?.toLowerCase().includes(searchTerm) ||
          project.description?.toLowerCase().includes(searchTerm)
        );
      }

      // Filtro per status
      if (filters.value.status) {
        projects = projects.filter(project => project.status === filters.value.status);
      }

      // Filtro per priorità
      if (filters.value.priority) {
        projects = projects.filter(project => project.priority === filters.value.priority);
      }

      // Filtro per budget
      if (filters.value.budget) {
        projects = projects.filter(project => {
          const budget = project.budget || 0;
          switch (filters.value.budget) {
            case "0-10000":
              return budget >= 0 && budget <= 10000;
            case "10000-50000":
              return budget > 10000 && budget <= 50000;
            case "50000-100000":
              return budget > 50000 && budget <= 100000;
            case "100000+":
              return budget > 100000;
            default:
              return true;
          }
        });
      }

      return projects;
    });

    // Controlla se ci sono filtri attivi
    const hasActiveFilters = computed(() => {
      return !!(
        filters.value.search ||
        filters.value.status ||
        filters.value.priority ||
        filters.value.budget
      );
    });

    // Status badge classes
    const getStatusBadgeClass = (status: string) => {
      const statusMap: Record<string, string> = {
        "PLANNING": "badge-light-info",
        "IN_PROGRESS": "badge-light-primary",
        "ON_HOLD": "badge-light-warning", 
        "COMPLETED": "badge-light-success",
        "CANCELLED": "badge-light-danger",
        // Backwards compatibility
        "Active": "badge-light-success",
        "Pending": "badge-light-info",
        "Completed": "badge-light-success",
        "On Hold": "badge-light-warning",
      };
      return statusMap[status] || "badge-light-secondary";
    };

    // Funzioni per i filtri
    const getBudgetLabel = (budgetRange: string) => {
      switch (budgetRange) {
        case "0-10000": return "€0 - €10k";
        case "10000-50000": return "€10k - €50k";
        case "50000-100000": return "€50k - €100k";
        case "100000+": return "€100k+";
        default: return budgetRange;
      }
    };

    const clearAllFilters = () => {
      filters.value = {
        search: "",
        status: "",
        priority: "",
        budget: "",
      };
    };

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
            title: "Assegnazione Completata!",
            text: `${successCount} progetto/i assegnato/i con successo`,
            icon: "success",
            timer: 3000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
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
          title: "Errore!",
          text: "Impossibile assegnare i progetti. Riprova.",
          icon: "error",
          confirmButtonText: "OK"
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
      filteredProjects,
      formData,
      filters,
      isFormValid,
      hasActiveFilters,
      getStatusBadgeClass,
      getBudgetLabel,
      clearAllFilters,
      submit,
      resetForm,
      formatBudget,
    };
  },
});
</script>

<style scoped>
.bg-gradient-primary {
  background: linear-gradient(135deg, #3E97FF 0%, #1E47FF 100%);
}

.project-card {
  background: #fff;
  border: 2px solid #f1f1f2;
  border-radius: 0.75rem;
  padding: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.project-card:hover {
  border-color: #009EF7;
  box-shadow: 0 4px 20px rgba(62, 151, 255, 0.1);
  transform: translateY(-2px);
}

.project-card.selected {
  border-color: #009EF7;
  background: linear-gradient(135deg, rgba(62, 151, 255, 0.1) 0%, rgba(30, 71, 255, 0.05) 100%);
}

.project-card .form-check-input:checked {
  background-color: #009EF7;
  border-color: #009EF7;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.form-range::-webkit-slider-thumb {
  background-color: #009EF7;
}

.form-range::-moz-range-thumb {
  background-color: #009EF7;
  border: none;
}

.project-grid::-webkit-scrollbar {
  width: 6px;
}

.project-grid::-webkit-scrollbar-track {
  background: #f1f1f2;
  border-radius: 3px;
}

.project-grid::-webkit-scrollbar-thumb {
  background: #009EF7;
  border-radius: 3px;
}

.project-grid::-webkit-scrollbar-thumb:hover {
  background: #0085D6;
}

.modal-xl {
  max-width: 1200px;
}

.sticky-top {
  position: sticky !important;
}

@media (max-width: 991.98px) {
  .sticky-top {
    position: relative !important;
  }
}
</style> 