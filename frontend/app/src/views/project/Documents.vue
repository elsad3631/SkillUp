<template>
  <!--begin::Documents page-->
  <div class="documents-page">
    <!--begin::Loading State-->
    <div v-if="isLoading" class="d-flex justify-content-center align-items-center" style="min-height: 400px;">
      <div class="text-center">
        <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
          <span class="visually-hidden">Loading...</span>
        </div>
        <div class="mt-3">
          <span class="fw-semibold text-gray-600">Loading documents...</span>
          <div class="mt-2">
            <small class="text-muted">Please wait while we fetch project documents</small>
          </div>
        </div>
      </div>
    </div>
    <!--end::Loading State-->

    <!--begin::Documents content-->
    <div v-if="!isLoading">
      <!--begin::Documents toolbar-->
      <div class="d-flex flex-wrap flex-stack mb-6">
        <!--begin::Title and breadcrumb-->
        <div>
          <h3 class="fw-bold my-2">
            Project Documents
            <span class="fs-6 text-gray-400 fw-semibold ms-1">
              {{ totalFiles }} file(s) in {{ totalFolders }} folder(s)
            </span>
          </h3>
          
          <!--begin::Breadcrumb-->
          <nav v-if="currentPath || breadcrumbs.length > 0">
            <ol class="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0 pt-1">
              <li class="breadcrumb-item text-muted">
                <a href="#" @click.prevent="navigateToPath('')" class="text-muted text-hover-primary hover-elevate" title="Go to root folder">
                  <i class="bi bi-house me-1"></i>Root
                </a>
              </li>
              <li v-for="(crumb, index) in breadcrumbs" :key="index" class="breadcrumb-item">
                <span class="bullet bg-gray-400 w-5px h-2px"></span>
              </li>
              <li v-for="(crumb, index) in breadcrumbs" :key="index" class="breadcrumb-item text-muted">
                <a 
                  href="#" 
                  @click.prevent="navigateToPath(getBreadcrumbPath(index))" 
                  class="text-muted text-hover-primary hover-elevate"
                  :title="`Go to ${crumb} folder`"
                >
                  {{ crumb }}
                </a>
              </li>
            </ol>
          </nav>
          <!--end::Breadcrumb-->
        </div>
        <!--end::Title and breadcrumb-->

        <!--begin::Controls-->
        <div class="d-flex my-2">
          <!--begin::Search-->
          <div class="d-flex align-items-center position-relative me-4">
            <KTIcon
              icon-name="magnifier"
              icon-class="fs-3 position-absolute ms-3"
            />
            <input
              type="text"
              v-model="searchQuery"
              class="form-control form-control-white form-control-sm w-150px ps-9"
              placeholder="Search files..."
              title="Search for files and folders"
            />
          </div>
          <!--end::Search-->

          <!--begin::Upload button-->
          <button
            class="btn btn-primary btn-sm me-2 hover-elevate"
            data-bs-toggle="modal"
            data-bs-target="#kt_modal_upload_file"
            @click="openUploadModal"
            title="Upload new files to this folder"
          >
            <KTIcon icon-name="files" icon-class="fs-2 me-1" />
            Upload Files
          </button>
          <!--end::Upload button-->

          <!--begin::Create folder button-->
          <button
            class="btn btn-light btn-sm me-2 hover-elevate"
            data-bs-toggle="modal"
            data-bs-target="#kt_modal_create_folder"
            @click="openCreateFolderModal"
            title="Create a new folder"
          >
            <KTIcon icon-name="folder-plus" icon-class="fs-2 me-1" />
            New Folder
          </button>
          <!--end::Create folder button-->

          <!--begin::AI Search button-->
          <button
            class="btn btn-success btn-sm hover-elevate"
            data-bs-toggle="modal"
            data-bs-target="#kt_modal_ai_search"
            @click="openAISearchModal"
            title="Ask AI to help you find documents"
          >
            <KTIcon icon-name="robot" icon-class="fs-2 me-1" />
            Ask AI
          </button>
          <!--end::AI Search button-->
        </div>
        <!--end::Controls-->
      </div>
      <!--end::Documents toolbar-->

      <!--begin::Folders section-->
      <div v-if="filteredFolders.length > 0" class="row g-6 g-xl-9 mb-6 mb-xl-9">
        <div 
          v-for="folder in filteredFolders" 
          :key="folder.name"
          class="col-md-6 col-lg-4 col-xl-3"
        >
          <div class="card card-flush h-100 hover-elevate-up">
            <div class="card-header pt-7">
              <div class="card-title">
                <div class="symbol symbol-60px me-3">
                  <div class="symbol-label bg-light-warning">
                    <KTIcon icon-name="folder" icon-class="fs-1 text-warning" />
                  </div>
                </div>
                <div class="d-flex flex-column">
                  <span class="fw-bold text-gray-900 text-hover-primary fs-6" style="cursor: pointer;" @click="navigateToFolder(folder)" :title="`Open ${folder.name} folder`">
                    {{ folder.name }}
                  </span>
                  <span class="text-muted fs-7">{{ folder.files.length }} file(s)</span>
                </div>
              </div>
              <!--begin::Menu-->
              <div class="card-toolbar">
                <div class="dropdown">
                  <button 
                    class="btn btn-sm btn-icon btn-color-primary btn-active-light-primary hover-elevate"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    title="Folder options"
                  >
                    <KTIcon icon-name="dots-vertical" icon-class="fs-2" />
                  </button>
                  <ul class="dropdown-menu">
                    <li>
                      <a class="dropdown-item" href="#" @click.prevent="navigateToFolder(folder)" title="Open this folder">
                        <i class="fas fa-folder-open text-warning me-2"></i>
                        Open Folder
                      </a>
                    </li>
                    <li>
                      <a class="dropdown-item" href="#" @click.prevent="downloadFolder(folder)" title="Download folder as ZIP">
                        <i class="fas fa-download text-primary me-2"></i>
                        Download as ZIP
                      </a>
                    </li>
                    <li><hr class="dropdown-divider"></li>
                    <li>
                      <a class="dropdown-item text-danger" href="#" @click.prevent="confirmDeleteFolder(folder)" title="Delete this folder and all its contents">
                        <i class="fas fa-trash text-danger me-2"></i>
                        Delete Folder
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <!--end::Menu-->
            </div>
            <div class="card-body d-flex justify-content-end pt-0">
              <button class="btn btn-sm btn-light hover-elevate" @click="navigateToFolder(folder)" title="Open folder">
                <KTIcon icon-name="arrow-right" icon-class="fs-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <!--end::Folders section-->

      <!--begin::Files section-->
      <div v-if="filteredFiles.length > 0" class="row g-6 g-xl-9 mb-6 mb-xl-9">
        <div 
          v-for="file in filteredFiles" 
          :key="file.fullPath"
          class="col-md-6 col-lg-4 col-xl-3"
        >
          <div class="card card-flush h-100 hover-elevate-up">
            <div class="card-header pt-7">
              <div class="card-title">
                <div class="symbol symbol-60px me-3">
                  <div class="symbol-label bg-light-primary">
                    <i :class="getFileTypeIcon(file.name)" class="fs-2x"></i>
                  </div>
                </div>
                <div class="d-flex flex-column">
                  <span class="fw-bold text-gray-900 fs-6" style="word-break: break-word;" :title="file.name">
                    {{ file.name }}
                  </span>
                  <span class="text-muted fs-7">{{ formatFileSize(file.size) }}</span>
                  <span class="text-muted fs-8">{{ formatDate(file.lastModified) }}</span>
                  <span v-if="file.uploadedBy" class="text-muted fs-8">Uploaded by: {{ file.uploadedBy }}</span>
                </div>
              </div>
              <!--begin::Menu-->
              <div class="card-toolbar">
                <div class="dropdown">
                  <button 
                    class="btn btn-sm btn-icon btn-color-primary btn-active-light-primary hover-elevate"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    title="File options"
                  >
                    <KTIcon icon-name="dots-vertical" icon-class="fs-2" />
                  </button>
                  <ul class="dropdown-menu">
                    <li>
                      <a class="dropdown-item" href="#" @click.prevent="previewFile(file)" title="Preview file">
                        <i class="fas fa-eye text-info me-2"></i>
                        Preview
                      </a>
                    </li>
                    <li>
                      <a class="dropdown-item" href="#" @click.prevent="downloadFile(file)" title="Download file">
                        <i class="fas fa-download text-primary me-2"></i>
                        Download
                      </a>
                    </li>
                    <li>
                      <a class="dropdown-item" href="#" @click.prevent="shareFile(file)" title="Share file">
                        <i class="fas fa-share text-success me-2"></i>
                        Share
                      </a>
                    </li>
                    <li><hr class="dropdown-divider"></li>
                    <li>
                      <a class="dropdown-item text-danger" href="#" @click.prevent="confirmDeleteFile(file)" title="Delete this file">
                        <i class="fas fa-trash text-danger me-2"></i>
                        Delete
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <!--end::Menu-->
            </div>
          </div>
        </div>
      </div>
      <!--end::Files section-->

      <!--begin::Empty state-->
      <div v-if="!isLoading && filteredFolders.length === 0 && filteredFiles.length === 0" class="text-center py-10">
        <KTIcon icon-name="files" icon-class="fs-5x text-muted mb-4" />
        <div class="text-muted fw-semibold fs-6 mb-4">
          {{ searchQuery ? 'No files match your search' : 'No documents found in this folder' }}
        </div>
        <div v-if="!searchQuery" class="d-flex justify-content-center gap-3">
          <button
            class="btn btn-primary hover-elevate"
            data-bs-toggle="modal"
            data-bs-target="#kt_modal_upload_file"
            @click="openUploadModal"
            title="Upload your first files"
          >
            <KTIcon icon-name="files" icon-class="fs-2 me-1" />
            Upload Files
          </button>
          <button
            class="btn btn-light hover-elevate"
            data-bs-toggle="modal"
            data-bs-target="#kt_modal_create_folder"
            @click="openCreateFolderModal"
            title="Create your first folder"
          >
            <KTIcon icon-name="folder-plus" icon-class="fs-2 me-1" />
            New Folder
          </button>
          <button
            class="btn btn-success hover-elevate"
            data-bs-toggle="modal"
            data-bs-target="#kt_modal_ai_search"
            @click="openAISearchModal"
            title="Ask AI to help you find documents"
          >
            <KTIcon icon-name="robot" icon-class="fs-2 me-1" />
            Ask AI
          </button>
        </div>
        <div v-if="searchQuery" class="mt-3">
          <button @click="clearSearch" class="btn btn-outline-secondary btn-sm">
            <i class="bi bi-x-circle me-1"></i>Clear Search
          </button>
        </div>
      </div>
      <!--end::Empty state-->
    </div>
    <!--end::Documents content-->

    <!--begin::Modals-->
    <CreateFolderModal 
      :current-path="currentPath" 
      @folder-created="handleFolderCreated" 
    />
    <UploadFileModal 
      :current-path="currentPath" 
      @files-uploaded="handleFilesUploaded" 
    />
    <AISearchModal />
    <!--end::Modals-->
  </div>
  <!--end::Documents page-->
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, inject, watch } from "vue";
import { useRoute } from "vue-router";
import KTIcon from "@/core/helpers/kt-icon/KTIcon.vue";
import CreateFolderModal from "@/components/project/CreateFolderModal.vue";
import UploadFileModal from "@/components/project/UploadFileModal.vue";
import AISearchModal from "@/components/project/AISearchModal.vue";
import Swal from "sweetalert2/dist/sweetalert2.js";
import {
  documentManagerService,
  type FolderItem as ProjectFolder,
  type FileItem as ProjectFile,
  type FolderStructure,
} from "@/core/services/businessServices/DocumentManager";
import { useCurrentUser } from "@/core/composables/useCurrentUser";

