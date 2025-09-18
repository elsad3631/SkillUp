<template>
  <!--begin::Modal-->
  <div
    class="modal fade"
    id="kt_modal_event"
    tabindex="-1"
    aria-hidden="true"
    :class="{ show: show, 'd-block': show }"
    @click.self="closeModal"
  >
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content modern-modal-content">
        <!--begin::Modal header-->
        <div class="modal-header modern-modal-header">
          <h2 class="fw-bold">
            {{ mode === 'create' ? 'Nuovo Evento' : 'Modifica Evento' }}
          </h2>
          <div class="btn btn-icon btn-sm btn-active-icon-primary modern-btn-close" @click="closeModal">
            <KTIcon icon-name="cross" icon-class="fs-1" />
          </div>
        </div>
        <!--end::Modal header-->

        <!--begin::Modal body-->
        <div class="modal-body py-lg-10 px-lg-10">
          <form @submit.prevent="handleSubmit" class="form">
            <!--begin::Row-->
            <div class="row mb-6">
              <!--begin::Col-->
              <div class="col-md-6 fv-row">
                <label class="d-flex align-items-center fs-6 fw-semibold mb-2">
                  <span class="required">Titolo</span>
                </label>
                <input
                  type="text"
                  class="form-control form-control-solid"
                  :class="{ 'is-invalid': errors.title }"
                  placeholder="Inserisci il titolo dell'evento"
                  v-model="form.title"
                  required
                />
                <div v-if="errors.title" class="invalid-feedback">
                  {{ errors.title }}
                </div>
              </div>
              <!--end::Col-->

              <!--begin::Col-->
              <div class="col-md-6 fv-row">
                <label class="d-flex align-items-center fs-6 fw-semibold mb-2">
                  <span class="required">Tipo Evento</span>
                </label>
                <select
                  class="form-select form-select-solid"
                  :class="{ 'is-invalid': errors.eventType }"
                  v-model="form.eventType"
                  @change="onEventTypeChange"
                  required
                >
                  <option value="">Seleziona tipo</option>
                  <option value="APPOINTMENT">Appuntamento</option>
                  <option value="MEETING">Riunione</option>
                  <option value="TASK">Attività</option>
                  <option value="HOLIDAY">Ferie</option>
                  <option value="SICK_LEAVE">Permesso</option>
                  <option value="PERMISSION">Permesso Speciale</option>
                  <option value="OTHER">Altro</option>
                </select>
                <div v-if="errors.eventType" class="invalid-feedback">
                  {{ errors.eventType }}
                </div>
              </div>
              <!--end::Col-->
            </div>
            <!--end::Row-->

            <!--begin::Row-->
            <div class="row mb-6">
              <!--begin::Col-->
              <div class="col-md-6 fv-row">
                <label class="d-flex align-items-center fs-6 fw-semibold mb-2">
                  <span class="required">Data Inizio</span>
                </label>
                <input
                  type="datetime-local"
                  class="form-control form-control-solid"
                  :class="{ 'is-invalid': errors.startDate }"
                  v-model="form.startDate"
                  required
                />
                <div v-if="errors.startDate" class="invalid-feedback">
                  {{ errors.startDate }}
                </div>
              </div>
              <!--end::Col-->

              <!--begin::Col-->
              <div class="col-md-6 fv-row">
                <label class="d-flex align-items-center fs-6 fw-semibold mb-2">
                  <span class="required">Data Fine</span>
                </label>
                <input
                  type="datetime-local"
                  class="form-control form-control-solid"
                  :class="{ 'is-invalid': errors.endDate }"
                  v-model="form.endDate"
                  required
                />
                <div v-if="errors.endDate" class="invalid-feedback">
                  {{ errors.endDate }}
                </div>
              </div>
              <!--end::Col-->
            </div>
            <!--end::Row-->

            <!--begin::Row-->
            <div class="row mb-4">
              <div class="col-12">
                <label class="d-flex align-items-center fs-6 fw-semibold mb-2">
                  Orari Rapidi
                </label>
                <div class="d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    class="btn btn-sm btn-light-primary"
                    @click="setQuickTime('09:00', '10:00')"
                  >
                    9:00 - 10:00
                  </button>
                  <button
                    type="button"
                    class="btn btn-sm btn-light-primary"
                    @click="setQuickTime('10:00', '11:00')"
                  >
                    10:00 - 11:00
                  </button>
                  <button
                    type="button"
                    class="btn btn-sm btn-light-primary"
                    @click="setQuickTime('11:00', '12:00')"
                  >
                    11:00 - 12:00
                  </button>
                  <button
                    type="button"
                    class="btn btn-sm btn-light-primary"
                    @click="setQuickTime('14:00', '15:00')"
                  >
                    14:00 - 15:00
                  </button>
                  <button
                    type="button"
                    class="btn btn-sm btn-light-primary"
                    @click="setQuickTime('15:00', '16:00')"
                  >
                    15:00 - 16:00
                  </button>
                  <button
                    type="button"
                    class="btn btn-sm btn-light-primary"
                    @click="setQuickTime('16:00', '17:00')"
                  >
                    16:00 - 17:00
                  </button>
                  <button
                    type="button"
                    class="btn btn-sm btn-light-warning"
                    @click="setAllDay()"
                  >
                    Tutto il giorno
                  </button>
                </div>
              </div>
            </div>
            <!--end::Row-->

            <!--begin::Row-->
            <div class="row mb-6">
              <!--begin::Col-->
              <div class="col-md-6 fv-row">
                <label class="d-flex align-items-center fs-6 fw-semibold mb-2">
                  Stato
                </label>
                <select class="form-select form-select-solid" v-model="form.status">
                  <option value="CONFIRMED">Confermato</option>
                  <option value="PENDING">In Attesa</option>
                  <option value="CANCELLED">Cancellato</option>
                  <option value="COMPLETED">Completato</option>
                </select>
              </div>
              <!--end::Col-->

              <!--begin::Col-->
              <div class="col-md-6 fv-row">
                <label class="d-flex align-items-center fs-6 fw-semibold mb-2">
                  Priorità
                </label>
                <select class="form-select form-select-solid" v-model="form.priority">
                  <option value="LOW">Bassa</option>
                  <option value="MEDIUM">Media</option>
                  <option value="HIGH">Alta</option>
                  <option value="URGENT">Urgente</option>
                </select>
              </div>
              <!--end::Col-->
            </div>
            <!--end::Row-->

            <!--begin::Row-->
            <div class="row mb-6">
              <!--begin::Col-->
              <div class="col-md-6 fv-row">
                <label class="d-flex align-items-center fs-6 fw-semibold mb-2">
                  Località
                </label>
                <input
                  type="text"
                  class="form-control form-control-solid"
                  placeholder="Inserisci la località"
                  v-model="form.location"
                />
              </div>
              <!--end::Col-->

              <!--begin::Col-->
              <div class="col-md-6 fv-row">
                <label class="d-flex align-items-center fs-6 fw-semibold mb-2">
                  Colore
                </label>
                <input
                  type="color"
                  class="form-control form-control-solid"
                  v-model="form.color"
                />
              </div>
              <!--end::Col-->
            </div>
            <!--end::Row-->

            <!--begin::Row-->
            <div class="row mb-6">
              <!--begin::Col-->
              <div class="col-md-6 fv-row">
                <label class="d-flex align-items-center fs-6 fw-semibold mb-2">
                  Ricorrenza
                </label>
                <select class="form-select form-select-solid" v-model="form.recurrence">
                  <option value="">Nessuna ricorrenza</option>
                  <option value="DAILY">Giornaliera</option>
                  <option value="WEEKLY">Settimanale</option>
                  <option value="MONTHLY">Mensile</option>
                  <option value="YEARLY">Annuale</option>
                </select>
              </div>
              <!--end::Col-->

              <!--begin::Col-->
              <div class="col-md-6 fv-row">
                <label class="d-flex align-items-center fs-6 fw-semibold mb-2">
                  Data Fine Ricorrenza
                </label>
                <input
                  type="datetime-local"
                  class="form-control form-control-solid"
                  v-model="form.recurrenceEndDate"
                  :disabled="!form.recurrence"
                />
              </div>
              <!--end::Col-->
            </div>
            <!--end::Row-->

            <!--begin::Row-->
            <div class="row mb-6">
              <!--begin::Col-->
              <div class="col-12 fv-row">
                <label class="d-flex align-items-center fs-6 fw-semibold mb-2">
                  Descrizione
                </label>
                <textarea
                  class="form-control form-control-solid"
                  rows="3"
                  placeholder="Inserisci una descrizione dell'evento"
                  v-model="form.description"
                ></textarea>
              </div>
              <!--end::Col-->
            </div>
            <!--end::Row-->

            <!--begin::Row-->
            <div class="row mb-6">
              <!--begin::Col-->
              <div class="col-md-6 fv-row">
                <div class="form-check form-check-custom form-check-solid">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="allDay"
                    v-model="form.allDay"
                  />
                  <label class="form-check-label" for="allDay">
                    Tutto il giorno
                  </label>
                </div>
              </div>
              <!--end::Col-->

              <!--begin::Col-->
              <div class="col-md-6 fv-row">
                <div class="form-check form-check-custom form-check-solid">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="isPrivate"
                    v-model="form.isPrivate"
                  />
                  <label class="form-check-label" for="isPrivate">
                    Evento privato
                  </label>
                </div>
              </div>
              <!--end::Col-->
            </div>
            <!--end::Row-->

            <!--begin::Row-->
            <div class="row mb-6">
              <!--begin::Col-->
              <div class="col-12 fv-row">
                <label class="d-flex align-items-center fs-6 fw-semibold mb-3">
                  <KTIcon icon-name="users" icon-class="fs-2 me-2" />
                  Partecipanti
                </label>
                
                <!-- Search box for users -->
                <div class="mb-3">
                  <input
                    type="text"
                    class="form-control form-control-solid"
                    placeholder="Cerca utenti..."
                    v-model="userSearchQuery"
                  />
                </div>
                
                <!-- Users list with checkboxes -->
                <div class="users-selection-container">
                  <div v-if="filteredUsers.length === 0" class="text-muted text-center py-4">
                    Nessun utente trovato
                  </div>
                  <div v-else class="users-grid">
                    <div
                      v-for="user in filteredUsers"
                      :key="user.id"
                      class="user-item"
                      :class="{ 'selected': selectedAttendees.includes(user.id) }"
                    >
                      <label class="user-checkbox">
                        <input
                          type="checkbox"
                          :value="user.id"
                          v-model="selectedAttendees"
                          class="form-check-input me-2"
                        />
                        <div class="user-info">
                          <div class="user-avatar">
                            <img
                              v-if="user.avatar"
                              :src="user.avatar"
                              :alt="`${user.firstName} ${user.lastName}`"
                              class="avatar-img"
                            />
                            <div v-else class="avatar-placeholder">
                              {{ getInitials(user.firstName, user.lastName) }}
                            </div>
                          </div>
                          <div class="user-details">
                            <div class="user-name">
                              {{ user.firstName }} {{ user.lastName }}
                            </div>
                            <div class="user-role">
                              {{ user.currentRole || 'Dipendente' }}
                            </div>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <!-- Selected count -->
                <div v-if="selectedAttendees.length > 0" class="mt-3">
                  <span class="badge bg-primary">
                    {{ selectedAttendees.length }} partecipante{{ selectedAttendees.length !== 1 ? 'i' : '' }} selezionato{{ selectedAttendees.length !== 1 ? 'i' : '' }}
                  </span>
                </div>
              </div>
              <!--end::Col-->
            </div>
            <!--end::Row-->
          </form>
        </div>
        <!--end::Modal body-->

        <!--begin::Modal footer-->
        <div class="modal-footer modern-modal-footer">
          <button
            type="button"
            class="btn btn-light modern-btn"
            @click="closeModal"
          >
            Annulla
          </button>
          
          <button
            v-if="mode === 'edit'"
            type="button"
            class="btn btn-danger modern-btn"
            @click="handleDelete"
          >
            Elimina
          </button>
          
          <button
            type="button"
            class="btn btn-primary modern-btn"
            @click="handleSubmit"
            :disabled="loading"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            {{ mode === 'create' ? 'Crea' : 'Salva' }}
          </button>
        </div>
        <!--end::Modal footer-->
      </div>
    </div>
  </div>
  <!--end::Modal-->
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed, onMounted } from "vue";
import type { CalendarEvent, CreateCalendarEventDto } from "@/core/models/Calendar";
import { getNonSuperAdminUsers, type ApplicationUser } from "@/core/services/businessServices/ApplicationUser";
import { useCurrentUser } from "@/core/composables/useCurrentUser";
import Swal from "sweetalert2/dist/sweetalert2.js";

