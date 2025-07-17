<template>
  <!--begin::Menu-->
  <div
    class="menu menu-sub menu-sub-dropdown menu-column w-400px w-lg-425px"
    data-kt-menu="true"
  >
    <!--begin::Heading-->
    <div
      class="d-flex flex-column bgi-no-repeat rounded-top"
    >
      <!--begin::Title-->
      <div class="d-flex justify-content-between align-items-center px-9 mt-10 mb-6">
        <h3 class="text-dark fw-semobold mb-0">
          Notifications 
          <span class="fs-8 text-muted ps-3">{{ unreadCount }} unread</span>
        </h3>
        <div class="d-flex gap-2">
          <button 
            v-if="unreadCount > 0"
            @click="markAllAsRead" 
            class="btn btn-sm btn-light-primary btn-icon"
            title="Mark all as read"
          >
            <KTIcon icon-name="check" icon-class="fs-6" />
          </button>
          <button 
            v-if="notifications.length > 0"
            @click="clearAllNotifications" 
            class="btn btn-sm btn-light-danger btn-icon"
            title="Clear all notifications"
          >
            <KTIcon icon-name="trash" icon-class="fs-6" />
          </button>
        </div>
      </div>
      <!--end::Title-->

      <!--begin::Tabs-->
      <ul
        class="nav nav-line-tabs nav-line-tabs-2x nav-stretch fw-semobold px-9"
      >
        <li class="nav-item">
          <a
            class="nav-link text-dark opacity-75 opacity-state-100 pb-4 active"
            data-bs-toggle="tab"
            href="#kt_topbar_notifications_1"
            @click="onAlertsTabClick"
            >
            Alerts
            <span v-if="unreadCount > 0" class="badge badge-light-danger ms-2">{{ unreadCount }}</span>
          </a>
        </li>

        <li class="nav-item">
          <a
            class="nav-link text-dark opacity-75 opacity-state-100 pb-4"
            data-bs-toggle="tab"
            href="#kt_topbar_notifications_3"
            >Logs</a
          >
        </li>
      </ul>
      <!--end::Tabs-->
    </div>
    <!--end::Heading-->

    <!--begin::Tab content-->
    <div class="tab-content">
      <!--begin::Tab panel-->
      <div class="tab-pane fade show active" id="kt_topbar_notifications_1" role="tabpanel">
        <!--begin::Items-->
        <div class="scroll-y mh-325px my-5 px-8">
          <div v-if="loadingNotifications" class="text-center py-4">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <div class="mt-2 text-muted">Caricamento notifiche...</div>
          </div>
          
          <div v-else-if="errorNotifications" class="text-center py-4">
            <div class="text-danger">
              <KTIcon icon-name="warning" icon-class="fs-2x" />
              <div class="mt-2">{{ errorNotifications }}</div>
            </div>
          </div>
          
          <div v-else-if="notifications.length === 0" class="text-center py-4">
            <div class="text-muted">
              <KTIcon icon-name="bell" icon-class="fs-2x" />
              <div class="mt-2">Nessuna notifica</div>
            </div>
          </div>
          
          <template v-else v-for="(item, index) in notifications" :key="index">
            <!--begin::Item-->
            <div class="d-flex flex-stack py-4 notification-item" :class="{ 'unread': !item.isRead }">
              <!--begin::Section-->
              <div class="d-flex align-items-center flex-grow-1">
                <!--begin::Symbol-->
                <div class="symbol symbol-40px me-4">
                  <span :class="`bg-light-${getNotificationState(item.type || 'default')}`" class="symbol-label">
                    <KTIcon
                      :icon-name="getNotificationIcon(item.type || 'default')"
                      :icon-class="`text-${getNotificationState(item.type || 'default')}`"
                    />
                  </span>
                </div>
                <!--end::Symbol-->

                <!--begin::Content-->
                <div class="flex-grow-1 me-3">
                  <div class="d-flex align-items-center mb-1">
                    <a
                      href="#"
                      class="fs-6 text-gray-800 text-hover-primary fw-bold me-2"
                      >{{ item.title }}</a
                    >
                    <span v-if="!item.isRead" class="badge badge-dot badge-danger"></span>
                  </div>
                  <div class="text-gray-500 fs-7 line-clamp-2">
                    {{ item.description }}
                  </div>
                  <div class="text-gray-400 fs-8 mt-1">
                    {{ formatTime(item.time) }}
                  </div>
                </div>
                <!--end::Content-->
              </div>
              <!--end::Section-->

              <!--begin::Actions-->
              <div class="d-flex flex-column align-items-end gap-2">
                <button 
                  @click="deleteNotification(item.id)"
                  class="btn btn-sm btn-icon btn-light-danger"
                  title="Delete notification"
                >
                  <KTIcon icon-name="trash" icon-class="fs-6" />
                </button>
              </div>
              <!--end::Actions-->
            </div>
            <!--end::Item-->
          </template>
        </div>
        <!--end::Items-->

        <!--begin::View more-->
        <div class="py-3 text-center border-top">
          <a href="#" class="btn btn-color-gray-600 btn-active-color-primary">
            View All
            <KTIcon icon-name="arrow-right" icon-class="fs-5" />
          </a>
        </div>
        <!--end::View more-->
      </div>
      <!--end::Tab panel-->



      <!--begin::Tab panel-->
      <div class="tab-pane fade" id="kt_topbar_notifications_3" role="tabpanel">
        <!--begin::Items-->
        <div class="scroll-y mh-325px my-5 px-8">
          <div v-if="loadingLogs" class="text-center py-4">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <div class="mt-2 text-muted">Caricamento log...</div>
          </div>
          
          <div v-else-if="errorLogs" class="text-center py-4">
            <div class="text-danger">
              <KTIcon icon-name="warning" icon-class="fs-2x" />
              <div class="mt-2">{{ errorLogs }}</div>
            </div>
          </div>
          
          <div v-else-if="logs.length === 0" class="text-center py-4">
            <div class="text-muted">
              <KTIcon icon-name="document" icon-class="fs-2x" />
              <div class="mt-2">Nessun log disponibile</div>
            </div>
          </div>
          
          <template v-else v-for="(item, index) in logs" :key="index">
            <!--begin::Item-->
            <div class="d-flex flex-stack py-4 log-item">
              <!--begin::Icon-->
              <div class="symbol symbol-35px me-4">
                <span :class="`bg-light-${getLogState(item.status || '')}`" class="symbol-label">
                  <KTIcon
                    :icon-name="getLogIcon(item.status || '')"
                    :icon-class="`text-${getLogState(item.status || '')}`"
                  />
                </span>
              </div>
              <!--end::Icon-->

              <!--begin::Content-->
              <div class="flex-grow-1 me-3">
                <div class="text-gray-800 fw-semobold mb-1">
                  {{ item.action || '' }}
                </div>
                <div class="text-gray-400 fs-8">
                  {{ formatTime(item.timestamp || '') }}
                </div>
              </div>
              <!--end::Content-->
            </div>
            <!--end::Item-->
          </template>
        </div>
        <!--end::Items-->

        <!--begin::View more-->
        <div class="py-3 text-center border-top">
          <a href="#" class="btn btn-color-gray-600 btn-active-color-primary">
            View All
            <KTIcon icon-name="arrow-right" icon-class="fs-5" />
          </a>
        </div>
        <!--end::View more-->
      </div>
      <!--end::Tab panel-->
    </div>
    <!--end::Tab content-->
  </div>
  <!--end::Menu-->
