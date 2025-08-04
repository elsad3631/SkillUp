<template>
  <UserCalendar></UserCalendar>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserCalendar from "@/components/calendar/UserCalendar.vue";

export default defineComponent({
  name: "apps-calendar",
  components: {
    UserCalendar,
  },
});
</script>
