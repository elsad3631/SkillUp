<template>
  <!--begin::Card-->
  <div class="card">
    <!--begin::Card header-->
    <div class="card-header">
      <h2 class="card-title fw-bold">Il Mio Calendario</h2>

      <div class="card-toolbar">
        <div class="d-flex align-items-center gap-2">
          <!--begin::Filter dropdown-->
          <div class="dropdown">
            <button
              class="btn btn-light-primary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <KTIcon icon-name="filter" icon-class="fs-2" />
              Filtri
            </button>
            <ul class="dropdown-menu">
              <li>
                <a class="dropdown-item" href="#" @click="filterByType('')">
                  Tutti gli eventi
                </a>
              </li>
              <li>
                <a class="dropdown-item" href="#" @click="filterByType('APPOINTMENT')">
                  Appuntamenti
                </a>
              </li>
              <li>
                <a class="dropdown-item" href="#" @click="filterByType('MEETING')">
                  Riunioni
                </a>
              </li>
              <li>
                <a class="dropdown-item" href="#" @click="filterByType('TASK')">
                  Attività
                </a>
              </li>
              <li>
                <a class="dropdown-item" href="#" @click="filterByType('HOLIDAY')">
                  Ferie
                </a>
              </li>
              <li>
                <a class="dropdown-item" href="#" @click="filterByType('SICK_LEAVE')">
                  Permessi
                </a>
              </li>
            </ul>
          </div>
          <!--end::Filter dropdown-->

          <button class="btn btn-flex btn-primary" @click="newEvent()">
            <KTIcon icon-name="plus" icon-class="fs-2" />
            Nuovo Evento
          </button>
        </div>
      </div>
    </div>
    <!--end::Card header-->

    <!--begin::Card body-->
    <div class="card-body">
      <!--begin::Loading spinner-->
      <div v-if="loading" class="d-flex justify-content-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Caricamento...</span>
        </div>
      </div>
      <!--end::Loading spinner-->

      <!--begin::Calendar-->
      <FullCalendar
        v-if="!loading"
        class="demo-app-calendar"
        :options="calendarOptions"
      ></FullCalendar>
      <!--end::Calendar-->
    </div>
    <!--end::Card body-->
  </div>
  <!--end::Card-->

  <!--begin::Event Modal-->
  <EventModal
    :show="showEventModal"
    :event="selectedEvent"
    :mode="eventModalMode"
    @close="closeEventModal"
    @save="handleEventSave"
    @delete="handleEventDelete"
  />
  <!--end::Event Modal-->
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { useCurrentUser } from "@/core/composables/useCurrentUser";
import { getMyEvents, createEvent, updateEvent, deleteEvent } from "@/core/services/businessServices/Calendar";
import type { CalendarEvent, CreateCalendarEventDto } from "@/core/models/Calendar";
import EventModal from "./EventModal.vue";

