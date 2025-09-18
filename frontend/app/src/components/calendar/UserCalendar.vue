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
