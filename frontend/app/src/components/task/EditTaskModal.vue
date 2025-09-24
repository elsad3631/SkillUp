<template>
  <div class="modal fade" id="kt_modal_edit_task" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Edit Task</h2>
          <div class="btn btn-icon btn-sm btn-active-icon-primary" data-bs-dismiss="modal" aria-label="Close">
            <KTIcon icon-name="cross" icon-class="fs-1" />
          </div>
        </div>
        <form @submit.prevent="handleSubmit" class="form">
          <div class="modal-body scroll-y mx-5 mx-xl-15 my-7">
            <div class="d-flex flex-column scroll-y me-n7 pe-7" id="kt_modal_edit_task_scroll" data-kt-scroll="true" data-kt-scroll-activate="{default: false, lg: true}" data-kt-scroll-max-height="auto" data-kt-scroll-dependencies="#kt_modal_edit_task_header" data-kt-scroll-wrappers="#kt_modal_edit_task_scroll" data-kt-scroll-offset="300px">
              
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
                />
              </div>
              <!--end::Input group-->

              <!--begin::Input group-->
              <div class="fv-row mb-7">
                <label class="fw-semibold fs-6 mb-2">Actual Hours</label>
                <input 
                  type="number" 
                  v-model="form.actualHours" 
                  class="form-control form-control-solid" 
                  placeholder="Enter actual hours"
                />
              </div>
              <!--end::Input group-->

              <!--begin::Input group-->
              <div class="fv-row mb-7">
                <label class="fw-semibold fs-6 mb-2">Tags</label>
                <input 
                  type="text" 
                  v-model="form.tagsInput" 
                  @input="updateTags"
                  class="form-control form-control-solid" 
                  placeholder="Enter tags separated by commas"
                />
                <div v-if="form.tags.length > 0" class="mt-2">
                  <span 
                    v-for="tag in form.tags" 
                    :key="tag"
                    class="badge badge-light-primary me-2 mb-2"
                  >
                    {{ tag }}
                    <button 
                      type="button" 
                      @click="removeTag(tag)"
                      class="btn btn-sm btn-icon btn-light-danger ms-2"
                    >
                      <KTIcon icon-name="cross" icon-class="fs-7" />
                    </button>
                  </span>
                </div>
              </div>
              <!--end::Input group-->

            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              Update Task
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted, watch } from "vue";
import { updateTask, type Task } from "@/core/services/businessServices/Task";
import { type ApplicationUser } from "@/core/services/businessServices/ApplicationUser";
import { useToast } from "vue-toastification";

export default defineComponent({
  name: "edit-task-modal",
  props: {
    task: {
      type: Object as () => Task,
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
  emits: ['task-updated'],
  setup(props, { emit }) {
    const toast = useToast();
    const loading = ref(false);

    const form = reactive({
      title: '',
      description: '',
      assignedTo: '',
      priority: '',
      status: '',
      dueDate: '',
      estimatedHours: null as number | null,
      actualHours: null as number | null,
      tagsInput: '',
      tags: [] as string[]
    });

    const loadTaskData = () => {
      if (props.task) {
        form.title = props.task.title || '';
        form.description = props.task.description || '';
        form.assignedTo = props.task.assignedTo || '';
        form.priority = props.task.priority || '';
        form.status = props.task.status || '';
        form.estimatedHours = props.task.estimatedHours || null;
        form.actualHours = props.task.actualHours || null;
        
        // Handle due date
        if (props.task.dueDate) {
          try {
            const date = new Date(props.task.dueDate);
            form.dueDate = date.toISOString().slice(0, 16);
          } catch (error) {
            console.error('Invalid due date:', props.task.dueDate);
            form.dueDate = '';
          }
        } else {
          form.dueDate = '';
        }
        
        // Handle tags
        form.tags = props.task.tags || [];
        form.tagsInput = form.tags.join(', ');
      }
    };

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
        toast.error('Please fill in all required fields.');
        return;
      }

      loading.value = true;
      try {
        const taskData = {
          title: form.title,
          description: form.description,
          assignedTo: form.assignedTo || undefined,
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
          actualHours: form.actualHours,
          tags: form.tags,
          attachments: props.task.attachments || []
        };

        const updatedTask = await updateTask(props.task.id, taskData);
        if (updatedTask) {
          emit('task-updated', updatedTask);
          props.closeModal();
          toast.success('Task updated successfully!');
        } else {
          toast.error('Failed to update task.');
        }
      } catch (error) {
        console.error('Failed to update task:', error);
        toast.error('Failed to update task.');
      } finally {
        loading.value = false;
      }
    };

    // Watch for task changes to reload data
    watch(() => props.task, () => {
      loadTaskData();
    }, { immediate: true });

    onMounted(() => {
      loadTaskData();
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