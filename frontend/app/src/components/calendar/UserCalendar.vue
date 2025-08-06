<template>
  <!--begin::Card-->
  <div class="card calendar-card">
    <!--begin::Card header-->
    <div class="card-header calendar-header">
      <div class="d-flex align-items-center">
        <div class="calendar-title-section">
          <h2 class="card-title fw-bold mb-1">
            <KTIcon icon-name="calendar" icon-class="fs-1 text-primary me-2" />
            Il Mio Calendario
          </h2>
          <p class="text-muted mb-0 fs-7">
            Gestisci i tuoi appuntamenti e attività
          </p>
        </div>
      </div>

      <div class="card-toolbar">
        <div class="d-flex align-items-center gap-3">
          <!--begin::Filter dropdown-->
          <div class="dropdown">
            <button
              class="btn btn-light-primary dropdown-toggle filter-btn"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <KTIcon icon-name="filter" icon-class="fs-2 me-2" />
              <span class="filter-text">Filtri</span>
              <span class="filter-count" v-if="currentFilter">{{ getFilteredCount() }}</span>
            </button>
            <ul class="dropdown-menu filter-dropdown">
              <li>
                <button class="dropdown-item filter-item" type="button" @click="filterByType('')">
                  <KTIcon icon-name="check" icon-class="fs-2 me-2" />
                  Tutti gli eventi
                  <span class="badge bg-light text-dark ms-auto">{{ events.length }}</span>
                </button>
              </li>
              <li>
                <button class="dropdown-item filter-item" type="button" @click="filterByType('APPOINTMENT')">
                  <KTIcon icon-name="user" icon-class="fs-2 me-2 text-primary" />
                  Appuntamenti
                  <span class="badge bg-primary ms-auto">{{ getEventTypeCount('APPOINTMENT') }}</span>
                </button>
              </li>
              <li>
                <button class="dropdown-item filter-item" type="button" @click="filterByType('MEETING')">
                  <KTIcon icon-name="users" icon-class="fs-2 me-2 text-danger" />
                  Riunioni
                  <span class="badge bg-danger ms-auto">{{ getEventTypeCount('MEETING') }}</span>
                </button>
              </li>
              <li>
                <button class="dropdown-item filter-item" type="button" @click="filterByType('TASK')">
                  <KTIcon icon-name="check-circle" icon-class="fs-2 me-2 text-success" />
                  Attività
                  <span class="badge bg-success ms-auto">{{ getEventTypeCount('TASK') }}</span>
                </button>
              </li>
              <li>
                <button class="dropdown-item filter-item" type="button" @click="filterByType('HOLIDAY')">
                  <KTIcon icon-name="sun" icon-class="fs-2 me-2 text-warning" />
                  Ferie
                  <span class="badge bg-warning ms-auto">{{ getEventTypeCount('HOLIDAY') }}</span>
                </button>
              </li>
              <li>
                <button class="dropdown-item filter-item" type="button" @click="filterByType('SICK_LEAVE')">
                  <KTIcon icon-name="heart" icon-class="fs-2 me-2 text-info" />
                  Permessi
                  <span class="badge bg-info ms-auto">{{ getEventTypeCount('SICK_LEAVE') }}</span>
                </button>
              </li>
            </ul>
          </div>
          <!--end::Filter dropdown-->

          <button class="btn btn-flex btn-primary new-event-btn" @click="newEvent()">
            <KTIcon icon-name="plus" icon-class="fs-2 me-2" />
            <span>Nuovo Evento</span>
          </button>
        </div>
      </div>
    </div>
    <!--end::Card header-->

    <!--begin::Card body-->
    <div class="card-body">
      <!--begin::Loading spinner-->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner">
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="loading-text">Caricamento eventi...</div>
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
import Swal from "sweetalert2/dist/sweetalert2.js";



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



    // Funzione per ottenere il conteggio degli eventi filtrati
    const getFilteredCount = () => {
      if (!currentFilter.value) return events.value.length;
      return events.value.filter(event => event.eventType === currentFilter.value).length;
    };

    // Funzione per ottenere il conteggio degli eventi per tipo
    const getEventTypeCount = (eventType: string) => {
      return events.value.filter(event => event.eventType === eventType).length;
    };

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
            const filteredEvents = data.filter(event => event.eventType === eventType);
            events.value = filteredEvents;
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
          await Swal.fire({
            title: 'Successo!',
            text: 'Evento creato con successo',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#1bc5bd',
            timer: 2000,
            timerProgressBar: true
          });
        } else if (selectedEvent.value) {
          await updateEvent(selectedEvent.value.id, {
            ...eventData,
            id: selectedEvent.value.id,
          });
          await Swal.fire({
            title: 'Successo!',
            text: 'Evento aggiornato con successo',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#1bc5bd',
            timer: 2000,
            timerProgressBar: true
          });
        }
        
        await loadEvents();
        closeEventModal();
      } catch (error) {
        console.error('Error saving event:', error);
        await Swal.fire({
          title: 'Errore!',
          text: 'Errore durante il salvataggio dell\'evento',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#f64e60'
        });
      }
    };

    const handleEventDelete = async (eventId: string) => {
      try {
        await deleteEvent(eventId);
        await Swal.fire({
          title: 'Eliminato!',
          text: 'L\'evento è stato eliminato con successo',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#1bc5bd',
          timer: 2000,
          timerProgressBar: true
        });
        await loadEvents();
        closeEventModal();
      } catch (error) {
        console.error('Error deleting event:', error);
        await Swal.fire({
          title: 'Errore!',
          text: 'Errore durante l\'eliminazione dell\'evento',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#f64e60'
        });
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
      select: (info: any) => {
        // Quando l'utente seleziona un intervallo di tempo
        const startDate = new Date(info.start);
        const endDate = new Date(info.end);
        
        // Formatta le date per l'input datetime-local
        const formatDateForInput = (date: Date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          return `${year}-${month}-${day}T${hours}:${minutes}`;
        };
        
        selectedEvent.value = {
          id: '',
          title: '',
          description: '',
          startDate: formatDateForInput(startDate),
          endDate: formatDateForInput(endDate),
          allDay: false,
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
        // Ottieni la data cliccata
        const clickedDate = new Date(info.date);
        
        // Imposta l'orario di inizio alle 9:00 del giorno cliccato
        const startDate = new Date(clickedDate);
        startDate.setHours(9, 0, 0, 0);
        
        // Imposta l'orario di fine alle 10:00 del giorno cliccato
        const endDate = new Date(clickedDate);
        endDate.setHours(10, 0, 0, 0);
        
        // Formatta le date per l'input datetime-local
        const formatDateForInput = (date: Date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          return `${year}-${month}-${day}T${hours}:${minutes}`;
        };
        
        selectedEvent.value = {
          id: '',
          title: '',
          description: '',
          startDate: formatDateForInput(startDate),
          endDate: formatDateForInput(endDate),
          allDay: false, // Cambiato a false per permettere orari specifici
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
            // Mostra un messaggio di conferma
            const result = await Swal.fire({
              title: 'Conferma spostamento',
              text: 'Vuoi spostare questo evento?',
              icon: 'question',
              showCancelButton: true,
              confirmButtonColor: '#3699ff',
              cancelButtonColor: '#6c757d',
              confirmButtonText: 'Sì, sposta',
              cancelButtonText: 'Annulla'
            });

            if (!result.isConfirmed) {
              info.revert();
              return;
            }

            // Calcola la durata originale dell'evento
            const originalStart = new Date(event.startDate);
            const originalEnd = new Date(event.endDate);
            const duration = originalEnd.getTime() - originalStart.getTime();

            // Calcola le nuove date mantenendo la durata
            const newStart = new Date(info.event.startStr);
            const newEnd = new Date(newStart.getTime() + duration);

            await updateEvent(event.id, {
              id: event.id,
              startDate: newStart.toISOString(),
              endDate: newEnd.toISOString(),
            });
            
            // Mostra un messaggio di successo
            console.log('Evento spostato con successo');
            await Swal.fire({
              title: 'Spostato!',
              text: 'Evento spostato con successo',
              icon: 'success',
              showConfirmButton: false,
              timer: 1500,
              timerProgressBar: true,
              toast: true,
              position: 'top-end'
            });
            await loadEvents();
          } catch (error) {
            console.error('Error updating event:', error);
            await Swal.fire({
              title: 'Errore!',
              text: 'Errore durante lo spostamento dell\'evento',
              icon: 'error',
              confirmButtonText: 'OK',
              confirmButtonColor: '#f64e60'
            });
            info.revert();
          }
        }
      },

      eventResize: async (info: any) => {
        const event = events.value.find(e => e.id === info.event.id);
        if (event) {
          try {
            const result = await Swal.fire({
              title: 'Conferma modifica',
              text: 'Vuoi modificare la durata di questo evento?',
              icon: 'question',
              showCancelButton: true,
              confirmButtonColor: '#3699ff',
              cancelButtonColor: '#6c757d',
              confirmButtonText: 'Sì, modifica',
              cancelButtonText: 'Annulla'
            });

            if (!result.isConfirmed) {
              info.revert();
              return;
            }

            await updateEvent(event.id, {
              id: event.id,
              startDate: info.event.startStr,
              endDate: info.event.endStr || info.event.startStr,
            });
            
            console.log('Durata evento modificata con successo');
            await Swal.fire({
              title: 'Modificato!',
              text: 'Durata evento modificata con successo',
              icon: 'success',
              showConfirmButton: false,
              timer: 1500,
              timerProgressBar: true,
              toast: true,
              position: 'top-end'
            });
            await loadEvents();
          } catch (error) {
            console.error('Error resizing event:', error);
            await Swal.fire({
              title: 'Errore!',
              text: 'Errore durante la modifica della durata dell\'evento',
              icon: 'error',
              confirmButtonText: 'OK',
              confirmButtonColor: '#f64e60'
            });
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
      getFilteredCount,
      getEventTypeCount,
    };
  },
});
</script>

<style lang="scss">
// Stili per il calendario
.calendar-card {
  border: none;
  box-shadow: 0 0.5rem 1.5rem 0.5rem rgba(0, 0, 0, 0.075);
  border-radius: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 1rem 2rem 1rem rgba(0, 0, 0, 0.1);
  }
}

