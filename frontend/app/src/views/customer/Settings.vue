<template>
  <!--begin::Loading State for Settings-->
  <div v-if="!customer" class="d-flex justify-content-center align-items-center" style="min-height: 300px;">
    <div class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="mt-3">
        <span class="fw-semobold text-gray-600">Loading customer settings...</span>
      </div>
    </div>
  </div>
  <!--end::Loading State for Settings-->

  <!--begin::Settings Content-->
  <div v-else>
    <!--begin::Page Header-->
    <div class="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between mb-5">
      <div class="d-flex align-items-center">
        <KTIcon icon-name="setting-2" icon-class="fs-2x text-primary me-3" />
        <div>
          <h1 class="fw-bold mb-1">Customer Settings</h1>
          <p class="text-muted mb-0">Manage customer profile, contact information, and preferences</p>
        </div>
      </div>
      <div class="d-flex align-items-center mt-3 mt-sm-0">
        <span class="badge badge-light-primary fs-7 me-2">
          <KTIcon icon-name="information-5" icon-class="fs-6 me-1" />
          Auto-save enabled
        </span>
      </div>
    </div>
    <!--end::Page Header-->

    <!--begin::Basic info-->
    <div class="card mb-5 mb-xl-10">
      <!--begin::Card header-->
      <div
        class="card-header border-0 cursor-pointer"
        role="button"
        data-bs-toggle="collapse"
        data-bs-target="#kt_account_profile_details"
        aria-expanded="true"
        aria-controls="kt_account_profile_details"
      >
        <!--begin::Card title-->
        <div class="card-title m-0">
          <div class="d-flex align-items-center">
            <KTIcon icon-name="user" icon-class="fs-2 text-primary me-3" />
            <h3 class="fw-bold m-0">Customer Details</h3>
          </div>
        </div>
        <!--end::Card title-->
        
        <!--begin::Card toolbar-->
        <div class="card-toolbar">
          <span class="badge badge-light-info fs-7">
            <KTIcon icon-name="information-5" icon-class="fs-6 me-1" />
            Required fields marked with *
          </span>
        </div>
        <!--end::Card toolbar-->
      </div>
      <!--begin::Card header-->

      <!--begin::Content-->
      <div id="kt_account_profile_details" class="collapse show">
        <!--begin::Form-->
        <form
          id="kt_account_profile_details_form"
          class="form"
          @submit.prevent="saveChanges()"
        >
          <!--begin::Card body-->
          <div class="card-body border-top p-9">
            <!--begin::Input group-->
            <div class="row mb-6">
              <!--begin::Label-->
              <label class="col-lg-4 col-form-label required fw-semobold fs-6">
                <KTIcon icon-name="user" icon-class="fs-6 me-2" />
                Customer Name
              </label>
              <!--end::Label-->

              <!--begin::Col-->
              <div class="col-lg-8 fv-row">
                <input
                  type="text"
                  name="name"
                  class="form-control form-control-lg form-control-solid mb-3 mb-lg-0"
                  placeholder="Enter customer name"
                  v-model="profileDetails.name"
                  :class="{ 'is-invalid': !profileDetails.name }"
                />
                <div class="invalid-feedback" v-if="!profileDetails.name">
                  Customer name is required
                </div>
                <div class="form-text">
                  <KTIcon icon-name="information-5" icon-class="fs-6 me-1" />
                  Enter the customer's full name or company name
                </div>
              </div>
              <!--end::Col-->
            </div>
            <!--end::Input group-->

            <!--begin::Input group-->
            <div class="row mb-6">
              <!--begin::Label-->
              <label class="col-lg-4 col-form-label fw-semobold fs-6">
                <KTIcon icon-name="briefcase" icon-class="fs-6 me-2" />
                Company Name
              </label>
              <!--end::Label-->

              <!--begin::Col-->
              <div class="col-lg-8 fv-row">
                <input
                  type="text"
                  name="companyName"
                  class="form-control form-control-lg form-control-solid"
                  placeholder="Enter company name"
                  v-model="profileDetails.companyName"
                />
                <div class="form-text">
                  <KTIcon icon-name="information-5" icon-class="fs-6 me-1" />
                  Enter the company name if different from customer name
                </div>
              </div>
              <!--end::Col-->
            </div>
            <!--end::Input group-->

            <!--begin::Input group-->
            <div class="row mb-6">
              <!--begin::Label-->
              <label class="col-lg-4 col-form-label fw-semobold fs-6">
                <KTIcon icon-name="sms" icon-class="fs-6 me-2" />
                Email Address
              </label>
              <!--end::Label-->

              <!--begin::Col-->
              <div class="col-lg-8 fv-row">
                <input
                  type="email"
                  name="email"
                  class="form-control form-control-lg form-control-solid"
                  placeholder="Enter email address"
                  v-model="profileDetails.email"
                />
                <div class="form-text">
                  <KTIcon icon-name="information-5" icon-class="fs-6 me-1" />
                  Primary contact email address
                </div>
              </div>
              <!--end::Col-->
            </div>
            <!--end::Input group-->

            <!--begin::Input group-->
            <div class="row mb-6">
              <!--begin::Label-->
              <label class="col-lg-4 col-form-label fw-semobold fs-6">
                <KTIcon icon-name="phone" icon-class="fs-6 me-2" />
                Phone Number
              </label>
              <!--end::Label-->

              <!--begin::Col-->
              <div class="col-lg-8 fv-row">
                <input
                  type="tel"
                  name="phone"
                  class="form-control form-control-lg form-control-solid"
                  placeholder="Enter phone number"
                  v-model="profileDetails.phone"
                />
                <div class="form-text">
                  <KTIcon icon-name="information-5" icon-class="fs-6 me-1" />
                  Primary contact phone number
                </div>
              </div>
              <!--end::Col-->
            </div>
            <!--end::Input group-->

            <!--begin::Input group-->
            <div class="row mb-6">
              <!--begin::Label-->
              <label class="col-lg-4 col-form-label fw-semobold fs-6">
                <KTIcon icon-name="map-pin" icon-class="fs-6 me-2" />
                Address
              </label>
              <!--end::Label-->

              <!--begin::Col-->
              <div class="col-lg-8 fv-row">
                <textarea
                  name="address"
                  class="form-control form-control-lg form-control-solid"
                  rows="3"
                  placeholder="Enter full address"
                  v-model="profileDetails.address"
                ></textarea>
                <div class="form-text">
                  <KTIcon icon-name="information-5" icon-class="fs-6 me-1" />
                  Complete address including street, city, and postal code
                </div>
              </div>
              <!--end::Col-->
            </div>
            <!--end::Input group-->

            <!--begin::Input group-->
            <div class="row mb-6">
              <!--begin::Label-->
              <label class="col-lg-4 col-form-label fw-semobold fs-6">
                <KTIcon icon-name="building" icon-class="fs-6 me-2" />
                City
              </label>
              <!--end::Label-->

              <!--begin::Col-->
              <div class="col-lg-8 fv-row">
                <input
                  type="text"
                  name="city"
                  class="form-control form-control-lg form-control-solid"
                  placeholder="Enter city"
                  v-model="profileDetails.city"
                />
              </div>
              <!--end::Col-->
            </div>
            <!--end::Input group-->

            <!--begin::Input group-->
            <div class="row mb-6">
              <!--begin::Label-->
              <label class="col-lg-4 col-form-label fw-semobold fs-6">
                <KTIcon icon-name="flag" icon-class="fs-6 me-2" />
                Country
              </label>
              <!--end::Label-->

              <!--begin::Col-->
              <div class="col-lg-8 fv-row">
                <input
                  type="text"
                  name="country"
                  class="form-control form-control-lg form-control-solid"
                  placeholder="Enter country"
                  v-model="profileDetails.country"
                />
              </div>
              <!--end::Col-->
            </div>
            <!--end::Input group-->

            <!--begin::Input group-->
            <div class="row mb-6">
              <!--begin::Label-->
              <label class="col-lg-4 col-form-label fw-semobold fs-6">
                <KTIcon icon-name="document" icon-class="fs-6 me-2" />
                VAT Number
              </label>
              <!--end::Label-->

              <!--begin::Col-->
              <div class="col-lg-8 fv-row">
                <input
                  type="text"
                  name="vatNumber"
                  class="form-control form-control-lg form-control-solid"
                  placeholder="Enter VAT number"
                  v-model="profileDetails.vatNumber"
                />
                <div class="form-text">
                  <KTIcon icon-name="information-5" icon-class="fs-6 me-1" />
                  Partita IVA for Italian companies
                </div>
              </div>
              <!--end::Col-->
            </div>
            <!--end::Input group-->

            <!--begin::Input group-->
            <div class="row mb-6">
              <!--begin::Label-->
              <label class="col-lg-4 col-form-label fw-semobold fs-6">
                <KTIcon icon-name="document" icon-class="fs-6 me-2" />
                Fiscal Code
              </label>
              <!--end::Label-->

              <!--begin::Col-->
              <div class="col-lg-8 fv-row">
                <input
                  type="text"
                  name="fiscalCode"
                  class="form-control form-control-lg form-control-solid"
                  placeholder="Enter fiscal code"
                  v-model="profileDetails.fiscalCode"
                />
                <div class="form-text">
                  <KTIcon icon-name="information-5" icon-class="fs-6 me-1" />
                  Codice Fiscale for Italian companies
                </div>
              </div>
              <!--end::Col-->
            </div>
            <!--end::Input group-->

            <!--begin::Input group-->
            <div class="row mb-6">
              <!--begin::Label-->
              <label class="col-lg-4 col-form-label fw-semobold fs-6">
                <KTIcon icon-name="user" icon-class="fs-6 me-2" />
                Contact Person
              </label>
              <!--end::Label-->

              <!--begin::Col-->
              <div class="col-lg-8 fv-row">
                <input
                  type="text"
                  name="contactPerson"
                  class="form-control form-control-lg form-control-solid"
                  placeholder="Enter contact person name"
                  v-model="profileDetails.contactPerson"
                />
              </div>
              <!--end::Col-->
            </div>
            <!--end::Input group-->

            <!--begin::Input group-->
            <div class="row mb-6">
              <!--begin::Label-->
              <label class="col-lg-4 col-form-label fw-semobold fs-6">
                <KTIcon icon-name="phone" icon-class="fs-6 me-2" />
                Contact Phone
              </label>
              <!--end::Label-->

              <!--begin::Col-->
              <div class="col-lg-8 fv-row">
                <input
                  type="tel"
                  name="contactPhone"
                  class="form-control form-control-lg form-control-solid"
                  placeholder="Enter contact phone"
                  v-model="profileDetails.contactPhone"
                />
              </div>
              <!--end::Col-->
            </div>
            <!--end::Input group-->

            <!--begin::Input group-->
            <div class="row mb-6">
              <!--begin::Label-->
              <label class="col-lg-4 col-form-label fw-semobold fs-6">
                <KTIcon icon-name="sms" icon-class="fs-6 me-2" />
                Contact Email
              </label>
              <!--end::Label-->

              <!--begin::Col-->
              <div class="col-lg-8 fv-row">
                <input
                  type="email"
                  name="contactEmail"
                  class="form-control form-control-lg form-control-solid"
                  placeholder="Enter contact email"
                  v-model="profileDetails.contactEmail"
                />
              </div>
              <!--end::Col-->
            </div>
            <!--end::Input group-->

            <!--begin::Input group-->
            <div class="row mb-6">
              <!--begin::Label-->
              <label class="col-lg-4 col-form-label fw-semobold fs-6">
                <KTIcon icon-name="briefcase" icon-class="fs-6 me-2" />
                Industry
              </label>
              <!--end::Label-->

              <!--begin::Col-->
              <div class="col-lg-8 fv-row">
                <input
                  type="text"
                  name="industry"
                  class="form-control form-control-lg form-control-solid"
                  placeholder="Enter industry"
                  v-model="profileDetails.industry"
                />
              </div>
              <!--end::Col-->
            </div>
            <!--end::Input group-->

            <!--begin::Input group-->
            <div class="row mb-6">
              <!--begin::Label-->
              <label class="col-lg-4 col-form-label fw-semobold fs-6">
                <KTIcon icon-name="globe" icon-class="fs-6 me-2" />
                Website
              </label>
              <!--end::Label-->

              <!--begin::Col-->
              <div class="col-lg-8 fv-row">
                <input
                  type="url"
                  name="website"
                  class="form-control form-control-lg form-control-solid"
                  placeholder="Enter website URL"
                  v-model="profileDetails.website"
                />
              </div>
              <!--end::Col-->
            </div>
            <!--end::Input group-->

            <!--begin::Input group-->
            <div class="row mb-6">
              <!--begin::Label-->
              <label class="col-lg-4 col-form-label fw-semobold fs-6">
                <KTIcon icon-name="status" icon-class="fs-6 me-2" />
                Status
              </label>
              <!--end::Label-->

              <!--begin::Col-->
              <div class="col-lg-8 fv-row">
                <select
                  name="status"
                  class="form-select form-select-lg form-select-solid"
                  v-model="profileDetails.status"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="PROSPECT">Prospect</option>
                </select>
              </div>
              <!--end::Col-->
            </div>
            <!--end::Input group-->

            <!--begin::Input group-->
            <div class="row mb-6">
              <!--begin::Label-->
              <label class="col-lg-4 col-form-label fw-semobold fs-6">
                <KTIcon icon-name="note" icon-class="fs-6 me-2" />
                Notes
              </label>
              <!--end::Label-->

              <!--begin::Col-->
              <div class="col-lg-8 fv-row">
                <textarea
                  name="notes"
                  class="form-control form-control-lg form-control-solid"
                  rows="4"
                  placeholder="Enter additional notes"
                  v-model="profileDetails.notes"
                ></textarea>
                <div class="form-text">
                  <KTIcon icon-name="information-5" icon-class="fs-6 me-1" />
                  Additional information about the customer
                </div>
              </div>
              <!--end::Col-->
            </div>
            <!--end::Input group-->
          </div>
          <!--end::Card body-->

          <!--begin::Card footer-->
          <div class="card-footer d-flex justify-content-end py-6 px-9">
            <button
              type="button"
              class="btn btn-light btn-active-light-primary me-2"
              @click="resetForm()"
            >
              <KTIcon icon-name="arrow-left" icon-class="fs-4 me-1" />
              Reset
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="!profileDetails.name || isSaving"
            >
              <KTIcon icon-name="check" icon-class="fs-4 me-1" />
              {{ isSaving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
          <!--end::Card footer-->
        </form>
        <!--end::Form-->
      </div>
      <!--end::Content-->
    </div>
    <!--end::Basic info-->
  </div>
  <!--end::Settings Content-->
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getCustomerById, updateCustomer } from '@/core/services/businessServices/Customer';
import type { Customer } from '@/core/models/Customer';
import { useAuthStore } from '@/stores/auth';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const customer = ref<Customer | null>(null);
const isSaving = ref(false);

const profileDetails = reactive({
  name: '',
  companyName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  country: '',
  vatNumber: '',
  fiscalCode: '',
  contactPerson: '',
  contactPhone: '',
  contactEmail: '',
  industry: '',
  website: '',
  status: 'ACTIVE',
  notes: ''
});

const customerId = computed(() => route.params.id as string);

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
      // Populate form with customer data
      Object.assign(profileDetails, {
        name: customerData.name || '',
        companyName: customerData.companyName || '',
        email: customerData.email || '',
        phone: customerData.phone || '',
        address: customerData.address || '',
        city: customerData.city || '',
        country: customerData.country || '',
        vatNumber: customerData.vatNumber || '',
        fiscalCode: customerData.fiscalCode || '',
        contactPerson: customerData.contactPerson || '',
        contactPhone: customerData.contactPhone || '',
        contactEmail: customerData.contactEmail || '',
        industry: customerData.industry || '',
        website: customerData.website || '',
        status: customerData.status || 'ACTIVE',
        notes: customerData.notes || ''
      });
    } else {
      authStore.setError('Customer not found', 404);
      router.push('/customers');
    }
  } catch (error) {
    console.error('Error loading customer:', error);
    authStore.setError('Failed to load customer', 500);
  }
};

