<template>
  <!--begin::Loading State-->
  <div v-if="loading" class="d-flex justify-content-center align-items-center" style="min-height: 400px;">
    <div class="text-center">
      <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="mt-3">
        <span class="fw-semobold text-gray-600">Loading employee data...</span>
      </div>
    </div>
  </div>
  <!--end::Loading State-->

  <!--begin::Error State-->
  <div v-else-if="error" class="d-flex justify-content-center align-items-center" style="min-height: 400px;">
    <div class="text-center">
      <div class="mb-4">
        <i class="bi bi-exclamation-triangle text-danger" style="font-size: 3rem;"></i>
      </div>
      <div class="mb-3">
        <h4 class="text-danger">Error Loading Employee</h4>
        <p class="text-gray-600">{{ error }}</p>
      </div>
      <button @click="handleRefreshClick" class="btn btn-primary">
        <i class="bi bi-arrow-clockwise me-2"></i>Try Again
      </button>
    </div>
  </div>
  <!--end::Error State-->

  <!--begin::Content (shown when loaded)-->
  <div v-else>
    <!--begin::Navbar-->
    <div class="card mb-5 mb-xl-10">
      <div class="card-body pt-9 pb-0">
        <!--begin::Details-->
        <div class="d-flex flex-wrap flex-sm-nowrap mb-3">
          <!--begin: Pic-->
          <div class="me-7 mb-4">
            <div
              class="symbol symbol-100px symbol-lg-160px symbol-fixed position-relative"
            >
              <img 
                :src="currentAvatarUrl" 
                :alt="`${employee?.firstName || ''} ${employee?.lastName || ''} avatar`"
                @error="handleImageError"
                @load="handleImageLoad"
                :class="{ 'opacity-50': imageLoading }"
              />
              <div
                class="position-absolute translate-middle bottom-0 start-100 mb-6 bg-success rounded-circle border border-4 border-white h-20px w-20px"
              ></div>
              
              <!--begin::Avatar controls-->
              <div class="position-absolute bottom-0 end-0">
                <!--begin::Change avatar button-->
                <label
                  class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                  data-bs-toggle="tooltip"
                  title="Change avatar"
                  :class="{ 'disabled': avatarComposable.isProcessing.value }"
                >
                  <i class="bi bi-pencil-fill fs-7" v-if="!avatarComposable.isUploading.value"></i>
                  <span class="spinner-border spinner-border-sm" v-if="avatarComposable.isUploading.value"></span>

                  <input 
                    type="file" 
                    name="avatar" 
                    accept=".png, .jpg, .jpeg, .webp" 
                    @change="handleAvatarUpload"
                    :disabled="avatarComposable.isProcessing.value"
                    ref="avatarInput"
                    style="display: none;"
                  />
                </label>
                <!--end::Change avatar button-->

                <!--begin::Remove avatar button-->
                <span
                  v-if="employee?.avatar && currentAvatarUrl !== getAssetPath('media/avatars/blank.png')"
                  class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow ms-1"
                  data-bs-toggle="tooltip"
                  @click="handleAvatarRemove"
                  title="Remove avatar"
                  :class="{ 'disabled': avatarComposable.isProcessing.value }"
                  style="cursor: pointer;"
                >
                  <i class="bi bi-x fs-2" v-if="!avatarComposable.isDeleting.value"></i>
                  <span class="spinner-border spinner-border-sm" v-if="avatarComposable.isDeleting.value"></span>
                </span>
                <!--end::Remove avatar button-->
              </div>
              <!--end::Avatar controls-->
            </div>
            
          </div>
          <!--end::Pic-->

          <!--begin::Info-->
          <div class="flex-grow-1">
            <!--begin::Title-->
            <div
              class="d-flex justify-content-between align-items-start flex-wrap mb-2"
            >
              <!--begin::User-->
              <div class="d-flex flex-column">
                <!--begin::Name-->
                <div class="d-flex align-items-center mb-2">
                  <span class="text-gray-800 fs-2 fw-bold me-1">
                    {{ employee?.name || employee?.firstName || '' }} {{ employee?.surname || employee?.lastName || '' }}
                  </span>
                  <a href="#">
                    <KTIcon icon-name="verify" icon-class="fs-1 text-primary" />
                  </a>

                  <a
                    href="#"
                    class="btn btn-sm btn-light-success fw-bold ms-2 fs-8 py-1 px-3"
                    data-bs-toggle="modal"
                    data-bs-target="#kt_modal_upgrade_plan"
                    >Upgrade to Pro</a
                  >
                </div>
                <!--end::Name-->

                <!--begin::Info-->
                <div class="d-flex flex-wrap fw-semobold fs-6 mb-4 pe-2">
                  <span v-if="employee?.currentRole || employee?.role" class="d-flex align-items-center text-gray-400 text-hover-primary me-5 mb-2">
                    <KTIcon icon-name="profile-circle" icon-class="fs-4 me-1" />
                    {{ employee?.currentRole || employee?.role }}
                  </span>
                  <span v-if="employee?.location || employee?.placeOfBirth" class="d-flex align-items-center text-gray-400 text-hover-primary me-5 mb-2">
                    <KTIcon icon-name="geolocation" icon-class="fs-4 me-1" />
                    {{ employee?.location || employee?.placeOfBirth }}
                  </span>
                  <span v-if="employee?.email" class="d-flex align-items-center text-gray-400 text-hover-primary mb-2">
                    <KTIcon icon-name="sms" icon-class="fs-4 me-1" />
                    {{ employee?.email }}
                  </span>
                </div>
                <!--end::Info-->
              </div>
              <!--end::User-->

              <!--begin::Actions-->
              <div class="d-flex my-4">
                <a
                  href="#"
                  class="btn btn-sm btn-light me-2"
                  id="kt_user_follow_button"
                >
                  <KTIcon icon-name="check" icon-class="fs-3 d-none" />
                  Follow
                </a>

                <a
                  href="#"
                  class="btn btn-sm btn-primary me-3"
                  data-bs-toggle="modal"
                  data-bs-target="#kt_modal_offer_a_deal"
                  >Hire Me</a
                >

                <!--begin::Menu-->
                <div class="me-0">
                  <button
                    class="btn btn-sm btn-icon btn-bg-light btn-active-color-primary"
                    data-kt-menu-trigger="click"
                    data-kt-menu-placement="bottom-end"
                    data-kt-menu-flip="top-end"
                  >
                    <i class="bi bi-three-dots fs-3"></i>
                  </button>
                  <Dropdown3></Dropdown3>
                </div>
                <!--end::Menu-->
              </div>
              <!--end::Actions-->
            </div>
            <!--end::Title-->

            <!--begin::Stats-->
            <div class="d-flex flex-wrap flex-stack">
              <!--begin::Wrapper-->
              <div class="d-flex flex-column flex-grow-1 pe-8">
                <!--begin::Stats-->
                <div class="d-flex flex-wrap">
                  <!--begin::Stat-->
                  <div
                    class="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3"
                  >
                    <!--begin::Number-->
                    <div class="d-flex align-items-center">
                      <KTIcon
                        icon-name="arrow-up"
                        icon-class="fs-3 text-success me-2"
                      />
                      <div class="fs-2 fw-bold">4500$</div>
                    </div>
                    <!--end::Number-->

                    <!--begin::Label-->
                    <div class="fw-semobold fs-6 text-gray-400">Earnings</div>
                    <!--end::Label-->
                  </div>
                  <!--end::Stat-->

                  <!--begin::Stat-->
                  <div
                    class="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3"
                  >
                    <!--begin::Number-->
                    <div class="d-flex align-items-center">
                      <KTIcon
                        icon-name="arrow-down"
                        icon-class="fs-3 text-danger me-2"
                      />
                      <div
                        class="fs-2 fw-bold"
                        data-kt-countup="true"
                        data-kt-countup-value="75"
                      >
                        75
                      </div>
                    </div>
                    <!--end::Number-->

                    <!--begin::Label-->
                    <div class="fw-semobold fs-6 text-gray-400">Projects</div>
                    <!--end::Label-->
                  </div>
                  <!--end::Stat-->

                  <!--begin::Stat-->
                  <div
                    class="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3"
                  >
                    <!--begin::Number-->
                    <div class="d-flex align-items-center">
                      <KTIcon
                        icon-name="arrow-up"
                        icon-class="fs-3 text-success me-2"
                      />
                      <div
                        class="fs-2 fw-bold"
                        data-kt-countup="true"
                        data-kt-countup-value="60"
                        data-kt-countup-prefix="%"
                      >
                        %60
                      </div>
                    </div>
                    <!--end::Number-->

                    <!--begin::Label-->
                    <div class="fw-semobold fs-6 text-gray-400">Success Rate</div>
                    <!--end::Label-->
                  </div>
                  <!--end::Stat-->
                </div>
                <!--end::Stats-->
              </div>
              <!--end::Wrapper-->
            </div>
            <!--end::Stats-->
          </div>
          <!--end::Info-->
        </div>
        <!--end::Details-->

        <!--begin::Navs-->
        <div class="d-flex overflow-auto h-55px">
          <ul
            class="nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bold flex-nowrap"
          >
            <!--begin::Nav item-->
            <li class="nav-item">
              <router-link
                :to="`/employees/${route.params.id}/overview`"
                class="nav-link text-active-primary me-6"
                active-class="active"
              >
                Overview
              </router-link>
            </li>
            <!--end::Nav item-->
            <!--begin::Nav item-->
            <li class="nav-item">
              <router-link
                :to="`/employees/${route.params.id}/settings`"
                class="nav-link text-active-primary me-6"
                active-class="active"
              >
                Settings
              </router-link>
            </li>
            <!--end::Nav item-->
          </ul>
        </div>
        <!--begin::Navs-->
      </div>
    </div>
    <!--end::Navbar-->
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, ref, onMounted, onUnmounted, provide, watch } from "vue";
import { useRoute } from "vue-router";
import Dropdown3 from "@/components/dropdown/Dropdown3.vue";
import { useAvatar } from "@/core/composables/useAvatar";
import Swal from "sweetalert2/dist/sweetalert2.js";
// Updated to use ApplicationUser API
// import { getEmployee } from "@/core/services/businessServices/Employee";

