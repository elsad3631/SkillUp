<template>
  <div
    class="modal fade"
    id="kt_modal_upload_file"
    tabindex="-1"
    aria-hidden="true"
    @hidden.bs.modal="handleModalHidden"
  >
    <!--begin::Modal dialog-->
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <!--begin::Modal content-->
      <div class="modal-content">
        <!--begin::Modal header-->
        <div class="modal-header" id="kt_modal_upload_file_header">
          <!--begin::Modal title-->
          <h2 class="fw-bold">Upload Files</h2>
          <!--end::Modal title-->

          <!--begin::Close-->
          <div
            id="kt_modal_upload_file_close"
            data-bs-dismiss="modal"
            class="btn btn-icon btn-sm btn-active-icon-primary"
          >
            <KTIcon icon-name="cross" icon-class="fs-1" />
          </div>
          <!--end::Close-->
        </div>
        <!--end::Modal header-->

        <!--begin::Modal body-->
        <div class="modal-body py-10 px-lg-17">
          <!--begin::Scroll-->
          <div
            class="scroll-y me-n7 pe-7"
            id="kt_modal_upload_file_scroll"
            data-kt-scroll="true"
            data-kt-scroll-activate="{default: false, lg: true}"
            data-kt-scroll-max-height="auto"
            data-kt-scroll-dependencies="#kt_modal_upload_file_header"
            data-kt-scroll-wrappers="#kt_modal_upload_file_scroll"
            data-kt-scroll-offset="300px"
          >
            <!--begin::Current path info-->
            <div v-if="currentPath" class="alert alert-info mb-7">
              <div class="d-flex align-items-center">
                <KTIcon icon-name="information-5" icon-class="fs-2x text-info me-4" />
                <div>
                  <h4 class="alert-heading">Uploading to:</h4>
                  <p class="mb-0">{{ currentPath || 'Root folder' }}</p>
                </div>
              </div>
            </div>
            <!--end::Current path info-->

            <!--begin::File upload area-->
            <div
              ref="dropZone"
              class="dropzone-area"
              :class="{ 'drag-over': isDragOver }"
              @dragover.prevent="handleDragOver"
              @dragleave.prevent="handleDragLeave"
              @drop.prevent="handleDrop"
              @click="triggerFileInput"
            >
              <div class="text-center">
                <KTIcon 
                  icon-name="files" 
                  icon-class="fs-5x text-primary mb-5" 
                />
                <div class="fw-bold fs-6 text-gray-900 mb-4">
                  Drop files here or click to browse
                </div>
                <div class="text-muted fs-7">
                  Maximum file size: {{ maxFileSize }}MB<br>
                  Allowed types: All file types
                </div>
              </div>
            </div>
            <!--end::File upload area-->

            <!--begin::Hidden file input-->
            <input
              ref="fileInput"
              type="file"
              multiple
              class="d-none"
              @change="handleFileSelect"
            />
            <!--end::Hidden file input-->

            <!--begin::Selected files list-->
            <div v-if="selectedFiles.length > 0" class="mt-7">
              <h6 class="fw-bold mb-4">Selected Files ({{ selectedFiles.length }})</h6>
              <div class="max-h-300px overflow-auto">
                <div
                  v-for="(file, index) in selectedFiles"
                  :key="index"
                  class="d-flex align-items-center border border-gray-300 rounded p-3 mb-3"
                >
                  <div class="symbol symbol-50px me-3">
                    <div class="symbol-label bg-light-primary">
                      <i :class="getFileIcon(file.name)" class="fs-2x"></i>
                    </div>
                  </div>
                  <div class="flex-grow-1">
                    <div class="fw-bold text-gray-900">{{ file.name }}</div>
                    <div class="text-muted fs-7">{{ formatFileSize(file.size) }}</div>
                  </div>
                  <button
                    type="button"
                    class="btn btn-sm btn-icon btn-active-light-danger"
                    @click="removeFile(index)"
                    :disabled="isUploading"
                  >
                    <KTIcon icon-name="cross" icon-class="fs-2" />
                  </button>
                </div>
              </div>
            </div>
            <!--end::Selected files list-->

            <!--begin::Upload progress-->
            <div v-if="uploadProgress > 0 && isUploading" class="mt-7">
              <div class="d-flex align-items-center mb-2">
                <span class="fw-bold text-gray-900 me-2">Uploading...</span>
                <span class="text-muted">{{ uploadProgress }}%</span>
              </div>
              <div class="progress">
                <div
                  class="progress-bar"
                  role="progressbar"
                  :style="{ width: `${uploadProgress}%` }"
                  :aria-valuenow="uploadProgress"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>
            <!--end::Upload progress-->
          </div>
          <!--end::Scroll-->
        </div>
        <!--end::Modal body-->

        <!--begin::Modal footer-->
        <div class="modal-footer flex-center">
          <!--begin::Button-->
          <button
            ref="cancelButton"
            type="reset"
            data-bs-dismiss="modal"
            class="btn btn-light me-3"
            :disabled="isUploading"
          >
            Cancel
          </button>
          <!--end::Button-->

          <!--begin::Button-->
          <button
            ref="submitButton"
            type="submit"
            class="btn btn-primary"
            @click="handleUpload"
            :disabled="isUploading || selectedFiles.length === 0"
          >
            <span v-if="!isUploading" class="indicator-label">
              <KTIcon icon-name="files" icon-class="fs-2 me-2" />
              Upload {{ selectedFiles.length }} file(s)
            </span>
            <span v-if="isUploading" class="indicator-progress">
              Uploading...
              <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
            </span>
          </button>
          <!--end::Button-->
        </div>
        <!--end::Modal footer-->
      </div>
      <!--end::Modal content-->
    </div>
    <!--end::Modal dialog-->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import KTIcon from "@/core/helpers/kt-icon/KTIcon.vue";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { Modal } from "bootstrap";

