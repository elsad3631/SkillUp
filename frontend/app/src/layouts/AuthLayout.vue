<template>
  <!--begin::Authentication Layout -->
  <div class="auth-layout-container">
    <!--begin::Background Image-->
    <div class="auth-background">
      <img 
        :src="getAssetPath('media/logos/logobackground.jpg')" 
        alt="Background" 
        class="background-image"
      />
      <div class="background-overlay"></div>
    </div>
    <!--end::Background Image-->

    <!--begin::Content Container-->
    <div class="auth-content">
      <!--begin::Form Container-->
      <div class="form-container">
        <router-view></router-view>
      </div>
      <!--end::Form Container-->

      <!--begin::Footer-->
      <div class="auth-footer">
        <div class="footer-links">
          <a href="#" class="footer-link" target="_blank">Terms</a>
          <a href="#" class="footer-link" target="_blank">Plans</a>
          <a href="#" class="footer-link" target="_blank">Contact Us</a>
        </div>
      </div>
      <!--end::Footer-->
    </div>
    <!--end::Content Container-->
  </div>
  <!--end::Authentication Layout -->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, onMounted } from "vue";
import LayoutService from "@/core/services/LayoutService";
import { useBodyStore } from "@/stores/body";

export default defineComponent({
  name: "auth-layout",
  components: {},
  setup() {
    const store = useBodyStore();

    onMounted(() => {
      LayoutService.emptyElementClassesAndAttributes(document.body);

      store.addBodyClassname("app-blank");
      store.addBodyClassname("bg-body");
    });

    return {
      getAssetPath,
    };
  },
});
</script>

