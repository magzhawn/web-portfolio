<script setup lang="ts">
import ThemeToggler from '@/components/header/ThemeToggler.vue';
import { routes } from '@/router'
</script>

<template>
    <div class="layout">
        <aside class="sidebar">
            <nav class="menu">
                <div class="menu__upper">
                    <a v-for="route in routes" :key="route.path" :href="route.path" class="menu-item">
                        {{ route.emoji }}
                        {{ route.name }}
                    </a>
                </div>
                <div class="menu__lower">
                    <ThemeToggler />
                </div>
            </nav>
        </aside>
        <div class="main">
            <section class="content">
                <RouterView />
            </section>
        </div>
    </div>
</template>

<style scoped>
.layout {
    display: flex;
    min-height: 100vh;
    overflow-y: auto;
}

.sidebar {
    background: var(--bg-color-secondary);
    border-right: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 0.5rem;
    height: auto;
}

.menu {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
}

.menu__lower {
    display: flex;
    justify-content: start;
}

.menu-item {
    text-decoration: none;
    color: var(--text-color);
    font-size: 1rem;
    transition: background-color 0.1s;
    padding: 0.5rem;
    border-radius: 1rem;
    font-weight: 500;
    white-space: nowrap;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.menu-item:hover {
    background-color: var(--hover-bg-color);
}

.main {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: var(--bg-color-primary);
}

.content {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
}
</style>
