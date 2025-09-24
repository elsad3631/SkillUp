<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <!--begin::Card title-->
      <div class="card-title">
        <!--begin::Search-->
        <div class="d-flex align-items-center position-relative my-1">
          <KTIcon icon-name="magnifier" icon-class="fs-1 position-absolute ms-6" />
          <input 
            type="text" 
            v-model="search" 
            @input="searchItems()"
            class="form-control form-control-solid w-250px ps-15" 
            placeholder="Search Tasks" 
          />
        </div>
        <!--end::Search-->
      </div>
      <!--begin::Card title-->
      <!--begin::Card toolbar-->
      <div class="card-toolbar">
        <!--begin::Toolbar-->
        <div v-if="selectedIds.length === 0" class="d-flex justify-content-end" data-kt-task-table-toolbar="base">
          <!--begin::Filter-->
          <div class="d-flex align-items-center me-3">
            <select v-model="statusFilter" @change="filterByStatus" class="form-select form-select-sm me-2">
              <option value="">All Status</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="REVIEW">Review</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <select v-model="priorityFilter" @change="filterByPriority" class="form-select form-select-sm">
              <option value="">All Priority</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
          <!--end::Filter-->
          <!--begin::Add task-->
          <button 
            type="button" 
            class="btn btn-primary" 
            data-bs-toggle="modal"
            data-bs-target="#kt_modal_add_task"
          >
            <KTIcon icon-name="plus" icon-class="fs-2" />
            Add Task
          </button>
          <!--end::Add task-->
        </div>
        <!--end::Toolbar-->
        <!--begin::Group actions-->
        <div v-else class="d-flex justify-content-end align-items-center" data-kt-task-table-toolbar="selected">
          <div class="fw-bold me-5">
            <span class="me-2">{{ selectedIds.length }}</span>Selected
          </div>
          <button type="button" class="btn btn-danger" @click="deleteFewTasks()">
            <KTIcon icon-name="trash" icon-class="fs-2" />
            Delete Selected
          </button>
        </div>
        <!--end::Group actions-->
      </div>
      <!--end::Card toolbar-->
    </div>
    <div class="card-body pt-0" style="position:relative;min-height:200px;">
      <Loading v-if="loading" />
      <Datatable 
        v-else 
        @on-sort="sort" 
        @on-items-select="onItemSelect" 
        :data="tableData" 
        :header="tableHeader"
        :enable-items-per-page-dropdown="true" 
        :checkbox-enabled="true" 
        checkbox-label="id"
      >
        <template v-slot:task="{ row: task }">
          <div class="d-flex flex-column">
            <span class="text-gray-800 text-hover-primary fw-bold mb-1">
              {{ task.title }}
            </span>
            <span v-if="task.description && task.description.length > 0" class="text-muted fs-8">
              {{ task.description.length > 50 ? task.description.substring(0, 50) + '...' : task.description }}
            </span>
          </div>
        </template>

                 <template v-slot:assigned="{ row: task }">
           <div class="d-flex align-items-center">
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
         </template>

        <template v-slot:priority="{ row: task }">
          <span :class="getPriorityBadgeClass(task.priority)" class="badge fs-8 fw-bold">
            {{ task.priority }}
          </span>
        </template>

        <template v-slot:status="{ row: task }">
          <span :class="getStatusBadgeClass(task.status)" class="badge fs-8 fw-bold">
            {{ task.status }}
          </span>
        </template>

        <template v-slot:dueDate="{ row: task }">
          <div class="d-flex flex-column">
            <span v-if="task.dueDate" class="text-gray-800 fw-semibold fs-7">
              {{ formatDate(task.dueDate) }}
            </span>
            <span v-else class="text-muted fs-8">No due date</span>
            <span v-if="task.dueDate && isOverdue(task.dueDate)" class="text-danger fs-8">
              Overdue
            </span>
          </div>
        </template>

        <template v-slot:progress="{ row: task }">
          <div class="d-flex align-items-center">
            <div class="progress h-6px w-100px me-3">
              <div 
                class="progress-bar" 
                :class="getProgressBarClass(task.status)"
                :style="{ width: getTaskProgress(task) + '%' }"
              ></div>
            </div>
            <span class="text-gray-800 fw-semibold fs-7">{{ getTaskProgress(task) }}%</span>
          </div>
        </template>

        <template v-slot:actions="{ row: task }">
          <div class="d-flex gap-2">
            <button @click="editTask(task)" class="btn btn-sm btn-light-primary">
              <KTIcon icon-name="pencil" icon-class="fs-7" />
              Edit
            </button>
            <button @click="assignTask(task)" class="btn btn-sm btn-light-info">
              <KTIcon icon-name="user" icon-class="fs-7" />
              Assign
            </button>
            <button @click="deleteSingleTask(task.id)" class="btn btn-sm btn-light-danger">
              <KTIcon icon-name="trash" icon-class="fs-7" />
              Delete
            </button>
          </div>
        </template>
      </Datatable>
    </div>
  </div>

  <!-- Modals -->
  <AddTaskModal 
    v-if="projectId"
    :project-id="projectId" 
    :available-users="availableUsers"
    @task-created="onTaskCreated" 
    :close-modal="() => closeModal('kt_modal_add_task')" 
  />
  <EditTaskModal 
    v-if="selectedTask"
    :task="selectedTask" 
    :available-users="availableUsers"
    @task-updated="onTaskUpdated" 
    :close-modal="() => closeModal('kt_modal_edit_task')"
  />
  <AssignTaskModal 
    v-if="selectedTask"
    :task="selectedTask" 
    :available-users="availableUsers"
    @task-assigned="onTaskAssigned" 
    :close-modal="() => closeModal('kt_modal_assign_task')"
  />

  <!-- Comments Section for Tasks -->
  <div class="row g-5 g-xl-10 mb-5 mb-xl-10">
    <div class="col-12">
      <CommentSection 
        v-if="projectId"
        entity-type="PROJECT"
        :entity-id="projectId"
        @comment-added="onCommentAdded"
        @comment-updated="onCommentUpdated"
        @comment-deleted="onCommentDeleted"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, inject, watch } from "vue";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import { MenuComponent } from "@/assets/ts/components";