const saveChanges = async () => {
  if (!profileDetails.name) {
    Swal.fire({
      title: 'Validation Error',
      text: 'Customer name is required',
      icon: 'error',
      confirmButtonText: 'OK'
    });
    return;
  }

  isSaving.value = true;
  try {
    const updatedCustomer = await updateCustomer(customerId.value, profileDetails);
    if (updatedCustomer) {
      customer.value = updatedCustomer;
      Swal.fire({
        title: 'Success!',
        text: 'Customer updated successfully',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    }
  } catch (error) {
    console.error('Error updating customer:', error);
    Swal.fire({
      title: 'Error',
      text: 'Failed to update customer',
      icon: 'error',
      confirmButtonText: 'OK'
    });
  } finally {
    isSaving.value = false;
  }
};

const resetForm = () => {
  if (customer.value) {
    Object.assign(profileDetails, {
      name: customer.value.name || '',
      companyName: customer.value.companyName || '',
      email: customer.value.email || '',
      phone: customer.value.phone || '',
      address: customer.value.address || '',
      city: customer.value.city || '',
      country: customer.value.country || '',
      vatNumber: customer.value.vatNumber || '',
      fiscalCode: customer.value.fiscalCode || '',
      contactPerson: customer.value.contactPerson || '',
      contactPhone: customer.value.contactPhone || '',
      contactEmail: customer.value.contactEmail || '',
      industry: customer.value.industry || '',
      website: customer.value.website || '',
      status: customer.value.status || 'ACTIVE',
      notes: customer.value.notes || ''
    });
  }
};
</script> 