<template>
  <!--begin::Card-->
  <div class="card card-flush h-xl-100">
    <!--begin::Card header-->
    <div class="card-header pt-5">
      <!--begin::Title-->
      <div class="card-title d-flex flex-column">
        <!--begin::Amount-->
        <span class="fs-2hx fw-bold text-dark me-2 lh-1 ls-n2">
          {{ upcomingEvents.length }}
        </span>
        <!--end::Amount-->
        <!--begin::Subtitle-->
        <span class="text-gray-400 pt-1 fw-semibold fs-6">
          Prossimi Eventi
        </span>
        <!--end::Subtitle-->
      </div>
      <!--end::Title-->
    </div>
    <!--end::Card header-->

    <!--begin::Card body-->
    <div class="card-body pt-2 pb-4 d-flex align-items-center">
      <!--begin::Content-->
      <div class="d-flex flex-column flex-grow-1">
        <!--begin::Loading spinner-->
        <div v-if="loading" class="d-flex justify-content-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Caricamento...</span>
          </div>
        </div>
        <!--end::Loading spinner-->

        <!--begin::Events list-->
        <div v-if="!loading && upcomingEvents.length > 0" class="d-flex flex-column">
          <div
            v-for="event in upcomingEvents.slice(0, 5)"
            :key="event.id"
            class="d-flex align-items-center mb-3"
          >
            <!--begin::Event icon-->
            <div class="symbol symbol-35px me-3">
              <div
                class="symbol-label"
                :style="{ backgroundColor: event.color || '#3699ff' }"
              >
                <KTIcon
                  :icon-name="getEventIcon(event.eventType)"
                  icon-class="fs-2 text-white"
                />
              </div>
            </div>
            <!--end::Event icon-->

            <!--begin::Event details-->
            <div class="d-flex flex-column flex-grow-1">
              <div class="fw-bold text-dark fs-6">
                {{ event.title }}
              </div>
              <div class="text-gray-400 fs-7">
                {{ formatEventDate(event.startDate) }}
              </div>
            </div>
            <!--end::Event details-->

            <!--begin::Event status-->
            <div class="d-flex flex-column align-items-end">
              <span
                class="badge"
                :class="getStatusBadgeClass(event.status)"
              >
                {{ getStatusText(event.status) }}
              </span>
              <span
                class="badge mt-1"
                :class="getPriorityBadgeClass(event.priority)"
              >
                {{ getPriorityText(event.priority) }}
              </span>
            </div>
            <!--end::Event status-->
          </div>
        </div>
        <!--end::Events list-->

        <!--begin::Empty state-->
        <div v-if="!loading && upcomingEvents.length === 0" class="text-center py-4">
          <KTIcon icon-name="calendar" icon-class="fs-2x text-gray-400 mb-3" />
          <div class="text-gray-500 fs-6">Nessun evento imminente</div>
        </div>
        <!--end::Empty state-->

        <!--begin::View all button-->
        <div class="mt-4">
          <router-link
            to="/my-calendar"
            class="btn btn-light-primary btn-sm w-100"
          >
            Visualizza Tutti gli Eventi
          </router-link>
        </div>
        <!--end::View all button-->
      </div>
      <!--end::Content-->
    </div>
    <!--end::Card body-->
  </div>
  <!--end::Card-->
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { getMyEvents } from "@/core/services/businessServices/Calendar";
import type { CalendarEvent } from "@/core/models/Calendar";

export default defineComponent({
  name: "widget-11",
  setup() {
    const loading = ref(false);
    const upcomingEvents = ref<CalendarEvent[]>([]);

    const loadUpcomingEvents = async () => {
      loading.value = true;
      try {
        const data = await getMyEvents();
        if (data) {
          // Filter events that are in the future and sort by start date
          const now = new Date();
          upcomingEvents.value = data
            .filter(event => new Date(event.startDate) > now)
            .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
            .slice(0, 5); // Show only next 5 events
        }
      } catch (error) {
        console.error('Error loading upcoming events:', error);
      } finally {
        loading.value = false;
      }
    };

    const getEventIcon = (eventType: string) => {
      const icons: { [key: string]: string } = {
        'APPOINTMENT': 'calendar',
        'MEETING': 'people',
        'TASK': 'element-11',
        'HOLIDAY': 'sun',
        'SICK_LEAVE': 'health',
        'PERMISSION': 'shield-tick',
        'OTHER': 'element-plus',
      };
      return icons[eventType] || 'calendar';
    };

    const formatEventDate = (dateString: string) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = date.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        return 'Oggi alle ' + date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
      } else if (diffDays === 1) {
        return 'Domani alle ' + date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
      } else if (diffDays < 7) {
        return date.toLocaleDateString('it-IT', { weekday: 'long', hour: '2-digit', minute: '2-digit' });
      } else {
        return date.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
      }
    };

    const getStatusBadgeClass = (status: string) => {
      const classes: { [key: string]: string } = {
        'CONFIRMED': 'badge-light-success',
        'PENDING': 'badge-light-warning',
        'CANCELLED': 'badge-light-danger',
        'COMPLETED': 'badge-light-info',
      };
      return classes[status] || 'badge-light-primary';
    };

    const getStatusText = (status: string) => {
      const texts: { [key: string]: string } = {
        'CONFIRMED': 'Confermato',
        'PENDING': 'In Attesa',
        'CANCELLED': 'Cancellato',
        'COMPLETED': 'Completato',
      };
      return texts[status] || status;
    };

    const getPriorityBadgeClass = (priority: string) => {
      const classes: { [key: string]: string } = {
        'LOW': 'badge-light-success',
        'MEDIUM': 'badge-light-warning',
        'HIGH': 'badge-light-danger',
        'URGENT': 'badge-light-danger',
      };
      return classes[priority] || 'badge-light-primary';
    };

    const getPriorityText = (priority: string) => {
      const texts: { [key: string]: string } = {
        'LOW': 'Bassa',
        'MEDIUM': 'Media',
        'HIGH': 'Alta',
        'URGENT': 'Urgente',
      };
      return texts[priority] || priority;
    };

    onMounted(() => {
      loadUpcomingEvents();
    });

    return {
      loading,
      upcomingEvents,
      getEventIcon,
      formatEventDate,
      getStatusBadgeClass,
      getStatusText,
      getPriorityBadgeClass,
      getPriorityText,
    };
  },
});
</script>
