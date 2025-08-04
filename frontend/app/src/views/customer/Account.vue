<template>
  <!--begin::Loading State-->
  <div v-if="loading" class="d-flex justify-content-center align-items-center" style="min-height: 400px;">
    <div class="text-center">
      <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="mt-3">
        <span class="fw-semobold text-gray-600">Loading customer data...</span>
        <div class="mt-2">
          <small class="text-muted">Please wait while we fetch the latest information</small>
        </div>
      </div>
    </div>
  </div>
  <!--end::Loading State-->

  <!--begin::Error State-->
  <div v-else-if="error" class="d-flex justify-content-center align-items-center" style="min-height: 400px;">
    <div class="text-center">
      <div class="mb-4">
        <i class="bi bi-exclamation-triangle text-danger" style="font-size: 3rem;"></i>
      </div>
      <div class="mb-3">
        <h4 class="text-danger">Unable to Load Customer</h4>
        <p class="text-gray-600 mb-3">{{ error }}</p>
        <div class="alert alert-info" role="alert">
          <i class="bi bi-info-circle me-2"></i>
          <small>This might be due to network issues or the customer may have been moved/deleted.</small>
        </div>
      </div>
      <div class="d-flex gap-2 justify-content-center">
        <button @click="handleRefreshClick" class="btn btn-primary">
          <i class="bi bi-arrow-clockwise me-2"></i>Try Again
        </button>
        <button @click="goBack" class="btn btn-outline-secondary">
          <i class="bi bi-arrow-left me-2"></i>Go Back
        </button>
      </div>
    </div>
  </div>
  <!--end::Error State-->

  <!--begin::Content (shown when loaded)-->
  <div v-else>
    <!--begin::Navbar-->
    <div class="card mb-5 mb-xl-10">
      <div class="card-body pt-9 pb-0">
        <!--begin::Details-->
        <div class="d-flex flex-wrap flex-sm-nowrap mb-3">
          <!--begin: Pic-->
          <div class="me-7 mb-4">
            <div class="symbol symbol-100px symbol-lg-160px symbol-fixed position-relative">
              <div class="symbol-label bg-light-primary">
                <span class="fs-2x fw-bold text-primary">
                  {{ getInitials(customer?.name) }}
                </span>
              </div>
              <div
                class="position-absolute translate-middle bottom-0 start-100 mb-6 bg-success rounded-circle border border-4 border-white h-20px w-20px"
                :title="`Customer Status: ${customer?.status || 'Active'}`"
              ></div>
            </div>
          </div>
          <!--end: Pic-->

          <!--begin::Info-->
          <div class="flex-grow-1">
            <!--begin::Title-->
            <div class="d-flex justify-content-between align-items-start flex-wrap mb-2">
              <!--begin::User-->
              <div class="d-flex flex-column">
                <div class="d-flex align-items-center mb-2">
                  <a href="#" class="text-gray-900 text-hover-primary fs-2 fw-bold me-1">
                    {{ customer?.name || 'Customer Name' }}
                  </a>
                  <a href="#">
                    <i class="ki-duotone ki-verify fs-1 text-primary">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                  </a>
                </div>

                <!--begin::Info-->
                <div class="d-flex flex-wrap fw-semibold fs-6 text-muted mb-4 pe-2">
                  <span class="d-flex align-items-center text-gray-400 me-5 mb-2">
                    <i class="ki-duotone ki-geolocation fs-4 me-1 align-middle"></i>
                    {{ customer?.companyName || 'No company' }}
                  </span>
                  <span class="d-flex align-items-center text-gray-400 me-5 mb-2">
                    <i class="ki-duotone ki-sms fs-4 me-1 align-middle"></i>
                    {{ customer?.email || 'No email' }}
                  </span>
                  <span class="d-flex align-items-center text-gray-400 mb-2">
                    <i class="ki-duotone ki-phone fs-4 me-1 align-middle"></i>
                    {{ customer?.phone || 'No phone' }}
                  </span>
                </div>
                <!--end::Info-->
              </div>
              <!--end::User-->

              <!--begin::Actions-->
              <div class="d-flex my-4">
                <a href="#" class="btn btn-sm btn-light me-2" data-bs-toggle="tooltip" title="Coming soon">
                  <i class="ki-duotone ki-phone fs-3"></i>
                  Call
                </a>
                <a href="#" class="btn btn-sm btn-primary" data-bs-toggle="tooltip" title="Coming soon">
                  <i class="ki-duotone ki-sms fs-3"></i>
                  Message
                </a>
              </div>
              <!--end::Actions-->
            </div>
            <!--end::Title-->

            <!--begin::Stats-->
            <div class="d-flex flex-wrap flex-stack">
              <!--begin::Wrapper-->
              <div class="d-flex flex-column flex-grow-1 pe-8">
                <!--begin::Stats-->
                <div class="d-flex flex-wrap">
                  <!--begin::Stat-->
                  <div class="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                    <div class="fs-6 fw-semibold text-gray-700">{{ customer?.projects?.length || 0 }}</div>
                    <div class="fw-bold fs-6 text-gray-900">Projects</div>
                  </div>
                  <!--end::Stat-->

                  <!--begin::Stat-->
                  <div class="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                    <div class="fs-6 fw-semibold text-gray-700">{{ getStatusLabel(customer?.status) }}</div>
                    <div class="fw-bold fs-6 text-gray-900">Status</div>
                  </div>
                  <!--end::Stat-->

                  <!--begin::Stat-->
                  <div class="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                    <div class="fs-6 fw-semibold text-gray-700">{{ formatDate(customer?.createdAt) }}</div>
                    <div class="fw-bold fs-6 text-gray-900">Created</div>
                  </div>
                  <!--end::Stat-->
                </div>
                <!--end::Stats-->
              </div>
              <!--end::Wrapper-->

              <!--begin::Progress-->
              <div class="d-flex align-items-center w-200px w-sm-300px flex-column mt-3">
                <div class="d-flex justify-content-between w-100 mt-auto mb-2">
                  <span class="fw-semibold fs-6 text-gray-400">Profile Completion</span>
                  <span class="fw-bold fs-6 text-gray-900">{{ profileCompletion }}%</span>
                </div>
                <div class="h-5px mx-3 w-100 bg-light mb-3">
                  <div
                    class="bg-primary rounded h-5px"
                    role="progressbar"
                    :style="{ width: profileCompletion + '%' }"
                    aria-valuenow="profileCompletion"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>
              <!--end::Progress-->
            </div>
            <!--end::Stats-->
          </div>
          <!--end::Info-->
        </div>
        <!--end::Details-->

        <!--begin::Navs-->
        <div class="d-flex overflow-auto h-55px">
          <ul
            class="nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bold flex-nowrap"
          >
            <!--begin::Nav item-->
            <li class="nav-item">
              <router-link
                :to="overviewUrl"
                class="nav-link text-active-primary me-6"
                active-class="active"
                title="View customer overview and summary"
              >
                <i class="bi bi-eye me-1"></i>
                Overview
              </router-link>
            </li>
            <!--end::Nav item-->
            <!--begin::Nav item-->
            <li class="nav-item">
              <router-link
                :to="projectsUrl"
                class="nav-link text-active-primary me-6"
                active-class="active"
                title="View customer projects and assignments"
              >
                <i class="bi bi-briefcase me-1"></i>
                Projects
              </router-link>
            </li>
            <!--end::Nav item-->
            <!--begin::Nav item-->
            <li class="nav-item">
              <router-link
                :to="settingsUrl"
                class="nav-link text-active-primary me-6"
                active-class="active"
                title="Configure customer settings"
              >
                <i class="bi bi-gear me-1"></i>
                Settings
              </router-link>
            </li>
            <!--end::Nav item-->
          </ul>
        </div>
        <!--begin::Navs-->
      </div>
    </div>
    <!--end::Navbar-->
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, provide } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getCustomerById } from '@/core/services/businessServices/Customer';
import type { Customer } from '@/core/models/Customer';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const customer = ref<Customer | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const customerId = computed(() => route.params.id as string);

