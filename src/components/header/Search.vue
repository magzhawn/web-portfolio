<script setup lang="ts">
import { ref } from 'vue'

const query = ref('')

const searchGoogle = () => {
  if (query.value.trim() !== '') {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query.value)}`, '_blank')
  }
}
</script>

<template>
  <form @submit.prevent="searchGoogle" class="search-wrapper">
    <input type="text" v-model="query" placeholder="Search..." />
  </form>
</template>

<style scoped>
.search-wrapper {
  position: relative;
  display: inline-block;
}

input {
  background-color: var(--bg-color-secondary);
  border: 0;
  padding: 0.5em 2.5em 0.5em 1em;
  border-radius: 3rem;
  outline: none; 
  font-size: var(--font-size-base);
  color: var(--text-color);
  width: 100px;
}

input:focus {
  outline: none;
  box-shadow: none;
}

button {
  position: absolute;
  right: 0.5em;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  color: #888;
}

button svg {
  width: 1em;
  height: 1em;
}

button:focus {
  outline: none;
}
</style>
