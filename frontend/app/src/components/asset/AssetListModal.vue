<template>
  <div class="modal fade show d-block" tabindex="-1" style="background:rgba(0,0,0,0.3);">
    <div class="modal-dialog modal-dialog-centered mw-900px">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Assets: {{ type }}</h2>
          <button class="btn btn-icon btn-sm btn-active-icon-primary" @click="$emit('close')">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body scroll-y mx-5 mx-xl-15 my-7">
          <button class="btn btn-primary mb-4" @click="showAdd = true">Add Asset</button>
          <table class="table align-middle table-row-dashed fs-6 gy-5">
            <thead>
              <tr class="text-start text-muted fw-bold fs-7 text-uppercase gs-0">
                <th>Name</th>
                <th>Enable</th>
                <th class="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="asset in filteredAssets" :key="asset.id">
                <td v-if="editId !== asset.id">{{ asset.name }}</td>
                <td v-else><input v-model="editName" class="form-control" /></td>
                <td>
                  <span v-if="editId !== asset.id">{{ asset.enable ? 'Yes' : 'No' }}</span>
                  <input v-else type="checkbox" v-model="editEnable" />
                </td>
                <td class="text-end">
                  <button v-if="editId !== asset.id" class="btn btn-sm btn-warning me-2" @click="startEdit(asset)">Edit</button>
                  <button v-if="editId === asset.id" class="btn btn-sm btn-success me-2" @click="saveEdit(asset)">Save</button>
                  <button v-if="editId === asset.id" class="btn btn-sm btn-light me-2" @click="cancelEdit">Cancel</button>
                  <button class="btn btn-sm btn-danger" @click="deleteAsset(asset)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <AddAssetModal v-if="showAdd" :type="type" @created="onCreated" @close="showAdd = false" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import AddAssetModal from './AddAssetModal.vue';
import { getAssets, updateAsset, deleteAsset as deleteAssetApi } from '@/core/services/businessServices/Asset';

const props = defineProps<{ type: string }>();
const emit = defineEmits(['close']);

const assets = ref<any[]>([]);
const showAdd = ref(false);
const editId = ref<number|null>(null);
const editName = ref('');
const editEnable = ref(true);

const filteredAssets = computed(() => assets.value.filter(a => a.type === props.type));

async function fetchAssets() {
  const result = await getAssets();
  if (result) assets.value = result;
}

function startEdit(asset: any) {
  editId.value = asset.id;
  editName.value = asset.name;
  editEnable.value = asset.enable;
}

function cancelEdit() {
  editId.value = null;
  editName.value = '';
  editEnable.value = true;
}

async function saveEdit(asset: any) {
  try {
    const updated = await updateAsset(asset.id, { name: editName.value, type: asset.type, enable: editEnable.value });
    const idx = assets.value.findIndex(a => a.id === asset.id);
    if (idx !== -1) assets.value[idx] = updated;
    Swal.fire('Success', 'Asset updated!', 'success');
    cancelEdit();
  } catch {
    Swal.fire('Error', 'Failed to update asset', 'error');
  }
}

async function deleteAsset(asset: any) {
  const confirm = await Swal.fire({
    title: 'Are you sure?',
    text: 'This action cannot be undone!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!'
  });
  if (confirm.isConfirmed) {
    try {
      const ok = await deleteAssetApi(asset.id);
      if (!ok) throw new Error();
      assets.value = assets.value.filter(a => a.id !== asset.id);
      Swal.fire('Deleted!', 'Asset deleted.', 'success');
    } catch {
      Swal.fire('Error', 'Failed to delete asset', 'error');
    }
  }
}

function onCreated(newAsset: any) {
  assets.value.push(newAsset);
  showAdd.value = false;
  Swal.fire('Success', 'Asset created!', 'success');
}

onMounted(fetchAssets);
watch(() => props.type, fetchAssets);
</script> 