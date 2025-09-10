<script setup lang="ts">
import router from '@/router';
import { routes } from '@/router';
import { ref, onMounted, onUnmounted, watch } from 'vue';
import ThemeToggler from './ThemeToggler.vue';

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
  if (open) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
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
  document.body.style.overflow = ''; // reset overflow on unmount
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

  <!-- Fullscreen Overlay -->
  <div v-if="mobileMenuOpen" class="mobile-overlay">
    <div class="mobile-tabs">
      <span class="mobile-tab" v-for="tab in routes" :key="tab.path" @click="navigate(tab.path)">
        {{ tab.name }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.header-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: rgba(var(--bg-rgb), 0.1);
  color: var(--text-color);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 20;
}

.moto {
  font-weight: 700;
  white-space: nowrap;           /* Prevent wrapping */
  overflow: hidden;              /* Hide overflow if too long */
  text-overflow: ellipsis;       /* Optional: show "..." if too long */
  font-size: clamp(1rem, 2.5vw, 1.25rem); /* Dynamic: min 16px, max 20px, scales with viewport */
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
  flex-direction: column;
  justify-content: space-between;
  width: 24px;
  height: 18px;
  cursor: pointer;
}

.hamburger span {
  display: block;
  height: 3px;
  background: var(--text-color);
  border-radius: 2px;
  transition: all 0.3s ease;
}

.hamburger span.open:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}
.hamburger span.open:nth-child(2) {
  opacity: 0;
}
.hamburger span.open:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

/* Fullscreen overlay */
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--bg-color);
  color: var(--text-color);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 15;
}

/* Vertical mobile tabs */
.mobile-tabs {
  display: flex;
  flex-direction: column;
  gap: 32px;
  text-align: center;
}

.mobile-tab {
  font-size: 2rem;
  font-weight: 600;
  cursor: pointer;
}

.mobile-tab:hover {
  text-decoration: underline;
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