interface Props {
  show: boolean;
  event: CalendarEvent | null;
  mode: 'create' | 'edit';
}

interface Emits {
  (e: 'close'): void;
  (e: 'save', data: CreateCalendarEventDto): void;
  (e: 'delete', eventId: string): void;
}

export default defineComponent({
  name: "event-modal",
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    event: {
      type: Object as () => CalendarEvent | null,
      default: null,
    },
    mode: {
      type: String as () => 'create' | 'edit',
      required: true,
    },
  },
  emits: ['close', 'save', 'delete'],
  setup(props, { emit }) {
    const { currentUser } = useCurrentUser();
    const loading = ref(false);
    const attendeesInput = ref('');
    const errors = ref<Record<string, string>>({});
    const availableUsers = ref<ApplicationUser[]>([]);
    const selectedAttendees = ref<string[]>([]);
    const userSearchQuery = ref('');

    const form = ref<CreateCalendarEventDto>({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      allDay: false,
      eventType: 'APPOINTMENT',
      status: 'CONFIRMED',
      priority: 'MEDIUM',
      location: '',
      attendees: [],
      createdBy: '',
      customerId: '',
      projectId: '',
      userId: '',
      color: '#3699ff',
      recurrence: undefined,
      recurrenceEndDate: undefined,
      isPrivate: false,
    });

    // Funzione per caricare gli utenti della company
    const loadAvailableUsers = async () => {
      try {
        const users = await getNonSuperAdminUsers(currentUser.value?.company || undefined);
        if (users) {
          availableUsers.value = users;
        }
      } catch (error) {
        console.error('Error loading available users:', error);
      }
    };

    // Funzione per convertire date ISO in formato datetime-local
    const convertISOToLocal = (isoString: string) => {
      const date = new Date(isoString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    // Watch for event changes and populate form
    watch(() => props.event, (newEvent) => {
      if (newEvent) {
        form.value = {
          title: newEvent.title,
          description: newEvent.description || '',
          startDate: convertISOToLocal(newEvent.startDate),
          endDate: convertISOToLocal(newEvent.endDate),
          allDay: newEvent.allDay,
          eventType: newEvent.eventType,
          status: newEvent.status,
          priority: newEvent.priority,
          location: newEvent.location || '',
          attendees: newEvent.attendees,
          createdBy: newEvent.createdBy,
          customerId: newEvent.customerId,
          projectId: newEvent.projectId,
          userId: newEvent.userId,
          color: newEvent.color || '#3699ff',
          recurrence: newEvent.recurrence,
          recurrenceEndDate: newEvent.recurrenceEndDate ? convertISOToLocal(newEvent.recurrenceEndDate) : undefined,
          isPrivate: newEvent.isPrivate,
        };
        selectedAttendees.value = newEvent.attendees || [];
        attendeesInput.value = newEvent.attendees.join(', ');
      } else {
        // Reset form for new event
        const now = new Date();
        const startDate = now.toISOString().slice(0, 16);
        const endDate = new Date(now.getTime() + 60 * 60 * 1000).toISOString().slice(0, 16);
        
        form.value = {
          title: '',
          description: '',
          startDate: startDate,
          endDate: endDate,
          allDay: false,
          eventType: 'APPOINTMENT',
          status: 'CONFIRMED',
          priority: 'MEDIUM',
          location: '',
          attendees: [],
          createdBy: '',
          customerId: '',
          projectId: '',
          userId: '',
          color: '#3699ff',
          recurrence: undefined,
          recurrenceEndDate: undefined,
          isPrivate: false,
        };
        selectedAttendees.value = [];
        attendeesInput.value = '';
      }
    }, { immediate: true });

    // Watch selected attendees and update form
    watch(selectedAttendees, (newValue) => {
      form.value.attendees = newValue;
    }, { deep: true });

    // Watch attendees input and update form (backward compatibility)
    watch(attendeesInput, (newValue) => {
      form.value.attendees = newValue
        .split(',')
        .map(id => id.trim())
        .filter(id => id.length > 0);
    });

    // Funzione per gestire il cambio di tipo evento
    const onEventTypeChange = () => {
      // Suggerimenti per titoli basati sul tipo di evento
      const suggestions: Record<string, string> = {
        'APPOINTMENT': 'Appuntamento con cliente',
        'MEETING': 'Riunione di team',
        'TASK': 'Completamento attività',
        'HOLIDAY': 'Ferie estive',
        'SICK_LEAVE': 'Permesso per malattia',
        'PERMISSION': 'Permesso speciale',
        'OTHER': 'Altro evento'
      };

      // Se il titolo è vuoto o è un suggerimento precedente, aggiornalo
      if (!form.value.title || Object.values(suggestions).includes(form.value.title)) {
        form.value.title = suggestions[form.value.eventType] || '';
      }
      
      // Valida il form dopo il cambio
      validateForm();
    };

    // Funzione per validare il form
    const validateForm = () => {
      errors.value = {};

      // Validazione titolo
      if (!form.value.title.trim()) {
        errors.value.title = 'Il titolo è obbligatorio';
      } else if (form.value.title.length < 3) {
        errors.value.title = 'Il titolo deve essere di almeno 3 caratteri';
      }

      // Validazione tipo evento
      if (!form.value.eventType) {
        errors.value.eventType = 'Seleziona un tipo di evento';
      }

      // Validazione date
      if (!form.value.startDate) {
        errors.value.startDate = 'La data di inizio è obbligatoria';
      }

      if (!form.value.endDate) {
        errors.value.endDate = 'La data di fine è obbligatoria';
      }

      if (form.value.startDate && form.value.endDate) {
        const startDate = new Date(form.value.startDate);
        const endDate = new Date(form.value.endDate);
        
        if (startDate >= endDate) {
          errors.value.endDate = 'La data di fine deve essere successiva alla data di inizio';
        }
      }

      return Object.keys(errors.value).length === 0;
    };

    // Watch per validazione in tempo reale
    watch(() => form.value.title, () => {
      if (errors.value.title) {
        validateForm();
      }
    });

    watch(() => form.value.eventType, () => {
      if (errors.value.eventType) {
        validateForm();
      }
    });

    watch(() => form.value.startDate, () => {
      if (errors.value.startDate || errors.value.endDate) {
        validateForm();
      }
    });

    watch(() => form.value.endDate, () => {
      if (errors.value.endDate) {
        validateForm();
      }
    });

    const closeModal = () => {
      emit('close');
    };

    const handleSubmit = async () => {
      loading.value = true;
      try {
        // Valida il form
        if (!validateForm()) {
          throw new Error('Correggi gli errori nel form prima di continuare');
        }

        // Prepara i dati per l'invio, convertendo le date in formato ISO
        const eventData = { ...form.value };
        
        // Converti le date locali in formato ISO
        if (eventData.startDate) {
          eventData.startDate = new Date(eventData.startDate).toISOString();
        }
        if (eventData.endDate) {
          eventData.endDate = new Date(eventData.endDate).toISOString();
        }
        if (eventData.recurrenceEndDate) {
          eventData.recurrenceEndDate = new Date(eventData.recurrenceEndDate).toISOString();
        }

        emit('save', eventData);
      } catch (error) {
        console.error('Error submitting form:', error);
        await Swal.fire({
          title: 'Errore!',
          text: error instanceof Error ? error.message : 'Errore durante il salvataggio',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#f64e60'
        });
      } finally {
        loading.value = false;
      }
    };

    const handleDelete = async () => {
      if (!props.event) return;
      
      const result = await Swal.fire({
        title: 'Sei sicuro?',
        text: 'Vuoi eliminare questo evento? Questa azione non può essere annullata.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#f64e60',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sì, elimina',
        cancelButtonText: 'Annulla',
        reverseButtons: true
      });

      if (result.isConfirmed) {
        emit('delete', props.event.id);
      }
    };

    // Funzione per impostare orari rapidi
    const setQuickTime = (startTime: string, endTime: string) => {
      if (!form.value.startDate) return;
      
      const startDate = new Date(form.value.startDate);
      const [startHour, startMinute] = startTime.split(':').map(Number);
      const [endHour, endMinute] = endTime.split(':').map(Number);
      
      // Imposta l'orario di inizio
      startDate.setHours(startHour, startMinute, 0, 0);
      
      // Imposta l'orario di fine
      const endDate = new Date(startDate);
      endDate.setHours(endHour, endMinute, 0, 0);
      
      form.value.startDate = convertISOToLocal(startDate.toISOString());
      form.value.endDate = convertISOToLocal(endDate.toISOString());
      form.value.allDay = false;
    };

    // Funzione per impostare tutto il giorno
    const setAllDay = () => {
      if (!form.value.startDate) return;
      
      const startDate = new Date(form.value.startDate);
      const endDate = new Date(form.value.startDate);
      
      // Imposta inizio alle 00:00
      startDate.setHours(0, 0, 0, 0);
      
      // Imposta fine alle 23:59
      endDate.setHours(23, 59, 0, 0);
      
      form.value.startDate = convertISOToLocal(startDate.toISOString());
      form.value.endDate = convertISOToLocal(endDate.toISOString());
      form.value.allDay = true;
    };

    // Computed per filtrare gli utenti in base alla ricerca
    const filteredUsers = computed(() => {
      if (!userSearchQuery.value) {
        return availableUsers.value;
      }
      
      const query = userSearchQuery.value.toLowerCase();
      return availableUsers.value.filter(user => 
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.currentRole?.toLowerCase().includes(query)
      );
    });

    // Funzione per ottenere le iniziali dell'utente
    const getInitials = (firstName?: string | null, lastName?: string | null) => {
      const first = firstName?.charAt(0).toUpperCase() || '';
      const last = lastName?.charAt(0).toUpperCase() || '';
      return first + last || '?';
    };

    // Load available users when component mounts
    onMounted(() => {
      loadAvailableUsers();
    });

    return {
      loading,
      form,
      attendeesInput,
      errors,
      availableUsers,
      selectedAttendees,
      userSearchQuery,
      filteredUsers,
      getInitials,
      closeModal,
      handleSubmit,
      handleDelete,
      setQuickTime,
      setAllDay,
      onEventTypeChange,
    };
  },
});
</script>

<style lang="scss">
.modal.show {
  background-color: rgba(0, 0, 0, var(--bs-modal-backdrop-opacity, 0.8));
  backdrop-filter: blur(4px);
}

.form-check-input:checked {
  background-color: #3699ff;
  border-color: #3699ff;
}

.modern-modal-content {
  border-radius: 16px;
  border: 1px solid rgba(var(--bs-primary-rgb), 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-50px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modern-modal-header {
  background: linear-gradient(135deg, rgba(var(--bs-primary-rgb), 0.05), rgba(var(--bs-primary-rgb), 0.1));
  border-bottom: 1px solid rgba(var(--bs-primary-rgb), 0.1);
  border-radius: 16px 16px 0 0;
}

.modern-modal-footer {
  background: linear-gradient(135deg, rgba(var(--bs-primary-rgb), 0.02), rgba(var(--bs-primary-rgb), 0.05));
  border-top: 1px solid rgba(var(--bs-primary-rgb), 0.1);
  border-radius: 0 0 16px 16px;
}

.modern-btn-close {
  transition: all 0.2s ease;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modern-btn-close:hover {
  background-color: rgba(var(--bs-danger-rgb), 0.1);
  transform: scale(1.1);
}

.modern-btn {
  transition: all 0.3s ease;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

.modern-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.modern-btn:hover::before {
  left: 100%;
}

.modern-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

// Stili per la selezione partecipanti
.users-selection-container {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #e4e6ef;
  border-radius: 0.475rem;
  padding: 1rem;
  background-color: #f9f9f9;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 0.75rem;
}

.user-item {
  background: white;
  border: 1px solid #e4e6ef;
  border-radius: 0.475rem;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #3699ff;
    box-shadow: 0 0 0 1px rgba(54, 153, 255, 0.2);
  }
  
  &.selected {
    border-color: #3699ff;
    background-color: rgba(54, 153, 255, 0.05);
  }
}

.user-checkbox {
  display: block;
  width: 100%;
  padding: 0.75rem;
  margin: 0;
  cursor: pointer;
  
  &:hover {
    background-color: rgba(54, 153, 255, 0.05);
  }
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-weight: 600;
  color: #3f4254;
  font-size: 0.875rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 0.75rem;
  color: #7e8299;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

// Responsive design per la selezione utenti
@media (max-width: 768px) {
  .users-grid {
    grid-template-columns: 1fr;
  }
  
  .users-selection-container {
    max-height: 300px;
  }
}
</style> 