// URL computations
const overviewUrl = computed(() => `/customers/${customerId.value}/overview`);
const projectsUrl = computed(() => `/customers/${customerId.value}/projects`);
const settingsUrl = computed(() => `/customers/${customerId.value}/settings`);

// Profile completion calculation
const profileCompletion = computed(() => {
  if (!customer.value) return 0;
  
  const fields = [
    customer.value.name,
    customer.value.email,
    customer.value.phone,
    customer.value.address,
    customer.value.companyName,
    customer.value.contactPerson,
    customer.value.industry
  ];
  
  const filledFields = fields.filter(field => field && field.trim() !== '').length;
  return Math.round((filledFields / fields.length) * 100);
});

onMounted(async () => {
  if (customerId.value) {
    await loadCustomer();
  }
});

const loadCustomer = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const customerData = await getCustomerById(customerId.value);
    if (customerData) {
      customer.value = customerData;
    } else {
      error.value = 'Customer not found';
    }
  } catch (err) {
    console.error('Failed to load customer:', err);
    error.value = 'Failed to load customer data';
  } finally {
    loading.value = false;
  }
};

// Provide refresh function to child components
provide('refreshCustomer', loadCustomer);

const handleRefreshClick = () => {
  loadCustomer();
};

const goBack = () => {
  router.push('/customers');
};

const getInitials = (name?: string) => {
  if (!name) return 'C';
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const formatDate = (date: Date | string | undefined) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString();
};

const getStatusLabel = (status?: string) => {
  switch (status) {
    case 'ACTIVE':
      return 'Active';
    case 'INACTIVE':
      return 'Inactive';
    case 'PROSPECT':
      return 'Prospect';
    default:
      return 'Unknown';
  }
};
</script>

<style scoped>
.nav-link {
  color: #6c757d;
  text-decoration: none;
  transition: color 0.15s ease-in-out;
}

.nav-link:hover {
  color: #009ef7;
}

.nav-link.active {
  color: #009ef7;
  border-bottom: 2px solid #009ef7;
}
</style> 