.calendar-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom: none;
  padding: 1.5rem 2rem;

  .calendar-title-section {
    h2 {
      color: white;
      font-size: 1.75rem;
      margin-bottom: 0.25rem;
    }

    p {
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.875rem;
    }
  }

  .card-toolbar {
    .filter-btn {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: white;
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: translateY(-2px);
      }

      .filter-count {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        padding: 0.25rem 0.5rem;
        font-size: 0.75rem;
        margin-left: 0.5rem;
      }
    }

    .new-event-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
      }
    }
  }
}

.filter-dropdown {
  border: none;
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.15);
  border-radius: 0.75rem;
  padding: 0.5rem;

  .filter-item {
    border-radius: 0.5rem;
    margin: 0.25rem 0;
    padding: 0.75rem 1rem;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(102, 126, 234, 0.1);
      transform: translateX(5px);
    }

    .badge {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
    }
  }
}

// Stili per FullCalendar
.fc {
  .fc-button {
    padding: 0.75rem 1.25rem;
    box-shadow: none !important;
    border: 0 !important;
    border-radius: 0.75rem;
    vertical-align: middle;
    font-weight: 500;
    text-transform: capitalize;
    transition: all 0.3s ease;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }

    &.fc-button-active {
      background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
    }
  }

  .fc-toolbar {
    padding: 1rem 0;
    margin-bottom: 1rem;
  }

  .fc-toolbar-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #3f4254;
  }

  .fc-daygrid-day {
    transition: all 0.2s ease;

    &:hover {
      background: rgba(102, 126, 234, 0.05);
    }
  }

  .fc-day-today {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%) !important;
  }

  .fc-day-header {
    font-weight: 600;
    color: #3f4254;
    padding: 1rem 0;
  }

  .fc-col-header-cell {
    background: rgba(102, 126, 234, 0.05);
    border: none;
  }
}

