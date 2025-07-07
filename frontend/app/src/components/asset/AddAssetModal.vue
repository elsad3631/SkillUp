<template>
  <div class="modal fade show d-block" tabindex="-1" style="background:rgba(0,0,0,0.3);">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Add Asset ({{ type }})</h2>
          <button class="btn btn-icon btn-sm btn-active-icon-primary" @click="$emit('close')">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="onSubmit">
            <div class="mb-3">
              <label class="form-label">Name</label>
              <input v-model="name" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Enable</label>
              <input type="checkbox" v-model="enable" />
            </div>
            <div class="d-flex justify-content-end">
              <button type="button" class="btn btn-light me-2" @click="$emit('close')">Cancel</button>
              <button type="submit" class="btn btn-primary">Add</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { createAsset } from '@/core/services/businessServices/Asset';

const props = defineProps<{ type: string }>();
const emit = defineEmits(['created', 'close']);

const name = ref('');
const enable = ref(true);

async function onSubmit() {
  try {
    const asset = await createAsset({ name: name.value, type: props.type, enable: enable.value });
    emit('created', asset);
    emit('close');
    Swal.fire('Success', 'Asset created!', 'success');
  } catch {
    Swal.fire('Error', 'Failed to create asset', 'error');
  }
}
</script> 