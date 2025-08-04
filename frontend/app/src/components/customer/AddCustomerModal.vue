<template>
  <div class="modal fade" id="kt_modal_add_customer" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered mw-900px">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Add New Customer</h2>
          <div class="btn btn-icon btn-sm btn-active-icon-primary" data-bs-dismiss="modal">
            <KTIcon icon-name="cross" icon-class="fs-1" />
          </div>
        </div>

        <div class="modal-body scroll-y mx-5 mx-xl-15 my-7">
          <form @submit.prevent="onSubmit" class="form">
            <!-- Basic Information -->
            <div class="card mb-6">
              <div class="card-header">
                <h3 class="card-title">Basic Information</h3>
              </div>
              <div class="card-body">
                <div class="row mb-6">
                  <div class="col-md-6">
                    <label class="form-label required">Customer Name</label>
                    <input
                      v-model="form.name"
                      type="text"
                      class="form-control"
                      required
                    />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Company Name</label>
                    <input
                      v-model="form.companyName"
                      type="text"
                      class="form-control"
                    />
                  </div>
                </div>

                <div class="row mb-6">
                  <div class="col-md-6">
                    <label class="form-label">Industry</label>
                    <input
                      v-model="form.industry"
                      type="text"
                      class="form-control"
                      placeholder="e.g., Technology, Healthcare, Finance"
                    />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Status</label>
                    <select v-model="form.status" class="form-select">
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                      <option value="PROSPECT">Prospect</option>
                    </select>
                  </div>
                </div>

                <div class="row mb-6">
                  <div class="col-md-6">
                    <label class="form-label">Website</label>
                    <input
                      v-model="form.website"
                      type="url"
                      class="form-control"
                      placeholder="https://example.com"
                    />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">VAT Number</label>
                    <input
                      v-model="form.vatNumber"
                      type="text"
                      class="form-control"
                      placeholder="Partita IVA"
                    />
                  </div>
                </div>

                <div class="row mb-6">
                  <div class="col-md-6">
                    <label class="form-label">Fiscal Code</label>
                    <input
                      v-model="form.fiscalCode"
                      type="text"
                      class="form-control"
                      placeholder="Codice Fiscale"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Contact Information -->
            <div class="card mb-6">
              <div class="card-header">
                <h3 class="card-title">Contact Information</h3>
              </div>
              <div class="card-body">
                <div class="row mb-6">
                  <div class="col-md-6">
                    <label class="form-label">Email</label>
                    <input
                      v-model="form.email"
                      type="email"
                      class="form-control"
                    />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Phone</label>
                    <input
                      v-model="form.phone"
                      type="tel"
                      class="form-control"
                    />
                  </div>
                </div>

                <div class="row mb-6">
                  <div class="col-md-6">
                    <label class="form-label">Contact Person</label>
                    <input
                      v-model="form.contactPerson"
                      type="text"
                      class="form-control"
                    />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Contact Phone</label>
                    <input
                      v-model="form.contactPhone"
                      type="tel"
                      class="form-control"
                    />
                  </div>
                </div>

                <div class="row mb-6">
                  <div class="col-md-6">
                    <label class="form-label">Contact Email</label>
                    <input
                      v-model="form.contactEmail"
                      type="email"
                      class="form-control"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Address Information -->
            <div class="card mb-6">
              <div class="card-header">
                <h3 class="card-title">Address Information</h3>
              </div>
              <div class="card-body">
                <div class="row mb-6">
                  <div class="col-12">
                    <label class="form-label">Address</label>
                    <textarea
                      v-model="form.address"
                      class="form-control"
                      rows="3"
                      placeholder="Full address"
                    ></textarea>
                  </div>
                </div>

                <div class="row mb-6">
                  <div class="col-md-6">
                    <label class="form-label">City</label>
                    <input
                      v-model="form.city"
                      type="text"
                      class="form-control"
                    />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Country</label>
                    <input
                      v-model="form.country"
                      type="text"
                      class="form-control"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Additional Information -->
            <div class="card mb-6">
              <div class="card-header">
                <h3 class="card-title">Additional Information</h3>
              </div>
              <div class="card-body">
                <div class="row mb-6">
                  <div class="col-12">
                    <label class="form-label">Notes</label>
                    <textarea
                      v-model="form.notes"
                      class="form-control"
                      rows="4"
                      placeholder="Additional notes about the customer"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="d-flex justify-content-end">
              <button type="button" class="btn btn-light me-3" data-bs-dismiss="modal">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                Create Customer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from "vue";
import { createCustomer } from "@/core/services/businessServices/Customer";
import type { Customer } from "@/core/models/Customer";
import Swal from "sweetalert2/dist/sweetalert2.js";

export default defineComponent({
  name: "add-customer-modal",
  emits: ["customer-created"],
  props: {
    closeModal: {
      type: Function,
      required: true,
    },
  },
  setup(props, { emit }) {
    const loading = ref(false);

    const form = reactive({
      name: "",
      companyName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "",
      vatNumber: "",
      fiscalCode: "",
      contactPerson: "",
      contactPhone: "",
      contactEmail: "",
      notes: "",
      status: "ACTIVE",
      industry: "",
      website: "",
    });

    const resetForm = () => {
      Object.assign(form, {
        name: "",
        companyName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        country: "",
        vatNumber: "",
        fiscalCode: "",
        contactPerson: "",
        contactPhone: "",
        contactEmail: "",
        notes: "",
        status: "ACTIVE",
        industry: "",
        website: "",
      });
    };

    const onSubmit = async () => {
      if (!form.name.trim()) {
        Swal.fire("Error", "Customer name is required", "error");
        return;
      }

      loading.value = true;

      try {
        const customerData = {
          name: form.name.trim(),
          companyName: form.companyName?.trim() || undefined,
          email: form.email?.trim() || undefined,
          phone: form.phone?.trim() || undefined,
          address: form.address?.trim() || undefined,
          city: form.city?.trim() || undefined,
          country: form.country?.trim() || undefined,
          vatNumber: form.vatNumber?.trim() || undefined,
          fiscalCode: form.fiscalCode?.trim() || undefined,
          contactPerson: form.contactPerson?.trim() || undefined,
          contactPhone: form.contactPhone?.trim() || undefined,
          contactEmail: form.contactEmail?.trim() || undefined,
          notes: form.notes?.trim() || undefined,
          status: form.status,
          industry: form.industry?.trim() || undefined,
          website: form.website?.trim() || undefined,
        };

        const newCustomer = await createCustomer(customerData);

        if (newCustomer) {
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Customer created successfully",
          });

          emit("customer-created", newCustomer);
          resetForm();
          props.closeModal();
        } else {
          Swal.fire("Error", "Failed to create customer", "error");
        }
      } catch (error: any) {
        console.error("Failed to create customer:", error);
        Swal.fire("Error", error.message || "Failed to create customer", "error");
      } finally {
        loading.value = false;
      }
    };

    return {
      form,
      loading,
      onSubmit,
    };
  },
});
</script> 