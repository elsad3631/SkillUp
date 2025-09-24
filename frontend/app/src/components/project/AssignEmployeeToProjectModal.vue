<template>
  <div
    class="modal fade"
    id="kt_modal_assign_employee_to_project"
    ref="assignEmployeeToProjectModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content rounded-3 overflow-hidden">
        <!--begin::Header with gradient-->
        <div class="modal-header bg-gradient-success text-white position-relative border-0 py-8">
          <div class="d-flex align-items-center">
            <div class="symbol symbol-50px me-4">
              <div class="symbol-label bg-white bg-opacity-20">
                <i class="ki-duotone ki-people fs-2x text-white">
                  <span class="path1"></span>
                  <span class="path2"></span>
                  <span class="path3"></span>
                  <span class="path4"></span>
                  <span class="path5"></span>
                </i>
              </div>
            </div>
            <div>
              <h2 class="fw-bold text-white mb-1">Assign Employees</h2>
              <p class="text-white-75 mb-0 fs-6">Build your project team efficiently</p>
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
              <!--begin::Left Column - Employee Selection-->
              <div class="col-lg-7">
                <!--begin::Employees Section-->
                <div class="card border-0 shadow-sm mb-6">
                  <div class="card-header bg-light-success border-0 py-4">
                    <div class="card-title">
                      <i class="ki-duotone ki-people fs-2 text-success me-2">
                        <span class="path1"></span>
                        <span class="path2"></span>
                        <span class="path3"></span>
                        <span class="path4"></span>
                        <span class="path5"></span>
                      </i>
                      <h4 class="fw-bold text-gray-800 mb-0">Available Employees</h4>
                    </div>
                    <div class="card-toolbar">
                      <span class="badge badge-light-success fs-7">
                        {{ filteredEmployees.length }} of {{ availableEmployees.length }} showing
                      </span>
                    </div>
                  </div>
                  
                  <!--begin::Filters-->
                  <div class="card-body border-bottom bg-light-success bg-opacity-25 py-4">
                    <div class="row g-3 align-items-center">
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
                            placeholder="Search employees by name or role..."
                          />
                        </div>
                      </div>
                      <!--end::Search-->
                      
                      <!--begin::Smart Search-->
                      <div class="col-md-6">
                        <div class="smart-search-container">
                          <div class="d-flex align-items-center gap-2 mb-2">
                            <button
                              @click="performSmartSearch"
                              :disabled="smartSearchLoading"
                              class="btn btn-light-success btn-sm d-flex align-items-center"
                              title="Find employees matching project skills"
                            >
                              <span v-if="!smartSearchLoading" class="indicator-label">
                                <i class="ki-duotone ki-magic-wand fs-6 me-1">
                                  <span class="path1"></span>
                                  <span class="path2"></span>
                                  <span class="path3"></span>
                                  <span class="path4"></span>
                                  <span class="path5"></span>
                                </i>
                                Smart Search
                              </span>
                              <span v-if="smartSearchLoading" class="indicator-progress">
                                <span class="spinner-border spinner-border-sm align-middle me-1"></span>
                                Analyzing...
                              </span>
                            </button>
                            
                            <button
                              v-if="searchResultsSummary"
                              @click="clearSmartSearch"
                              class="btn btn-light-danger btn-sm"
                              title="Clear smart search results"
                            >
                              <i class="ki-duotone ki-cross fs-6">
                                <span class="path1"></span>
                                <span class="path2"></span>
                              </i>
                            </button>
                          </div>
                          
                          <div class="form-check form-check-custom form-check-solid">
                            <input
                              v-model="includeSoftSkills"
                              class="form-check-input"
                              type="checkbox"
                              id="includeSoftSkills"
                            />
                            <label class="form-check-label fs-7 text-muted" for="includeSoftSkills">
                              <i class="ki-duotone ki-profile-user fs-7 me-1">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                                <span class="path4"></span>
                              </i>
                              Include Soft Skills
                            </label>
                          </div>
                        </div>
                      </div>
                      <!--end::Smart Search-->
                    </div>
                    
                    <!--begin::Search Results Summary-->
                    <div v-if="searchResultsSummary" class="d-flex align-items-center gap-2 mt-3">
                      <span class="badge badge-light-success fs-7">
                        <i class="ki-duotone ki-magic-wand fs-7 me-1">
                          <span class="path1"></span>
                          <span class="path2"></span>
                          <span class="path3"></span>
                          <span class="path4"></span>
                          <span class="path5"></span>
                        </i>
                        {{ searchResultsSummary.totalMatches }} matches
                      </span>
                      <span class="badge badge-light-info fs-7">
                        <i class="ki-duotone ki-chart-pie-4 fs-7 me-1">
                          <span class="path1"></span>
                          <span class="path2"></span>
                          <span class="path3"></span>
                        </i>
                        Avg: {{ Math.round(searchResultsSummary.averageScore) }}%
                      </span>
                    </div>
                    <!--end::Search Results Summary-->
                    
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
                      
                      <span v-if="filters.department" class="badge badge-light-success">
                        Department: {{ filters.department }}
                        <i @click="filters.department = ''" class="ki-duotone ki-cross fs-7 ms-1 cursor-pointer">
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
                    <div v-if="employeesLoading" class="d-flex align-items-center justify-content-center py-10">
                      <div class="d-flex flex-column align-items-center">
                        <div class="spinner-border text-success mb-3" role="status"></div>
                        <span class="text-muted fw-semibold">Loading employees...</span>
                      </div>
                    </div>
                    <!--end::Loading state-->
                    
                    <!--begin::Employees grid-->
                    <div v-else class="employee-grid" style="max-height: 400px; overflow-y: auto;">
                      <div 
                        v-for="employee in filteredEmployees" 
                        :key="employee.id"
                        class="employee-card mb-4"
                        :class="{ 'selected': employee.id && formData.selectedEmployees.includes(employee.id) }"
                      >
                        <div class="form-check">
                          <input 
                            :id="`employee_${employee.id}`"
                            v-model="formData.selectedEmployees"
                            :value="employee.id || ''"
                            class="form-check-input" 
                            type="checkbox"
                          />
                          <label 
                            :for="`employee_${employee.id}`" 
                            class="form-check-label w-100 cursor-pointer"
                          >
                            <div class="d-flex align-items-start">
                              <!--begin::Employee Avatar-->
                              <div class="symbol symbol-50px me-4 flex-shrink-0">
                                <div v-if="employee.avatar" class="symbol-label">
                                  <img :src="getAvatarUrl(employee.avatar)" alt="Avatar" class="w-100" />
                                </div>
                                <div v-else class="symbol-label bg-light-success">
                                  <span class="fs-2 fw-bold text-success">
                                    {{ getInitials(employee) }}
                                  </span>
                                </div>
                              </div>
                              <!--end::Employee Avatar-->
                              
                              <!--begin::Employee Info-->
                              <div class="flex-grow-1">
                                <div class="d-flex justify-content-between align-items-start mb-2">
                                  <h5 class="fw-bold text-gray-800 mb-1">{{ getEmployeeName(employee) }}</h5>
                                  <span class="badge badge-light-primary fs-8">
                                    {{ employee.department || 'No Department' }}
                                  </span>
                                </div>
                                
                                <p class="text-muted mb-2 fs-7">
                                  {{ employee.email || 'No email provided' }}
                                </p>
                                
                                <div class="d-flex flex-wrap gap-2">
                                  <span class="badge badge-light-info fs-8">
                                    <i class="ki-duotone ki-profile-user fs-7 me-1">
                                      <span class="path1"></span>
                                      <span class="path2"></span>
                                      <span class="path3"></span>
                                      <span class="path4"></span>
                                    </i>
                                    {{ employee.position || 'No Position' }}
                                  </span>
                                  
                                  <span v-if="employee.phone" class="badge badge-light-warning fs-8">
                                    <i class="ki-duotone ki-phone fs-7 me-1">
                                      <span class="path1"></span>
                                      <span class="path2"></span>
                                    </i>
                                    {{ employee.phone }}
                                  </span>
                                  
                                  <!--begin::Skill Match Indicator-->
                                  <span v-if="employee.skillMatchScore !== undefined" :class="getMatchScoreBadgeClass(employee.skillMatchScore)" class="badge fs-8">
                                    <i class="ki-duotone ki-magic-wand fs-7 me-1">
                                      <span class="path1"></span>
                                      <span class="path2"></span>
                                      <span class="path3"></span>
                                      <span class="path4"></span>
                                      <span class="path5"></span>
                                    </i>
                                    {{ Math.round(employee.skillMatchScore) }}% Match
                                  </span>
                                  <!--end::Skill Match Indicator-->
                                  
                                  <!--begin::Skill Details Tooltip-->
                                  <span v-if="employee.skillMatchScore !== undefined" class="badge badge-light-secondary fs-8 cursor-pointer" 
                                        :title="getSkillMatchTooltip(employee)"
                                        data-bs-toggle="tooltip" 
                                        data-bs-placement="top">
                                    <i class="ki-duotone ki-information-5 fs-7 me-1">
                                      <span class="path1"></span>
                                      <span class="path2"></span>
                                      <span class="path3"></span>
                                    </i>
                                    Details
                                  </span>
                                  <!--end::Skill Details Tooltip-->
                                </div>
                              </div>
                              <!--end::Employee Info-->
                            </div>
                          </label>
                        </div>
                      </div>
                      
                      <!--begin::Empty state-->
                      <div v-if="filteredEmployees.length === 0 && availableEmployees.length === 0" class="text-center py-10">
                        <div class="mb-4">
                          <i class="ki-duotone ki-user-tick fs-5x text-muted">
                            <span class="path1"></span>
                            <span class="path2"></span>
                            <span class="path3"></span>
                          </i>
                        </div>
                        <h4 class="text-muted fw-semibold">No Employees Available</h4>
                        <p class="text-muted mb-0">All employees are already assigned to this project</p>
                      </div>
                      
                      <!--begin::No filtered results-->
                      <div v-else-if="filteredEmployees.length === 0 && availableEmployees.length > 0" class="text-center py-10">
                        <div class="mb-4">
                          <i class="ki-duotone ki-filter-search fs-5x text-muted">
                            <span class="path1"></span>
                            <span class="path2"></span>
                          </i>
                        </div>
                        <h4 class="text-muted fw-semibold">No Employees Match Filters</h4>
                        <p class="text-muted mb-3">Try adjusting your search criteria or clear filters</p>
                        <button @click="clearAllFilters" class="btn btn-light-success">
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
                    <!--end::Employees grid-->
                  </div>
                </div>
                <!--end::Employees Section-->
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
                    <div v-if="formData.selectedEmployees.length > 0" class="alert alert-success d-flex align-items-center mb-6">
                      <i class="ki-duotone ki-information-5 fs-2x text-success me-3">
                        <span class="path1"></span>
                        <span class="path2"></span>
                        <span class="path3"></span>
                      </i>
                      <div>
                        <h6 class="mb-1">{{ formData.selectedEmployees.length }} Employee(s) Selected</h6>
                        <span class="fs-7 text-muted">Configure assignment details below</span>
                      </div>
                    </div>
                    <!--end::Selection Summary-->

                    <!--begin::Assignment Form-->
                    <div :class="{ 'opacity-50': formData.selectedEmployees.length === 0 }">
                      <!--begin::Role-->
                      <div class="mb-6">
                        <label class="form-label fw-semibold fs-6 mb-2">
                          <i class="ki-duotone ki-profile-user fs-6 text-success me-2">
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
                          :disabled="formData.selectedEmployees.length === 0"
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
                            :disabled="formData.selectedEmployees.length === 0"
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
                            :disabled="formData.selectedEmployees.length === 0"
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
                            :disabled="formData.selectedEmployees.length === 0"
                          />
                          <input
                            v-model.number="formData.allocationPercentage"
                            type="number"
                            min="1"
                            max="100"
                            class="form-control form-control-solid w-80px"
                            :disabled="formData.selectedEmployees.length === 0"
                          />
                          <span class="input-group-text">%</span>
                        </div>
                        
                        <!--begin::Progress visualization-->
                        <div class="mt-3">
                          <div class="d-flex justify-content-between mb-2">
                            <span class="fs-7 text-muted">Time allocation</span>
                            <span class="fs-7 fw-bold">{{ formData.allocationPercentage }}%</span>
                          </div>
                          <div class="progress h-6px bg-light-success">
                            <div 
                              class="progress-bar bg-success" 
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
                          <i class="ki-duotone ki-status fs-6 text-success me-2">
                            <span class="path1"></span>
                            <span class="path2"></span>
                          </i>
                          Assignment Status <span class="text-danger">*</span>
                        </label>
                        <select
                          v-model="formData.status"
                          class="form-select form-select-solid"
                          :disabled="formData.selectedEmployees.length === 0"
                        >
                          <option value="Active">Active</option>
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
                class="btn btn-light-success me-3"
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
                class="btn btn-success"
              >
                <span v-if="!isLoading" class="indicator-label">
                  <i class="ki-duotone ki-check fs-6 me-2">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                  Assign {{ formData.selectedEmployees.length || 0 }} Employee{{ formData.selectedEmployees.length !== 1 ? 's' : '' }}
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
import { getNonSuperAdminUsers } from "@/core/services/businessServices/ApplicationUser";
import { assignProjectToEmployee, smartSearchEmployees } from "@/core/services/businessServices/Project";
import { getAssetPath } from "@/core/helpers/assets";
import { hideModal } from "@/core/helpers/dom";
import { useToast } from "vue-toastification";

