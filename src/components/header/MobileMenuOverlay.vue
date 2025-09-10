<script setup lang="ts">
import { ref } from 'vue';

const baseItems = [
  { path: '/home', name: 'Home' },
  { path: '/about', name: 'About' },
  { path: '/projects', name: 'Projects' },
  { path: '/contact', name: 'Contact' }
];

const items = ref(
  Array.from({ length: 250 }).flatMap(() => baseItems)
);
</script>

<template>
  <div class="mobile-overlay">
    <div class="carousel" ref="carousel">
      <div v-for="(tab, index) in items" :key="index" class="mobile-tab">
        {{ tab.name.toUpperCase() }}
        <span class="justify-helper"></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background-color: rgba(var(--bg-rgb), 0.1);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(8px);
  color: var(--text-color);
}

.carousel {
  width: 100%;
  height: 100%;
  padding: 0 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 32px;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  scrollbar-width: none;
  overflow-x: hidden;
}
.carousel::-webkit-scrollbar {
  display: none;
}

.mobile-tab {
  font-weight: 1000;
  font-size: 3rem; /* uniform base font */
  text-align: justify; /* justify text across full width */
  white-space: nowrap;
  cursor: pointer;
  position: relative;
}

.mobile-tab .justify-helper {
  display: inline-block;
  width: 100%;
  height: 0;
}
</style>
