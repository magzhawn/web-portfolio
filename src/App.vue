<script setup lang="ts">
import Header from '@/components/header/Header.vue';
</script>

<template>
  <div class="app">
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
