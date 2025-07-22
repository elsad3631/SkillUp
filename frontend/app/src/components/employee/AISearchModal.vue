<template>
  <div class="modal fade" id="kt_modal_ai_search_employee" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <!--begin::Modal header-->
        <div class="modal-header">
          <h5 class="modal-title">
            <KTIcon icon-name="robot" icon-class="fs-2 me-2 text-primary" />
            AI Document Search
          </h5>
          <div class="btn btn-icon btn-sm btn-active-light-primary ms-2" data-bs-dismiss="modal" aria-label="Close">
            <KTIcon icon-name="cross" icon-class="fs-1" />
          </div>
        </div>
        <!--end::Modal header-->

        <!--begin::Modal body-->
        <div class="modal-body">
          <!--begin::Search input-->
          <div class="mb-6">
            <label class="form-label fw-semibold">Ask a question about employee documents:</label>
            <div class="input-group">
              <input
                v-model="question"
                type="text"
                class="form-control form-control-lg"
                placeholder="e.g., What documents are available for this employee?"
                @keyup.enter="askQuestion"
                :disabled="isLoading"
              />
              <button
                class="btn btn-primary btn-lg"
                type="button"
                @click="askQuestion"
                :disabled="!question.trim() || isLoading"
              >
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                <KTIcon v-else icon-name="magnifier" icon-class="fs-2" />
                Ask
              </button>
            </div>
          </div>
          <!--end::Search input-->

          <!--begin::Suggested questions-->
          <div v-if="!currentAnswer && !isLoading" class="mb-6">
            <div class="card card-flush">
              <div class="card-header">
                <h6 class="card-title">
                  <KTIcon icon-name="bulb" icon-class="fs-2 me-2 text-warning" />
                  Domande frequenti
                </h6>
              </div>
              <div class="card-body">
                <div class="row g-3">
                  <div class="col-md-6">
                    <div class="btn btn-light-primary btn-sm w-100 text-start p-3" @click="setQuestion('Quali documenti sono disponibili per questo dipendente?')">
                      <KTIcon icon-name="files" icon-class="fs-2 me-2 text-primary" />
                      <span>Quali documenti sono disponibili per questo dipendente?</span>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="btn btn-light-success btn-sm w-100 text-start p-3" @click="setQuestion('Quali sono le competenze e le esperienze del dipendente?')">
                      <KTIcon icon-name="profile-user" icon-class="fs-2 me-2 text-success" />
                      <span>Quali sono le competenze e le esperienze del dipendente?</span>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="btn btn-light-info btn-sm w-100 text-start p-3" @click="setQuestion('Quali sono i progetti a cui ha partecipato?')">
                      <KTIcon icon-name="calendar" icon-class="fs-2 me-2 text-info" />
                      <span>Quali sono i progetti a cui ha partecipato?</span>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="btn btn-light-danger btn-sm w-100 text-start p-3" @click="setQuestion('Quali sono le valutazioni e i feedback ricevuti?')">
                      <KTIcon icon-name="shield-cross" icon-class="fs-2 me-2 text-danger" />
                      <span>Quali sono le valutazioni e i feedback ricevuti?</span>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="btn btn-light-warning btn-sm w-100 text-start p-3" @click="setQuestion('Quali sono i contratti e i documenti HR?')">
                      <KTIcon icon-name="dollar" icon-class="fs-2 me-2 text-warning" />
                      <span>Quali sono i contratti e i documenti HR?</span>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="btn btn-light-dark btn-sm w-100 text-start p-3" @click="setQuestion('Quali sono le certificazioni e i training completati?')">
                      <KTIcon icon-name="gear" icon-class="fs-2 me-2 text-dark" />
                      <span>Quali sono le certificazioni e i training completati?</span>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="btn btn-light-primary btn-sm w-100 text-start p-3" @click="setQuestion('Quali sono i documenti di sicurezza e compliance?')">
                      <KTIcon icon-name="message-text" icon-class="fs-2 me-2 text-primary" />
                      <span>Quali sono i documenti di sicurezza e compliance?</span>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="btn btn-light-success btn-sm w-100 text-start p-3" @click="setQuestion('Quali sono i documenti di performance e obiettivi?')">
                      <KTIcon icon-name="files" icon-class="fs-2 me-2 text-success" />
                      <span>Quali sono i documenti di performance e obiettivi?</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--end::Suggested questions-->

          <!--begin::Loading state-->
          <div v-if="isLoading" class="text-center py-8">
            <div class="spinner-border text-primary mb-3" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <div class="text-muted">Searching documents and generating answer...</div>
          </div>
          <!--end::Loading state-->

          <!--begin::Answer-->
          <div v-if="currentAnswer && !isLoading" class="mb-6">
            <div class="card card-flush">
              <div class="card-header">
                <h6 class="card-title">
                  <KTIcon icon-name="robot" icon-class="fs-2 me-2 text-primary" />
                  AI Answer
                </h6>
                <div class="card-toolbar">
                  <span class="badge badge-light-primary">
                    {{ Math.round(currentAnswer.confidence * 100) }}% confidence
                  </span>
                </div>
              </div>
              <div class="card-body">
                <div class="mb-4">
                  <div class="fw-semibold mb-2">Question:</div>
                  <div class="text-muted">{{ question }}</div>
                </div>
                <div class="mb-4">
                  <div class="fw-semibold mb-2">Answer:</div>
                  <div class="text-gray-900" style="white-space: pre-wrap;">{{ currentAnswer.answer }}</div>
                </div>
                <div class="d-flex align-items-center text-muted fs-7">
                  <KTIcon icon-name="clock" icon-class="fs-1 me-1" />
                  Generated in {{ currentAnswer.queryTime }}ms
                </div>
              </div>
            </div>
          </div>
          <!--end::Answer-->

          <!--begin::Sources-->
          <div v-if="currentAnswer?.sources && currentAnswer.sources.length > 0" class="mb-6">
            <div class="card card-flush">
              <div class="card-header">
                <h6 class="card-title">
                  <KTIcon icon-name="files" icon-class="fs-2 me-2 text-info" />
                  Sources ({{ currentAnswer.sources.length }})
                </h6>
              </div>
              <div class="card-body">
                <div class="accordion" id="sourcesAccordion">
                  <div
                    v-for="(source, index) in currentAnswer.sources"
                    :key="index"
                    class="accordion-item"
                  >
                    <h2 class="accordion-header">
                      <button
                        class="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        :data-bs-target="`#source-${index}`"
                        aria-expanded="false"
                        :aria-controls="`source-${index}`"
                      >
                        <div class="d-flex align-items-center w-100">
                          <KTIcon icon-name="file" icon-class="fs-2 me-3" />
                          <div class="flex-grow-1">
                            <div class="fw-semibold">{{ source.fileName }}</div>
                            <div class="text-muted fs-7">Relevance: {{ Math.round(source.relevance) }}%</div>
                          </div>
                        </div>
                      </button>
                    </h2>
                    <div
                      :id="`source-${index}`"
                      class="accordion-collapse collapse"
                      data-bs-parent="#sourcesAccordion"
                    >
                      <div class="accordion-body">
                        <div class="text-muted fs-7 mb-2">File path: {{ source.filePath }}</div>
                        <div class="bg-light p-3 rounded">
                          <div style="white-space: pre-wrap; max-height: 200px; overflow-y: auto;">
                            {{ source.content }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--end::Sources-->

          <!--begin::Error state-->
          <div v-if="error" class="alert alert-danger">
            <KTIcon icon-name="shield-cross" icon-class="fs-2 me-2" />
            {{ error }}
          </div>
          <!--end::Error state-->
        </div>
        <!--end::Modal body-->

        <!--begin::Modal footer-->
        <div class="modal-footer">
          <button type="button" class="btn btn-light" data-bs-dismiss="modal">Close</button>
          <button
            v-if="currentAnswer"
            type="button"
            class="btn btn-primary"
            @click="clearSearch"
          >
            New Question
          </button>
        </div>
        <!--end::Modal footer-->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, inject, computed } from "vue";