// Stili per gli eventi
.fc-event {
  border-radius: 0.5rem;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }

  .fc-event-title {
    font-weight: 500;
  }

  .fc-event-time {
    font-size: 0.875rem;
    opacity: 0.9;
  }
}

.fc-event-appointment {
  background: linear-gradient(135deg, #3699ff 0%, #1f78d4 100%) !important;
  border-color: #3699ff !important;
}

.fc-event-meeting {
  background: linear-gradient(135deg, #f64e60 0%, #e53e3e 100%) !important;
  border-color: #f64e60 !important;
}

.fc-event-task {
  background: linear-gradient(135deg, #1bc5bd 0%, #0ea5a5 100%) !important;
  border-color: #1bc5bd !important;
}

.fc-event-holiday {
  background: linear-gradient(135deg, #ffa800 0%, #f59e0b 100%) !important;
  border-color: #ffa800 !important;
}

.fc-event-sick_leave {
  background: linear-gradient(135deg, #e1f0ff 0%, #d1e7ff 100%) !important;
  border: 2px solid #3699ff !important;
  color: #3699ff !important;
}

.fc-event-permission {
  background: linear-gradient(135deg, #fff4de 0%, #ffeaa7 100%) !important;
  border: 2px solid #ffa800 !important;
  color: #ffa800 !important;
}

.fc-event-other {
  background: linear-gradient(135deg, #e4e6ef 0%, #d1d5db 100%) !important;
  border: 2px solid #6c757d !important;
  color: #6c757d !important;
}

// Stati degli eventi
.fc-event-confirmed {
  opacity: 1;
}

.fc-event-pending {
  opacity: 0.7;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 5px,
      rgba(255, 255, 255, 0.1) 5px,
      rgba(255, 255, 255, 0.1) 10px
    );
  }
}

.fc-event-cancelled {
  opacity: 0.5;
  text-decoration: line-through;
  background: #6c757d !important;
}

.fc-event-completed {
  opacity: 0.8;
  position: relative;

  &::before {
    content: '✓';
    position: absolute;
    top: 2px;
    right: 4px;
    font-size: 0.75rem;
    font-weight: bold;
    color: white;
  }
}

// Priorità degli eventi
.fc-event-urgent {
  border-width: 3px !important;
  animation: pulse 2s infinite;
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

// Animazioni
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(220, 53, 69, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(220, 53, 69, 0);
  }
}

// Responsive design
@media (max-width: 768px) {
  .calendar-header {
    padding: 1rem;

    .calendar-title-section {
      h2 {
        font-size: 1.5rem;
      }
    }

    .card-toolbar {
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;

      .filter-btn,
      .new-event-btn {
        width: 100%;
        justify-content: center;
      }
    }
  }

  .fc {
    .fc-toolbar {
      flex-direction: column;
      gap: 1rem;
    }

    .fc-toolbar-chunk {
      display: flex;
      justify-content: center;
    }
  }
}

// Loading spinner personalizzato
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.loading-spinner {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner-ring {
  position: absolute;
  width: 60px;
  height: 60px;
  border: 4px solid transparent;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  &:nth-child(2) {
    width: 50px;
    height: 50px;
    border-top-color: #764ba2;
    animation-delay: 0.2s;
  }

  &:nth-child(3) {
    width: 40px;
    height: 40px;
    border-top-color: #3699ff;
    animation-delay: 0.4s;
  }
}

.loading-text {
  margin-top: 80px;
  font-size: 1rem;
  font-weight: 500;
  color: #6c757d;
  text-align: center;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

</style> 