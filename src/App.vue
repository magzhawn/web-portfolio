<script setup lang="ts">
import NoiseBackground from './components/background/NoiseBackground.vue';
import Header from '@/components/header/Header.vue';
import { useHeaderStore } from '@/composables/headerStore';

const { showPerlinNoise } = useHeaderStore()
</script>

<template>
  <div class="app">
    <NoiseBackground v-if="showPerlinNoise"/>
    <Header />
    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<style>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
  z-index: 0;
}

.content {
  flex: 1;
}
</style>
