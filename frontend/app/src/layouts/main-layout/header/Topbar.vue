<template>
  <!--begin::Toolbar wrapper-->
  <div class="d-flex align-items-stretch flex-shrink-0">
    <!--begin::Search-->
    <div class="d-flex align-items-stretch ms-1 ms-lg-3">
      <KTSearch></KTSearch>
    </div>
    <!--end::Search-->

    <!--begin::Activities-->
    <div class="d-flex align-items-center ms-1 ms-lg-3">
      <!--begin::drawer toggle-->
      <div
        class="btn btn-icon btn-active-light-primary w-30px h-30px w-md-40px h-md-40px"
        id="kt_activities_toggle"
      >
      <i class="bi bi-clipboard-check fs-2"></i>
      </div>
      <!--end::drawer toggle-->
    </div>
    <!--end::Activities-->

    <!--begin::Notifications-->
    <div class="d-flex align-items-center ms-1 ms-lg-3">
      <!--begin::Menu-->
      <div
        class="btn btn-icon btn-active-light-primary position-relative w-30px h-30px w-md-40px h-md-40px"
        data-kt-menu-trigger="click"
        data-kt-menu-attach="parent"
        data-kt-menu-placement="bottom-end"
        data-kt-menu-flip="bottom"
        @click="loadNotifications"
      >
        <i class="bi bi-bell fs-2"></i>
        <span
          v-if="hasUnreadNotifications"
          class="bullet bullet-dot bg-success h-6px w-6px position-absolute translate-middle top-0 start-50 animation-blink"
        >
        </span>
      </div>
      <KTNotificationsMenu></KTNotificationsMenu>
      <!--end::Menu-->
    </div>
    <!--end::Notifications-->

    <!--begin::Theme mode-->
    <div class="d-flex align-items-center ms-1 ms-lg-3">
      <!--begin::Menu toggle-->
      <a
        href="#"
        class="btn btn-icon btn-active-light-primary w-30px h-30px w-md-40px h-md-40px"
        data-kt-menu-trigger="{default:'click', lg: 'hover'}"
        data-kt-menu-attach="parent"
        data-kt-menu-placement="bottom-end"
      >
        <KTIcon
          icon-name="night-day"
          icon-class="theme-light-show fs-2 fs-md-1"
        />
        <KTIcon icon-name="moon" icon-class="theme-dark-show fs-2 fs-md-1" />
      </a>
      <!--begin::Menu toggle-->
      <KTThemeModeSwitcher></KTThemeModeSwitcher>
    </div>
    <!--end::Theme mode-->

    <!--begin::User-->
    <div
      class="d-flex align-items-center ms-1 ms-lg-3"
      id="kt_header_user_menu_toggle"
    >
      <!--begin::Menu-->
      <div
        class="cursor-pointer symbol symbol-30px symbol-md-40px"
        data-kt-menu-trigger="click"
        data-kt-menu-attach="parent"
        data-kt-menu-placement="bottom-end"
        data-kt-menu-flip="bottom"
      >
        <img 
          :src="currentAvatarUrl" 
          alt="User Avatar"
          @error="handleImageError"
          @load="handleImageLoad"
          :class="{ 'opacity-50': imageLoading }"
        />
      </div>
      <KTUserMenu></KTUserMenu>
      <!--end::Menu-->
    </div>
    <!--end::User -->

    <!--begin::Heaeder menu toggle-->
    <div
      class="d-flex align-items-center d-lg-none ms-2 me-n3"
      title="Show header menu"
    >
      <div
        class="btn btn-icon btn-active-light-primary btn-custom w-30px h-30px w-md-40px h-md-40px"
        id="kt_header_menu_mobile_toggle"
      >
        <KTIcon icon-name="text-align-left" icon-class="fs-1" />
      </div>
    </div>
    <!--end::Heaeder menu toggle-->
  </div>
  <!--end::Toolbar wrapper-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, ref, watch, onMounted, computed } from "vue";
import KTSearch from "@/layouts/main-layout/search/Search.vue";
import KTNotificationsMenu from "@/layouts/main-layout/menus/NotificationsMenu.vue";
import KTQuickLinksMenu from "@/layouts/main-layout/menus/QuickLinksMenu.vue";
import KTUserMenu from "@/layouts/main-layout/menus/UserAccountMenu.vue";
import KTThemeModeSwitcher from "@/layouts/main-layout/theme-mode/ThemeModeSwitcher.vue";
import { useCurrentUser } from "@/core/composables/useCurrentUser";
import { useAvatar } from "@/core/composables/useAvatar";
import { getNotifications } from "@/core/services/businessServices/Notification";
import type { Notification } from "@/core/services/businessServices/Notification";

export default defineComponent({
  name: "layout-topbar",
  components: {
    KTSearch,
    KTNotificationsMenu,
    KTQuickLinksMenu,
    KTUserMenu,
    KTThemeModeSwitcher,
  },
  setup() {
    const { currentUser, fetchCurrentUser } = useCurrentUser();
    const { getAvatarDisplayUrl } = useAvatar();
    
    // Avatar state management
    const imageLoading = ref(false);
    const imageError = ref(false);
    const currentAvatarUrl = ref(getAssetPath('media/avatars/blank.png'));

    // Notifications state
    const notifications = ref<Notification[]>([]);
    const loadingNotifications = ref(false);

    // Computed per verificare se ci sono notifiche non lette
    const hasUnreadNotifications = computed(() => {
      return notifications.value.some(n => !n.isRead);
    });

    // Avatar functions
    const handleImageError = () => {
      imageError.value = true;
      imageLoading.value = false;
      currentAvatarUrl.value = getAssetPath('media/avatars/blank.png');
    };

    const handleImageLoad = () => {
      imageError.value = false;
      imageLoading.value = false;
    };

    // Get avatar URL function
    const getAvatarUrl = async (avatarUrl: string | undefined) => {
      if (!avatarUrl || avatarUrl.trim() === '' || imageError.value) {
        return getAssetPath('media/avatars/blank.png');
      }
      
      const displayUrl = await getAvatarDisplayUrl(avatarUrl);
      
      if (!displayUrl) {
        return getAssetPath('media/avatars/blank.png');
      }
      
      return displayUrl;
    };

    // Watch for avatar changes
    watch(() => currentUser.value?.avatar, async (newAvatar) => {
      currentAvatarUrl.value = await getAvatarUrl(newAvatar);
    }, { immediate: true });

    // Carica le notifiche
    const loadNotifications = async () => {
      if (!currentUser.value?.id) return;
      
      loadingNotifications.value = true;
      try {
        const notif = await getNotifications(10);
        notifications.value = notif || [];
      } catch (error) {
        console.error('Error loading notifications:', error);
      } finally {
        loadingNotifications.value = false;
      }
    };

    // Fetch current user on mount
    onMounted(async () => {
      await fetchCurrentUser();
      await loadNotifications();
    });

    // Ricarica le notifiche quando cambia l'utente
    watch(() => currentUser.value?.id, async (newUserId) => {
      if (newUserId) {
        await loadNotifications();
      } else {
        notifications.value = [];
      }
    });

    return {
      getAssetPath,
      currentAvatarUrl,
      imageLoading,
      handleImageError,
      handleImageLoad,
      hasUnreadNotifications,
      loadNotifications,
    };
  },
});
</script>
