<template>
  <!--begin::Loading State for Overview-->
  <div v-if="!customer" class="d-flex justify-content-center align-items-center" style="min-height: 300px;">
    <div class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="mt-3">
        <span class="fw-semobold text-gray-600">Loading overview...</span>
      </div>
    </div>
  </div>
  <!--end::Loading State for Overview-->

  <!--begin::Overview Content-->
  <div v-else>
    <!--begin::Profile Header Card-->
    <div class="card mb-5 mb-xl-10">
      <div class="card-body p-0">
        <!--begin::Profile Header-->
        <div class="d-flex flex-column flex-md-row align-items-center p-8">
          <!--begin::Avatar-->
          <div class="symbol symbol-100px symbol-circle mb-5 mb-md-0 me-md-8">
            <div class="symbol-label bg-light-primary">
              <span class="fs-2x fw-bold text-primary">
                {{ getInitials(customer?.name) }}
              </span>
            </div>
          </div>
          <!--end::Avatar-->

          <!--begin::Profile Info-->
          <div class="flex-grow-1 text-center text-md-start">
            <h2 class="fw-bold fs-1 text-dark mb-2">
              {{ customer?.name || 'Customer Name' }}
            </h2>
            <div class="d-flex flex-column flex-md-row align-items-center gap-3 mb-3">
              <span class="badge badge-light-primary fs-7 fw-bold" v-if="customer?.companyName">
                {{ customer.companyName }}
              </span>
              <span class="badge badge-light-info fs-7 fw-bold" v-if="customer?.industry">
                {{ customer.industry }}
              </span>
              <span :class="getStatusBadgeClass(customer?.status)" class="badge fs-7 fw-bold">
                {{ getStatusLabel(customer?.status) }}
              </span>
            </div>
            <div class="d-flex flex-column flex-md-row align-items-center gap-4 text-muted">
              <div class="d-flex align-items-center" v-if="customer?.email">
                <KTIcon icon-name="sms" icon-class="fs-5 me-2" />
                <span>{{ customer.email }}</span>
              </div>
              <div class="d-flex align-items-center" v-if="customer?.phone">
                <KTIcon icon-name="phone" icon-class="fs-5 me-2" />
                <span>{{ customer.phone }}</span>
              </div>
            </div>
          </div>
          <!--end::Profile Info-->

          <!--begin::Actions-->
          <div class="mt-5 mt-md-0">
            <router-link
              v-if="customer && customer.id"
              :to="editProfileUrl"
              class="btn btn-primary btn-lg"
            >
              <KTIcon icon-name="pencil" icon-class="fs-5 me-2" />
              Edit Profile
            </router-link>
          </div>
          <!--end::Actions-->
        </div>
        <!--end::Profile Header-->
      </div>
    </div>
    <!--end::Profile Header Card-->

    <!--begin::Details Cards-->
    <div class="row g-5 g-xl-10 mb-5 mb-xl-10">
      <!--begin::Customer Information-->
      <div class="col-xl-6">
        <div class="card h-100">
          <div class="card-header">
            <div class="card-title">
              <KTIcon icon-name="user" icon-class="fs-2 me-2 text-primary" />
              <h3 class="fw-bold m-0">Customer Information</h3>
            </div>
          </div>
          <div class="card-body">
            <div class="d-flex flex-column gap-4">
              <div class="d-flex align-items-center p-4 bg-light-primary rounded" v-if="customer?.companyName">
                <KTIcon icon-name="briefcase" icon-class="fs-2 me-3 text-primary" />
                <div>
                  <div class="text-muted fs-7 fw-semibold">Company Name</div>
                  <div class="fw-bold fs-6">{{ customer.companyName }}</div>
                </div>
              </div>

              <div class="d-flex align-items-center p-4 bg-light-info rounded" v-if="customer?.industry">
                <KTIcon icon-name="chart-simple" icon-class="fs-2 me-3 text-info" />
                <div>
                  <div class="text-muted fs-7 fw-semibold">Industry</div>
                  <div class="fw-bold fs-6">{{ customer.industry }}</div>
                </div>
              </div>

              <div class="d-flex align-items-center p-4 bg-light-success rounded" v-if="customer?.website">
                <KTIcon icon-name="globe" icon-class="fs-2 me-3 text-success" />
                <div>
                  <div class="text-muted fs-7 fw-semibold">Website</div>
                  <div class="fw-bold fs-6">
                    <a :href="customer.website" target="_blank" class="text-decoration-none">
                      {{ customer.website }}
                    </a>
                  </div>
                </div>
              </div>

              <div class="d-flex align-items-center p-4 bg-light-warning rounded" v-if="customer?.vatNumber">
                <KTIcon icon-name="document" icon-class="fs-2 me-3 text-warning" />
                <div>
                  <div class="text-muted fs-7 fw-semibold">VAT Number</div>
                  <div class="fw-bold fs-6">{{ customer.vatNumber }}</div>
                </div>
              </div>

              <div class="d-flex align-items-center p-4 bg-light-danger rounded" v-if="customer?.fiscalCode">
                <KTIcon icon-name="document" icon-class="fs-2 me-3 text-danger" />
                <div>
                  <div class="text-muted fs-7 fw-semibold">Fiscal Code</div>
                  <div class="fw-bold fs-6">{{ customer.fiscalCode }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--end::Customer Information-->

      <!--begin::Contact Information-->
      <div class="col-xl-6">
        <div class="card h-100">
          <div class="card-header">
            <div class="card-title">
              <KTIcon icon-name="phone" icon-class="fs-2 me-2 text-primary" />
              <h3 class="fw-bold m-0">Contact Information</h3>
            </div>
          </div>
          <div class="card-body">
            <div class="d-flex flex-column gap-4">
              <div class="d-flex align-items-center p-4 bg-light-primary rounded" v-if="customer?.contactPerson">
                <KTIcon icon-name="user" icon-class="fs-2 me-3 text-primary" />
                <div>
                  <div class="text-muted fs-7 fw-semibold">Contact Person</div>
                  <div class="fw-bold fs-6">{{ customer.contactPerson }}</div>
                </div>
              </div>

              <div class="d-flex align-items-center p-4 bg-light-info rounded" v-if="customer?.contactEmail">
                <KTIcon icon-name="sms" icon-class="fs-2 me-3 text-info" />
                <div>
                  <div class="text-muted fs-7 fw-semibold">Contact Email</div>
                  <div class="fw-bold fs-6">
                    <a :href="`mailto:${customer.contactEmail}`" class="text-decoration-none">
                      {{ customer.contactEmail }}
                    </a>
                  </div>
                </div>
              </div>

              <div class="d-flex align-items-center p-4 bg-light-success rounded" v-if="customer?.contactPhone">
                <KTIcon icon-name="phone" icon-class="fs-2 me-3 text-success" />
                <div>
                  <div class="text-muted fs-7 fw-semibold">Contact Phone</div>
                  <div class="fw-bold fs-6">
                    <a :href="`tel:${customer.contactPhone}`" class="text-decoration-none">
                      {{ customer.contactPhone }}
                    </a>
                  </div>
                </div>
              </div>

              <div class="d-flex align-items-center p-4 bg-light-warning rounded" v-if="customer?.email">
                <KTIcon icon-name="sms" icon-class="fs-2 me-3 text-warning" />
                <div>
                  <div class="text-muted fs-7 fw-semibold">Primary Email</div>
                  <div class="fw-bold fs-6">
                    <a :href="`mailto:${customer.email}`" class="text-decoration-none">
                      {{ customer.email }}
                    </a>
                  </div>
                </div>
              </div>

              <div class="d-flex align-items-center p-4 bg-light-danger rounded" v-if="customer?.phone">
                <KTIcon icon-name="phone" icon-class="fs-2 me-3 text-danger" />
                <div>
                  <div class="text-muted fs-7 fw-semibold">Primary Phone</div>
                  <div class="fw-bold fs-6">
                    <a :href="`tel:${customer.phone}`" class="text-decoration-none">
                      {{ customer.phone }}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--end::Contact Information-->
    </div>
    <!--end::Details Cards-->

    <!--begin::Address Information-->
    <div class="row g-5 g-xl-10 mb-5 mb-xl-10" v-if="customer?.address || customer?.city || customer?.country">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <KTIcon icon-name="map-pin" icon-class="fs-2 me-2 text-primary" />
              <h3 class="fw-bold m-0">Address Information</h3>
            </div>
          </div>
          <div class="card-body">
            <div class="d-flex flex-column gap-4">
              <div class="d-flex align-items-start p-4 bg-light-primary rounded" v-if="customer?.address">
                <KTIcon icon-name="map-pin" icon-class="fs-2 me-3 text-primary mt-1" />
                <div>
                  <div class="text-muted fs-7 fw-semibold">Full Address</div>
                  <div class="fw-bold fs-6">{{ customer.address }}</div>
                </div>
              </div>

              <div class="row" v-if="customer?.city || customer?.country">
                <div class="col-md-6" v-if="customer?.city">
                  <div class="d-flex align-items-center p-4 bg-light-info rounded">
                    <KTIcon icon-name="building" icon-class="fs-2 me-3 text-info" />
                    <div>
                      <div class="text-muted fs-7 fw-semibold">City</div>
                      <div class="fw-bold fs-6">{{ customer.city }}</div>
                    </div>
                  </div>
                </div>

                <div class="col-md-6" v-if="customer?.country">
                  <div class="d-flex align-items-center p-4 bg-light-success rounded">
                    <KTIcon icon-name="flag" icon-class="fs-2 me-3 text-success" />
                    <div>
                      <div class="text-muted fs-7 fw-semibold">Country</div>
                      <div class="fw-bold fs-6">{{ customer.country }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--end::Address Information-->

    <!--begin::Notes Section-->
    <div class="row g-5 g-xl-10 mb-5 mb-xl-10" v-if="customer?.notes">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <KTIcon icon-name="note" icon-class="fs-2 me-2 text-primary" />
              <h3 class="fw-bold m-0">Notes</h3>
            </div>
          </div>
          <div class="card-body">
            <div class="p-4 bg-light-primary rounded">
              <p class="mb-0 fs-6">{{ customer.notes }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--end::Notes Section-->

    <!--begin::Statistics Cards-->
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
                <div class="fw-bold fs-2">{{ customer?.projects?.length || 0 }}</div>
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
                  <KTIcon icon-name="calendar" icon-class="fs-2x text-white" />
                </div>
              </div>
              <div>
                <div class="text-muted fs-7 fw-semibold">Created</div>
                <div class="fw-bold fs-6">{{ formatDate(customer?.createdAt) }}</div>
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
                  <KTIcon icon-name="calendar" icon-class="fs-2x text-white" />
                </div>
              </div>
              <div>
                <div class="text-muted fs-7 fw-semibold">Last Updated</div>
                <div class="fw-bold fs-6">{{ formatDate(customer?.updatedAt) }}</div>
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
                  <KTIcon icon-name="status" icon-class="fs-2x text-white" />
                </div>
              </div>
              <div>
                <div class="text-muted fs-7 fw-semibold">Status</div>
                <div class="fw-bold fs-6">
                  <span :class="getStatusBadgeClass(customer?.status)" class="badge">
                    {{ getStatusLabel(customer?.status) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--end::Statistics Cards-->
  </div>
  <!--end::Overview Content-->
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getCustomerById } from '@/core/services/businessServices/Customer';
import type { Customer } from '@/core/models/Customer';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const customer = ref<Customer | null>(null);

const customerId = computed(() => route.params.id as string);
const editProfileUrl = computed(() => `/customers/${customerId.value}/settings`);

onMounted(async () => {
  if (customerId.value) {
    await loadCustomer();
  }
});

const loadCustomer = async () => {
  try {
    const customerData = await getCustomerById(customerId.value);
    if (customerData) {
      customer.value = customerData;
    } else {
      authStore.setError('Customer not found', 404);
      router.push('/customers');
    }
  } catch (error) {
    console.error('Error loading customer:', error);
    authStore.setError('Failed to load customer', 500);
  }
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

const getStatusBadgeClass = (status?: string) => {
  switch (status) {
    case 'ACTIVE':
      return 'badge-light-success';
    case 'INACTIVE':
      return 'badge-light-warning';
    case 'PROSPECT':
      return 'badge-light-primary';
    default:
      return 'badge-light-secondary';
  }
};
</script> 