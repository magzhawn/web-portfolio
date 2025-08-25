<script setup lang="ts">
import { useSorting } from '../composables/store';

const { bars } = useSorting()
</script>

<template>
  <div class="loader">
    <div class="bar" v-for="(height, index) in bars" :key="index" :style="{ height: height + 'px' }"></div>
  </div>
</template>

<style scoped>
.loader {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 2px;
  width: 100%;
  padding: 10px 0;
  box-sizing: border-box;
}

.bar {
  width: 4px;
  background-color: white;
  border-radius: 2px;
  transition: height 0.1s ease-in-out;
}
</style>