export default defineComponent({
  name: "kt-account",
  components: {
    Dropdown3,
  },
  setup() {
    const route = useRoute();
    const employee = ref<any>(null);
    const loading = ref(true);
    const error = ref<string | null>(null);
    const imageLoading = ref(false);
    const imageError = ref(false);
    const dataUpdateTrigger = ref(0); // Force reactivity trigger

    // Get avatar functions from composable
    const { getAvatarDisplayUrl, uploadAvatar, deleteCurrentAvatar, ...avatarComposable } = useAvatar();

    const avatarInput = ref<HTMLInputElement | null>(null);

    const refreshEmployeeData = async (id: string) => {
      loading.value = true;
      error.value = '';
      
      try {
        // Add API_URL prefix to the endpoint, removing duplicate /api/
        const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:3000';
        const response = await fetch(`${API_URL}/applicationusers/${id}`);
        if (response.ok) {
          const newEmployeeData = await response.json();
          employee.value = newEmployeeData;
        } else {
          console.error('❌ Failed to refresh employee data:', response.status);
          error.value = 'Failed to load employee data. Please try again.';
        }
      } catch (err) {
        console.error('❌ Failed to refresh user:', err);
        error.value = 'An error occurred while loading employee data.';
      }
      loading.value = false;
    };

    // Provide refreshEmployee function to child components
    provide('refreshEmployee', () => {
      if (route.params.id) {
        return refreshEmployeeData(route.params.id as string);
      }
    });

    // Provide employee data to child components
    provide('employee', employee);

    // Handle avatar update events
    const handleAvatarUpdate = () => {
      if (employee.value?.id) {
        refreshEmployeeData(employee.value.id);
      }
    };

    // Handle employee data update events
    const handleEmployeeUpdate = (event: CustomEvent) => {
      if (event.detail) {
        employee.value = event.detail;
      }
    };

    onMounted(async () => {
      if (route.params.id) {
        try {
          await refreshEmployeeData(route.params.id as string);
        } catch (err) {
          console.error('Failed to fetch user:', err);
        }
      }

      // Listen for avatar and employee updates
      window.addEventListener('avatar-updated', handleAvatarUpdate);
      window.addEventListener('employee-updated', handleEmployeeUpdate as EventListener);
    });

    onUnmounted(() => {
      window.removeEventListener('avatar-updated', handleAvatarUpdate as EventListener);
      window.removeEventListener('employee-updated', handleEmployeeUpdate as EventListener);
    });

    // Watch for route changes
    watch(() => route.params.id, (newId) => {
      if (newId) {
        refreshEmployeeData(newId as string);
      }
    });

    // Timestamp for cache busting avatar images
    const avatarTimestamp = ref(Date.now());

    // Image handling functions
    const handleImageError = () => {
      imageError.value = true;
      imageLoading.value = false;
      // Se l'immagine non si carica, forza l'uso dell'immagine di default
      if (employee.value) {
        employee.value.avatar = '';
      }
    };

    const handleImageLoad = () => {
      imageError.value = false;
      imageLoading.value = false;
    };

    // Avatar URL using proxy endpoint
    const getAvatarUrl = async (avatarUrl: string | undefined) => {
      // Se non c'è avatar o è una stringa vuota, mostra subito l'immagine di default
      if (!avatarUrl || avatarUrl.trim() === '') {
        return getAssetPath('media/avatars/blank.png');
      }
      
      // Se l'immagine ha dato errore, mostra l'immagine di default
      if (imageError.value) {
        return getAssetPath('media/avatars/blank.png');
      }
      
      // Use proxy endpoint for avatar display
      const displayUrl = await getAvatarDisplayUrl(avatarUrl);
      
      if (!displayUrl) {
        return getAssetPath('media/avatars/blank.png');
      }
      
      // Add timestamp for cache busting
      return `${displayUrl}${avatarTimestamp.value ? `?t=${avatarTimestamp.value}` : ''}`;
    };

    // Computed property for avatar URL
    const currentAvatarUrl = ref(getAssetPath('media/avatars/blank.png'));

    // Watch employee avatar changes
    watch(() => employee.value?.avatar, async (newAvatar) => {
      currentAvatarUrl.value = await getAvatarUrl(newAvatar);
    }, { immediate: true });

    // Avatar upload handler (immediate save)
    const handleAvatarUpload = async (event: Event) => {
      const input = event.target as HTMLInputElement;
      if (!input.files?.length || !employee.value?.id) return;

      const file = input.files[0];
      
      try {
        await uploadAvatar(employee.value.id, file);
        
        // Update avatar timestamp for instant refresh
        avatarTimestamp.value = Date.now();
        
        // Show success message
        Swal.fire({
          title: 'Success!',
          text: 'Avatar updated successfully',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
        
        // Refresh employee data in background
        refreshEmployeeData(employee.value.id);
      } catch (error) {
        console.error('❌ Failed to upload and save avatar', error);
        
        // Show error message
        Swal.fire({
          title: 'Error!',
          text: 'Failed to update avatar',
          icon: 'error'
        });
      }
      
      // Reset input
      input.value = '';
    };

    // Avatar removal handler (immediate delete)
    const handleAvatarRemove = async () => {
      if (!employee.value?.id) return;
      
      try {
        await deleteCurrentAvatar(employee.value.id);
        
        // Reset error state
        imageError.value = false;
        
        // Update avatar timestamp and clear current avatar
        avatarTimestamp.value = Date.now();
        if (employee.value) {
          employee.value.avatar = ''; // Usa stringa vuota invece di undefined
        }
        
        // Show success message
        Swal.fire({
          title: 'Success!',
          text: 'Avatar removed successfully',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
        
        // Refresh employee data in background
        refreshEmployeeData(employee.value.id);
      } catch (error) {
        console.error('❌ Failed to delete avatar', error);
        
        // Show error message
        Swal.fire({
          title: 'Error!',
          text: 'Failed to remove avatar',
          icon: 'error'
        });
      }
    };

    const handleRefreshClick = () => {
      if (employee.value?.id) {
        refreshEmployeeData(employee.value.id);
      }
    };

    return {
      getAssetPath,
      route,
      employee,
      loading,
      imageLoading,
      imageError,
      handleImageError,
      handleImageLoad,
      getAvatarUrl,
      refreshEmployeeData,
      handleRefreshClick,
      error,
      dataUpdateTrigger,
      avatarComposable,
      handleAvatarUpload,
      handleAvatarRemove,
      avatarInput,
      currentAvatarUrl,
    };
  },
});
</script>
