<script setup lang="ts">
import { ref, onMounted } from 'vue'

const theme = ref<'light' | 'dark'>('light')

const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', theme.value)
    localStorage.setItem('theme', theme.value)
}

onMounted(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (saved) {
        theme.value = saved
        document.documentElement.setAttribute('data-theme', saved)
    } else {
        // Optional: respect OS preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        theme.value = prefersDark ? 'dark' : 'light'
        document.documentElement.setAttribute('data-theme', theme.value)
    }
})
</script>

<template>
    <button @click="toggleTheme">
        Toggle {{ theme }} mode
    </button>
</template>
