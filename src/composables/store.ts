import { onMounted, ref, nextTick } from "vue";
import lottie from "lottie-web";

export const useLogo = () => {
  const animatedLogo = ref<HTMLDivElement | null>(null);

  onMounted(async () => {
    await nextTick();
    if (animatedLogo.value) {
      lottie.loadAnimation({
        container: animatedLogo.value,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "/lottie/basketball.json",
      });
    }
  });

  return {
    animatedLogo,
  };
};

export const useSorting = () => {
  const isLoaded = ref<boolean>(false)

  const BAR_COUNT = 100;

  const bars = ref<number[]>([]);

  const generateBars = () => {
    bars.value = Array.from(
      { length: BAR_COUNT },
      () => Math.floor(Math.random() * 50) + 10
    );
  };

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const merge = async (
    arr: number[],
    left: number,
    mid: number,
    right: number
  ) => {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);

    let i = 0;
    let j = 0;
    let k = left;

    while (i < leftArr.length && j < rightArr.length) {
      await sleep(10);
      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i];
        i++;
      } else {
        arr[k] = rightArr[j];
        j++;
      }
      k++;
      bars.value = [...arr];
    }

    while (i < leftArr.length) {
      await sleep(10);
      arr[k++] = leftArr[i++];
      bars.value = [...arr];
    }

    while (j < rightArr.length) {
      await sleep(10);
      arr[k++] = rightArr[j++];
      bars.value = [...arr];
    }
  };

  const mergeSort = async (arr: number[], left: number, right: number) => {
    if (left >= right) return;
  
    const mid = Math.floor((left + right) / 2);
    await mergeSort(arr, left, mid);
    await mergeSort(arr, mid + 1, right);
    await merge(arr, left, mid, right);
  };

  onMounted(async () => {
    generateBars();
    const copy = [...bars.value];
    await mergeSort(copy, 0, copy.length - 1);
    isLoaded.value = true;
  });

  return {
    isLoaded,
    bars
  }

};
