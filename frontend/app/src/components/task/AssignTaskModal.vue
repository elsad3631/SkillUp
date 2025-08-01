<template>
  <div class="modal fade" id="kt_modal_assign_task" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Assign Task</h2>
          <div class="btn btn-icon btn-sm btn-active-icon-primary" data-bs-dismiss="modal" aria-label="Close">
            <KTIcon icon-name="cross" icon-class="fs-1" />
          </div>
        </div>
        <form @submit.prevent="handleSubmit" class="form">
          <div class="modal-body scroll-y mx-5 mx-xl-15 my-7">
            <div class="d-flex flex-column scroll-y me-n7 pe-7" id="kt_modal_assign_task_scroll" data-kt-scroll="true" data-kt-scroll-activate="{default: false, lg: true}" data-kt-scroll-max-height="auto" data-kt-scroll-dependencies="#kt_modal_assign_task_header" data-kt-scroll-wrappers="#kt_modal_assign_task_scroll" data-kt-scroll-offset="300px">
              
              <!--begin::Current task info-->
              <div class="fv-row mb-7">
                <label class="fw-semibold fs-6 mb-2">Current Task</label>
                <div class="card card-flush py-4">
                  <div class="card-body">
                    <div class="d-flex align-items-center mb-3">
                      <div class="symbol symbol-50px me-5">
                        <div class="symbol-label bg-light-primary d-flex align-items-center justify-content-center">
                          <KTIcon icon-name="task" icon-class="fs-2 text-primary" />
                        </div>
                      </div>
                      <div class="d-flex flex-column">
                        <span class="text-gray-800 text-hover-primary fw-bold mb-1">
                          {{ task.title }}
                        </span>
                        <span v-if="task.description && task.description.length > 0" class="text-muted fs-8">
                          {{ task.description.length > 100 ? task.description.substring(0, 100) + '...' : task.description }}
                        </span>
                      </div>
                    </div>
                    
                    <div class="row">
                      <div class="col-md-6">
                        <span class="badge fs-8 fw-bold me-2" :class="getPriorityBadgeClass(task.priority)">
                          {{ task.priority }}
                        </span>
                        <span class="badge fs-8 fw-bold" :class="getStatusBadgeClass(task.status)">
                          {{ task.status }}
                        </span>
                      </div>
                      <div class="col-md-6 text-end">
                        <span v-if="task.dueDate" class="text-gray-800 fw-semibold fs-7">
                          Due: {{ formatDate(task.dueDate) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!--end::Current task info-->

              <!--begin::Current assignee-->
              <div class="fv-row mb-7">
                <label class="fw-semibold fs-6 mb-2">Current Assignee</label>
                <div v-if="task.assignedUser && task.assignedUser.firstName" class="d-flex align-items-center">
                  <div class="symbol symbol-30px me-3">
                    <div class="symbol-label bg-light-success d-flex align-items-center justify-content-center" style="font-size: 0.8rem; font-weight: 600; color: #fff;">
                      {{ getInitials(task.assignedUser.firstName, task.assignedUser.lastName) }}
                    </div>
                  </div>
                  <div class="d-flex flex-column">
                    <span class="text-gray-800 fw-semibold fs-7">
                      {{ task.assignedUser.firstName }} {{ task.assignedUser.lastName }}
                    </span>
                    <span class="text-muted fs-8">{{ task.assignedUser.email }}</span>
                  </div>
                </div>
                <span v-else class="text-muted fs-8">Unassigned</span>
              </div>
              <!--end::Current assignee-->

              <!--begin::Input group-->
              <div class="fv-row mb-7">
                <label class="required fw-semibold fs-6 mb-2">Assign To</label>
                <select v-model="form.assignedTo" class="form-select form-select-solid" required>
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
                <label class="fw-semibold fs-6 mb-2">Priority</label>
                <select v-model="form.priority" class="form-select form-select-solid">
                  <option value="">Keep current priority</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
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

            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              Assign Task
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
import Swal from "sweetalert2/dist/sweetalert2.js";

export default defineComponent({
  name: "assign-task-modal",
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
  emits: ['task-assigned'],
  setup(props, { emit }) {
    const loading = ref(false);

    const form = reactive({
      assignedTo: '',
      priority: '',
      dueDate: ''
    });

    const loadTaskData = () => {
      if (props.task) {
        form.assignedTo = props.task.assignedTo || '';
        form.priority = props.task.priority || '';
        
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
      }
    };

    const handleSubmit = async () => {
      if (!form.assignedTo) {
        Swal.fire('Error', 'Please select an assignee.', 'error');
        return;
      }

      loading.value = true;
      try {
        const taskData = {
          assignedTo: form.assignedTo,
          priority: form.priority || props.task.priority,
          dueDate: form.dueDate ? (() => {
            try {
              return new Date(form.dueDate).toISOString();
            } catch (error) {
              console.error('Invalid due date:', form.dueDate);
              return undefined;
            }
          })() : props.task.dueDate
        };

        const updatedTask = await updateTask(props.task.id, taskData);
        if (updatedTask) {
          emit('task-assigned', updatedTask);
          props.closeModal();
          Swal.fire('Success', 'Task assigned successfully!', 'success');
        } else {
          Swal.fire('Error', 'Failed to assign task.', 'error');
        }
      } catch (error) {
        console.error('Failed to assign task:', error);
        Swal.fire('Error', 'Failed to assign task.', 'error');
      } finally {
        loading.value = false;
      }
    };

    const formatDate = (date: Date | string) => {
      if (!date) return 'N/A';
      try {
        return new Date(date).toLocaleDateString();
      } catch (error) {
        return 'Invalid Date';
      }
    };

    const getInitials = (firstName: string = '', lastName: string = ''): string => {
      const first = firstName ? firstName.charAt(0).toUpperCase() : '';
      const last = lastName ? lastName.charAt(0).toUpperCase() : '';
      return first + last;
    };

    const getPriorityBadgeClass = (priority: string) => {
      switch (priority) {
        case 'LOW': return 'badge-light-success';
        case 'MEDIUM': return 'badge-light-warning';
        case 'HIGH': return 'badge-light-danger';
        case 'URGENT': return 'badge-light-danger';
        default: return 'badge-light-secondary';
      }
    };

    const getStatusBadgeClass = (status: string) => {
      switch (status) {
        case 'TODO': return 'badge-light-secondary';
        case 'IN_PROGRESS': return 'badge-light-primary';
        case 'REVIEW': return 'badge-light-warning';
        case 'COMPLETED': return 'badge-light-success';
        case 'CANCELLED': return 'badge-light-danger';
        default: return 'badge-light-secondary';
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
      formatDate,
      getInitials,
      getPriorityBadgeClass,
      getStatusBadgeClass
    };
  }
});
</script> 