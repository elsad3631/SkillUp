<template>
  <div class="modal fade" id="kt_modal_upload_payslips" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content">
        <div class="modal-header" id="kt_modal_upload_payslips_header">
          <h2 class="fw-bold">Carica Buste Paga</h2>
          <div class="btn btn-icon btn-sm btn-active-icon-primary" data-bs-dismiss="modal">
            <KTIcon icon-name="cross" icon-class="fs-1" />
          </div>
        </div>

        <div class="modal-body px-5 my-7">
          <div v-if="!isProcessing">
            <!-- File Upload Area -->
            <div class="form-fv-row mb-7">
              <label class="fs-6 fw-semibold form-label mb-2">
                <span class="required">File PDF Buste Paga</span>
                <span class="ms-1" data-bs-toggle="tooltip" title="Carica un PDF contenente multiple buste paga. Ogni busta paga deve iniziare da una pagina intera.">
                  <KTIcon icon-name="information-5" icon-class="fs-7" />
                </span>
              </label>
              
              <div class="dropzone-container" 
                   @drop="handleDrop" 
                   @dragover.prevent 
                   @dragenter.prevent
                   :class="{ 'dragover': isDragOver }"
                   @dragenter="isDragOver = true"
                   @dragleave="isDragOver = false">
                <div class="dz-message needsclick">
                  <KTIcon icon-name="file-up" icon-class="fs-3x text-primary" />
                  <div class="ms-4">
                    <h3 class="fs-5 fw-bold text-gray-900 mb-1">
                      Trascina il file qui o clicca per selezionare
                    </h3>
                    <span class="fs-7 fw-semibold text-gray-500">
                      Solo file PDF fino a 50MB
                    </span>
                  </div>
                </div>
                <input 
                  type="file" 
                  ref="fileInput" 
                  @change="handleFileSelect" 
                  accept=".pdf"
                  style="display: none;"
                />
              </div>
              
              <!-- Selected File Display -->
              <div v-if="selectedFile" class="mt-4">
                <div class="d-flex align-items-center p-3 bg-light-primary rounded">
                  <KTIcon icon-name="document" icon-class="fs-2x text-primary me-3" />
                  <div class="flex-grow-1">
                    <div class="fw-bold text-gray-800">{{ selectedFile.name }}</div>
                    <div class="text-muted fs-7">{{ formatFileSize(selectedFile.size) }}</div>
                  </div>
                  <button @click="removeFile" class="btn btn-icon btn-sm btn-light-danger">
                    <KTIcon icon-name="cross" icon-class="fs-7" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Processing Options -->
            <div class="form-fv-row mb-7">
              <label class="fs-6 fw-semibold form-label mb-2">Opzioni di Elaborazione</label>
              
              <div class="form-check form-check-custom form-check-solid mb-3">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  v-model="options.autoMatch" 
                  id="autoMatch"
                />
                <label class="form-check-label fw-semibold text-gray-700" for="autoMatch">
                  Abbina automaticamente ai dipendenti tramite codice fiscale
                </label>
              </div>
              
              <div class="form-check form-check-custom form-check-solid">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  v-model="options.sendEmail" 
                  id="sendEmail"
                  disabled
                />
                <label class="form-check-label fw-semibold text-gray-400" for="sendEmail">
                  Invia via email ai dipendenti (prossimamente)
                </label>
              </div>
            </div>

          </div>

          <!-- Processing Status -->
          <div v-else class="text-center py-10">
            <div class="spinner-border text-primary mb-4" role="status">
              <span class="visually-hidden">Elaborazione in corso...</span>
            </div>
            <h3 class="fw-bold text-gray-900 mb-2">Elaborazione in corso</h3>
            <p class="text-muted mb-4">{{ processingStatus }}</p>
            
            <!-- Progress Bar -->
            <div v-if="processingProgress > 0" class="progress mb-4">
              <div 
                class="progress-bar" 
                role="progressbar" 
                :style="{ width: processingProgress + '%' }"
                :aria-valuenow="processingProgress" 
                aria-valuemin="0" 
                aria-valuemax="100"
              >
                {{ processingProgress }}%
              </div>
            </div>
          </div>

          <!-- Results -->
          <div v-if="processingResults" class="mt-7">
            <div class="alert alert-success d-flex align-items-center p-5 mb-7">
              <KTIcon icon-name="shield-tick" icon-class="fs-2hx text-success me-4" />
              <div class="d-flex flex-column">
                <h4 class="mb-1 text-success">Elaborazione completata!</h4>
                <span>{{ processingResults.summary }}</span>
                <small class="text-muted mt-2">Le buste paga sono state salvate nel cloud storage</small>
              </div>
            </div>

            <!-- Detailed Results -->
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Risultati Dettagliati</h3>
              </div>
              <div class="card-body">
                <div class="row g-3">
                  <div class="col-md-6">
                    <div class="d-flex align-items-center">
                      <KTIcon icon-name="document" icon-class="fs-2x text-primary me-3" />
                      <div>
                        <div class="fw-bold">Buste Paga Estratte</div>
                        <div class="text-muted">{{ processingResults.extractedCount }}</div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="d-flex align-items-center">
                      <KTIcon icon-name="profile-user" icon-class="fs-2x text-success me-3" />
                      <div>
                        <div class="fw-bold">Dipendenti Abbinati</div>
                        <div class="text-muted">{{ processingResults.matchedCount }}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Unmatched Payslips -->
                <div v-if="processingResults.unmatched && processingResults.unmatched.length > 0" class="mt-5">
                  <h5 class="text-warning mb-3">
                    <KTIcon icon-name="warning" icon-class="fs-5 me-2" />
                    Buste Paga Non Abbinate
                  </h5>
                  <div class="table-responsive">
                    <table class="table table-row-bordered table-row-gray-100">
                      <thead>
                        <tr class="fw-bold fs-6 text-gray-800">
                          <th>File</th>
                          <th>Codice Fiscale Trovato</th>
                          <th>Motivo</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in processingResults.unmatched" :key="item.fileName">
                          <td>{{ item.fileName }}</td>
                          <td>{{ item.fiscalCode || 'Non trovato' }}</td>
                          <td>{{ item.reason }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button 
            type="button" 
            class="btn btn-light" 
            data-bs-dismiss="modal"
            :disabled="isProcessing"
          >
            {{ isProcessing ? 'Elaborazione...' : 'Annulla' }}
          </button>
          <button 
            type="button" 
            class="btn btn-primary" 
            @click="processPayslips"
            :disabled="!canProcess || isProcessing"
          >
            <span v-if="isProcessing" class="spinner-border spinner-border-sm me-2" role="status"></span>
            {{ isProcessing ? 'Elaborazione...' : 'Elabora Buste Paga' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useCurrentUser } from '@/core/composables/useCurrentUser';
import { payslipService } from '@/core/services/businessServices/PayslipService';
import type { PayslipProcessingOptions } from '@/core/services/businessServices/PayslipService';

// Use the interface from the service
type ProcessingOptions = PayslipProcessingOptions;

interface ProcessingResults {
  summary: string;
  extractedCount: number;
  matchedCount: number;
  unmatched: Array<{
    fileName: string;
    fiscalCode?: string;
    reason: string;
  }>;
}


export default defineComponent({
  name: 'UploadPayslipsModal',
  emits: ['payslips-processed'],
  setup(_, { emit }) {
    const toast = useToast();
    const { currentUser } = useCurrentUser();

    // Reactive data
    const selectedFile = ref<File | null>(null);
    const isDragOver = ref(false);
    const isProcessing = ref(false);
    const processingStatus = ref('');
    const processingProgress = ref(0);
    const processingResults = ref<ProcessingResults | null>(null);
    const fileInput = ref<HTMLInputElement>();
    
    const options = ref<ProcessingOptions>({
      autoMatch: true,
      createFolders: true,
      sendEmail: false
    });


    // Computed properties
    const isSuperAdmin = computed(() => {
      if (!currentUser.value?.userRoles) return false;
      return currentUser.value.userRoles.some((role: any) => role.name === 'superadmin');
    });

    const canProcess = computed(() => {
      return !!selectedFile.value;
    });

    // Methods
    const handleDrop = (event: DragEvent) => {
      event.preventDefault();
      isDragOver.value = false;
      
      const files = event.dataTransfer?.files;
      if (files && files.length > 0) {
        handleFileSelection(files[0]);
      }
    };

    const handleFileSelect = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        handleFileSelection(target.files[0]);
      }
    };

    const handleFileSelection = (file: File) => {
      // Validate file type
      if (file.type !== 'application/pdf') {
        toast.error('Solo file PDF sono supportati');
        return;
      }

      // Validate file size (50MB max)
      const maxSize = 50 * 1024 * 1024; // 50MB in bytes
      if (file.size > maxSize) {
        toast.error('Il file è troppo grande. Dimensione massima: 50MB');
        return;
      }

      selectedFile.value = file;
      toast.success('File selezionato correttamente');
    };

    const removeFile = () => {
      selectedFile.value = null;
      if (fileInput.value) {
        fileInput.value.value = '';
      }
    };

    const formatFileSize = (bytes: number): string => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const processPayslips = async () => {
      if (!selectedFile.value) return;

      isProcessing.value = true;
      processingProgress.value = 0;
      processingResults.value = null;
      processingStatus.value = 'Caricamento file...';

      try {
        processingStatus.value = 'Elaborazione del PDF...';
        processingProgress.value = 25;

        // Call the payslip service - usa sempre l'azienda dell'utente corrente
        const result = await payslipService.processPayslipsPDF(
          selectedFile.value,
          options.value,
          currentUser.value?.company || undefined
        );

        processingProgress.value = 75;
        processingStatus.value = 'Finalizzazione...';
        processingProgress.value = 100;
        processingStatus.value = 'Completato!';

        // Set results
        processingResults.value = {
          summary: `Elaborate ${result.extractedCount} buste paga, ${result.matchedCount} abbinate con successo`,
          extractedCount: result.extractedCount,
          matchedCount: result.matchedCount,
          unmatched: result.unmatched || []
        };

        // Emit event to parent
        emit('payslips-processed', result);

        toast.success('Buste paga elaborate con successo!');

      } catch (error) {
        console.error('Error processing payslips:', error);
        toast.error('Errore durante l\'elaborazione delle buste paga');
        processingResults.value = null;
      } finally {
        isProcessing.value = false;
      }
    };

    const openFileDialog = () => {
      fileInput.value?.click();
    };

    onMounted(() => {
      // Add click handler to dropzone
      const dropzone = document.querySelector('.dropzone-container');
      dropzone?.addEventListener('click', openFileDialog);
    });

    return {
      selectedFile,
      isDragOver,
      isProcessing,
      processingStatus,
      processingProgress,
      processingResults,
      fileInput,
      options,
      isSuperAdmin,
      canProcess,
      handleDrop,
      handleFileSelect,
      removeFile,
      formatFileSize,
      processPayslips,
      openFileDialog
    };
  }
});
</script>

<style scoped>
.dropzone-container {
  border: 2px dashed #e1e3ea;
  border-radius: 0.475rem;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #f9f9f9;
}

.dropzone-container:hover,
.dropzone-container.dragover {
  border-color: #009ef7;
  background-color: #f1f8ff;
}

.dz-message {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120px;
}

.progress {
  height: 8px;
  border-radius: 4px;
  background-color: #f1f3f6;
}

.progress-bar {
  background-color: #009ef7;
  border-radius: 4px;
  transition: width 0.3s ease;
}
</style>
