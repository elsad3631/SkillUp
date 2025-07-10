<template>
  <!--begin::Menu-->
  <div
    class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semobold py-4 fs-6 w-275px"
    data-kt-menu="true"
  >
    <!--begin::Menu item-->
    <div class="menu-item px-3">
      <div class="menu-content d-flex align-items-center px-3">
        <!--begin::Avatar-->
        <div class="symbol symbol-50px me-5">
          <img 
            alt="User Avatar" 
            :src="currentAvatarUrl" 
            @error="handleImageError"
            @load="handleImageLoad"
            :class="{ 'opacity-50': imageLoading }"
          />
        </div>
        <!--end::Avatar-->

        <!--begin::Username-->
        <div class="d-flex flex-column">
          <div class="fw-bold d-flex align-items-center fs-5">
            {{ userDisplayName }}
            <span class="badge badge-light-success fw-bold fs-8 px-2 py-1 ms-2"
              >Pro</span
            >
          </div>
          <a href="#" class="fw-semobold text-muted text-hover-primary fs-7"
            >{{ userEmail }}</a
          >
        </div>
        <!--end::Username-->
      </div>
    </div>
    <!--end::Menu item-->

    <!--begin::Menu separator-->
    <div class="separator my-2"></div>
    <!--end::Menu separator-->

    <!--begin::Menu item-->
    <div class="menu-item px-5">
      <router-link to="/crafted/pages/profile/overview" class="menu-link px-5">
        My Profile
      </router-link>
    </div>
    <!--end::Menu item-->

    <!--begin::Menu item-->
    <div class="menu-item px-5">
      <router-link to="/crafted/pages/profile/projects" class="menu-link px-5">
        <span class="menu-text">My Projects</span>
        <span class="menu-badge">
          <span class="badge badge-light-danger badge-circle fw-bold fs-7"
            >3</span
          >
        </span>
      </router-link>
    </div>
    <!--end::Menu item-->

    <!--begin::Menu item-->
    <div
      class="menu-item px-5"
      data-kt-menu-trigger="hover"
      data-kt-menu-placement="left-start"
      data-kt-menu-flip="center, top"
    >
      <a href="#" class="menu-link px-5">
        <span class="menu-title">My Subscription</span>
        <span class="menu-arrow"></span>
      </a>

      <!--begin::Menu sub-->
      <div class="menu-sub menu-sub-dropdown w-175px py-4">
        <!--begin::Menu item-->
        <div class="menu-item px-3">
          <router-link to="/apps/subscriptions/subscription-list" class="menu-link px-5">
            Subscriptions
          </router-link>
        </div>
        <!--end::Menu item-->

        <!--begin::Menu item-->
        <div class="menu-item px-3">
          <a href="#" class="menu-link px-5">
            Billing
          </a>
        </div>
        <!--end::Menu item-->

        <!--begin::Menu item-->
        <div class="menu-item px-3">
          <a href="#" class="menu-link px-5">
            Payments
          </a>
        </div>
        <!--end::Menu item-->

        <!--begin::Menu item-->
        <div class="menu-item px-3">
          <a href="#" class="menu-link d-flex flex-stack px-5">
            Statements

            <i
              class="fas fa-exclamation-circle ms-2 fs-7"
              data-bs-toggle="tooltip"
              title="View your statements"
            ></i>
          </a>
        </div>
        <!--end::Menu item-->

        <!--begin::Menu separator-->
        <div class="separator my-2"></div>
        <!--end::Menu separator-->

        <!--begin::Menu item-->
        <div class="menu-item px-3">
          <div class="menu-content px-3">
            <label
              class="form-check form-switch form-check-custom form-check-solid"
            >
              <input
                class="form-check-input w-30px h-20px"
                type="checkbox"
                value="1"
                checked
                name="notifications"
              />
              <span class="form-check-label text-muted fs-7">
                Notifications
              </span>
            </label>
          </div>
        </div>
        <!--end::Menu item-->
      </div>
      <!--end::Menu sub-->
    </div>
    <!--end::Menu item-->

    <!--begin::Menu item-->
    <div class="menu-item px-5">
      <router-link to="/employees" class="menu-link px-5">
        Employees
      </router-link>
    </div>
    <!--end::Menu item-->

    <!--begin::Menu separator-->
    <div class="separator my-2"></div>
    <!--end::Menu separator-->

    <!--begin::Menu item-->
    <div
      class="menu-item px-5"
      data-kt-menu-trigger="hover"
      data-kt-menu-placement="left-start"
      data-kt-menu-flip="center, top"
    >
      <a href="#" class="menu-link px-5">
        <span class="menu-title position-relative">
          Language
          <span
            class="fs-8 rounded bg-light px-3 py-2 position-absolute translate-middle-y top-50 end-0"
          >
            {{ currentLangugeLocale.name }}
            <img
              class="w-15px h-15px rounded-1 ms-2"
              :src="currentLangugeLocale.flag"
              alt="metronic"
            />
          </span>
        </span>
      </a>

      <!--begin::Menu sub-->
      <div class="menu-sub menu-sub-dropdown w-175px py-4">
        <!--begin::Menu item-->
        <div class="menu-item px-3">
          <a
            @click="setLang('en')"
            href="#"
            class="menu-link d-flex px-5"
            :class="{ active: currentLanguage === 'en' }"
          >
            <span class="symbol symbol-20px me-4">
              <img
                class="rounded-1"
                :src="getAssetPath('media/flags/united-states.svg')"
                alt="metronic"
              />
            </span>
            English
          </a>
        </div>
        <!--end::Menu item-->

        <!--begin::Menu item-->
        <div class="menu-item px-3">
          <a
            @click="setLang('es')"
            href="#"
            class="menu-link d-flex px-5"
            :class="{ active: currentLanguage === 'es' }"
          >
            <span class="symbol symbol-20px me-4">
              <img
                class="rounded-1"
                :src="getAssetPath('media/flags/spain.svg')"
                alt="metronic"
              />
            </span>
            Spanish
          </a>
        </div>
        <!--end::Menu item-->

        <!--begin::Menu item-->
        <div class="menu-item px-3">
          <a
            @click="setLang('de')"
            href="#"
            class="menu-link d-flex px-5"
            :class="{ active: currentLanguage === 'de' }"
          >
            <span class="symbol symbol-20px me-4">
              <img
                class="rounded-1"
                :src="getAssetPath('media/flags/germany.svg')"
                alt="metronic"
              />
            </span>
            German
          </a>
        </div>
        <!--end::Menu item-->

        <!--begin::Menu item-->
        <div class="menu-item px-3">
          <a
            @click="setLang('ja')"
            href="#"
            class="menu-link d-flex px-5"
            :class="{ active: currentLanguage === 'ja' }"
          >
            <span class="symbol symbol-20px me-4">
              <img
                class="rounded-1"
                :src="getAssetPath('media/flags/japan.svg')"
                alt="metronic"
              />
            </span>
            Japanese
          </a>
        </div>
        <!--end::Menu item-->

        <!--begin::Menu item-->
        <div class="menu-item px-3">
          <a
            @click="setLang('fr')"
            href="#"
            class="menu-link d-flex px-5"
            :class="{ active: currentLanguage === 'fr' }"
          >
            <span class="symbol symbol-20px me-4">
              <img
                class="rounded-1"
                :src="getAssetPath('media/flags/france.svg')"
                alt="metronic"
              />
            </span>
            French
          </a>
        </div>
        <!--end::Menu item-->
      </div>
      <!--end::Menu sub-->
    </div>
    <!--end::Menu item-->

    <!--begin::Menu item-->
    <div class="menu-item px-5 my-1">
      <router-link to="/crafted/account/settings" class="menu-link px-5">
        Account Settings
      </router-link>
    </div>
    <!--end::Menu item-->

    <!--begin::Menu item-->
    <div class="menu-item px-5">
      <a @click="signOut()" class="menu-link px-5"> Sign Out </a>
    </div>
    <!--end::Menu item-->
  </div>
  <!--end::Menu-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { computed, defineComponent, ref, watch, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { useCurrentUser } from "@/core/composables/useCurrentUser";
import { useAvatar } from "@/core/composables/useAvatar";

export default defineComponent({
  name: "kt-user-menu",
  components: {},
  setup() {
    const router = useRouter();
    const i18n = useI18n();
    const store = useAuthStore();
    const { currentUser, fetchCurrentUser } = useCurrentUser();
    const { getAvatarDisplayUrl } = useAvatar();
    
    // Avatar state management
    const imageLoading = ref(false);
    const imageError = ref(false);
    const currentAvatarUrl = ref(getAssetPath('media/avatars/blank.png'));

    i18n.locale.value = localStorage.getItem("lang")
      ? (localStorage.getItem("lang") as string)
      : "en";

    const countries = {
      en: {
        flag: getAssetPath("media/flags/united-states.svg"),
        name: "English",
      },
      es: {
        flag: getAssetPath("media/flags/spain.svg"),
        name: "Spanish",
      },
      de: {
        flag: getAssetPath("media/flags/germany.svg"),
        name: "German",
      },
      ja: {
        flag: getAssetPath("media/flags/japan.svg"),
        name: "Japanese",
      },
      fr: {
        flag: getAssetPath("media/flags/france.svg"),
        name: "French",
      },
    };

    const signOut = () => {
      store.logout();
      router.push({ name: "sign-in" });
    };

    const setLang = (lang: string) => {
      localStorage.setItem("lang", lang);
      i18n.locale.value = lang;
    };

    const currentLanguage = computed(() => {
      return i18n.locale.value;
    });

    const currentLangugeLocale = computed(() => {
      return countries[i18n.locale.value as keyof typeof countries];
    });

    // Get user data from current user (more reliable than auth store)
    const userDisplayName = computed(() => {
      if (currentUser.value) {
        const { firstName, lastName } = currentUser.value;
        if (firstName && lastName) {
          return `${firstName} ${lastName}`;
        }
        return firstName || lastName || currentUser.value.username || "User";
      }
      // Fallback to auth store if currentUser not loaded yet
      const user = store.user;
      if (user?.name && user?.surname) {
        return `${user.name} ${user.surname}`;
      } else if (user?.name) {
        return user.name;
      }
      return "User";
    });

    const userEmail = computed(() => {
      return currentUser.value?.email || store.user?.email || "user@example.com";
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

    // Fetch current user on mount
    onMounted(() => {
      fetchCurrentUser();
    });

    return {
      signOut,
      setLang,
      currentLanguage,
      currentLangugeLocale,
      countries,
      getAssetPath,
      userDisplayName,
      userEmail,
      currentAvatarUrl,
      imageLoading,
      handleImageError,
      handleImageLoad,
    };
  },
});
</script>
