<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import MobileLayout from '@/layouts/MobileLayout.vue'
import DesktopLayout from '@/layouts/DesktopLayout.vue'

const isMobile = ref(false)

const checkScreen = () => {
  isMobile.value = window.innerWidth < 768 
}

onMounted(() => {
  checkScreen()
  window.addEventListener('resize', checkScreen)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreen)
})
</script>

<template>
  <div class="app">
    <main class="content">
      <component :is="isMobile ? MobileLayout : DesktopLayout" />
    </main>
  </div>
</template>

<style>
.app {
  height: 100%;
  width: 100%;
}
.content {
  height: 100%;
}
</style>
