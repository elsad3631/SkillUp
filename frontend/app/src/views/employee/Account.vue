<template>
  <!--begin::Loading State-->
  <div v-if="loading" class="d-flex justify-content-center align-items-center" style="min-height: 400px;">
    <div class="text-center">
      <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="mt-3">
        <span class="fw-semobold text-gray-600">Loading employee data...</span>
        <div class="mt-2">
          <small class="text-muted">Please wait while we fetch the latest information</small>
        </div>
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
        <h4 class="text-danger">Unable to Load Employee</h4>
        <p class="text-gray-600 mb-3">{{ error }}</p>
        <div class="alert alert-info" role="alert">
          <i class="bi bi-info-circle me-2"></i>
          <small>This might be due to network issues or the employee may have been moved/deleted.</small>
        </div>
      </div>
      <div class="d-flex gap-2 justify-content-center">
        <button @click="handleRefreshClick" class="btn btn-primary">
          <i class="bi bi-arrow-clockwise me-2"></i>Try Again
        </button>
        <button @click="goBack" class="btn btn-outline-secondary">
          <i class="bi bi-arrow-left me-2"></i>Go Back
        </button>
      </div>
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
              <!-- Loading indicator -->
              <div v-if="imageLoading" class="position-absolute top-50 start-50 translate-middle">
                <div class="spinner-border spinner-border-sm text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
              
              <img 
                :src="currentAvatarUrl" 
                :alt="`${employee?.firstName || ''} ${employee?.lastName || ''} avatar`"
                @error="handleImageError"
                @load="handleImageLoad"
                :class="{ 'opacity-50': imageLoading }"
                style="object-fit: cover;"
                class="hover-zoom"
              />
              <div
                class="position-absolute translate-middle bottom-0 start-100 mb-6 bg-success rounded-circle border border-4 border-white h-20px w-20px"
                :title="`Employee Status: ${employee?.status || 'Active'}`"
              ></div>
              
              <!--begin::Avatar controls-->
              <div class="position-absolute bottom-0 end-0">
                <!--begin::Change avatar button-->
                <label
                  class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow hover-elevate"
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
                  class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow ms-1 hover-elevate"
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
                  <a href="#" title="Verified Employee">
                    <KTIcon icon-name="verify" icon-class="fs-1 text-primary" />
                  </a>

                  <a
                    href="#"
                    class="btn btn-sm btn-light-success fw-bold ms-2 fs-8 py-1 px-3 hover-elevate"
                    data-bs-toggle="modal"
                    data-bs-target="#kt_modal_upgrade_plan"
                    title="Upgrade to premium features"
                    >Upgrade to Pro</a
                  >
                </div>
                <!--end::Name-->

                <!--begin::Info-->
                <div class="d-flex flex-wrap fw-semobold fs-6 mb-4 pe-2">
                  <span v-if="employee?.currentRole || employee?.role" class="d-flex align-items-center text-gray-400 text-hover-primary me-5 mb-2" :title="`Current Role: ${employee?.currentRole || employee?.role}`">
                    <KTIcon icon-name="profile-circle" icon-class="fs-4 me-1" />
                    {{ employee?.currentRole || employee?.role }}
                  </span>
                  <span v-if="employee?.location || employee?.placeOfBirth" class="d-flex align-items-center text-gray-400 text-hover-primary me-5 mb-2" :title="`Location: ${employee?.location || employee?.placeOfBirth}`">
                    <KTIcon icon-name="geolocation" icon-class="fs-4 me-1" />
                    {{ employee?.location || employee?.placeOfBirth }}
                  </span>
                  <span v-if="employee?.email" class="d-flex align-items-center text-gray-400 text-hover-primary mb-2" :title="`Email: ${employee?.email}`">
                    <KTIcon icon-name="sms" icon-class="fs-4 me-1" />
                    {{ employee?.email }}
                  </span>
                </div>
                <!--end::Info-->

                <!--begin::Additional Info-->
                <div v-if="employee?.phone || employee?.department || employee?.hireDate" class="d-flex flex-wrap fw-semobold fs-6 mb-4 pe-2">
                  <span v-if="employee?.phone" class="d-flex align-items-center text-gray-400 text-hover-primary me-5 mb-2" :title="`Phone: ${employee?.phone}`">
                    <KTIcon icon-name="phone" icon-class="fs-4 me-1" />
                    {{ employee?.phone }}
                  </span>
                  <span v-if="employee?.department" class="d-flex align-items-center text-gray-400 text-hover-primary me-5 mb-2" :title="`Department: ${employee?.department}`">
                    <KTIcon icon-name="building" icon-class="fs-4 me-1" />
                    {{ employee?.department }}
                  </span>
                  <span v-if="employee?.hireDate" class="d-flex align-items-center text-gray-400 text-hover-primary mb-2" :title="`Hire Date: ${formatDate(employee?.hireDate)}`">
                    <KTIcon icon-name="calendar" icon-class="fs-4 me-1" />
                    Hired: {{ formatDate(employee?.hireDate) }}
                  </span>
                </div>
                <!--end::Additional Info-->
              </div>
              <!--end::User-->

              <!--begin::Actions-->
              <div class="d-flex my-4">
                <a
                  href="#"
                  class="btn btn-sm btn-light me-2 hover-elevate"
                  id="kt_user_follow_button"
                  title="Follow this employee"
                >
                  <KTIcon icon-name="check" icon-class="fs-3 d-none" />
                  Follow
                </a>

                <a
                  href="#"
                  class="btn btn-sm btn-primary me-3 hover-elevate"
                  data-bs-toggle="modal"
                  data-bs-target="#kt_modal_offer_a_deal"
                  title="Hire this employee for a project"
                  >Hire Me</a
                >

                <!--begin::Menu-->
                <div class="me-0">
                  <button
                    class="btn btn-sm btn-icon btn-bg-light btn-active-color-primary hover-elevate"
                    data-kt-menu-trigger="click"
                    data-kt-menu-placement="bottom-end"
                    data-kt-menu-flip="top-end"
                    title="More options"
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
                    class="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3 hover-elevate-up"
                    :title="`Total Earnings: $${getEmployeeEarnings()}`"
                  >
                    <!--begin::Number-->
                    <div class="d-flex align-items-center">
                      <KTIcon
                        icon-name="arrow-up"
                        icon-class="fs-3 text-success me-2"
                      />
                      <div class="fs-2 fw-bold">{{ getEmployeeEarnings() }}</div>
                    </div>
                    <!--end::Number-->

                    <!--begin::Label-->
                    <div class="fw-semobold fs-6 text-gray-400">Earnings</div>
                    <!--end::Label-->
                  </div>
                  <!--end::Stat-->

                  <!--begin::Stat-->
                  <div
                    class="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3 hover-elevate-up"
                    :title="`Total Projects: ${getEmployeeProjects()}`"
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
                        {{ getEmployeeProjects() }}
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
                    class="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3 hover-elevate-up"
                    :title="`Success Rate: ${getEmployeeSuccessRate()}%`"
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
                        %{{ getEmployeeSuccessRate() }}
                      </div>
                    </div>
                    <!--end::Number-->

                    <!--begin::Label-->
                    <div class="fw-semobold fs-6 text-gray-400">Success Rate</div>
                    <!--end::Label-->
                  </div>
                  <!--end::Stat-->

                  <!--begin::Stat-->
                  <div
                    class="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3 hover-elevate-up"
                    :title="`Experience: ${getEmployeeExperience()} years`"
                  >
                    <!--begin::Number-->
                    <div class="d-flex align-items-center">
                      <KTIcon
                        icon-name="star"
                        icon-class="fs-3 text-warning me-2"
                      />
                      <div class="fs-2 fw-bold">
                        {{ getEmployeeExperience() }}
                      </div>
                    </div>
                    <!--end::Number-->

                    <!--begin::Label-->
                    <div class="fw-semobold fs-6 text-gray-400">Experience (yrs)</div>
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
                :to="overviewUrl"
                class="nav-link text-active-primary me-6"
                active-class="active"
                title="View employee overview and summary"
              >
                <i class="bi bi-eye me-1"></i>
                Overview
              </router-link>
            </li>
            <!--end::Nav item-->
            <!--begin::Nav item-->
            <li class="nav-item">
              <router-link
                :to="projectsUrl"
                class="nav-link text-active-primary me-6"
                active-class="active"
                title="View employee projects and assignments"
              >
                <i class="bi bi-briefcase me-1"></i>
                Projects
              </router-link>
            </li>
            <!--end::Nav item-->
            <!--begin::Nav item-->
            <li class="nav-item">
              <router-link
                :to="documentsUrl"
                class="nav-link text-active-primary me-6"
                active-class="active"
                title="View and manage employee documents"
              >
                <i class="bi bi-file-earmark-text me-1"></i>
                Documents
              </router-link>
            </li>
            <!--end::Nav item-->
            <!--begin::Nav item-->
            <li class="nav-item">
              <router-link
                :to="settingsUrl"
                class="nav-link text-active-primary me-6"
                active-class="active"
                title="Configure employee settings"
              >
                <i class="bi bi-gear me-1"></i>
                Settings
              </router-link>
            </li>
            <!--end::Nav item-->
            <!--begin::Nav item-->
            <li class="nav-item" v-if="canViewPerformanceReviews">
              <router-link
                :to="performanceReviewUrl"
                class="nav-link text-active-primary me-6"
                active-class="active"
                title="View employee performance reviews"
              >
                <i class="bi bi-star me-1"></i>
                Performance Review
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
import { defineComponent, ref, onMounted, onUnmounted, provide, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import Dropdown3 from "@/components/dropdown/Dropdown3.vue";
import { useAvatar } from "@/core/composables/useAvatar";
import { useCurrentUser } from "@/core/composables/useCurrentUser";
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
    const router = useRouter();
    const employee = ref<any>(null);
    const loading = ref(true);
    const error = ref<string | null>(null);
    const imageLoading = ref(false);
    const imageError = ref(false);
    const dataUpdateTrigger = ref(0); // Force reactivity trigger

    // Determina se siamo in modalità employee view o account view
    const employeeId = computed(() => route.params.id as string);
    const isEmployeeView = computed(() => !!employeeId.value);

    // Get current user composable for account mode
    const { currentUser, fetchCurrentUser } = useCurrentUser();

    // Get avatar functions from composable
    const { getAvatarDisplayUrl, uploadAvatar, deleteCurrentAvatar, clearAvatarCacheForUrl, ...avatarComposable } = useAvatar();

    const avatarInput = ref<HTMLInputElement | null>(null);

    const refreshEmployeeData = async (id?: string) => {
      loading.value = true;
      error.value = '';
      
      try {
        if (isEmployeeView.value && id) {
          // Employee mode: fetch specific employee using ApiService
          const { getApplicationUserById } = await import('@/core/services/businessServices/ApplicationUser');
          const newEmployeeData = await getApplicationUserById(id);
          if (newEmployeeData) {
            employee.value = newEmployeeData;
            
            // Force avatar refresh by updating timestamp
            avatarTimestamp.value = Date.now();
          } else {
            console.error('❌ Failed to refresh employee data');
            error.value = 'Failed to load employee data. Please try again.';
          }
        } else {
          // Account mode: fetch current user
          await fetchCurrentUser();
          employee.value = currentUser.value;
          
          // Force avatar refresh by updating timestamp
          avatarTimestamp.value = Date.now();
        }
      } catch (err) {
        console.error('❌ Failed to refresh user:', err);
        error.value = 'An error occurred while loading user data.';
      }
      loading.value = false;
    };

    // Provide refreshEmployee function to child components
    provide('refreshEmployee', () => {
      if (isEmployeeView.value && route.params.id) {
        return refreshEmployeeData(route.params.id as string);
      } else {
        return refreshEmployeeData();
      }
    });

    // Provide employee data to child components - unified for both modes
    provide('employee', employee);

    // Handle avatar update events
    const handleAvatarUpdate = () => {
      if (isEmployeeView.value && employee.value?.id) {
        refreshEmployeeData(employee.value.id);
      } else if (!isEmployeeView.value) {
        refreshEmployeeData();
      }
    };

    // Handle employee data update events
    const handleEmployeeUpdate = (event: CustomEvent) => {
      if (event.detail) {
        employee.value = event.detail;
      }
    };

    onMounted(async () => {
      try {
        if (isEmployeeView.value && route.params.id) {
          await refreshEmployeeData(route.params.id as string);
        } else {
          await refreshEmployeeData();
        }
      } catch (err) {
        console.error('Failed to fetch user:', err);
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
      if (isEmployeeView.value && newId) {
        refreshEmployeeData(newId as string);
      } else if (!isEmployeeView.value) {
        refreshEmployeeData();
      }
    });

    // Timestamp for cache busting avatar images
    const avatarTimestamp = ref(Date.now());

    // Image handling functions
    const handleImageError = () => {
      imageError.value = true;
      imageLoading.value = false;
      // Se l'immagine non si carica, mostra l'immagine di default
      currentAvatarUrl.value = getAssetPath('media/avatars/blank.png');
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
      const finalUrl = `${displayUrl}${avatarTimestamp.value ? `?t=${avatarTimestamp.value}` : ''}`;
      return finalUrl;
    };

    // Computed property for avatar URL
    const currentAvatarUrl = ref(getAssetPath('media/avatars/blank.png'));

    // Watch employee avatar changes with better error handling
    watch(() => employee.value?.avatar, async (newAvatar, oldAvatar) => {
      // Reset error state when avatar changes
      if (newAvatar !== oldAvatar) {
        imageError.value = false;
        imageLoading.value = true; // Set loading when avatar changes
      }
      
      try {
        currentAvatarUrl.value = await getAvatarUrl(newAvatar);
      } catch (error) {
        console.error('Error getting avatar URL:', error);
        currentAvatarUrl.value = getAssetPath('media/avatars/blank.png');
        imageLoading.value = false;
      }
    }, { immediate: true });

    // Avatar upload handler (immediate save)
    const handleAvatarUpload = async (event: Event) => {
      const input = event.target as HTMLInputElement;
      if (!input.files?.length || !employee.value?.id) return;

      const file = input.files[0];
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          title: 'File Too Large',
          text: 'Please select an image smaller than 5MB',
          icon: 'warning'
        });
        input.value = '';
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        Swal.fire({
          title: 'Invalid File Type',
          text: 'Please select a valid image file (JPG, PNG, or WebP)',
          icon: 'warning'
        });
        input.value = '';
        return;
      }
      
      try {
        // Clear cache for old avatar URL if exists
        if (employee.value?.avatar) {
          clearAvatarCacheForUrl(employee.value.avatar);
        }
        
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
        
        // Refresh data in background
        if (isEmployeeView.value) {
          refreshEmployeeData(employee.value.id);
        } else {
          refreshEmployeeData();
        }
      } catch (error) {
        console.error('❌ Failed to upload and save avatar', error);
        
        // Show error message
        Swal.fire({
          title: 'Error!',
          text: 'Failed to update avatar. Please try again.',
          icon: 'error'
        });
      }
      
      // Reset input
      input.value = '';
    };

    // Avatar removal handler (immediate delete)
    const handleAvatarRemove = async () => {
      if (!employee.value?.id) return;
      
      // Confirm deletion
      const result = await Swal.fire({
        title: 'Remove Avatar?',
        text: 'Are you sure you want to remove the current avatar?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, remove it',
        cancelButtonText: 'Cancel'
      });

      if (!result.isConfirmed) return;
      
      try {
        // Clear cache for current avatar URL if exists
        if (employee.value?.avatar) {
          clearAvatarCacheForUrl(employee.value.avatar);
        }
        
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
        
        // Refresh data in background
        if (isEmployeeView.value) {
          refreshEmployeeData(employee.value.id);
        } else {
          refreshEmployeeData();
        }
      } catch (error) {
        console.error('❌ Failed to delete avatar', error);
        
        // Show error message
        Swal.fire({
          title: 'Error!',
          text: 'Failed to remove avatar. Please try again.',
          icon: 'error'
        });
      }
    };

    const handleRefreshClick = () => {
      if (isEmployeeView.value && employee.value?.id) {
        refreshEmployeeData(employee.value.id);
      } else if (!isEmployeeView.value) {
        refreshEmployeeData();
      }
    };

    const goBack = () => {
      router.go(-1);
    };

    // Helper functions for employee stats
    const getEmployeeEarnings = () => {
      // Mock earnings calculation - replace with actual logic
      return employee.value?.earnings || '4500';
    };

    const getEmployeeProjects = () => {
      // Mock projects count - replace with actual logic
      return employee.value?.projectCount || '75';
    };

    const getEmployeeSuccessRate = () => {
      // Mock success rate - replace with actual logic
      return employee.value?.successRate || '60';
    };

    const getEmployeeExperience = () => {
      if (!employee.value?.hireDate) return '0';
      
      const hireDate = new Date(employee.value.hireDate);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - hireDate.getTime());
      const diffYears = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365));
      return diffYears.toString();
    };

    const formatDate = (dateString: string) => {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    // Navigation URLs based on mode
    const overviewUrl = computed(() => {
      return isEmployeeView.value 
        ? `/employees/${route.params.id}/overview`
        : '/crafted/account/overview';
    });

    const projectsUrl = computed(() => {
      return isEmployeeView.value 
        ? `/employees/${route.params.id}/projects`
        : '/crafted/account/projects';
    });

    const settingsUrl = computed(() => {
      return isEmployeeView.value 
        ? `/employees/${route.params.id}/settings`
        : '/crafted/account/settings';
    });

    const documentsUrl = computed(() => {
      return isEmployeeView.value 
        ? `/employees/${route.params.id}/documents`
        : '/crafted/account/documents';
    });

    const performanceReviewUrl = computed(() => {
      return isEmployeeView.value 
        ? `/employees/${route.params.id}/performance-review`
        : '/crafted/account/performance-review';
    });

    // Check if user can view performance reviews (admin/super admin only)
    const canViewPerformanceReviews = computed(() => {
      try {
        if (!currentUser.value || !currentUser.value.userRoles || !Array.isArray(currentUser.value.userRoles)) return false;
        return currentUser.value.userRoles.some(role => role.name === 'admin' || role.name === 'superadmin');
      } catch (error) {
        console.error('Error checking performance review permissions:', error);
        return false;
      }
    });

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
      goBack,
      error,
      dataUpdateTrigger,
      avatarComposable,
      handleAvatarUpload,
      handleAvatarRemove,
      avatarInput,
      currentAvatarUrl,
      overviewUrl,
      projectsUrl,
      documentsUrl,
      settingsUrl,
      performanceReviewUrl,
      canViewPerformanceReviews,
      getEmployeeEarnings,
      getEmployeeProjects,
      getEmployeeSuccessRate,
      getEmployeeExperience,
      formatDate,
    };
  },
});
</script>

<style scoped>
.hover-elevate-up {
  transition: all 0.3s ease;
}

.hover-elevate-up:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.hover-elevate {
  transition: all 0.2s ease;
}

.hover-elevate:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.hover-zoom {
  transition: all 0.3s ease;
}

.hover-zoom:hover {
  transform: scale(1.05);
}

.nav-link {
  transition: all 0.2s ease;
}

.nav-link:hover {
  transform: translateY(-1px);
}

.btn {
  transition: all 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
}

.badge {
  transition: all 0.2s ease;
}

.badge:hover {
  transform: scale(1.05);
}

.symbol {
  transition: all 0.3s ease;
}

.symbol:hover {
  transform: scale(1.02);
}
</style>
