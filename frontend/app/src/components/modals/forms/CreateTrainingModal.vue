<template>
  <div
    class="modal fade"
    id="kt_modal_create_training"
    ref="createTrainingModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content">
        <div class="modal-header" id="kt_modal_create_training_header">
          <h2 class="fw-bold">New Training</h2>
          <div
            id="kt_modal_create_training_close"
            data-bs-dismiss="modal"
            class="btn btn-icon btn-sm btn-active-icon-primary"
            @click="handleClose"
          >
            <KTIcon icon-name="cross" icon-class="fs-1" />
          </div>
        </div>

        <el-form
          @submit.prevent="handleSubmit"
          :model="formData"
          :rules="rules"
          ref="formRef"
        >
          <div class="modal-body py-10 px-lg-17">
            <div
              class="scroll-y me-n7 pe-7"
              id="kt_modal_create_training_scroll"
              data-kt-scroll="true"
              data-kt-scroll-activate="{default: false, lg: true}"
              data-kt-scroll-max-height="auto"
              data-kt-scroll-dependencies="#kt_modal_create_training_header"
              data-kt-scroll-wrappers="#kt_modal_create_training_scroll"
              data-kt-scroll-offset="300px"
            >
              <!-- Title -->
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-semibold mb-2">Title</label>
                <el-form-item prop="title">
                  <el-input
                    v-model="formData.title"
                    type="text"
                    placeholder="Enter training title"
                  />
                </el-form-item>
              </div>

              <!-- Description -->
              <div class="fv-row mb-7">
                <label class="fs-6 fw-semibold mb-2">Description</label>
                <el-form-item prop="description">
                  <el-input
                    v-model="formData.description"
                    type="textarea"
                    :rows="3"
                    placeholder="Enter training description"
                  />
                </el-form-item>
              </div>

              <!-- Provider and URL -->
              <div class="row g-9 mb-7">
                <div class="col-md-6 fv-row">
                  <label class="fs-6 fw-semibold mb-2">Provider</label>
                  <el-form-item prop="provider">
                    <el-input
                      v-model="formData.provider"
                      type="text"
                      placeholder="Training provider"
                    />
                  </el-form-item>
                </div>
                <div class="col-md-6 fv-row">
                  <label class="fs-6 fw-semibold mb-2">URL</label>
                  <el-form-item prop="url">
                    <el-input
                      v-model="formData.url"
                      type="url"
                      placeholder="Training URL"
                    />
                  </el-form-item>
                </div>
              </div>

              <!-- Level and Duration -->
              <div class="row g-9 mb-7">
                <div class="col-md-6 fv-row">
                  <label class="required fs-6 fw-semibold mb-2">Difficulty Level</label>
                  <el-form-item prop="level">
                    <el-select v-model="formData.level" placeholder="Select level">
                      <el-option value="BEGINNER" label="Beginner" />
                      <el-option value="INTERMEDIATE" label="Intermediate" />
                      <el-option value="ADVANCED" label="Advanced" />
                      <el-option value="EXPERT" label="Expert" />
                    </el-select>
                  </el-form-item>
                </div>
                <div class="col-md-6 fv-row">
                  <label class="required fs-6 fw-semibold mb-2">Duration (hours)</label>
                  <el-form-item prop="estimatedDurationHours">
                    <el-input-number
                      v-model="formData.estimatedDurationHours"
                      :min="1"
                      :step="1"
                      controls-position="right"
                    />
                  </el-form-item>
                </div>
              </div>

              <!-- Cost -->
              <div class="fv-row mb-7">
                <label class="fs-6 fw-semibold mb-2">Cost (€)</label>
                <el-form-item prop="cost">
                  <el-input-number
                    v-model="formData.cost"
                    :min="0"
                    :step="0.01"
                    :precision="2"
                    controls-position="right"
                    placeholder="0.00"
                  />
                </el-form-item>
              </div>

              <!-- Skills Developed -->
              <div class="fv-row mb-7">
                <label class="fs-6 fw-semibold mb-2">Skills Developed</label>
                <el-form-item prop="skillsInput">
                  <el-input
                    v-model="skillsInput"
                    type="text"
                    placeholder="Type a skill and press Enter"
                    @keyup.enter="addSkill"
                  />
                </el-form-item>
                <div class="mt-3" v-if="formData.skillsDeveloped.length > 0">
                  <span
                    v-for="skill in formData.skillsDeveloped"
                    :key="skill"
                    class="badge badge-light-primary me-2 mb-2"
                  >
                    {{ skill }}
                    <button
                      type="button"
                      class="btn-close btn-close-white ms-1"
                      @click="removeSkill(skill)"
                    ></button>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer flex-center">
            <button
              type="button"
              class="btn btn-light me-3"
              @click="handleClose"
            >
              Cancel
            </button>
            <button
              :data-kt-indicator="loading ? 'on' : null"
              class="btn btn-lg btn-primary"
              type="submit"
            >
              <span v-if="!loading" class="indicator-label">
                Create Training
                <KTIcon icon-name="arrow-right" icon-class="fs-2 me-2 me-0" />
              </span>
              <span v-if="loading" class="indicator-progress">
                Please wait...
                <span
                  class="spinner-border spinner-border-sm align-middle ms-2"
                ></span>
              </span>
            </button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import KTIcon from "@/core/helpers/kt-icon/KTIcon.vue";

