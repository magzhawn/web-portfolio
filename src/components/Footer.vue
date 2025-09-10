<script setup lang="ts"></script>

<template>
  <footer>
    <span>All rights reserved</span>
    <span>Successfully vibecoded</span>
  </footer>
</template>

<style scoped>
footer {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: rgba(var(--bg-rgb), 0.1);
  color: var(--text-color);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-top: 1px solid rgba(var(--text-rgb), 0.1);
}
</style>
