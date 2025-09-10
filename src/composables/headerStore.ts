import { ref } from "vue"

const showPerlinNoise = ref<boolean>(true);

export const useHeaderStore = () => {

    const togglePerlinNoise = () => {
        showPerlinNoise.value = !showPerlinNoise.value
    }

    return {
        togglePerlinNoise,
        showPerlinNoise
    }
}