interface CreateTrainingFormData {
  title: string;
  description: string;
  provider: string;
  url: string;
  estimatedDurationHours: number;
  skillsDeveloped: string[];
  level: string;
  cost?: number;
}

export default defineComponent({
  name: "create-training-modal",
  components: {
    KTIcon,
  },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    closeModal: {
      type: Function,
      required: true,
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close', 'submit'],
  setup(props, { emit }) {
    const formRef = ref<null | HTMLFormElement>(null);
    const createTrainingModalRef = ref<null | HTMLElement>(null);
    const skillsInput = ref("");

    const formData = ref<CreateTrainingFormData>({
      title: "",
      description: "",
      provider: "",
      url: "",
      estimatedDurationHours: 1,
      skillsDeveloped: [],
      level: "BEGINNER",
      cost: undefined,
    });

    const rules = ref({
      title: [
        {
          required: true,
          message: "Training title is required",
          trigger: "blur",
        },
      ],
      level: [
        {
          required: true,
          message: "Difficulty level is required",
          trigger: "change",
        },
      ],
      estimatedDurationHours: [
        {
          required: true,
          message: "Duration is required",
          trigger: "change",
        },
      ],
    });

    // Reset form when modal is shown
    watch(() => props.show, (newShow) => {
      if (newShow) {
        // Reset form for new training
        formData.value = {
          title: "",
          description: "",
          provider: "",
          url: "",
          estimatedDurationHours: 1,
          skillsDeveloped: [],
          level: "BEGINNER",
          cost: undefined,
        };
        skillsInput.value = "";
        
        // Clear form validation
        if (formRef.value) {
          formRef.value.clearValidate();
        }
      }
    });

    const addSkill = () => {
      const skill = skillsInput.value.trim();
      if (skill && !formData.value.skillsDeveloped.includes(skill)) {
        formData.value.skillsDeveloped.push(skill);
        skillsInput.value = "";
      }
    };

    const removeSkill = (skill: string) => {
      formData.value.skillsDeveloped = formData.value.skillsDeveloped.filter(s => s !== skill);
    };

    const handleClose = () => {
      emit('close');
      props.closeModal();
    };

    const handleSubmit = () => {
      if (!formRef.value) {
        return;
      }

      formRef.value.validate((valid: boolean) => {
        if (valid) {
          emit('submit', formData.value);
        }
      });
    };

    return {
      formRef,
      createTrainingModalRef,
      formData,
      rules,
      skillsInput,
      addSkill,
      removeSkill,
      handleClose,
      handleSubmit,
    };
  },
});
</script>
