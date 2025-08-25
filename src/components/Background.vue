<script setup lang="ts">
import { useSorting } from "../composables/store";
import Loader from "./Loader.vue";
const { isLoaded } = useSorting();
</script>

<template>
  <div class="background" :class="{ visible: isLoaded }"></div>
  <div v-if="!isLoaded" class="progress-container">
    <Loader />
  </div>
</template>

<style scoped>
.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  background-image: url("/background.webp");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  transition: opacity 1.5s ease-in-out;
  z-index: 1;
}

.background.visible {
  opacity: 1;
}

.progress-container {
  bottom: 40px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
  align-items: center;
  z-index: 2;
}

.progress-text {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  color: white;
}
</style>
