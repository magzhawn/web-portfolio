<script setup lang="ts">
import Background from "./components/Background.vue";
import Window from "./components/Window.vue";
import Terminal from "./components/windows/Terminal.vue";
import { useSorting } from "./composables/store";

const { isLoaded } = useSorting();
</script>

<template>
  <div id="app">
    <Background />
    <Window v-show="isLoaded">
      <Terminal />
    </Window>
  </div>
</template>

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

#app {
  position: relative;
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000;
  overflow: hidden;
}

.content {
  z-index: 2;
  text-align: center;
  font-size: 2rem;
  opacity: 0;
  transition: opacity 1.5s ease-in-out;
}

.content.visible {
  opacity: 1;
}
</style>
