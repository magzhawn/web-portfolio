<script setup lang="ts">
import { useHeaderStore } from '@/composables/headerStore';

const { togglePerlinNoise, showPerlinNoise } = useHeaderStore();
</script>

<template>
  <button @click="togglePerlinNoise" >
    {{ showPerlinNoise ? 'Hide Noise' : 'Show Noise' }}
  </button>
</template>

<style scoped>
button {
  font-size: 16px;
  cursor: pointer;
  font-family: monospace;
  white-space: nowrap;  /* Prevent wrapping */
}
</style>
