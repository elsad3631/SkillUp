<template>
  <div
    class="modal fade"
    id="kt_employees_export_modal"
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
          <h2 class="fw-bold">Export Employees</h2>
          <!--end::Modal title-->

          <!--begin::Close-->
          <div
            id="kt_employees_export_close"
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

                         <!--begin::Date Range-->
             <!-- Note: Date range filtering is not available for this entity -->
             <!-- <div class="fv-row mb-10">
               <label class="fs-5 fw-semobold form-label mb-5">
                 <KTIcon icon-name="calendar" icon-class="fs-6 me-2" />
                 Date Range (Optional):
               </label>
               <el-form-item prop="dateRange">
                 <el-date-picker 
                   type="daterange" 
                   v-model="formData.dateRange"
                   range-separator="to"
                   start-placeholder="Start date"
                   end-placeholder="End date"
                   format="YYYY-MM-DD"
                   value-format="YYYY-MM-DD"
                   class="w-100"
                 />
               </el-form-item>
             </div> -->
             <!--end::Date Range-->

            <!--begin::Filters Row-->
            <div class="row mb-10">
              <!--begin::Department Filter-->
              <div class="col-md-6">
                <label class="fs-5 fw-semobold form-label mb-5">
                  <KTIcon icon-name="building" icon-class="fs-6 me-2" />
                  Department:
                </label>
                <el-form-item prop="departments">
                  <el-select 
                    v-model="formData.departments" 
                    multiple 
                    collapse-tags
                    placeholder="Select departments"
                    class="w-100"
                  >
                    <el-option 
                      v-for="dept in availableFilters.departments" 
                      :key="dept" 
                      :value="dept" 
                      :label="dept" 
                    />
                  </el-select>
                </el-form-item>
              </div>
              <!--end::Department Filter-->

              <!--begin::Role Filter-->
              <div class="col-md-6">
                <label class="fs-5 fw-semobold form-label mb-5">
                  <KTIcon icon-name="shield-tick" icon-class="fs-6 me-2" />
                  Roles:
                </label>
                <el-form-item prop="roles">
                  <el-select 
                    v-model="formData.roles" 
                    multiple 
                    collapse-tags
                    placeholder="Select roles"
                    class="w-100"
                  >
                    <el-option 
                      v-for="role in availableFilters.roles" 
                      :key="role" 
                      :value="role" 
                      :label="role" 
                    />
                  </el-select>
                </el-form-item>
              </div>
              <!--end::Role Filter-->
            </div>
            <!--end::Filters Row-->

            <!--begin::Status Filter-->
            <div class="fv-row mb-10">
              <label class="fs-5 fw-semobold form-label mb-5">
                <KTIcon icon-name="check-circle" icon-class="fs-6 me-2" />
                Status:
              </label>
              <el-form-item prop="status">
                <el-select v-model="formData.status" class="d-block w-100">
                  <el-option value="all" key="all" label="All Employees" />
                  <el-option value="available" key="available" label="Available Only" />
                  <el-option value="busy" key="busy" label="Busy Only" />
                </el-select>
              </el-form-item>
            </div>
            <!--end::Status Filter-->

            <!--begin::Include Options-->
            <div class="fv-row mb-10">
              <label class="fs-5 fw-semobold form-label mb-5">
                <KTIcon icon-name="settings" icon-class="fs-6 me-2" />
                Include Additional Data:
              </label>
              
              <div class="row">
                <div class="col-md-6">
                  <el-checkbox v-model="formData.includeContactInfo" class="mb-3">
                    <span class="ms-2">Contact Information (Phone, Address)</span>
                  </el-checkbox>
                  
                  <el-checkbox v-model="formData.includeSkills" class="mb-3">
                    <span class="ms-2">Skills (Hard & Soft Skills)</span>
                  </el-checkbox>
                </div>
                
                <div class="col-md-6">
                  <el-checkbox v-model="formData.includeExperience" class="mb-3">
                    <span class="ms-2">Work Experience</span>
                  </el-checkbox>
                  
                  <el-checkbox v-model="formData.includeProjects" class="mb-3">
                    <span class="ms-2">Project Assignments</span>
                  </el-checkbox>
                </div>
              </div>
            </div>
            <!--end::Include Options-->

            <!--begin::Actions-->
            <div class="text-center">
              <button
                type="reset"
                id="kt_employees_export_cancel"
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
                  Export Employees
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
import { exportEmployees, getExportFilters } from "@/core/services/businessServices/Export";

export default defineComponent({
  name: "export-employees-modal",
  components: {},
  setup() {
    const formRef = ref<null | HTMLFormElement>(null);
    const loading = ref<boolean>(false);
    const availableFilters = ref<{
      departments: string[];
      roles: string[];
    }>({
      departments: [],
      roles: []
    });

         const formData = ref({
       format: 'excel',
       departments: [],
       roles: [],
       status: 'all',
       includeContactInfo: false,
       includeSkills: false,
       includeExperience: false,
       includeProjects: false
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

    const loadAvailableFilters = async () => {
      try {
        const filters = await getExportFilters();
        availableFilters.value = filters;
      } catch (error) {
        console.error('Failed to load filters:', error);
      }
    };

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

                         // Note: Date range filtering is not available for this entity
             // if (formData.value.dateRange && formData.value.dateRange.length === 2) {
             //   filters.dateRange = {
             //     start: new Date(formData.value.dateRange[0]),
             //     end: new Date(formData.value.dateRange[1])
             //   };
             // }

            // Add department filter if selected
            if (formData.value.departments.length > 0) {
              filters.departments = formData.value.departments;
            }

            // Add role filter if selected
            if (formData.value.roles.length > 0) {
              filters.roles = formData.value.roles;
            }

            // Add include options
            filters.includeContactInfo = formData.value.includeContactInfo;
            filters.includeSkills = formData.value.includeSkills;
            filters.includeExperience = formData.value.includeExperience;
            filters.includeProjects = formData.value.includeProjects;

                         // Call export function
             const result = await exportEmployees({
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
              link.download = `employees_export_${new Date().toISOString().split('T')[0]}.${formData.value.format === 'excel' ? 'xlsx' : 'csv'}`;
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
                const modal = document.getElementById('kt_employees_export_modal');
                if (modal) {
                  const bootstrapModal = Modal.getInstance(modal);
                  bootstrapModal?.hide();
                }
              });
            }
          } catch (error) {
            console.error('Export error:', error);
            Swal.fire({
              text: "Failed to export employees. Please try again.",
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
         departments: [],
         roles: [],
         status: 'all',
         includeContactInfo: false,
         includeSkills: false,
         includeExperience: false,
         includeProjects: false
       };
     };

    onMounted(() => {
      loadAvailableFilters();
    });

    return {
      formData,
      rules,
      submit,
      formRef,
      loading,
      availableFilters,
      resetForm
    };
  },
});
</script>