export default defineComponent({
  name: "AssignEmployeeToProjectModal",
  props: {
    projectId: {
      type: String,
      required: true,
    },
    assignedEmployeeIds: {
      type: Array as () => string[],
      default: () => [],
    },
  },
  emits: {
    assignmentCreated: () => true,
  },
  setup(props, { emit }) {
    const toast = useToast();
    const assignEmployeeToProjectModalRef = ref<HTMLElement | null>(null);
    const isLoading = ref(false);
    const employeesLoading = ref(false);
    const smartSearchLoading = ref(false);
    const availableEmployees = ref<any[]>([]);
    const includeSoftSkills = ref(true);
    const searchResultsSummary = ref<{
      totalMatches: number;
      averageScore: number;
      includeSoftSkills: boolean;
    } | null>(null);
    
    const formData = ref({
      selectedEmployees: [] as string[],
      roleOnProject: "Developer",
      assignmentStartDate: "",
      assignmentEndDate: "",
      allocationPercentage: 50,
      status: "Active",
    });

    // Filtri per la ricerca employee
    const filters = ref({
      search: "",
      department: "",
    });

    // Computed property per validazione form
    const isFormValid = computed(() => {
      return (
        formData.value.selectedEmployees.length > 0 &&
        formData.value.roleOnProject &&
        formData.value.assignmentStartDate &&
        formData.value.allocationPercentage > 0 &&
        formData.value.allocationPercentage <= 100 &&
        formData.value.status
      );
    });

    // Computed properties per i filtri
    const filteredEmployees = computed(() => {
      let employees = availableEmployees.value;

      // Filtro per ricerca testuale
      if (filters.value.search) {
        const searchTerm = filters.value.search.toLowerCase();
        employees = employees.filter(employee =>
          getEmployeeName(employee).toLowerCase().includes(searchTerm) ||
          (employee.email && employee.email.toLowerCase().includes(searchTerm)) ||
          (employee.position && employee.position.toLowerCase().includes(searchTerm))
        );
      }

      // Filtro per department
      if (filters.value.department) {
        employees = employees.filter(employee => employee.department === filters.value.department);
      }

      return employees;
    });

    // Controlla se ci sono filtri attivi
    const hasActiveFilters = computed(() => {
      return !!(filters.value.search || filters.value.department);
    });

    // Helper functions
    const getEmployeeName = (employee: any) => {
      if (!employee) return 'Unknown Employee';
      const firstName = employee.firstName || '';
      const lastName = employee.lastName || '';
      return `${firstName} ${lastName}`.trim() || employee.username || employee.email || 'Unknown Employee';
    };

    const getInitials = (employee: any) => {
      if (!employee) return '??';
      const firstName = employee.firstName || '';
      const lastName = employee.lastName || '';
      if (firstName && lastName) {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
      }
      const name = employee.username || employee.email || 'Unknown';
      return name.substring(0, 2).toUpperCase();
    };

    const getAvatarUrl = (avatar: string) => {
      if (avatar.startsWith('http')) {
        return avatar;
      }
      return getAssetPath(`media/avatars/${avatar}`);
    };

    // Funzioni per i filtri
    const clearAllFilters = () => {
      filters.value = {
        search: "",
        department: "",
      };
    };

    // Badge class per il punteggio di match
    const getMatchScoreBadgeClass = (score: number) => {
      if (score >= 90) return "badge-light-success";
      if (score >= 70) return "badge-light-primary";
      if (score >= 50) return "badge-light-warning";
      if (score >= 30) return "badge-light-info";
      return "badge-light-danger";
    };

    // Tooltip con dettagli del match delle skills
    const getSkillMatchTooltip = (employee: any) => {
      const hardSkills = employee.hardSkills || [];
      const softSkills = employee.softSkills || [];
      
      let tooltip = `Match Score: ${Math.round(employee.skillMatchScore || 0)}%\n\n`;
      
      if (hardSkills.length > 0) {
        tooltip += `Hard Skills: ${hardSkills.length}\n`;
        hardSkills.forEach(skill => {
          tooltip += `• ${skill.name} (Level: ${skill.proficiencyLevel || 1})\n`;
        });
      }
      
      if (softSkills.length > 0) {
        tooltip += `\nSoft Skills: ${softSkills.length}\n`;
        softSkills.forEach(skill => {
          tooltip += `• ${skill.name} (Level: ${skill.proficiencyLevel || 1})\n`;
        });
      }
      
      return tooltip;
    };

    // Pulisce i risultati della smart search
    const clearSmartSearch = () => {
      searchResultsSummary.value = null;
      // Rimuove i punteggi di match dagli employee
      availableEmployees.value = availableEmployees.value.map(employee => ({
        ...employee,
        skillMatchScore: undefined
      }));
    };

    // Smart search per employee basati sulle skills del progetto
    const performSmartSearch = async () => {
      smartSearchLoading.value = true;
      try {
        // Chiama l'API per la smart search
        const result = await smartSearchEmployees(
          props.projectId,
          includeSoftSkills.value
        );

        if (!result) {
          toast.error("Impossibile eseguire la ricerca intelligente");
          return;
        }

        // Aggiorna la lista degli employee con i punteggi dal server
        availableEmployees.value = result.employees;

        // Calcola il punteggio medio
        const averageScore = result.employees.length > 0 
          ? result.employees.reduce((sum, e) => sum + (e.skillMatchScore || 0), 0) / result.employees.length
          : 0;

        // Aggiorna il summary dei risultati
        searchResultsSummary.value = {
          totalMatches: result.totalMatches,
          averageScore: averageScore,
          includeSoftSkills: result.includeSoftSkills
        };

        // Mostra un messaggio di successo più dettagliato
        toast.success(`🎯 Ricerca Intelligente Completata! ${result.totalMatches} employee trovati con skills compatibili. Punteggio medio: ${Math.round(averageScore)}%`);

      } catch (error) {
        console.error("Error performing smart search:", error);
        toast.error("Impossibile eseguire la ricerca intelligente");
      } finally {
        smartSearchLoading.value = false;
      }
    };

    // Carica employee disponibili
    const loadAvailableEmployees = async () => {
      employeesLoading.value = true;
      try {
        const employees = await getNonSuperAdminUsers();
        if (employees) {
          // Filtra employee già assegnati al progetto
          availableEmployees.value = employees.filter((employee) => {
            // Esclude employee già assegnati al progetto
            if (props.assignedEmployeeIds.includes(employee.id || "")) {
              return false;
            }
            
            // Esclude employee con ruoli admin (getNonSuperAdminUsers già esclude superadmin)
            if (employee.userRoles && Array.isArray(employee.userRoles)) {
              const hasAdminRole = employee.userRoles.some((userRole: any) => {
                const roleName = userRole.name?.toLowerCase();
                return roleName === 'admin';
              });
              if (hasAdminRole) {
                return false;
              }
            }
            
            return true;
          });
        }
      } catch (error) {
        console.error("Error loading employees:", error);
      } finally {
        employeesLoading.value = false;
      }
    };

    // Reset form quando si chiude la modal
    const resetForm = () => {
      formData.value = {
        selectedEmployees: [],
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
        
        // Crea un'assegnazione per ogni employee selezionato
        for (const employeeId of formData.value.selectedEmployees) {
          const assignmentData = {
            applicationUserId: employeeId,
            projectId: props.projectId,
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
          hideModal(assignEmployeeToProjectModalRef.value);
          
          // Mostra messaggio di successo
          toast.success(`Assegnazione Completata! ${successCount} employee assegnato/i con successo`);

          // Emetti evento per aggiornare la lista
          emit("assignmentCreated");
          
          // Reset form
          resetForm();
        } else {
          throw new Error("Failed to create assignments");
        }
      } catch (error) {
        console.error("Error creating assignments:", error);
        toast.error("Impossibile assegnare gli employee. Riprova.");
      } finally {
        isLoading.value = false;
      }
    };

    // Watch per ricaricare employee quando cambiano quelli assegnati
    watch(() => props.assignedEmployeeIds, loadAvailableEmployees, { deep: true });

    onMounted(() => {
      loadAvailableEmployees();
      
      // Imposta data di inizio di default a oggi
      const today = new Date().toISOString().split('T')[0];
      formData.value.assignmentStartDate = today;
    });

    return {
      assignEmployeeToProjectModalRef,
      isLoading,
      employeesLoading,
      smartSearchLoading,
      availableEmployees,
      filteredEmployees,
      formData,
      filters,
      includeSoftSkills,
      searchResultsSummary,
      isFormValid,
      hasActiveFilters,
      getEmployeeName,
      getInitials,
      getAvatarUrl,
      getMatchScoreBadgeClass,
      getSkillMatchTooltip,
      clearAllFilters,
      clearSmartSearch,
      performSmartSearch,
      submit,
      resetForm,
    };
  },
});
</script>

<style scoped>
.bg-gradient-success {
  background: linear-gradient(135deg, #50CD89 0%, #17C653 100%);
}

.employee-card {
  background: #fff;
  border: 2px solid #f1f1f2;
  border-radius: 0.75rem;
  padding: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.employee-card:hover {
  border-color: #50CD89;
  box-shadow: 0 4px 20px rgba(80, 205, 137, 0.1);
  transform: translateY(-2px);
}

.employee-card.selected {
  border-color: #50CD89;
  background: linear-gradient(135deg, rgba(80, 205, 137, 0.1) 0%, rgba(23, 198, 83, 0.05) 100%);
}

.employee-card .form-check-input:checked {
  background-color: #50CD89;
  border-color: #50CD89;
}

.form-range::-webkit-slider-thumb {
  background-color: #50CD89;
}

.form-range::-moz-range-thumb {
  background-color: #50CD89;
  border: none;
}

.employee-grid::-webkit-scrollbar {
  width: 6px;
}

.employee-grid::-webkit-scrollbar-track {
  background: #f1f1f2;
  border-radius: 3px;
}

.employee-grid::-webkit-scrollbar-thumb {
  background: #50CD89;
  border-radius: 3px;
}

.employee-grid::-webkit-scrollbar-thumb:hover {
  background: #17C653;
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

/* Smart Search Button Styles */
.btn-light-success {
  background-color: rgba(80, 205, 137, 0.1);
  border-color: rgba(80, 205, 137, 0.2);
  color: #50CD89;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.btn-light-success:hover:not(:disabled) {
  background-color: rgba(80, 205, 137, 0.2);
  border-color: rgba(80, 205, 137, 0.3);
  color: #17C653;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(80, 205, 137, 0.3);
}

.btn-light-success:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Smart Search Container */
.smart-search-container {
  background: rgba(80, 205, 137, 0.05);
  border-radius: 0.5rem;
  padding: 0.75rem;
  border: 1px solid rgba(80, 205, 137, 0.1);
}

/* Match Score Badge Animations */
.badge-light-success {
  animation: pulse-success 2s infinite;
}

.badge-light-primary {
  animation: pulse-primary 2s infinite;
}

.badge-light-warning {
  animation: pulse-warning 2s infinite;
}

@keyframes pulse-success {
  0% { box-shadow: 0 0 0 0 rgba(80, 205, 137, 0.4); }
  70% { box-shadow: 0 0 0 8px rgba(80, 205, 137, 0); }
  100% { box-shadow: 0 0 0 0 rgba(80, 205, 137, 0); }
}

@keyframes pulse-primary {
  0% { box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.4); }
  70% { box-shadow: 0 0 0 8px rgba(0, 123, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 123, 255, 0); }
}

@keyframes pulse-warning {
  0% { box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.4); }
  70% { box-shadow: 0 0 0 8px rgba(255, 193, 7, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 193, 7, 0); }
}

/* Skill Match Badge Animation */
.badge-light-info {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(54, 162, 235, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(54, 162, 235, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(54, 162, 235, 0);
  }
}

.cursor-pointer {
  cursor: pointer;
}
</style> 