import arraySort from "array-sort";
import type { Sort } from "@/components/kt-datatable/table-partials/models";
import AddTaskModal from "@/components/task/AddTaskModal.vue";
import EditTaskModal from "@/components/task/EditTaskModal.vue";
import AssignTaskModal from "@/components/task/AssignTaskModal.vue";
import CommentSection from "@/components/comment/CommentSection.vue";
import { useToast } from "vue-toastification";
import Loading from "@/components/kt-datatable/table-partials/Loading.vue";
import { Modal } from "bootstrap";
import { 
  getTasksByProject, 
  deleteTask, 
  type Task 
} from "@/core/services/businessServices/Task";
import { 
  getNonSuperAdminUsers, 
  type ApplicationUser 
} from "@/core/services/businessServices/ApplicationUser";
import { useCurrentUser } from "@/core/composables/useCurrentUser";

export default defineComponent({
  name: "project-tasks",
  components: {
    Datatable,
    AddTaskModal,
    EditTaskModal,
    AssignTaskModal,
    CommentSection,
    Loading,
  },
    setup() {
        const toast = useToast();
        const tableHeader = ref([
      {
        columnName: "Task",
        columnLabel: "task",
        sortEnabled: true,
        columnWidth: 300,
      },
      {
        columnName: "Assigned To",
        columnLabel: "assigned",
        sortEnabled: true,
        columnWidth: 200,
      },
      {
        columnName: "Priority",
        columnLabel: "priority",
        sortEnabled: true,
        columnWidth: 120,
      },
      {
        columnName: "Status",
        columnLabel: "status",
        sortEnabled: true,
        columnWidth: 120,
      },
      {
        columnName: "Due Date",
        columnLabel: "dueDate",
        sortEnabled: true,
        columnWidth: 150,
      },
      {
        columnName: "Progress",
        columnLabel: "progress",
        sortEnabled: true,
        columnWidth: 150,
      },
      {
        columnName: "Actions",
        columnLabel: "actions",
        sortEnabled: false,
        columnWidth: 200,
      },
    ]);

    const tableData = ref<Task[]>([]);
    const initTasks = ref<Task[]>([]);
    const selectedIds = ref<string[]>([]);
    const search = ref<string>("");
    const statusFilter = ref<string>("");
    const priorityFilter = ref<string>("");
    const selectedTask = ref<Task | null>(null);
    const loading = ref(false);
    const availableUsers = ref<ApplicationUser[]>([]);

    const { currentUser } = useCurrentUser();
    const project = inject('project') as any;
    const projectId = project?.value?.id;

    const fetchTasks = async () => {
      if (!projectId) return;
      
      loading.value = true;
      try {
        const result = await getTasksByProject(projectId);
        if (result) {
          tableData.value = result;
          initTasks.value = [...result];
        }
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      }
      loading.value = false;
    };

    const fetchAvailableUsers = async () => {
      try {
        let companyId: string | undefined;
        if (currentUser.value) {
          const userRoles = currentUser.value.userRoles || [];
          const isSuperAdmin = userRoles.some((ur: any) => ur.name === 'superadmin');
        
          if (isSuperAdmin) {
            companyId = currentUser.value.company || currentUser.value.id;
          } else {
            companyId = currentUser.value.company;
          }
        }
        
        const result = await getNonSuperAdminUsers(companyId);
        if (result) {
          availableUsers.value = result;
        }
      } catch (error) {
        console.error('Failed to fetch available users:', error);
      }
    };

    const onTaskCreated = (task: Task) => {
      tableData.value.push(task);
      initTasks.value.push(task);
    };

    const onTaskUpdated = (updatedTask: Task) => {
      const index = tableData.value.findIndex(t => t.id === updatedTask.id);
      if (index !== -1) {
        tableData.value[index] = updatedTask;
        initTasks.value[index] = updatedTask;
      }
    };

    const onTaskAssigned = (task: Task) => {
      const index = tableData.value.findIndex(t => t.id === task.id);
      if (index !== -1) {
        tableData.value[index] = task;
        initTasks.value[index] = task;
      }
    };

    const editTask = (task: Task) => {
      selectedTask.value = task;
      const modal = document.getElementById('kt_modal_edit_task');
      if (modal) {
        const bootstrapModal = new Modal(modal);
        bootstrapModal.show();
      }
    };

    const assignTask = (task: Task) => {
      selectedTask.value = task;
      const modal = document.getElementById('kt_modal_assign_task');
      if (modal) {
        const bootstrapModal = new Modal(modal);
        bootstrapModal.show();
      }
    };

    const deleteFewTasks = async () => {
      if (selectedIds.value.length === 0) return;
      
      if (confirm(`Are you sure you want to delete ${selectedIds.value.length} tasks? This action cannot be undone!`)) {
        try {
          const deletePromises = selectedIds.value.map(id => deleteTask(id));
          await Promise.all(deletePromises);
          
          tableData.value = tableData.value.filter(t => !selectedIds.value.includes(t.id));
          initTasks.value = initTasks.value.filter(t => !selectedIds.value.includes(t.id));
          selectedIds.value = [];
          
          toast.success(`${selectedIds.value.length} tasks have been deleted.`);
        } catch (error) {
          console.error('Failed to delete tasks:', error);
          toast.error('Failed to delete tasks.');
        }
      }
    };

    const deleteSingleTask = async (id: string) => {
      if (confirm("Are you sure you want to delete this task? This action cannot be undone!")) {
        try {
          const success = await deleteTask(id);
          if (success) {
            tableData.value = tableData.value.filter(t => t.id !== id);
            initTasks.value = initTasks.value.filter(t => t.id !== id);
            toast.success('Task has been deleted.');
          } else {
            toast.error('Failed to delete task.');
          }
        } catch (error) {
          console.error('Failed to delete task:', error);
          toast.error('Failed to delete task.');
        }
      }
    };

    const searchItems = () => {
      const query = search.value.toLowerCase();
      let filtered = [...initTasks.value];
      
      if (query) {
        filtered = filtered.filter(task => {
          return (
            task.title.toLowerCase().includes(query) ||
            task.description?.toLowerCase().includes(query) ||
            task.assignedUser?.firstName?.toLowerCase().includes(query) ||
            task.assignedUser?.lastName?.toLowerCase().includes(query) ||
            task.assignedUser?.email?.toLowerCase().includes(query)
          );
        });
      }
      
      if (statusFilter.value) {
        filtered = filtered.filter(task => task.status === statusFilter.value);
      }
      
      if (priorityFilter.value) {
        filtered = filtered.filter(task => task.priority === priorityFilter.value);
      }
      
      tableData.value = filtered;
    };

    const filterByStatus = () => {
      searchItems();
    };

    const filterByPriority = () => {
      searchItems();
    };

    const sort = (sort: Sort) => {
      if (!sort.label) return;
      const reverse: boolean = sort.order === 'asc';
      const sorted = arraySort(tableData.value, sort.label, { reverse });
      tableData.value = sorted;
    };

    const onItemSelect = (selectedItems: string[]) => {
      selectedIds.value = selectedItems;
    };

    const formatDate = (date: Date | string) => {
      if (!date) return 'N/A';
      try {
        return new Date(date).toLocaleDateString();
      } catch (error) {
        return 'Invalid Date';
      }
    };

    const isOverdue = (dueDate: Date | string) => {
      try {
        return new Date(dueDate) < new Date();
      } catch (error) {
        return false;
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

    const getProgressBarClass = (status: string) => {
      switch (status) {
        case 'TODO': return 'bg-secondary';
        case 'IN_PROGRESS': return 'bg-primary';
        case 'REVIEW': return 'bg-warning';
        case 'COMPLETED': return 'bg-success';
        case 'CANCELLED': return 'bg-danger';
        default: return 'bg-secondary';
      }
    };

    const getTaskProgress = (task: Task) => {
      switch (task.status) {
        case 'TODO': return 0;
        case 'IN_PROGRESS': return 50;
        case 'REVIEW': return 75;
        case 'COMPLETED': return 100;
        case 'CANCELLED': return 0;
        default: return 0;
      }
    };

    const closeModal = (modalId: string) => {
      const modal = document.getElementById(modalId);
      if (modal) {
        const dismissBtn = modal.querySelector('[data-bs-dismiss="modal"]') as HTMLElement;
        if (dismissBtn) {
          dismissBtn.click();
        }
      }
    };

    const onCommentAdded = (comment: any) => {
      console.log('Comment added:', comment);
    };

    const onCommentUpdated = (comment: any) => {
      console.log('Comment updated:', comment);
    };

    const onCommentDeleted = (commentId: string) => {
      console.log('Comment deleted:', commentId);
    };

    // Watch for project changes
    watch(() => projectId, (newProjectId) => {
      if (newProjectId) {
        fetchTasks();
      }
    });

    onMounted(async () => {
      if (!currentUser.value) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      await fetchAvailableUsers();
      if (projectId) {
        await fetchTasks();
      }
      MenuComponent.reinitialization();
    });

    return {
      tableData,
      tableHeader,
      search,
      selectedIds,
      statusFilter,
      priorityFilter,
      selectedTask,
      availableUsers,
      projectId,
      searchItems,
      filterByStatus,
      filterByPriority,
      sort,
      onItemSelect,
      deleteFewTasks,
      deleteSingleTask,
      editTask,
      assignTask,
      onTaskCreated,
      onTaskUpdated,
      onTaskAssigned,
      closeModal,
      formatDate,
      isOverdue,
      getInitials,
      getPriorityBadgeClass,
      getStatusBadgeClass,
      getProgressBarClass,
      getTaskProgress,
      loading,
      onCommentAdded,
      onCommentUpdated,
      onCommentDeleted,
    };
  },
});
</script> 