export default defineComponent({
  name: "user-calendar",
  components: {
    FullCalendar,
    EventModal,
  },
  setup() {
    const { currentUser } = useCurrentUser();
    const loading = ref(false);
    const events = ref<CalendarEvent[]>([]);
    const showEventModal = ref(false);
    const selectedEvent = ref<CalendarEvent | null>(null);
    const eventModalMode = ref<'create' | 'edit'>('create');
    const currentFilter = ref('');

    const loadEvents = async () => {
      loading.value = true;
      try {
        const data = await getMyEvents();
        if (data) {
          events.value = data;
        }
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        loading.value = false;
      }
    };

    const filterByType = async (eventType: string) => {
      currentFilter.value = eventType;
      loading.value = true;
      try {
        if (eventType) {
          const data = await getMyEvents();
          if (data) {
            events.value = data.filter(event => event.eventType === eventType);
          }
        } else {
          await loadEvents();
        }
      } catch (error) {
        console.error('Error filtering events:', error);
      } finally {
        loading.value = false;
      }
    };

    const newEvent = () => {
      selectedEvent.value = null;
      eventModalMode.value = 'create';
      showEventModal.value = true;
    };

    const editEvent = (event: CalendarEvent) => {
      selectedEvent.value = event;
      eventModalMode.value = 'edit';
      showEventModal.value = true;
    };

    const closeEventModal = () => {
      showEventModal.value = false;
      selectedEvent.value = null;
    };

    const handleEventSave = async (eventData: CreateCalendarEventDto) => {
      try {
        if (eventModalMode.value === 'create') {
          await createEvent({
            ...eventData,
            createdBy: currentUser.value?.id || '',
          });
        } else if (selectedEvent.value) {
          await updateEvent(selectedEvent.value.id, {
            ...eventData,
            id: selectedEvent.value.id,
          });
        }
        
        await loadEvents();
        closeEventModal();
      } catch (error) {
        console.error('Error saving event:', error);
      }
    };

    const handleEventDelete = async (eventId: string) => {
      try {
        await deleteEvent(eventId);
        await loadEvents();
        closeEventModal();
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    };

    const calendarOptions = computed(() => ({
      plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
      },
      initialDate: new Date(),
      navLinks: true,
      selectable: true,
      selectMirror: true,
      editable: true,
      dayMaxEvents: true,
      
      views: {
        dayGridMonth: { buttonText: "Mese" },
        timeGridWeek: { buttonText: "Settimana" },
        timeGridDay: { buttonText: "Giorno" },
        listWeek: { buttonText: "Lista" },
      },

      events: (() => {
        const mappedEvents = events.value.map(event => ({
          id: event.id,
          title: event.title,
          start: event.startDate,
          end: event.endDate,
          allDay: event.allDay,
          description: event.description,
          className: getEventClassName(event),
          extendedProps: {
            eventType: event.eventType,
            status: event.status,
            priority: event.priority,
            location: event.location,
            color: event.color,
          }
        }));
        return mappedEvents;
      })(),

      dateClick: (info: any) => {
        selectedEvent.value = {
          id: '',
          title: '',
          description: '',
          startDate: info.dateStr,
          endDate: info.dateStr,
          allDay: true,
          eventType: 'APPOINTMENT',
          status: 'CONFIRMED',
          priority: 'MEDIUM',
          attendees: [],
          createdBy: currentUser.value?.id || '',
          isPrivate: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdByUser: {
            id: currentUser.value?.id || '',
            firstName: currentUser.value?.firstName || '',
            lastName: currentUser.value?.lastName || '',
          }
        };
        eventModalMode.value = 'create';
        showEventModal.value = true;
      },

      eventClick: (info: any) => {
        const event = events.value.find(e => e.id === info.event.id);
        if (event) {
          editEvent(event);
        }
      },

      eventDrop: async (info: any) => {
        const event = events.value.find(e => e.id === info.event.id);
        if (event) {
          try {
            await updateEvent(event.id, {
              id: event.id,
              startDate: info.event.startStr,
              endDate: info.event.endStr || info.event.startStr,
            });
            await loadEvents();
          } catch (error) {
            console.error('Error updating event:', error);
            info.revert();
          }
        }
      },
    }));

    const getEventClassName = (event: CalendarEvent) => {
      const baseClass = 'fc-event-';
      const typeClass = event.eventType.toLowerCase();
      const statusClass = event.status.toLowerCase();
      const priorityClass = event.priority.toLowerCase();
      
      return `${baseClass}${typeClass} ${baseClass}${statusClass} ${baseClass}${priorityClass}`;
    };

    onMounted(() => {
      loadEvents();
    });

    return {
      loading,
      events,
      showEventModal,
      selectedEvent,
      eventModalMode,
      currentFilter,
      calendarOptions,
      newEvent,
      editEvent,
      closeEventModal,
      handleEventSave,
      handleEventDelete,
      filterByType,
    };
  },
});
</script>

<style lang="scss">
.fc .fc-button {
  padding: 0.75rem 1.25rem;
  box-shadow: none !important;
  border: 0 !important;
  border-radius: 0.475rem;
  vertical-align: middle;
  font-weight: 500;
  text-transform: capitalize;
}

.fc-event-appointment {
  background-color: #3699ff !important;
  border-color: #3699ff !important;
}

.fc-event-meeting {
  background-color: #f64e60 !important;
  border-color: #f64e60 !important;
}

.fc-event-task {
  background-color: #1bc5bd !important;
  border-color: #1bc5bd !important;
}

.fc-event-holiday {
  background-color: #ffa800 !important;
  border-color: #ffa800 !important;
}

.fc-event-sick_leave {
  background-color: #e1f0ff !important;
  border-color: #3699ff !important;
  color: #3699ff !important;
}

.fc-event-permission {
  background-color: #fff4de !important;
  border-color: #ffa800 !important;
  color: #ffa800 !important;
}

.fc-event-other {
  background-color: #e4e6ef !important;
  border-color: #6c757d !important;
  color: #6c757d !important;
}

.fc-event-confirmed {
  opacity: 1;
}

.fc-event-pending {
  opacity: 0.7;
}

.fc-event-cancelled {
  opacity: 0.5;
  text-decoration: line-through;
}

.fc-event-completed {
  opacity: 0.8;
}

.fc-event-urgent {
  border-width: 3px !important;
}

.fc-event-high {
  border-width: 2px !important;
}

.fc-event-medium {
  border-width: 1px !important;
}

.fc-event-low {
  border-width: 1px !important;
  opacity: 0.8;
}
</style> 