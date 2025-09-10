<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

const theme = ref<'light' | 'dark'>('light')

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', theme.value)
  localStorage.setItem('theme', theme.value)
}

onMounted(async () => {
  const saved = localStorage.getItem('theme') as 'light' | 'dark' | null
  if (saved) theme.value = saved
  else theme.value = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

  document.documentElement.setAttribute('data-theme', theme.value)

  // prevent shift on mount
  const btn = document.querySelector('.theme-toggle') as HTMLElement
  btn.style.transition = 'none'
  await nextTick()
  btn.style.transition = ''
})
</script>

<template>
  <button class="theme-toggle" @click="toggleTheme" :data-theme="theme">
    <svg viewBox="0 0 24 24" class="icon">
      <!-- Sun -->
      <circle class="sun" cx="12" cy="12" r="6" />
      <!-- Rays -->
      <g class="rays">
        <line x1="12" y1="2" x2="12" y2="5" />
        <line x1="12" y1="2" x2="12" y2="5" />
        <line x1="12" y1="2" x2="12" y2="5" />
        <line x1="12" y1="2" x2="12" y2="5" />
        <line x1="12" y1="2" x2="12" y2="5" />
        <line x1="12" y1="2" x2="12" y2="5" />
        <line x1="12" y1="2" x2="12" y2="5" />
        <line x1="12" y1="2" x2="12" y2="5" />
      </g>

      <!-- Moon with craters -->
      <g class="moon-group">
        <circle class="moon" cx="12" cy="12" r="8" />
        <circle class="crater" cx="14" cy="10" r="1" />
        <circle class="crater" cx="10" cy="14" r="0.8" />
        <circle class="crater" cx="13" cy="15" r="0.5" />
      </g>
    </svg>
  </button>
</template>

<style scoped>
.theme-toggle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  position: relative;
  transition: background 0.3s;
}

.icon {
  width: 24px;
  height: 24px;
  position: relative;
}

/* Sun */
.sun {
  fill: var(--text-color);
  transition: transform 0.5s ease, opacity 0.5s ease;
}

/* Rays */
.rays line {
  stroke: var(--text-color);
  stroke-width: 1.5;
  stroke-linecap: round;
  transform-origin: 12px 12px;
  transition: opacity 0.5s ease;
}
.rays line:nth-child(1) { transform: rotate(0deg); }
.rays line:nth-child(2) { transform: rotate(45deg); }
.rays line:nth-child(3) { transform: rotate(90deg); }
.rays line:nth-child(4) { transform: rotate(135deg); }
.rays line:nth-child(5) { transform: rotate(180deg); }
.rays line:nth-child(6) { transform: rotate(225deg); }
.rays line:nth-child(7) { transform: rotate(270deg); }
.rays line:nth-child(8) { transform: rotate(315deg); }

/* Moon and craters */
.moon-group {
  position: absolute;
  top: 0;
  left: 0;
  transform: scale(0);
  transition: transform 0.5s ease, opacity 0.5s ease;
}
.moon {
  fill: var(--text-color);
}
.crater {
  fill: rgba(var(--bg-rgb), 0.9);
}

/* Light mode */
.theme-toggle[data-theme='light'] .sun { transform: scale(1); opacity: 1; }
.theme-toggle[data-theme='light'] .rays line { opacity: 1; }
.theme-toggle[data-theme='light'] .moon-group { transform: scale(0); opacity: 0; }

/* Dark mode */
.theme-toggle[data-theme='dark'] .sun { transform: scale(0); opacity: 0; }
.theme-toggle[data-theme='dark'] .rays line { opacity: 0; }
.theme-toggle[data-theme='dark'] .moon-group { transform: scale(1); opacity: 1; }
</style>
