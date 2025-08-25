<script setup lang="ts">
import emojis from 'emoji.json';

const randomEmojis = () => {
  const selected = [];
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * emojis.length);
    selected.push(emojis[randomIndex].char);
  }
  return selected.join(" ");
};

</script>

<template>
    <div class="emojis">{{ randomEmojis() }}</div>
</template>

<style scoped>
.emojis {
    font-size: 30px;
}
</style>