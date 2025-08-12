<template>
  <div class="modal fade" id="kt_modal_add_training" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered mw-700px">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Aggiungi Nuovo Training</h2>
          <div class="btn btn-icon btn-sm btn-active-icon-primary" data-bs-dismiss="modal">
            <KTIcon icon-name="cross" icon-class="fs-1" />
          </div>
        </div>

        <div class="modal-body scroll-y mx-5 mx-xl-15 my-7">
          <form @submit.prevent="onSubmit" class="form">
            <!-- Basic Information -->
            <div class="card mb-6">
              <div class="card-header">
                <h3 class="card-title">Informazioni Training</h3>
              </div>
              <div class="card-body">
                <div class="row mb-6">
                  <div class="col-md-12">
                    <label class="form-label required">Titolo</label>
                    <input
                      v-model="form.title"
                      type="text"
                      class="form-control"
                      placeholder="es. JavaScript Fundamentals"
                      required
                    />
                  </div>
                </div>

                <div class="mb-6">
                  <label class="form-label">Descrizione</label>
                  <textarea
                    v-model="form.description"
                    class="form-control"
                    rows="3"
                    placeholder="Descrivi il contenuto del training..."
                  ></textarea>
                </div>

                <div class="row mb-6">
                  <div class="col-md-6">
                    <label class="form-label">Provider</label>
                    <input
                      v-model="form.provider"
                      type="text"
                      class="form-control"
                      placeholder="es. CodeAcademy, Coursera"
                    />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">URL</label>
                    <input
                      v-model="form.url"
                      type="url"
                      class="form-control"
                      placeholder="https://example.com/training"
                    />
                  </div>
                </div>

                <div class="row mb-6">
                  <div class="col-md-6">
                    <label class="form-label required">Livello di Difficoltà</label>
                    <select v-model="form.level" class="form-select" required>
                      <option value="">Seleziona Livello</option>
                      <option value="BEGINNER">Beginner</option>
                      <option value="INTERMEDIATE">Intermediate</option>
                      <option value="ADVANCED">Advanced</option>
                      <option value="EXPERT">Expert</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label required">Durata (ore)</label>
                    <input
                      v-model="form.estimatedDurationHours"
                      type="number"
                      class="form-control"
                      min="1"
                      placeholder="es. 20"
                      required
                    />
                  </div>
                </div>

                <div class="row mb-6">
                  <div class="col-md-6">
                    <label class="form-label">Costo (€)</label>
                    <input
                      v-model="form.cost"
                      type="number"
                      class="form-control"
                      min="0"
                      step="0.01"
                      placeholder="es. 49.99"
                    />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Competenze Sviluppate</label>
                    <input
                      v-model="skillsInput"
                      type="text"
                      class="form-control"
                      placeholder="Separate con virgole (es. JavaScript, Vue.js, HTML)"
                      @keyup.enter="addSkill"
                    />
                    <div class="mt-2">
                      <span v-for="skill in form.skillsDeveloped" :key="skill" class="badge badge-light-primary me-1 mb-1">
                        {{ skill }}
                        <button type="button" class="btn-close btn-close-white ms-1" @click="removeSkill(skill)"></button>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="text-center">
              <button
                type="button"
                class="btn btn-light me-3"
                data-bs-dismiss="modal"
              >
                Annulla
              </button>
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="loading"
              >
                <span v-if="loading" class="indicator-progress">
                  Attendi...
                  <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
                </span>
                <span v-else class="indicator-label">Aggiungi Training</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from "vue";
import KTIcon from "@/core/helpers/kt-icon/KTIcon.vue";
import { createTraining, type Training } from "@/core/services/businessServices/Training";
import Swal from "sweetalert2/dist/sweetalert2.js";

export default defineComponent({
  name: "AddTrainingModal",
  components: {
    KTIcon,
  },
  emits: ["training-created"],
  props: {
    closeModal: {
      type: Function,
      required: false,
      default: undefined,
    },
  },
  setup(props, { emit }) {
    const loading = ref(false);
    const skillsInput = ref("");

    const form = reactive({
      title: "",
      description: "",
      provider: "",
      url: "",
      estimatedDurationHours: 1,
      skillsDeveloped: [] as string[],
      level: "BEGINNER",
      cost: undefined as number | undefined,
    });

    const addSkill = () => {
      const skill = skillsInput.value.trim();
      if (skill && !form.skillsDeveloped.includes(skill)) {
        form.skillsDeveloped.push(skill);
        skillsInput.value = "";
      }
    };

    const removeSkill = (skill: string) => {
      form.skillsDeveloped = form.skillsDeveloped.filter(s => s !== skill);
    };

    const resetForm = () => {
      Object.assign(form, {
        title: "",
        description: "",
        provider: "",
        url: "",
        estimatedDurationHours: 1,
        skillsDeveloped: [],
        level: "BEGINNER",
        cost: undefined,
      });
      skillsInput.value = "";
    };

    const onSubmit = async () => {
      if (!form.title || !form.level || !form.estimatedDurationHours) {
        Swal.fire('Errore', 'Compila tutti i campi obbligatori.', 'error');
        return;
      }

      loading.value = true;
      try {
        // Prepara i dati per l'API
        const trainingData: Partial<Training> = {
          title: form.title.trim(),
          level: form.level,
          estimatedDurationHours: form.estimatedDurationHours,
        };

        if (form.description) trainingData.description = form.description.trim();
        if (form.provider) trainingData.provider = form.provider.trim();
        if (form.url) trainingData.url = form.url.trim();
        if (form.cost !== undefined) trainingData.cost = form.cost;
        if (form.skillsDeveloped.length > 0) trainingData.skillsDeveloped = form.skillsDeveloped;

        const result = await createTraining(trainingData);
        
        if (result) {
          emit("training-created", result);
          Swal.fire({
            icon: 'success',
            title: 'Training creato!',
            text: 'Il training è stato aggiunto con successo.'
          });
          
          if (props.closeModal) props.closeModal();
          resetForm();
        }
      } catch (error) {
        console.error("Errore creazione training:", error);
        Swal.fire({
          icon: 'error',
          title: 'Errore',
          text: 'Si è verificato un errore durante la creazione del training.'
        });
      } finally {
        loading.value = false;
      }
    };

    return {
      form,
      skillsInput,
      loading,
      onSubmit,
      addSkill,
      removeSkill,
      resetForm,
    };
  },
});
</script>
