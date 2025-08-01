<template>
  <div class="modal fade" id="kt_modal_add_task" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Add New Task</h2>
          <div class="btn btn-icon btn-sm btn-active-icon-primary" data-bs-dismiss="modal" aria-label="Close">
            <KTIcon icon-name="cross" icon-class="fs-1" />
          </div>
        </div>
        <form @submit.prevent="handleSubmit" class="form">
          <div class="modal-body scroll-y mx-5 mx-xl-15 my-7">
            <div class="d-flex flex-column scroll-y me-n7 pe-7" id="kt_modal_add_task_scroll" data-kt-scroll="true" data-kt-scroll-activate="{default: false, lg: true}" data-kt-scroll-max-height="auto" data-kt-scroll-dependencies="#kt_modal_add_task_header" data-kt-scroll-wrappers="#kt_modal_add_task_scroll" data-kt-scroll-offset="300px">
              
              <!--begin::Input group-->
              <div class="fv-row mb-7">
                <label class="required fw-semibold fs-6 mb-2">Task Title</label>
                <input 
                  type="text" 
                  v-model="form.title" 
                  class="form-control form-control-solid mb-3" 
                  placeholder="Enter task title"
                  required
                />
              </div>
              <!--end::Input group-->

              <!--begin::Input group-->
              <div class="fv-row mb-7">
                <label class="fw-semibold fs-6 mb-2">Description</label>
                <textarea 
                  v-model="form.description" 
                  class="form-control form-control-solid" 
                  rows="3"
                  placeholder="Enter task description"
                ></textarea>
              </div>
              <!--end::Input group-->

              <!--begin::Input group-->
              <div class="fv-row mb-7">
                <label class="fw-semibold fs-6 mb-2">Assign To</label>
                <select v-model="form.assignedTo" class="form-select form-select-solid">
                  <option value="">Select an employee</option>
                  <option 
                    v-for="user in availableUsers" 
                    :key="user.id" 
                    :value="user.id"
                  >
                    {{ user.firstName }} {{ user.lastName }} ({{ user.email }})
                  </option>
                </select>
              </div>
              <!--end::Input group-->

              <!--begin::Input group-->
              <div class="fv-row mb-7">
                <label class="required fw-semibold fs-6 mb-2">Priority</label>
                <select v-model="form.priority" class="form-select form-select-solid" required>
                  <option value="">Select priority</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
              <!--end::Input group-->

              <!--begin::Input group-->
              <div class="fv-row mb-7">
                <label class="required fw-semibold fs-6 mb-2">Status</label>
                <select v-model="form.status" class="form-select form-select-solid" required>
                  <option value="">Select status</option>
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="REVIEW">Review</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
              <!--end::Input group-->

              <!--begin::Input group-->
              <div class="fv-row mb-7">
                <label class="fw-semibold fs-6 mb-2">Due Date</label>
                <input 
                  type="datetime-local" 
                  v-model="form.dueDate" 
                  class="form-control form-control-solid"
                />
              </div>
              <!--end::Input group-->

              <!--begin::Input group-->
              <div class="fv-row mb-7">
                <label class="fw-semibold fs-6 mb-2">Estimated Hours</label>
                <input 
                  type="number" 
                  v-model="form.estimatedHours" 
                  class="form-control form-control-solid" 
                  placeholder="Enter estimated hours"
                  min="0"
                  step="0.5"
                />
              </div>
              <!--end::Input group-->

              <!--begin::Input group-->
              <div class="fv-row mb-7">
                <label class="fw-semibold fs-6 mb-2">Tags</label>
                <input 
                  type="text" 
                  v-model="form.tagsInput" 
                  class="form-control form-control-solid" 
                  placeholder="Enter tags separated by commas"
                  @input="updateTags"
                />
                <div v-if="form.tags.length > 0" class="mt-2">
                  <span 
                    v-for="tag in form.tags" 
                    :key="tag" 
                    class="badge badge-light-primary me-1 mb-1"
                  >
                    {{ tag }}
                    <i class="bi bi-x-circle ms-1" @click="removeTag(tag)" style="cursor: pointer;"></i>
                  </span>
                </div>
              </div>
              <!--end::Input group-->

            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light me-3" data-bs-dismiss="modal">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from "vue";
import { createTask, type Task } from "@/core/services/businessServices/Task";
import type { ApplicationUser } from "@/core/services/businessServices/ApplicationUser";
import Swal from "sweetalert2/dist/sweetalert2.js";

export default defineComponent({
  name: "add-task-modal",
  props: {
    projectId: {
      type: String,
      required: true
    },
    availableUsers: {
      type: Array as () => ApplicationUser[],
      default: () => []
    },
    closeModal: {
      type: Function,
      required: true
    }
  },
  emits: ['task-created'],
  setup(props, { emit }) {
    const loading = ref(false);

    const form = reactive({
      title: '',
      description: '',
      assignedTo: '',
      priority: '',
      status: 'TODO',
      dueDate: '',
      estimatedHours: null as number | null,
      tagsInput: '',
      tags: [] as string[]
    });

    const updateTags = () => {
      if (form.tagsInput) {
        form.tags = form.tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      } else {
        form.tags = [];
      }
    };

    const removeTag = (tagToRemove: string) => {
      form.tags = form.tags.filter(tag => tag !== tagToRemove);
      form.tagsInput = form.tags.join(', ');
    };

    const handleSubmit = async () => {
      if (!form.title || !form.priority || !form.status) {
        Swal.fire('Error', 'Please fill in all required fields.', 'error');
        return;
      }

      loading.value = true;
      try {
        const taskData = {
          title: form.title,
          description: form.description,
          assignedTo: form.assignedTo || undefined,
          projectId: props.projectId,
          priority: form.priority,
          status: form.status,
          dueDate: form.dueDate ? (() => {
            try {
              return new Date(form.dueDate).toISOString();
            } catch (error) {
              console.error('Invalid due date:', form.dueDate);
              return undefined;
            }
          })() : undefined,
          estimatedHours: form.estimatedHours,
          tags: form.tags,
          attachments: []
          // createdBy will be set by the backend based on the authenticated user
        };

        const newTask = await createTask(taskData);
        if (newTask) {
          emit('task-created', newTask);
          props.closeModal();
          
          // Reset form
          Object.assign(form, {
            title: '',
            description: '',
            assignedTo: '',
            priority: '',
            status: 'TODO',
            dueDate: '',
            estimatedHours: null,
            tagsInput: '',
            tags: []
          });

          Swal.fire('Success', 'Task created successfully!', 'success');
        } else {
          Swal.fire('Error', 'Failed to create task.', 'error');
        }
      } catch (error) {
        console.error('Failed to create task:', error);
        Swal.fire('Error', 'Failed to create task.', 'error');
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      // Set default values
      form.status = 'TODO';
    });

    return {
      form,
      loading,
      handleSubmit,
      updateTags,
      removeTag
    };
  }
});
</script> 