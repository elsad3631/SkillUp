<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        <h2>Gestione Assets</h2>
      </div>
      <div class="card-toolbar">
                            <button class="btn btn-primary" @click="showAddModal = true">
                      <i class="ki-duotone ki-plus fs-2">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                      Nuovo Asset
                    </button>
      </div>
    </div>
    <div class="card-body pt-0">
      <!-- Filtri e ricerca -->
      <div class="row mb-6">
        <div class="col-md-4">
          <label class="form-label">Filtra per tipo</label>
          <select v-model="selectedFilter" class="form-select" @change="filterAssets">
            <option value="">Tutti i tipi</option>
            <option v-for="type in availableTypes" :key="type.value" :value="type.value">
              {{ type.label }}
            </option>
          </select>
        </div>
        <div class="col-md-4">
          <label class="form-label">Stato</label>
          <select v-model="statusFilter" class="form-select" @change="filterAssets">
            <option value="">Tutti</option>
            <option value="true">Attivi</option>
            <option value="false">Disattivati</option>
          </select>
        </div>
        <div class="col-md-4">
          <label class="form-label">Cerca</label>
          <input 
            v-model="searchTerm" 
            type="text" 
            class="form-control" 
            placeholder="Cerca per nome..."
            @input="filterAssets"
          />
        </div>
      </div>

      <!-- Statistiche generali -->
      <div class="row mb-6">
        <div class="col-md-3">
          <div class="card bg-light-primary">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="symbol symbol-50px me-3">
                  <span class="symbol-label bg-primary">
                    <i class="ki-duotone ki-briefcase fs-2x text-white">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                  </span>
                </div>
                <div>
                  <div class="fs-6 text-gray-600">Totali</div>
                  <div class="fs-4 fw-bold text-gray-800">{{ totalAssetsCount }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-light-success">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="symbol symbol-50px me-3">
                  <span class="symbol-label bg-success">
                    <i class="ki-duotone ki-check fs-2x text-white">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                  </span>
                </div>
                <div>
                  <div class="fs-6 text-gray-600">Attivi</div>
                  <div class="fs-4 fw-bold text-gray-800">{{ activeAssetsCount }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-light-danger">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="symbol symbol-50px me-3">
                  <span class="symbol-label bg-danger">
                    <i class="ki-duotone ki-cross fs-2x text-white">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                  </span>
                </div>
                <div>
                  <div class="fs-6 text-gray-600">Disattivati</div>
                  <div class="fs-4 fw-bold text-gray-800">{{ inactiveAssetsCount }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-light-info">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="symbol symbol-50px me-3">
                  <span class="symbol-label bg-info">
                    <i class="ki-duotone ki-gear fs-2x text-white">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                  </span>
                </div>
                <div>
                  <div class="fs-6 text-gray-600">Tipi</div>
                  <div class="fs-4 fw-bold text-gray-800">{{ uniqueTypesCount }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista degli assets -->
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
                              <h3 class="card-title">
                  <i class="ki-duotone ki-list fs-2 text-primary me-2">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                  Assets del Sistema
                </h3>
              <div class="card-toolbar">
                <span class="badge badge-light-primary fs-7">
                  {{ filteredAssets.length }} risultati
                </span>
              </div>
            </div>
            <div class="card-body">
              <!-- Stato vuoto -->
              <div v-if="filteredAssets.length === 0" class="text-center py-8">
                <i class="ki-duotone ki-gear fs-3x text-gray-400 mb-4">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
                <p class="text-gray-600">Nessun asset trovato</p>
                <button class="btn btn-primary" @click="showAddModal = true">
                  Aggiungi il primo asset
                </button>
              </div>

                             <!-- Griglia degli assets -->
               <div v-else class="row">
                 <div v-for="asset in paginatedAssets" :key="asset.id" class="col-md-6 col-lg-4 mb-4">
                  <div class="card h-100" :class="asset.enable ? 'border-success' : 'border-light'">
                    <div class="card-body">
                      <div class="d-flex justify-content-between align-items-start mb-3">
                        <div class="flex-grow-1">
                          <h5 class="card-title mb-1">{{ asset.name }}</h5>
                          <div class="d-flex gap-2 mb-2">
                            <span :class="getTypeBadgeClass(asset.type)" class="badge fs-7">
                              {{ getTypeLabel(asset.type) }}
                            </span>
                            <span :class="asset.enable ? 'badge badge-success' : 'badge badge-light'" class="fs-7">
                              {{ asset.enable ? 'Attivo' : 'Disattivato' }}
                            </span>
                          </div>
                        </div>
                                                 <div class="dropdown">
                           <button class="btn btn-sm btn-icon btn-light" type="button" @click="toggleDropdown(asset.id)">
                             <i class="ki-duotone ki-gear fs-2">
                               <span class="path1"></span>
                               <span class="path2"></span>
                             </i>
                           </button>
                           <ul v-if="openDropdownId === asset.id" class="dropdown-menu show">
                             <li>
                               <button class="dropdown-item text-warning" @click="editAsset(asset)">
                                 <i class="ki-duotone ki-pencil fs-2 me-2">
                                   <span class="path1"></span>
                                   <span class="path2"></span>
                                 </i>
                                 Modifica
                               </button>
                             </li>
                             <li>
                               <button class="dropdown-item" :class="asset.enable ? 'text-danger' : 'text-success'" @click="toggleAssetStatus(asset)">
                                 <i class="ki-duotone fs-2 me-2" :class="asset.enable ? 'ki-cross' : 'ki-check'">
                                   <span class="path1"></span>
                                   <span class="path2"></span>
                                 </i>
                                 {{ asset.enable ? 'Disattiva' : 'Attiva' }}
                               </button>
                             </li>
                             <li><hr class="dropdown-divider"></li>
                             <li>
                               <button class="dropdown-item text-danger" @click="deleteAsset(asset)">
                                 <i class="ki-duotone ki-trash fs-2 me-2">
                                   <span class="path1"></span>
                                   <span class="path2"></span>
                                 </i>
                                 Elimina
                               </button>
                             </li>
                           </ul>
                         </div>
                      </div>
                      
                                             <div class="text-muted fs-7">
                         <i class="ki-duotone ki-calendar fs-2 me-1">
                           <span class="path1"></span>
                           <span class="path2"></span>
                         </i>
                         ID: {{ asset.id }}
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Paginazione se necessario -->
              <div v-if="filteredAssets.length > 12" class="d-flex justify-content-center mt-4">
                <nav>
                  <ul class="pagination">
                    <li class="page-item">
                                           <a class="page-link" href="#" @click.prevent="changePage(-1)">
                       <i class="ki-duotone ki-arrow-left fs-2">
                         <span class="path1"></span>
                         <span class="path2"></span>
                       </i>
                     </a>
                    </li>
                    <li class="page-item">
                      <span class="page-link">{{ currentPage }} di {{ totalPages }}</span>
                    </li>
                    <li class="page-item">
                                           <a class="page-link" href="#" @click.prevent="changePage(1)">
                       <i class="ki-duotone ki-arrow-right fs-2">
                         <span class="path1"></span>
                         <span class="path2"></span>
                       </i>
                     </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>



    <!-- Modal per aggiungere nuovo asset -->
    <AddAssetModal
      v-if="showAddModal"
      @close="showAddModal = false"
      @created="onAssetCreated"
    />

    <!-- Modal per modificare asset -->
    <EditAssetModal
      v-if="showEditModal"
      :asset="selectedAsset"
      @close="showEditModal = false"
      @updated="onAssetUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';

import AddAssetModal from '@/components/asset/AddAssetModal.vue';
// @ts-ignore
import EditAssetModal from '@/components/asset/EditAssetModal.vue';
import { getAssets, deleteAsset as deleteAssetApi, updateAsset as updateAssetApi } from '@/core/services/businessServices/Asset';
import Swal from 'sweetalert2/dist/sweetalert2.js';

const authStore = useAuthStore();

const assets = ref<any[]>([]);

const showAddModal = ref(false);
const showEditModal = ref(false);

const selectedAsset = ref<any>(null);

// Filtri
const selectedFilter = ref('');
const statusFilter = ref('');
const searchTerm = ref('');
const currentPage = ref(1);
const itemsPerPage = 12;
const openDropdownId = ref<number | null>(null);

// Tipi di asset disponibili
const availableTypes = computed(() => {
  const types = [...new Set(assets.value.map(asset => asset.type))];
  return types.map(type => ({
    value: type,
    label: getTypeLabel(type)
  }));
});

// Assets filtrati
const filteredAssets = computed(() => {
  let filtered = assets.value;

  // Filtro per tipo
  if (selectedFilter.value) {
    filtered = filtered.filter(asset => asset.type === selectedFilter.value);
  }

  // Filtro per stato
  if (statusFilter.value !== '') {
    const isActive = statusFilter.value === 'true';
    filtered = filtered.filter(asset => asset.enable === isActive);
  }

  // Filtro per ricerca
  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase();
    filtered = filtered.filter(asset => 
      asset.name.toLowerCase().includes(search)
    );
  }

  return filtered;
});

// Statistiche
const totalAssetsCount = computed(() => assets.value.length);
const activeAssetsCount = computed(() => assets.value.filter(asset => asset.enable).length);
const inactiveAssetsCount = computed(() => assets.value.filter(asset => !asset.enable).length);
const uniqueTypesCount = computed(() => new Set(assets.value.map(asset => asset.type)).size);

// Paginazione
const totalPages = computed(() => Math.ceil(filteredAssets.value.length / itemsPerPage));
const paginatedAssets = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredAssets.value.slice(start, end);
});

// Funzioni helper
function getTypeLabel(type: string): string {
  const typeLabels: { [key: string]: string } = {
    'hard skill': 'Hard Skill',
    'soft skill': 'Soft Skill',
    'technology': 'Tecnologia',
    'framework': 'Framework',
    'tool': 'Strumento',
    'language': 'Linguaggio',
    'database': 'Database',
    'service': 'Servizio',
    'platform': 'Piattaforma',
    'certification': 'Certificazione'
  };
  return typeLabels[type] || type;
}

function getTypeBadgeClass(type: string): string {
  const typeClasses: { [key: string]: string } = {
    'hard skill': 'badge-primary',
    'soft skill': 'badge-success',
    'technology': 'badge-info',
    'framework': 'badge-warning',
    'tool': 'badge-secondary',
    'language': 'badge-danger',
    'database': 'badge-dark',
    'service': 'badge-light-primary',
    'platform': 'badge-light-success',
    'certification': 'badge-light-warning'
  };
  return typeClasses[type] || 'badge-light';
}

// Funzioni di filtro e ricerca
function filterAssets() {
  currentPage.value = 1; // Reset alla prima pagina quando si filtra
}

function changePage(delta: number) {
  const newPage = currentPage.value + delta;
  if (newPage >= 1 && newPage <= totalPages.value) {
    currentPage.value = newPage;
  }
}

function toggleDropdown(assetId: number) {
  if (openDropdownId.value === assetId) {
    openDropdownId.value = null;
  } else {
    openDropdownId.value = assetId;
  }
}

function closeDropdown() {
  openDropdownId.value = null;
}

// Funzioni CRUD
async function fetchAssets() {
  try {
    const result = await getAssets();
    if (result) {
      assets.value = result;
    }
  } catch (error) {
    console.error('Errore nel caricamento degli assets:', error);
  }
}



function editAsset(asset: any) {
  selectedAsset.value = asset;
  showEditModal.value = true;
  openDropdownId.value = null; // Chiudi il dropdown
}

async function toggleAssetStatus(asset: any) {
  try {
    const newStatus = !asset.enable;
    const success = await updateAssetApi(asset.id, { enable: newStatus });
    if (success) {
      asset.enable = newStatus;
      Swal.fire('Successo', `Asset ${newStatus ? 'attivato' : 'disattivato'} con successo.`, 'success');
    } else {
      throw new Error('Errore durante l\'aggiornamento');
    }
  } catch (error) {
    Swal.fire('Errore', 'Impossibile aggiornare lo stato dell\'asset.', 'error');
  }
  openDropdownId.value = null; // Chiudi il dropdown
}

async function deleteAsset(asset: any) {
  const confirm = await Swal.fire({
    title: 'Sei sicuro?',
    text: `Vuoi eliminare l'asset "${asset.name}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sì, elimina!',
    cancelButtonText: 'Annulla'
  });

  if (confirm.isConfirmed) {
    try {
      const success = await deleteAssetApi(asset.id);
      if (success) {
        assets.value = assets.value.filter(a => a.id !== asset.id);
        Swal.fire('Eliminato!', 'Asset eliminato con successo.', 'success');
      } else {
        throw new Error('Errore durante l\'eliminazione');
      }
    } catch (error) {
      Swal.fire('Errore', 'Impossibile eliminare l\'asset.', 'error');
    }
  }
  openDropdownId.value = null; // Chiudi il dropdown
}

function onAssetCreated(newAsset: any) {
  assets.value.push(newAsset);
  showAddModal.value = false;
}

function onAssetUpdated(updatedAsset: any) {
  const index = assets.value.findIndex(a => a.id === updatedAsset.id);
  if (index !== -1) {
    assets.value[index] = updatedAsset;
  }
  showEditModal.value = false;
}

onMounted(async () => {
  await fetchAssets();
  
  // Aggiungi event listener per chiudere dropdown quando si clicca fuori
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      openDropdownId.value = null;
    }
  });
});
</script> 