<script setup lang="ts">
import router from '@/router';
import { routes } from '@/router';
import { ref, onMounted, onUnmounted, watch } from 'vue';
import ThemeToggler from './ThemeToggler.vue';
import MobileMenuOverlay from './MobileMenuOverlay.vue';
import Search from './Search.vue';

const scrolled = ref(false);
const mobileMenuOpen = ref(false);

const handleScroll = () => {
  scrolled.value = window.scrollY > 0;
};

const toggleMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

watch(mobileMenuOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : '';
});

const navigate = (path: string) => {
  router.replace(path);
  mobileMenuOpen.value = false;
};

const motoFull = 'MAGZHAN ESENTAEV';
const motoShort = 'MAGZHAN';
const moto = ref(motoFull);
const leftRef = ref<HTMLElement | null>(null);

const updateMoto = () => {
  if (!leftRef.value) return;
  const motoEl = leftRef.value.querySelector('.moto') as HTMLElement;
  if (!motoEl) return;
  // Use real width of the element
  moto.value = motoEl.scrollWidth > leftRef.value.offsetWidth ? motoShort : motoFull;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', updateMoto);
  updateMoto();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', updateMoto);
  document.body.style.overflow = '';
});
</script>

<template>
  <div :class="['header-container', { scrolled }]">
    <div class="left" ref="leftRef">
      <span class="moto">{{ moto }}</span>
      <Search />
    </div>
    <div class="right">
      <ThemeToggler />
      <div class="tabs desktop-only">
        <span class="tab" v-for="tab in routes" :key="tab.path" @click="navigate(tab.path)">
          {{ tab.name }}
        </span>
      </div>
      <div class="hamburger mobile-only" @click="toggleMenu">
        <span :class="{ open: mobileMenuOpen }"></span>
        <span :class="{ open: mobileMenuOpen }"></span>
        <span :class="{ open: mobileMenuOpen }"></span>
      </div>
    </div>
  </div>
  <MobileMenuOverlay v-if="mobileMenuOpen" :routes="routes" @close="mobileMenuOpen = false" @navigate="navigate" />
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
  padding: 0px 16px;
  background-color: rgba(var(--bg-color), 0.1);
  color: var(--text-color);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 20;
  box-sizing: border-box;
}

.left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  padding: 12px 0;
}


.moto {
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  min-width: 0;
}

.right {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  padding: 12px 0;
}

/* Desktop Tabs */
.tabs.desktop-only {
  display: flex;
  gap: 16px;
}

.tab {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.tab:hover {
  text-decoration: underline;
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

.hamburger span:nth-child(1) {
  top: 0;
}

.hamburger span:nth-child(2) {
  top: 50%;
  transform: translateY(-50%);
}

.hamburger span:nth-child(3) {
  bottom: 0;
}

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
