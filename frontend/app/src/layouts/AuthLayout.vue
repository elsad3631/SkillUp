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

<style scoped>
.auth-layout-container {
  position: relative;
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.auth-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.background-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
}

.auth-content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 450px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.form-container {
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 2.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.auth-footer {
  text-align: center;
}

.footer-links {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.footer-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: rgba(255, 255, 255, 1);
  text-decoration: none;
}

@media (max-width: 768px) {
  .auth-content {
    padding: 1rem;
    max-width: 100%;
  }
  
  .form-container {
    padding: 2rem;
  }
  
  .footer-links {
    gap: 1rem;
  }
}
</style>
