<script setup lang="ts">
</script>

<template>
  <div class="layout">
    <div class="main">
      <section class="content">
        <span class="fade-blink">
          Mobile version is coming soon
        </span>
      </section>
    </div>
  </div>
</template>

<style scoped>
.content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.5rem;
  color: var(--text-color);
}

/* Fade in + blink */
.fade-blink {
  opacity: 0;
  animation: fadeIn 1s ease forwards, blink 2s ease-in-out infinite;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}
</style>
