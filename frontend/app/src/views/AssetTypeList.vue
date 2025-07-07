<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        <h2>Asset Types</h2>
      </div>
    </div>
    <div class="card-body pt-0">
      <table class="table align-middle table-row-dashed fs-6 gy-5">
        <thead>
          <tr class="text-start text-muted fw-bold fs-7 text-uppercase gs-0">
            <th>Type</th>
            <th class="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="type in assetTypes" :key="type.value">
            <td>{{ type.label }}</td>
            <td class="text-end">
              <button class="btn btn-primary" @click="openAssetsModal(type.value)">Go</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <AssetListModal
      v-if="showModal"
      :type="selectedType"
      @close="showModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AssetListModal from '@/components/asset/AssetListModal.vue';

const assetTypes = [
  { label: 'Soft Skills', value: 'Soft Skills' },
  { label: 'Hard Skills', value: 'Hard Skills' },
];

const showModal = ref(false);
const selectedType = ref('');

function openAssetsModal(type: string) {
  selectedType.value = type;
  showModal.value = true;
}
</script> 