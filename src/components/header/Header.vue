<script setup lang="ts">
import router from '@/router';
import { routes } from '@/router';
import { ref, onMounted, onUnmounted, watch } from 'vue';
import ThemeToggler from './ThemeToggler.vue';
import MobileMenuOverlay from './MobileMenuOverlay.vue';

const scrolled = ref(false);
const mobileMenuOpen = ref(false);

const handleScroll = () => {
  scrolled.value = window.scrollY > 0;
};

const toggleMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

// Disable scrolling when overlay is open
watch(mobileMenuOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : '';
});

const navigate = (path: string) => {
  router.replace(path);
  mobileMenuOpen.value = false;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  document.body.style.overflow = '';
});
</script>

<template>
  <div :class="['header-container', { scrolled }]">
    <span class="moto">MAGZHAN ESENTAEV</span>

    <div class="right">
      <ThemeToggler />

      <!-- Desktop Tabs -->
      <div class="tabs desktop-only">
        <span class="tab" v-for="tab in routes" :key="tab.path" @click="navigate(tab.path)">
          {{ tab.name }}
        </span>
      </div>

      <!-- Mobile Hamburger -->
      <div class="hamburger mobile-only" @click="toggleMenu">
        <span :class="{ open: mobileMenuOpen }"></span>
        <span :class="{ open: mobileMenuOpen }"></span>
        <span :class="{ open: mobileMenuOpen }"></span>
      </div>
    </div>
  </div>

  <!-- Mobile Overlay -->
  <MobileMenuOverlay
    v-if="mobileMenuOpen"
    :routes="routes"
    @close="mobileMenuOpen = false"
    @navigate="navigate"
  />
</template>

<style scoped>
.header-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: rgba(var(--bg-rgb), 0.1);
  color: var(--text-color);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 20;
  box-sizing: border-box;
}

.moto {
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: clamp(1rem, 2.5vw, 1.25rem);
}

.right {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* Desktop Tabs */
.tabs.desktop-only {
  display: flex;
  gap: 16px;
}

/* Hamburger */
.hamburger {
  display: none;
  position: relative;
  width: 24px;
  height: 18px;
  cursor: pointer;
}

.hamburger span {
  position: absolute;
  left: 0;
  width: 100%;
  height: 3px;
  background: var(--text-color);
  border-radius: 2px;
  transition: all 0.3s ease;
}

.hamburger span:nth-child(1) { top: 0; }
.hamburger span:nth-child(2) { top: 50%; transform: translateY(-50%); }
.hamburger span:nth-child(3) { bottom: 0; }

.hamburger span.open:nth-child(1) {
  top: 50%;
  transform: translateY(-50%) rotate(45deg);
}
.hamburger span.open:nth-child(2) {
  opacity: 0;
}
.hamburger span.open:nth-child(3) {
  top: 50%;
  transform: translateY(-50%) rotate(-45deg);
}

/* Responsive */
@media (max-width: 768px) {
  .tabs.desktop-only {
    display: none;
  }
  .hamburger.mobile-only {
    display: flex;
  }
}
</style>