export default defineComponent({
  name: "project-documents",
  components: {
    KTIcon,
    CreateFolderModal,
    UploadFileModal,
    AISearchModal,
  },
  setup() {
    const route = useRoute();
    const project = inject<any>('project');
    const { currentUser, fetchCurrentUser } = useCurrentUser();
    
    // Reactive data
    const isLoading = ref(true);
    const currentPath = ref('');
    const folderStructure = ref<FolderStructure | null>(null);
    const searchQuery = ref('');

    // Computed properties
    const projectId = computed(() => route.params.id as string);
    
    const breadcrumbs = computed(() => {
      return currentPath.value ? documentManagerService.getBreadcrumb(currentPath.value) : [];
    });

    const filteredFolders = computed(() => {
      if (!folderStructure.value) return [];
      
      if (!searchQuery.value) {
        return folderStructure.value.folders;
      }
      
      return folderStructure.value.folders.filter(folder =>
        folder.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });

    const filteredFiles = computed(() => {
      if (!folderStructure.value) return [];
      
      if (!searchQuery.value) {
        return folderStructure.value.files;
      }
      
      return folderStructure.value.files.filter(file =>
        file.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });

    const totalFiles = computed(() => {
      if (!folderStructure.value) return 0;
      return folderStructure.value.files.length +
        folderStructure.value.folders.reduce((sum, folder) => sum + folder.files.length, 0);
    });

    const totalFolders = computed(() => {
      return folderStructure.value?.folders.length || 0;
    });

    // Methods
    const loadDocuments = async () => {
      if (!projectId.value) return;
      
      try {
        isLoading.value = true;
        const result = await documentManagerService.getEntityDocuments('projects', projectId.value, currentPath.value);
        folderStructure.value = result;
      } catch (error) {
        console.error('Error loading documents:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to load documents. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      } finally {
        isLoading.value = false;
      }
    };

    const navigateToPath = (path: string) => {
      currentPath.value = path;
      loadDocuments();
    };

    const navigateToFolder = (folder: ProjectFolder) => {
      const newPath = currentPath.value + folder.name + '/';
      navigateToPath(newPath);
    };

    const getBreadcrumbPath = (index: number): string => {
      return breadcrumbs.value.slice(0, index + 1).join('/') + '/';
    };

    const openCreateFolderModal = () => {
      // Reset modal form if needed
    };

    const openUploadModal = () => {
      // Reset modal form if needed
    };

    const openAISearchModal = () => {
      // Reset modal form if needed
    };

    const clearSearch = () => {
      searchQuery.value = '';
    };

    const handleFolderCreated = async (data: { name: string; path: string }) => {
      try {
        // Prepare project info for metadata
        const projectInfo = project.value ? {
          id: project.value.id,
          name: project.value.name
        } : undefined;
        
        const success = await documentManagerService.createEntityFolder(
          'projects',
          projectId.value, 
          data.name, 
          currentPath.value, 
          projectInfo
        );
        
        if (success) {
          Swal.fire({
            title: 'Success!',
            text: `Folder "${data.name}" created successfully.`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
          
          // Reload documents
          await loadDocuments();
        } else {
          throw new Error('Failed to create folder');
        }
      } catch (error) {
        console.error('Error creating folder:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to create folder. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    };

    const handleFilesUploaded = async (data: { files: File[]; path: string }) => {
      try {
        // Ensure current user is loaded
        if (!currentUser.value) {
          await fetchCurrentUser();
        }
        
        const uploadPromises = data.files.map(file => {
          // Prepare project info for metadata
          const projectInfo = project.value ? {
            id: project.value.id,
            name: project.value.name
          } : undefined;
          
          return documentManagerService.uploadEntityFile(
            'projects',
            projectId.value, 
            file, 
            currentPath.value, 
            undefined, 
            {
              projectId: projectInfo?.id,
              uploadedBy: currentUser.value?.id
            }
          );
        });
        
        const results = await Promise.all(uploadPromises);
        const successCount = results.filter(result => result !== null).length;
        const failCount = results.length - successCount;
        
        if (successCount > 0) {
          let message = `${successCount} file(s) uploaded successfully.`;
          if (failCount > 0) {
            message += ` ${failCount} file(s) failed to upload.`;
          }
          
          Swal.fire({
            title: 'Upload Complete!',
            text: message,
            icon: successCount === results.length ? 'success' : 'warning',
            timer: 3000,
            showConfirmButton: false
          });
          
          // Reload documents
          await loadDocuments();
        } else {
          throw new Error('All uploads failed');
        }
      } catch (error) {
        console.error('Error uploading files:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to upload files. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    };

    const confirmDeleteFile = (file: ProjectFile) => {
      Swal.fire({
        title: 'Delete File?',
        text: `Are you sure you want to delete "${file.name}"? This action cannot be undone.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
      }).then(async (result) => {
        if (result.isConfirmed) {
          await deleteFile(file);
        }
      });
    };

    const confirmDeleteFolder = (folder: ProjectFolder) => {
      const fileCount = folder.files.length;
      const message = fileCount > 0 
        ? `Are you sure you want to delete "${folder.name}" and all ${fileCount} file(s) inside it? This action cannot be undone.`
        : `Are you sure you want to delete the empty folder "${folder.name}"?`;

      Swal.fire({
        title: 'Delete Folder?',
        text: message,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
      }).then(async (result) => {
        if (result.isConfirmed) {
          await deleteFolderWithContents(folder);
        }
      });
    };

    const deleteFile = async (file: ProjectFile) => {
      try {
        const success = await documentManagerService.deleteEntityFile('projects', projectId.value, file.fullPath, file.id);
        
        if (success) {
          Swal.fire({
            title: 'Deleted!',
            text: `"${file.name}" has been deleted.`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
          
          // Reload documents
          await loadDocuments();
        } else {
          throw new Error('Failed to delete file');
        }
      } catch (error) {
        console.error('Error deleting file:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete file. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    };

    const deleteFolderWithContents = async (folder: ProjectFolder) => {
      try {
        const success = await documentManagerService.deleteEntityFolder('projects', projectId.value, folder.path);
        
        if (success) {
          Swal.fire({
            title: 'Deleted!',
            text: `Folder "${folder.name}" and all its contents have been deleted.`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
          
          // Reload documents
          await loadDocuments();
        } else {
          throw new Error('Failed to delete folder');
        }
      } catch (error) {
        console.error('Error deleting folder:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete folder. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    };

    const downloadFile = async (file: ProjectFile) => {
      try {
        const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:3000';
        const downloadUrl = `${API_URL}/blobstorage/download/${encodeURIComponent(file.fullPath)}`;
        
        // Create a temporary link and click it to start download
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = file.name;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show success message
        Swal.fire({
          title: 'Download Started!',
          text: `"${file.name}" is being downloaded.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (error) {
        console.error('Error downloading file:', error);
        Swal.fire({
          title: 'Download Error!',
          text: 'Failed to download file. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    };

    const downloadFolder = (folder: ProjectFolder) => {
      // Implementation for downloading folder as ZIP
      Swal.fire({
        title: 'Download Folder',
        text: `Preparing "${folder.name}" for download...`,
        icon: 'info',
        timer: 2000,
        showConfirmButton: false
      });
    };

    const previewFile = (file: ProjectFile) => {
      // Implementation for file preview
      Swal.fire({
        title: 'Preview File',
        text: `Opening "${file.name}" in preview mode...`,
        icon: 'info',
        timer: 2000,
        showConfirmButton: false
      });
    };

    const shareFile = (file: ProjectFile) => {
      // Implementation for file sharing
      Swal.fire({
        title: 'Share File',
        text: `Generating share link for "${file.name}"...`,
        icon: 'info',
        timer: 2000,
        showConfirmButton: false
      });
    };

    const formatDate = (date: Date): string => {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    // Watch for project changes
    watch(() => projectId.value, (newId) => {
      if (newId) {
        currentPath.value = '';
        loadDocuments();
      }
    });

    // Load documents on mount
    onMounted(async () => {
      // Load current user first
      await fetchCurrentUser();
      
      if (projectId.value) {
        loadDocuments();
      }
    });

    return {
      // Data
      isLoading,
      currentPath,
      searchQuery,
      folderStructure,
      
      // Computed
      breadcrumbs,
      filteredFolders,
      filteredFiles,
      totalFiles,
      totalFolders,
      
      // Methods
      navigateToPath,
      navigateToFolder,
      getBreadcrumbPath,
      openCreateFolderModal,
      openUploadModal,
      openAISearchModal,
      clearSearch,
      handleFolderCreated,
      handleFilesUploaded,
      confirmDeleteFile,
      confirmDeleteFolder,
      downloadFile,
      downloadFolder,
      previewFile,
      shareFile,
      formatDate,
      getFileTypeIcon: documentManagerService.getFileTypeIcon,
      formatFileSize: documentManagerService.formatFileSize,
    };
  },
});
</script>

<style scoped>
.documents-page {
  min-height: 500px;
}

.hover-elevate-up {
  transition: all 0.3s ease;
}

.hover-elevate-up:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.hover-elevate {
  transition: all 0.2s ease;
}

.hover-elevate:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.card {
  transition: all 0.3s ease;
}

.card:hover {
  border-color: var(--kt-primary);
}

.btn {
  transition: all 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
}

.breadcrumb-item a {
  transition: all 0.2s ease;
}

.breadcrumb-item a:hover {
  transform: translateY(-1px);
}

.dropdown-menu {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.dropdown-item {
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background-color: var(--kt-primary-light);
  color: var(--kt-primary);
}
</style>
