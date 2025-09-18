<template>
  <!--begin::Menu-->
  <div
    class="hover-scroll-overlay-y my-2 my-lg-5 pe-lg-n1"
    id="kt_aside_menu_wrapper"
    data-kt-scroll="true"
    data-kt-scroll-height="auto"
    data-kt-scroll-dependencies="#kt_aside_logo, #kt_aside_footer"
    data-kt-scroll-wrappers="#kt_aside, #kt_aside_menu"
    data-kt-scroll-offset="5px"
  >
    <div
      id="kt_aside_menu"
      class="menu menu-column menu-title-gray-700 menu-state-title-primary menu-state-icon-primary menu-state-bullet-primary menu-arrow-gray-500 fw-semibold modern-menu"
      data-kt-menu="true"
    >
      <template v-for="(item, i) in MainMenuConfig" :key="i">
        <template v-if="!item.pages">
          <template v-if="item.heading">
            <div
              v-if="item.route"
              :class="{ 'show here': currentActive(item.route) }"
              class="menu-item py-3 modern-menu-item"
            >
              <router-link
                v-if="item.route"
                class="menu-link menu-center modern-menu-link"
                :to="item.route"
              >
                <span
                  v-if="item.keenthemesIcon || item.bootstrapIcon"
                  class="menu-icon me-0"
                >
                  <i
                    v-if="asideMenuIcons === 'bootstrap'"
                    :class="item.bootstrapIcon"
                    class="bi fs-2"
                  ></i>
                  <KTIcon
                    v-else-if="asideMenuIcons === 'keenthemes'"
                    :icon-name="item.keenthemesIcon"
                    icon-class="fs-2"
                  />
                </span>
                <span class="menu-title">{{ translate(item.heading) }}</span>
              </router-link>
            </div>
          </template>
        </template>
        <template v-if="item.pages">
          <div
            v-if="item.sectionTitle && item.route"
            :class="{ 'show here': hasActiveChildren(item.route) }"
            data-kt-menu-trigger="click"
            data-kt-menu-placement="right-start"
            class="menu-item py-3 modern-menu-item"
          >
            <span class="menu-link menu-center modern-menu-link">
              <span
                v-if="item.keenthemesIcon || item.bootstrapIcon"
                class="menu-icon me-0"
              >
                <i
                  v-if="asideMenuIcons === 'bootstrap'"
                  :class="item.bootstrapIcon"
                  class="bi fs-2"
                ></i>
                <KTIcon
                  v-else-if="asideMenuIcons === 'keenthemes'"
                  :icon-name="item.keenthemesIcon"
                  icon-class="fs-2"
                />
              </span>
              <span class="menu-title">{{ translate(item.sectionTitle) }}</span>
            </span>
            <div
              class="menu-sub menu-sub-dropdown menu-sub-indention px-2 py-4 w-250px modern-submenu"
            >
              <template v-for="(menuItem, j) in item.pages" :key="j">
                <div
                  v-if="menuItem.sectionTitle && menuItem.route"
                  :class="{ show: hasActiveChildren(menuItem.route) }"
                  class="menu-item menu-accordion modern-submenu-item"
                  data-kt-menu-sub="accordion"
                  data-kt-menu-trigger="click"
                >
                  <span class="menu-link modern-submenu-link">
                    <span class="menu-bullet">
                      <span class="bullet bullet-dot"></span>
                    </span>
                    <span class="menu-title">{{
                      translate(menuItem.sectionTitle)
                    }}</span>
                    <span class="menu-arrow"></span>
                  </span>
                  <div class="menu-sub menu-sub-accordion">
                    <template v-for="(item2, k) in menuItem.sub" :key="k">
                      <div
                        v-if="item2.sectionTitle && item2.route"
                        :class="{ show: hasActiveChildren(item2.route) }"
                        class="menu-item menu-accordion modern-submenu-item"
                        data-kt-menu-sub="accordion"
                        data-kt-menu-trigger="click"
                      >
                        <span class="menu-link modern-submenu-link">
                          <span class="menu-bullet">
                            <span class="bullet bullet-dot"></span>
                          </span>
                          <span class="menu-title">{{
                            translate(item2.sectionTitle)
                          }}</span>
                          <span class="menu-arrow"></span>
                        </span>
                        <div
                          v-if="item2.route"
                          :class="{ show: hasActiveChildren(item2.route) }"
                          class="menu-sub menu-sub-accordion"
                        >
                          <template v-for="(item3, l) in item2.sub" :key="l">
                            <div v-if="item3.heading" class="menu-item modern-submenu-item">
                              <router-link
                                v-if="item3.route"
                                class="menu-link modern-submenu-link"
                                active-class="active"
                                :to="item3.route"
                              >
                                <span class="menu-bullet">
                                  <span class="bullet bullet-dot"></span>
                                </span>
                                <span class="menu-title">{{
                                  translate(item3.heading)
                                }}</span>
                              </router-link>
                            </div>
                          </template>
                        </div>
                      </div>
                      <div v-else-if="item2.heading" class="menu-item modern-submenu-item">
                        <router-link
                          v-if="item2.route"
                          class="menu-link modern-submenu-link"
                          active-class="active"
                          :to="item2.route"
                        >
                          <span class="menu-bullet">
                            <span class="bullet bullet-dot"></span>
                          </span>
                          <span class="menu-title">{{
                            translate(item2.heading)
                          }}</span>
                        </router-link>
                      </div>
                    </template>
                  </div>
                </div>
                <div v-else-if="menuItem.heading" class="menu-item modern-submenu-item">
                  <router-link
                    v-if="menuItem.route"
                    class="menu-link modern-submenu-link"
                    active-class="active"
                    :to="menuItem.route"
                  >
                    <span class="menu-bullet">
                      <span class="bullet bullet-dot"></span>
                    </span>
                    <span class="menu-title">{{
                      translate(menuItem.heading)
                    }}</span>
                  </router-link>
                </div>
              </template>
            </div>
          </div>
        </template>
      </template>
    </div>
  </div>
  <!--end::Menu-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { version } from "@/core/helpers/documentation";
