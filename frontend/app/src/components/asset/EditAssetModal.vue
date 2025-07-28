<template>
  <div class="modal fade show d-block" tabindex="-1" style="background:rgba(0,0,0,0.3);">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Modifica Asset</h2>
          <button class="btn btn-icon btn-sm btn-active-icon-primary" @click="$emit('close')">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="onSubmit">
            <div class="mb-3">
              <label class="form-label required">Nome Asset</label>
              <input v-model="name" class="form-control" placeholder="Inserisci il nome dell'asset" required />
            </div>
            <div class="mb-3">
              <label class="form-label required">Tipo</label>
              <select v-model="selectedType" class="form-select" required @change="onTypeChange">
                <option value="">Seleziona il tipo</option>
                <option value="hard skill">Hard Skill</option>
                <option value="soft skill">Soft Skill</option>
                <option value="technology">Tecnologia</option>
                <option value="framework">Framework</option>
                <option value="tool">Strumento</option>
                <option value="language">Linguaggio</option>
                <option value="database">Database</option>
                <option value="service">Servizio</option>
                <option value="platform">Piattaforma</option>
                <option value="certification">Certificazione</option>
                <option value="other">Altro</option>
              </select>
            </div>
            <div v-if="selectedType === 'other'" class="mb-3">
              <label class="form-label required">Tipo personalizzato</label>
              <input v-model="customType" class="form-control" placeholder="Inserisci il tipo personalizzato" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Stato</label>
              <div class="form-check">
                <input type="checkbox" v-model="enable" class="form-check-input" />
                <label class="form-check-label">Asset attivo</label>
              </div>
            </div>
            <div class="d-flex justify-content-end">
              <button type="button" class="btn btn-light me-2" @click="$emit('close')">Annulla</button>
              <button type="submit" class="btn btn-primary" :disabled="!name || !selectedType">
                Salva Modifiche
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { updateAsset } from '@/core/services/businessServices/Asset';

const props = defineProps<{ asset: any }>();
const emit = defineEmits(['close', 'updated']);

const name = ref('');
const selectedType = ref('');
const customType = ref('');
const enable = ref(true);

// Inizializza i valori quando l'asset cambia
watch(() => props.asset, (newAsset) => {
  if (newAsset) {
    name.value = newAsset.name;
    selectedType.value = newAsset.type;
    customType.value = '';
    enable.value = newAsset.enable;
  }
}, { immediate: true });

function onTypeChange() {
  if (selectedType.value !== 'other') {
    customType.value = '';
  }
}

async function onSubmit() {
  try {
    const finalType = selectedType.value === 'other' ? customType.value : selectedType.value;
    
    if (!finalType) {
      Swal.fire('Errore', 'Seleziona un tipo valido', 'error');
      return;
    }
    
    const updatedAsset = await updateAsset(props.asset.id, {
      name: name.value,
      type: finalType,
      enable: enable.value
    });
    
    emit('updated', updatedAsset);
    emit('close');
    Swal.fire('Successo', 'Asset aggiornato con successo!', 'success');
  } catch {
    Swal.fire('Errore', 'Impossibile aggiornare l\'asset', 'error');
  }
}
</script> 