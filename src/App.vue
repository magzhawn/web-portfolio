<script setup lang="ts">
import Carousel from './components/Carousel.vue';



</script>

<template>
    <div class="container">
        <Carousel />
    </div>
</template>

<style scoped>
.container {
    background-color: #BBB;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
}
</style>

<style>
html, body, #app {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    font-family: 'Roboto', sans-serif;
}
</style>
