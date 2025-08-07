<template>
  <div
    class="modal fade"
    id="kt_projects_export_modal"
    tabindex="-1"
    aria-hidden="true"
  >
    <!--begin::Modal dialog-->
    <div class="modal-dialog modal-dialog-centered mw-750px">
      <!--begin::Modal content-->
      <div class="modal-content">
        <!--begin::Modal header-->
        <div class="modal-header">
          <!--begin::Modal title-->
          <h2 class="fw-bold">Export Projects</h2>
          <!--end::Modal title-->

          <!--begin::Close-->
          <div
            id="kt_projects_export_close"
            data-bs-dismiss="modal"
            class="btn btn-icon btn-sm btn-active-icon-primary"
          >
            <KTIcon icon-name="cross" icon-class="fs-1" />
          </div>
          <!--end::Close-->
        </div>
        <!--end::Modal header-->

        <!--begin::Modal body-->
        <div class="modal-body scroll-y mx-5 mx-xl-15 my-7">
          <!--begin::Form-->
          <el-form
            @submit.prevent="submit()"
            :model="formData"
            :rules="rules"
            ref="formRef"
          >
            <!--begin::Export Format-->
            <div class="fv-row mb-10">
              <!--begin::Label-->
              <label class="fs-5 fw-semobold form-label mb-5">
                <KTIcon icon-name="file-down" icon-class="fs-6 me-2" />
                Export Format:
              </label>
              <!--end::Label-->

              <!--begin::Input-->
              <el-form-item prop="format">
                <el-select v-model="formData.format" class="d-block w-100">
                  <el-option value="excel" key="excel" label="Excel (.xlsx)" />
                  <el-option value="csv" key="csv" label="CSV (.csv)" />
                </el-select>
              </el-form-item>
              <!--end::Input-->
            </div>
            <!--end::Export Format-->

            <!--begin::Filters-->
            <div class="fv-row mb-10">
              <label class="fs-5 fw-semobold form-label mb-5">
                <KTIcon icon-name="filter" icon-class="fs-6 me-2" />
                Filters:
              </label>
              
              <div class="row">
                <div class="col-md-6">
                  <label class="form-label">Status:</label>
                  <el-select v-model="formData.status" class="d-block w-100">
                    <el-option value="all" label="All Projects" />
                    <el-option value="active" label="Active" />
                    <el-option value="completed" label="Completed" />
                    <el-option value="on hold" label="On Hold" />
                    <el-option value="cancelled" label="Cancelled" />
                  </el-select>
                </div>
                
                <div class="col-md-6">
                  <label class="form-label">Priority:</label>
                  <el-select v-model="formData.priorities" multiple class="d-block w-100" placeholder="Select priorities">
                    <el-option value="high" label="High" />
                    <el-option value="medium" label="Medium" />
                    <el-option value="low" label="Low" />
                  </el-select>
                </div>
              </div>
            </div>
            <!--end::Filters-->

            <!--begin::Include Options-->
            <div class="fv-row mb-10">
              <label class="fs-5 fw-semobold form-label mb-5">
                <KTIcon icon-name="settings" icon-class="fs-6 me-2" />
                Include Additional Data:
              </label>
              
              <div class="row">
                <div class="col-md-6">
                  <el-checkbox v-model="formData.includeSkills" class="mb-3">
                    <span class="ms-2">Required Skills (Hard & Soft)</span>
                  </el-checkbox>
                  
                  <el-checkbox v-model="formData.includeAssignments" class="mb-3">
                    <span class="ms-2">Project Assignments</span>
                  </el-checkbox>
                </div>
                
                <div class="col-md-6">
                  <el-checkbox v-model="formData.includeCustomerInfo" class="mb-3">
                    <span class="ms-2">Customer Information</span>
                  </el-checkbox>
                  
                  <el-checkbox v-model="formData.includeTimeline" class="mb-3">
                    <span class="ms-2">Timeline & Progress</span>
                  </el-checkbox>
                </div>
              </div>
            </div>
            <!--end::Include Options-->

            <!--begin::Actions-->
            <div class="text-center">
              <button
                type="reset"
                id="kt_projects_export_cancel"
                class="btn btn-light me-3"
                @click="resetForm"
              >
                Reset
              </button>

              <!--begin::Button-->
              <button
                :data-kt-indicator="loading ? 'on' : null"
                type="submit"
                class="btn btn-lg btn-primary"
                :disabled="loading"
              >
                <span v-if="!loading" class="indicator-label">
                  <KTIcon icon-name="file-down" icon-class="fs-3 me-2" />
                  Export Projects
                </span>
                <span v-if="loading" class="indicator-progress">
                  Generating Export...
                  <span
                    class="spinner-border spinner-border-sm align-middle ms-2"
                  ></span>
                </span>
              </button>
              <!--end::Button-->
            </div>
            <!--end::Actions-->
          </el-form>
          <!--end::Form-->
        </div>
        <!--end::Modal body-->
      </div>
      <!--end::Modal content-->
    </div>
    <!--end::Modal dialog-->
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted } from "vue";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { Modal } from "bootstrap";
import { exportProjects, getProjectExportFilters } from "@/core/services/businessServices/Export";

