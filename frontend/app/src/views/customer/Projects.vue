<template>
  <!--begin::Loading State-->
  <div v-if="loading" class="d-flex justify-content-center align-items-center" style="min-height: 300px;">
    <div class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="mt-3">
        <span class="fw-semobold text-gray-600">Loading customer projects...</span>
      </div>
    </div>
  </div>
  <!--end::Loading State-->

  <!--begin::Content-->
  <div v-else>
    <!--begin::Page Header-->
    <div class="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between mb-5">
      <div class="d-flex align-items-center">
        <KTIcon icon-name="briefcase" icon-class="fs-2x text-primary me-3" />
        <div>
          <h1 class="fw-bold mb-1">Customer Projects</h1>
          <p class="text-muted mb-0">View and manage projects for {{ customer?.name }}</p>
        </div>
      </div>
      <div class="d-flex align-items-center mt-3 mt-sm-0">
        <span class="badge badge-light-primary fs-7 me-2">
          <KTIcon icon-name="information-5" icon-class="fs-6 me-1" />
          {{ projects.length }} projects
        </span>
      </div>
    </div>
    <!--end::Page Header-->

    <!--begin::Projects Grid-->
    <div class="row g-5 g-xl-10 mb-5 mb-xl-10">
      <!--begin::Project Cards-->
      <div v-if="projects.length > 0" class="col-12">
        <div class="row g-5 g-xl-10">
          <div v-for="project in projects" :key="project.id" class="col-xl-4 col-lg-6 col-md-6">
            <div class="card h-100">
              <!--begin::Card header-->
              <div class="card-header border-0 pt-9">
                <div class="card-title m-0">
                  <div class="d-flex align-items-center">
                    <div class="symbol symbol-50px me-5">
                      <div class="symbol-label bg-light-primary">
                        <KTIcon icon-name="briefcase" icon-class="fs-2x text-primary" />
                      </div>
                    </div>
                    <div>
                      <router-link 
                        :to="`/projects/${project.id}/overview`"
                        class="text-dark fw-bold text-hover-primary fs-6"
                      >
                        {{ project.name }}
                      </router-link>
                      <div class="text-muted fs-7 fw-semibold">{{ project.description }}</div>
                    </div>
                  </div>
                </div>
                <div class="card-toolbar">
                  <span :class="getProjectStatusBadgeClass(project.status)" class="badge">
                    {{ getProjectStatusLabel(project.status) }}
                  </span>
                </div>
              </div>
              <!--end::Card header-->

              <!--begin::Card body-->
              <div class="card-body d-flex flex-column p-9">
                <!--begin::Project details-->
                <div class="d-flex flex-column mb-7">
                  <div class="d-flex align-items-center mb-3">
                    <KTIcon icon-name="calendar" icon-class="fs-4 text-muted me-2" />
                    <span class="text-muted fs-7">Start Date</span>
                  </div>
                  <span class="fw-bold fs-6">{{ formatDate(project.startDate) }}</span>
                </div>

                <div class="d-flex flex-column mb-7">
                  <div class="d-flex align-items-center mb-3">
                    <KTIcon icon-name="calendar" icon-class="fs-4 text-muted me-2" />
                    <span class="text-muted fs-7">End Date</span>
                  </div>
                  <span class="fw-bold fs-6">{{ formatDate(project.endDate) }}</span>
                </div>

                <div class="d-flex flex-column mb-7">
                  <div class="d-flex align-items-center mb-3">
                    <KTIcon icon-name="user" icon-class="fs-4 text-muted me-2" />
                    <span class="text-muted fs-7">Project Manager</span>
                  </div>
                  <span class="fw-bold fs-6">{{ project.projectManager || 'Not assigned' }}</span>
                </div>

                <div class="d-flex flex-column mb-7">
                  <div class="d-flex align-items-center mb-3">
                    <KTIcon icon-name="chart-simple" icon-class="fs-4 text-muted me-2" />
                    <span class="text-muted fs-7">Budget</span>
                  </div>
                  <span class="fw-bold fs-6">{{ formatCurrency(project.budget) }}</span>
                </div>
                <!--end::Project details-->

                <!--begin::Progress-->
                <div class="d-flex flex-column mb-7">
                  <div class="d-flex align-items-center justify-content-between mb-3">
                    <span class="text-muted fs-7">Progress</span>
                    <span class="fw-bold fs-6">{{ project.progress || 0 }}%</span>
                  </div>
                  <div class="progress h-6px w-100">
                    <div
                      class="progress-bar"
                      :class="getProgressBarClass(project.progress || 0)"
                      role="progressbar"
                      :style="{ width: (project.progress || 0) + '%' }"
                      :aria-valuenow="project.progress || 0"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
                <!--end::Progress-->

                <!--begin::Actions-->
                <div class="d-flex justify-content-between align-items-center mt-auto">
                  <router-link 
                    :to="`/projects/${project.id}/overview`"
                    class="btn btn-sm btn-light-primary"
                  >
                    <KTIcon icon-name="eye" icon-class="fs-4 me-1" />
                    View Details
                  </router-link>
                  <div class="d-flex align-items-center">
                    <span class="text-muted fs-7 me-2">Last updated</span>
                    <span class="fw-bold fs-7">{{ formatDate(project.updatedAt) }}</span>
                  </div>
                </div>
                <!--end::Actions-->
              </div>
              <!--end::Card body-->
            </div>
          </div>
        </div>
      </div>
      <!--end::Project Cards-->

      <!--begin::Empty State-->
      <div v-else class="col-12">
        <div class="card">
          <div class="card-body text-center py-10">
            <div class="mb-5">
              <KTIcon icon-name="briefcase" icon-class="fs-4x text-muted" />
            </div>
            <h3 class="fw-bold text-gray-900 mb-5">No Projects Found</h3>
            <p class="text-muted fs-6 mb-8">
              This customer doesn't have any projects assigned yet. 
              <br />
              Projects will appear here once they are created and assigned to this customer.
            </p>
          </div>
        </div>
      </div>
      <!--end::Empty State-->
    </div>
    <!--end::Projects Grid-->

    <!--begin::Statistics-->
    <div class="row g-5 g-xl-10 mb-5 mb-xl-10">
      <div class="col-xl-3">
        <div class="card bg-light-primary">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="symbol symbol-50px me-3">
                <div class="symbol-label bg-primary">
                  <KTIcon icon-name="briefcase" icon-class="fs-2x text-white" />
                </div>
              </div>
              <div>
                <div class="text-muted fs-7 fw-semibold">Total Projects</div>
                <div class="fw-bold fs-2">{{ projects.length }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3">
        <div class="card bg-light-success">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="symbol symbol-50px me-3">
                <div class="symbol-label bg-success">
                  <KTIcon icon-name="check" icon-class="fs-2x text-white" />
                </div>
              </div>
              <div>
                <div class="text-muted fs-7 fw-semibold">Active Projects</div>
                <div class="fw-bold fs-2">{{ activeProjectsCount }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3">
        <div class="card bg-light-info">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="symbol symbol-50px me-3">
                <div class="symbol-label bg-info">
                  <KTIcon icon-name="chart-simple" icon-class="fs-2x text-white" />
                </div>
              </div>
              <div>
                <div class="text-muted fs-7 fw-semibold">In Progress</div>
                <div class="fw-bold fs-2">{{ inProgressProjectsCount }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3">
        <div class="card bg-light-warning">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="symbol symbol-50px me-3">
                <div class="symbol-label bg-warning">
                  <KTIcon icon-name="chart-simple" icon-class="fs-2x text-white" />
                </div>
              </div>
              <div>
                <div class="text-muted fs-7 fw-semibold">Total Budget</div>
                <div class="fw-bold fs-6">{{ formatCurrency(totalBudget) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--end::Statistics-->
  </div>
  <!--end::Content-->
</template>

<script setup lang="ts">
import { ref, computed, onMounted, inject } from 'vue';
import { useRoute } from 'vue-router';
import { getCustomerById } from '@/core/services/businessServices/Customer';
import type { Customer } from '@/core/models/Customer';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const authStore = useAuthStore();

const customer = ref<Customer | null>(null);
const projects = ref<any[]>([]);
const loading = ref(true);

const customerId = computed(() => route.params.id as string);

// Inject refresh function from parent
const refreshCustomer = inject('refreshCustomer', () => {});

// Computed properties for statistics
const activeProjectsCount = computed(() => 
  projects.value.filter(p => p.status === 'ACTIVE').length
);

const inProgressProjectsCount = computed(() => 
  projects.value.filter(p => p.status === 'IN_PROGRESS').length
);

const totalBudget = computed(() => 
  projects.value.reduce((sum, p) => sum + (p.budget || 0), 0)
);

onMounted(async () => {
  if (customerId.value) {
    await loadCustomerData();
  }
});

const loadCustomerData = async () => {
  loading.value = true;
  try {
    const customerData = await getCustomerById(customerId.value);
    if (customerData) {
      customer.value = customerData;
      // Load projects - this would typically come from a separate API call
      // For now, we'll use the projects from the customer data if available
      projects.value = customerData.projects || [];
    } else {
      authStore.setError('Customer not found', 404);
    }
  } catch (error) {
    console.error('Error loading customer data:', error);
    authStore.setError('Failed to load customer data', 500);
  } finally {
    loading.value = false;
  }
};

const formatDate = (date: Date | string | undefined) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString();
};

const formatCurrency = (amount: number | undefined) => {
  if (!amount) return '€0';
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};

const getProjectStatusLabel = (status?: string) => {
  switch (status) {
    case 'ACTIVE':
      return 'Active';
    case 'IN_PROGRESS':
      return 'In Progress';
    case 'COMPLETED':
      return 'Completed';
    case 'ON_HOLD':
      return 'On Hold';
    case 'CANCELLED':
      return 'Cancelled';
    default:
      return 'Unknown';
  }
};

const getProjectStatusBadgeClass = (status?: string) => {
  switch (status) {
    case 'ACTIVE':
      return 'badge-light-success';
    case 'IN_PROGRESS':
      return 'badge-light-primary';
    case 'COMPLETED':
      return 'badge-light-info';
    case 'ON_HOLD':
      return 'badge-light-warning';
    case 'CANCELLED':
      return 'badge-light-danger';
    default:
      return 'badge-light-secondary';
  }
};

const getProgressBarClass = (progress: number) => {
  if (progress >= 80) return 'bg-success';
  if (progress >= 50) return 'bg-warning';
  return 'bg-primary';
};
</script> 