import { useRoute } from "vue-router";
import KTIcon from "@/core/helpers/kt-icon/KTIcon.vue";
import azureAISearchService, { type SearchResult } from "@/core/services/businessServices/AzureAISearch";

export default defineComponent({
  name: "ai-search-modal-employee",
  components: {
    KTIcon,
  },
  setup() {
    const route = useRoute();
    const employee = inject<any>('employee');
    
    // Reactive data
    const question = ref('');
    const isLoading = ref(false);
    const currentAnswer = ref<SearchResult | null>(null);
    const error = ref('');

    // Computed properties
    const employeeId = computed(() => route.params.id as string);

    // Methods
    const askQuestion = async () => {
      if (!question.value.trim() || isLoading.value) return;

      try {
        isLoading.value = true;
        error.value = '';

        const result = await azureAISearchService.askQuestion({
          question: question.value,
          entityType: 'employee',
          entityId: employeeId.value,
          maxResults: 5
        });

        if (result) {
          currentAnswer.value = result;
        } else {
          error.value = 'Failed to get answer. Please try again.';
        }
      } catch (err: any) {
        console.error('Error asking question:', err);
        error.value = err.message || 'An error occurred while processing your question.';
      } finally {
        isLoading.value = false;
      }
    };

    const clearSearch = () => {
      question.value = '';
      currentAnswer.value = null;
      error.value = '';
    };

    const setQuestion = (selectedQuestion: string) => {
      question.value = selectedQuestion;
    };

    return {
      question,
      isLoading,
      currentAnswer,
      error,
      askQuestion,
      clearSearch,
      setQuestion,
    };
  },
});
</script>

<style scoped>
.accordion-button:not(.collapsed) {
  background-color: #f8f9fa;
  color: #495057;
}

.accordion-button:focus {
  box-shadow: none;
  border-color: rgba(0, 0, 0, 0.125);
}
</style> 