export default defineComponent({
  name: "export-projects-modal",
  components: {},
  setup() {
    const formRef = ref<null | HTMLFormElement>(null);
    const loading = ref<boolean>(false);

    const formData = ref({
      format: 'excel',
      status: 'all',
      priorities: [],
      includeSkills: false,
      includeAssignments: false,
      includeCustomerInfo: false,
      includeTimeline: false
    });

    const rules = ref({
      format: [
        {
          required: true,
          message: "Export format is required",
          trigger: "change",
        },
      ],
    });

    const submit = async () => {
      if (!formRef.value) {
        return;
      }

      formRef.value.validate(async (valid: boolean) => {
        if (valid) {
          loading.value = true;

          try {
            // Prepare filters object
            const filters: any = {
              status: formData.value.status
            };

            // Add priority filter if selected
            if (formData.value.priorities.length > 0) {
              filters.priorities = formData.value.priorities;
            }

            // Add include options
            filters.includeSkills = formData.value.includeSkills;
            filters.includeAssignments = formData.value.includeAssignments;
            filters.includeCustomerInfo = formData.value.includeCustomerInfo;
            filters.includeTimeline = formData.value.includeTimeline;

            // Call export function
            const result = await exportProjects({
              format: formData.value.format as 'excel' | 'csv',
              filters
            });

            if (result) {
              // Create download link
              const blob = new Blob([result], {
                type: formData.value.format === 'excel' 
                  ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                  : 'text/csv'
              });
              
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `projects_export_${new Date().toISOString().split('T')[0]}.${formData.value.format === 'excel' ? 'xlsx' : 'csv'}`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              window.URL.revokeObjectURL(url);

              // Show success message
              Swal.fire({
                text: "Export completed successfully!",
                icon: "success",
                buttonsStyling: false,
                confirmButtonText: "Ok, got it!",
                heightAuto: false,
                customClass: {
                  confirmButton: "btn btn-primary",
                },
              }).then(() => {
                // Close modal
                const modal = document.getElementById('kt_projects_export_modal');
                if (modal) {
                  const bootstrapModal = Modal.getInstance(modal);
                  bootstrapModal?.hide();
                }
              });
            }
          } catch (error) {
            console.error('Export error:', error);
            Swal.fire({
              text: "Failed to export projects. Please try again.",
              icon: "error",
              buttonsStyling: false,
              confirmButtonText: "Ok, got it!",
              heightAuto: false,
              customClass: {
                confirmButton: "btn btn-primary",
              },
            });
          } finally {
            loading.value = false;
          }
        } else {
          Swal.fire({
            text: "Please fill in all required fields.",
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            heightAuto: false,
            customClass: {
              confirmButton: "btn btn-primary",
            },
          });
          return false;
        }
      });
    };

    const resetForm = () => {
      formData.value = {
        format: 'excel',
        status: 'all',
        priorities: [],
        includeSkills: false,
        includeAssignments: false,
        includeCustomerInfo: false,
        includeTimeline: false
      };
    };

    return {
      formData,
      rules,
      submit,
      formRef,
      loading,
      resetForm
    };
  },
});
</script>

<style lang="scss">
.el-select {
  width: 100%;
}
</style> 