export default defineComponent({
  name: "UploadFileModal",
  components: {
    KTIcon,
  },
  props: {
    currentPath: {
      type: String,
      default: '',
    },
  },
  emits: ['files-uploaded'],
  setup(props, { emit }) {
    const selectedFiles = ref<File[]>([]);
    const isUploading = ref(false);
    const uploadProgress = ref(0);
    const isDragOver = ref(false);
    const maxFileSize = ref(100); // MB
    const fileInput = ref<HTMLInputElement | null>(null);
    const dropZone = ref<HTMLElement | null>(null);

    const triggerFileInput = () => {
      if (fileInput.value && !isUploading.value) {
        fileInput.value.click();
      }
    };

    const handleFileSelect = (event: Event) => {
      const input = event.target as HTMLInputElement;
      if (input.files) {
        addFiles(Array.from(input.files));
        input.value = ''; // Reset input
      }
    };

    const handleDragOver = (event: DragEvent) => {
      event.preventDefault();
      isDragOver.value = true;
    };

    const handleDragLeave = (event: DragEvent) => {
      event.preventDefault();
      isDragOver.value = false;
    };

    const handleDrop = (event: DragEvent) => {
      event.preventDefault();
      isDragOver.value = false;
      
      if (event.dataTransfer?.files) {
        addFiles(Array.from(event.dataTransfer.files));
      }
    };

    const addFiles = (files: File[]) => {
      if (isUploading.value) return;

      const validFiles = files.filter(file => {
        if (file.size > maxFileSize.value * 1024 * 1024) {
          Swal.fire({
            title: 'File too large',
            text: `${file.name} is larger than ${maxFileSize.value}MB and cannot be uploaded.`,
            icon: 'warning',
            confirmButtonText: 'OK'
          });
          return false;
        }
        return true;
      });

      selectedFiles.value = [...selectedFiles.value, ...validFiles];
    };

    const removeFile = (index: number) => {
      selectedFiles.value.splice(index, 1);
    };

    const handleUpload = async () => {
      if (selectedFiles.value.length === 0 || isUploading.value) return;

      try {
        isUploading.value = true;
        uploadProgress.value = 0;

        // Emit the upload event with files
        emit('files-uploaded', {
          files: selectedFiles.value,
          path: props.currentPath,
        });

        // Reset form
        selectedFiles.value = [];
        uploadProgress.value = 0;
        
        // Remove focus from any focused element to prevent accessibility warning
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        
        // Close modal
        const modal = document.getElementById('kt_modal_upload_file');
        if (modal) {
          const bootstrapModal = Modal.getInstance(modal);
          if (bootstrapModal) {
            bootstrapModal.hide();
          }
        }

      } catch (error) {
        console.error('Error in handleUpload:', error);
        Swal.fire({
          title: 'Error!',
          text: 'An unexpected error occurred while uploading files.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      } finally {
        isUploading.value = false;
      }
    };

    const getFileIcon = (fileName: string): string => {
      const extension = fileName.split('.').pop()?.toLowerCase() || '';
      
      const iconMap: Record<string, string> = {
        pdf: 'fa-file-pdf text-danger',
        doc: 'fa-file-word text-primary',
        docx: 'fa-file-word text-primary',
        xls: 'fa-file-excel text-success',
        xlsx: 'fa-file-excel text-success',
        ppt: 'fa-file-powerpoint text-warning',
        pptx: 'fa-file-powerpoint text-warning',
        txt: 'fa-file-text text-muted',
        jpg: 'fa-file-image text-info',
        jpeg: 'fa-file-image text-info',
        png: 'fa-file-image text-info',
        gif: 'fa-file-image text-info',
        zip: 'fa-file-archive text-secondary',
        rar: 'fa-file-archive text-secondary',
        mp4: 'fa-file-video text-danger',
        mp3: 'fa-file-audio text-success',
        css: 'fa-file-code text-info',
        js: 'fa-file-code text-warning',
        ts: 'fa-file-code text-primary',
        html: 'fa-file-code text-danger',
      };
      
      return iconMap[extension] || 'fa-file text-muted';
    };

    const formatFileSize = (bytes: number): string => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const resetForm = () => {
      selectedFiles.value = [];
      isUploading.value = false;
      uploadProgress.value = 0;
      isDragOver.value = false;
    };

    // Handle modal hidden event to clean up focus
    const handleModalHidden = () => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    };

    return {
      selectedFiles,
      isUploading,
      uploadProgress,
      isDragOver,
      maxFileSize,
      fileInput,
      dropZone,
      triggerFileInput,
      handleFileSelect,
      handleDragOver,
      handleDragLeave,
      handleDrop,
      removeFile,
      handleUpload,
      getFileIcon,
      formatFileSize,
      resetForm,
      handleModalHidden,
    };
  },
});
</script>

<style scoped>
.dropzone-area {
  border: 2px dashed #cbd5e1;
  border-radius: 0.5rem;
  padding: 3rem 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #f8fafc;
}

.dropzone-area:hover,
.dropzone-area.drag-over {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.max-h-300px {
  max-height: 300px;
}
</style> 