import { asideMenuIcons } from "@/core/helpers/config";
import MainMenuConfig from "@/core/config/MainMenuConfig";

export default defineComponent({
  name: "kt-menu",
  components: {},
  setup() {
    const { t, te } = useI18n();
    const route = useRoute();
    const scrollElRef = ref<null | HTMLElement>(null);

    onMounted(() => {
      if (scrollElRef.value) {
        scrollElRef.value.scrollTop = 0;
      }
    });

    const translate = (text: string) => {
      if (te(text)) {
        return t(text);
      } else {
        return text;
      }
    };

    const hasActiveChildren = (match: string) => {
      return route.path.indexOf(match) !== -1;
    };

    const currentActive = (current: string) => {
      return route.path === current;
    };

    return {
      hasActiveChildren,
      currentActive,
      MainMenuConfig,
      asideMenuIcons,
      version,
      translate,
      getAssetPath,
    };
  },
});
</script>

<style scoped>
/* Modern Menu Styling */
.modern-menu {
  border-radius: 12px;
  padding: 8px;
  margin: 8px 0;
}

.modern-menu-item {
  margin: 4px 0;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.modern-menu-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1));
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 8px;
}

.modern-menu-item:hover::before {
  opacity: 1;
}

.modern-menu-link {
  border-radius: 8px;
  padding: 12px 16px;
  margin: 2px 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 12px;
}

.modern-menu-link:hover {
  background: rgba(99, 102, 241, 0.15);
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.15);
  color: rgba(255, 255, 255, 1);
}

.modern-menu-link.active {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2));
  color: rgba(255, 255, 255, 1);
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.2);
}

.modern-menu-link .menu-icon {
  transition: all 0.3s ease;
}

.modern-menu-link:hover .menu-icon {
  transform: scale(1.1);
  color: rgba(99, 102, 241, 1);
}

.modern-menu-link .menu-title {
  transition: all 0.3s ease;
  font-size: 14px;
}

.modern-menu-link:hover .menu-title {
  transform: translateX(2px);
}

/* Submenu Styling */
.modern-submenu {
  border-radius: 12px;
  margin-top: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.modern-submenu-item {
  margin: 2px 0;
  border-radius: 6px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modern-submenu-link {
  border-radius: 6px;
  padding: 10px 14px;
  margin: 1px 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: rgba(255, 255, 255, 0.8);
  font-weight: 400;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.modern-submenu-link:hover {
  background: rgba(99, 102, 241, 0.12);
  transform: translateX(4px);
  color: rgba(255, 255, 255, 1);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
}

.modern-submenu-link.active {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.15));
  color: rgba(255, 255, 255, 1);
}

.modern-submenu-link .menu-bullet {
  transition: all 0.3s ease;
}

.modern-submenu-link:hover .menu-bullet .bullet {
  background: rgba(99, 102, 241, 1);
  transform: scale(1.2);
}

.modern-submenu-link .menu-title {
  transition: all 0.3s ease;
}

.modern-submenu-link:hover .menu-title {
  transform: translateX(2px);
}

/* Menu Arrow Animation */
.modern-menu-link .menu-arrow {
  transition: all 0.3s ease;
}

.modern-menu-item:hover .menu-arrow {
  transform: rotate(90deg);
  color: rgba(99, 102, 241, 1);
}

/* Responsive Design */
@media (max-width: 991px) {
  .modern-menu {
    margin: 4px 0;
    padding: 4px;
  }
  
  .modern-menu-link {
    padding: 10px 12px;
    font-size: 13px;
  }
  
  .modern-submenu-link {
    padding: 8px 12px;
    font-size: 12px;
  }
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
  .modern-menu-link {
    color: rgba(255, 255, 255, 0.9);
  }
  
  .modern-submenu-link {
    color: rgba(255, 255, 255, 0.8);
  }
}

/* Smooth scrolling for menu */
#kt_aside_menu_wrapper {
  scrollbar-width: thin;
  scrollbar-color: rgba(99, 102, 241, 0.3) transparent;
}

#kt_aside_menu_wrapper::-webkit-scrollbar {
  width: 6px;
}

#kt_aside_menu_wrapper::-webkit-scrollbar-track {
  background: transparent;
}

#kt_aside_menu_wrapper::-webkit-scrollbar-thumb {
  background: rgba(99, 102, 241, 0.3);
  border-radius: 3px;
}

#kt_aside_menu_wrapper::-webkit-scrollbar-thumb:hover {
  background: rgba(99, 102, 241, 0.5);
}
</style>
