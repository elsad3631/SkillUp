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
      <div class="modal-content">
        <!--begin::Modal header-->
        <div class="modal-header">
          <h2 class="fw-bold">
            {{ mode === 'create' ? 'Nuovo Evento' : 'Modifica Evento' }}
          </h2>
          <div class="btn btn-icon btn-sm btn-active-icon-primary" @click="closeModal">
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
                  placeholder="Inserisci il titolo dell'evento"
                  v-model="form.title"
                  required
                />
              </div>
              <!--end::Col-->

              <!--begin::Col-->
              <div class="col-md-6 fv-row">
                <label class="d-flex align-items-center fs-6 fw-semibold mb-2">
                  <span class="required">Tipo Evento</span>
                </label>
                <select
                  class="form-select form-select-solid"
                  v-model="form.eventType"
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
                  v-model="form.startDate"
                  required
                />
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
                  v-model="form.endDate"
                  required
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
                <label class="d-flex align-items-center fs-6 fw-semibold mb-2">
                  Partecipanti (ID separati da virgola)
                </label>
                <input
                  type="text"
                  class="form-control form-control-solid"
                  placeholder="Inserisci gli ID dei partecipanti separati da virgola"
                  v-model="attendeesInput"
                />
              </div>
              <!--end::Col-->
            </div>
            <!--end::Row-->
          </form>
        </div>
        <!--end::Modal body-->

        <!--begin::Modal footer-->
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-light"
            @click="closeModal"
          >
            Annulla
          </button>
          
          <button
            v-if="mode === 'edit'"
            type="button"
            class="btn btn-danger"
            @click="handleDelete"
          >
            Elimina
          </button>
          
          <button
            type="button"
            class="btn btn-primary"
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
import { defineComponent, ref, watch, computed } from "vue";
import type { CalendarEvent, CreateCalendarEventDto } from "@/core/models/Calendar";

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
    const loading = ref(false);
    const attendeesInput = ref('');

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

    // Watch for event changes and populate form
    watch(() => props.event, (newEvent) => {
      if (newEvent) {
        form.value = {
          title: newEvent.title,
          description: newEvent.description || '',
          startDate: newEvent.startDate,
          endDate: newEvent.endDate,
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
          recurrenceEndDate: newEvent.recurrenceEndDate,
          isPrivate: newEvent.isPrivate,
        };
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
        attendeesInput.value = '';
      }
    }, { immediate: true });

    // Watch attendees input and update form
    watch(attendeesInput, (newValue) => {
      form.value.attendees = newValue
        .split(',')
        .map(id => id.trim())
        .filter(id => id.length > 0);
    });

    const closeModal = () => {
      emit('close');
    };

    const handleSubmit = async () => {
      loading.value = true;
      try {
        // Validate form
        if (!form.value.title || !form.value.startDate || !form.value.endDate || !form.value.eventType) {
          throw new Error('Compila tutti i campi obbligatori');
        }

        // Validate dates
        if (new Date(form.value.startDate) >= new Date(form.value.endDate)) {
          throw new Error('La data di fine deve essere successiva alla data di inizio');
        }

        // Convert dates to ISO string if allDay is true
        if (form.value.allDay) {
          const startDate = new Date(form.value.startDate);
          const endDate = new Date(form.value.endDate);
          form.value.startDate = startDate.toISOString();
          form.value.endDate = endDate.toISOString();
        }

        emit('save', { ...form.value });
      } catch (error) {
        console.error('Error submitting form:', error);
        alert(error instanceof Error ? error.message : 'Errore durante il salvataggio');
      } finally {
        loading.value = false;
      }
    };

    const handleDelete = () => {
      if (props.event && confirm('Sei sicuro di voler eliminare questo evento?')) {
        emit('delete', props.event.id);
      }
    };

    return {
      loading,
      form,
      attendeesInput,
      closeModal,
      handleSubmit,
      handleDelete,
    };
  },
});
</script>

<style lang="scss">
.modal.show {
  background-color: rgba(0, 0, 0, 0.5);
}

.form-check-input:checked {
  background-color: #3699ff;
  border-color: #3699ff;
}
</style> 