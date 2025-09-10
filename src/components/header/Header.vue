<script setup lang="ts">
import router from '@/router';
import { routes } from '@/router';
import { onMounted, onUnmounted, ref } from 'vue';
import ThemeToggler from './ThemeToggler.vue';

const scrolled = ref(false)

const handleScroll = () => {
    scrolled.value = window.scrollY > 0
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
    <div :class="['header-container', { scrolled }]">
        <span class="moto">{{ "You're in Magzhan's web portfolio" }}</span>
        <div class="right">
            <ThemeToggler />
            <div class="tabs">
                <span class="tab" v-for="tab in routes" :key="tab.path" @click="router.replace(tab.path)">
                    {{ tab.name }}
                </span>
            </div>
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
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: var(--bg-color); 
  color: var(--text-color);         
  background-color: rgba(var(--bg-rgb), 0.1); 
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 10;
}

.header-container::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    width: 100%;
    background: var(--trasparent-color);
    transition: opacity 0.1s ease;
}

.right {
    display: flex;
    flex-direction: row;
    gap: 16px;
    align-items: center;
}

.header-container.scrolled::after {
    opacity: 1;
}

.tabs {
    display: flex;
    flex-direction: row;
    gap: 16px;
}

.tab {
    cursor: pointer;
}

.tab:hover {
    text-decoration: underline;

}

.moto {
    font-weight: 700;
}
</style>