</template>

<script lang="ts">
import { getAssetPath, getIllustrationsPath } from "@/core/helpers/assets";
import { defineComponent, ref, onMounted, computed } from "vue";
import { 
  getNotifications, 
  getLogs, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  deleteNotification as deleteNotificationService 
} from "@/core/services/businessServices/Notification";
import type { Notification, UserActivityLog } from "@/core/services/businessServices/Notification";
import { useCurrentUser } from "@/core/composables/useCurrentUser";
import Swal from "sweetalert2/dist/sweetalert2.js";
export default defineComponent({
  name: "notifications-menu",
  components: {},
  setup() {
    const { currentUser } = useCurrentUser();
    
    // Stato per notifiche e log
    const notifications = ref<Notification[]>([]);
    const logs = ref<UserActivityLog[]>([]);
    const loadingNotifications = ref(false);
    const loadingLogs = ref(false);
    const errorNotifications = ref<string | null>(null);
    const errorLogs = ref<string | null>(null);
    const alertsTabClicked = ref(false);

    // Computed per contare le notifiche non lette
    const unreadCount = computed(() => {
      return notifications.value.filter(n => !n.isRead).length;
    });

    // Carica solo notifiche non lette
    const loadNotifications = async () => {
      if (!currentUser.value?.id) return;
      
      loadingNotifications.value = true;
      errorNotifications.value = null;
      
      try {
        const notif = await getNotifications(10);
        notifications.value = notif || [];
      } catch (e: any) {
        errorNotifications.value = e?.message || "Errore caricamento notifiche";
      } finally {
        loadingNotifications.value = false;
      }
    };

    // Carica log
    const loadLogs = async () => {
      loadingLogs.value = true;
      errorLogs.value = null;
      
      try {
        const logList = await getLogs(12);
        logs.value = logList || [];
      } catch (e: any) {
        errorLogs.value = e?.message || "Errore caricamento log";
      } finally {
        loadingLogs.value = false;
      }
    };

    // Carica notifiche e log da backend
    onMounted(async () => {
      await Promise.all([loadNotifications(), loadLogs()]);
    });

    // Funzioni helper per le notifiche
    const getNotificationState = (type: string) => {
      switch (type) {
        case 'CV_PROCESSING_COMPLETE':
        case 'TASK_COMPLETION':
          return 'success';
        case 'CV_PROCESSING_ERROR':
        case 'ERROR':
          return 'danger';
        case 'PROJECT_ASSIGNMENT':
          return 'warning';
        default:
          return 'info';
      }
    };

    const getNotificationIcon = (type: string) => {
      switch (type) {
        case 'CV_PROCESSING_COMPLETE':
          return 'check';
        case 'CV_PROCESSING_ERROR':
        case 'ERROR':
          return 'warning';
        case 'PROJECT_ASSIGNMENT':
          return 'user';
        default:
          return 'bell';
      }
    };

    // Funzioni helper per i log
    const getLogState = (state: string) => {
      if (!state) return 'info';
      
      switch (state) {
        case 'SUCCESS':
          return 'success';
        case 'FAILED':
        case 'ERROR':
          return 'danger';
        case 'PENDING':
          return 'warning';
        default:
          return 'info';
      }
    };

    const getLogIcon = (state: string) => {
      if (!state) return 'info';
      
      switch (state) {
        case 'SUCCESS':
          return 'check';
        case 'FAILED':
        case 'ERROR':
          return 'warning';
        case 'PENDING':
          return 'clock';
        default:
          return 'info';
      }
    };

    // Funzione per formattare il tempo
    const formatTime = (time: string) => {
      if (!time) return '';
      
      try {
        const date = new Date(time);
        return date.toLocaleTimeString('it-IT', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      } catch {
        return time;
      }
    };

    // Funzione per formattare la data
    const formatDate = (dateStr: string) => {
      if (!dateStr) return '';
      
      try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('it-IT', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      } catch {
        return dateStr;
      }
    };

    // Funzione per formattare il tempo relativo
    const formatTimeAgo = (time: string) => {
      if (!time) return '';
      
      try {
        const date = new Date(time);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Ora';
        if (diffInMinutes < 60) return `${diffInMinutes}m fa`;
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h fa`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}g fa`;
        
        return date.toLocaleDateString('it-IT');
      } catch {
        return time;
      }
    };

    // Funzioni per gestire le notifiche
    const onAlertsTabClick = async () => {
      if (!alertsTabClicked.value && unreadCount.value > 0) {
        alertsTabClicked.value = true;
        await markAllAsRead();
      }
    };

    const markAllAsRead = async () => {
      if (!currentUser.value?.id) return;
      
      try {
        const success = await markAllNotificationsAsRead(currentUser.value.id);
        if (success) {
          // Aggiorna lo stato locale
          notifications.value = notifications.value.map(n => ({ ...n, isRead: true }));
        }
      } catch (error) {
        console.error('Error marking notifications as read:', error);
      }
    };

    const deleteNotification = async (notificationId: string) => {
      try {
        const success = await deleteNotificationService(notificationId);
        if (success) {
          // Rimuovi dalla lista locale
          notifications.value = notifications.value.filter(n => n.id !== notificationId);
        }
      } catch (error) {
        console.error('Error deleting notification:', error);
      }
    };

    const clearAllNotifications = async () => {
      const result = await Swal.fire({
        title: 'Elimina tutte le notifiche?',
        text: 'Questa azione non può essere annullata.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sì, elimina tutto',
        cancelButtonText: 'Annulla'
      });

      if (result.isConfirmed) {
        try {
          // Elimina tutte le notifiche una per una
          const deletePromises = notifications.value.map(n => deleteNotificationService(n.id));
          await Promise.all(deletePromises);
          
          // Svuota la lista locale
          notifications.value = [];
          
          Swal.fire(
            'Eliminate!',
            'Tutte le notifiche sono state eliminate.',
            'success'
          );
        } catch (error) {
          console.error('Error clearing notifications:', error);
          Swal.fire(
            'Errore!',
            'Si è verificato un errore durante l\'eliminazione.',
            'error'
          );
        }
      }
    };

    return {
      notifications,
      logs,
      unreadCount,
      getIllustrationsPath,
      getAssetPath,
      loadingNotifications,
      loadingLogs,
      errorNotifications,
      errorLogs,
      getNotificationState,
      getNotificationIcon,
      getLogState,
      getLogIcon,
      formatTime,
      formatDate,
      formatTimeAgo,
      onAlertsTabClick,
      markAllAsRead,
      deleteNotification,
      clearAllNotifications,
    };
  },
});
</script>
