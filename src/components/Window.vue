<script setup lang="ts">
import { ref, onBeforeUnmount } from "vue";

const windowRef = ref<HTMLElement | null>(null);

const pos = ref({ x: 100, y: 100 });
const size = ref({ width: 800, height: 600 });

// Dragging state
const isDragging = ref(false);
const dragOffset = ref({ x: 0, y: 0 });

// Resizing state
const isResizing = ref(false);
const resizeDir = ref("");
const resizeOffset = ref({ x: 0, y: 0 });

// Fullscreen toggle
const isFullscreen = ref(false);

// --- DRAGGING LOGIC ---
const startDrag = (e: MouseEvent | TouchEvent) => {
  if (isFullscreen.value || isResizing.value) return;
  isDragging.value = true;

  const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
  const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

  dragOffset.value = {
    x: clientX - pos.value.x,
    y: clientY - pos.value.y,
  };

  document.addEventListener("mousemove", onDrag);
  document.addEventListener("mouseup", stopDrag);
  document.addEventListener("touchmove", onDrag);
  document.addEventListener("touchend", stopDrag);
};

const onDrag = (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value) return;

  const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
  const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

  pos.value = {
    x: clientX - dragOffset.value.x,
    y: clientY - dragOffset.value.y,
  };
};

const stopDrag = () => {
  isDragging.value = false;
  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("mouseup", stopDrag);
  document.removeEventListener("touchmove", onDrag);
  document.removeEventListener("touchend", stopDrag);
};

// --- RESIZING LOGIC ---
const startResize = (e: MouseEvent, dir: string) => {
  if (isFullscreen.value) return;

  isResizing.value = true;
  resizeDir.value = dir;

  resizeOffset.value = {
    x: e.clientX,
    y: e.clientY,
  };

  document.addEventListener("mousemove", onResize);
  document.addEventListener("mouseup", stopResize);
};

const onResize = (e: MouseEvent) => {
  if (!isResizing.value) return;

  const dx = e.clientX - resizeOffset.value.x;
  const dy = e.clientY - resizeOffset.value.y;

  resizeOffset.value = { x: e.clientX, y: e.clientY };

  // Horizontal resize
  if (resizeDir.value.includes("right")) size.value.width += dx;
  if (resizeDir.value.includes("left")) {
    size.value.width -= dx;
    pos.value.x += dx;
  }

  // Vertical resize
  if (resizeDir.value.includes("bottom")) size.value.height += dy;
  if (resizeDir.value.includes("top")) {
    size.value.height -= dy;
    pos.value.y += dy;
  }

  // Minimum size constraints
  size.value.width = Math.max(300, size.value.width);
  size.value.height = Math.max(200, size.value.height);
};

const stopResize = () => {
  isResizing.value = false;
  document.removeEventListener("mousemove", onResize);
  document.removeEventListener("mouseup", stopResize);
};

// --- FULLSCREEN TOGGLE ---
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;

  if (isFullscreen.value) {
    pos.value = { x: 0, y: 0 };
    size.value = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  } else {
    pos.value = { x: 100, y: 100 };
    size.value = { width: 800, height: 600 };
  }
};

const closeWindow = () => {
  windowRef.value?.remove();
};

onBeforeUnmount(() => {
  stopDrag();
  stopResize();
});
</script>

<template>
  <div
    ref="windowRef"
    class="window"
    :style="{
      top: pos.y + 'px',
      left: pos.x + 'px',
      width: size.width + 'px',
      height: size.height + 'px',
    }"
  >
    <div class="window-header" @mousedown="startDrag" @touchstart="startDrag">
      <div class="mac-controls">
        <span class="btn close" @click.stop="closeWindow"></span>
        <span class="btn minimize"></span>
        <span class="btn maximize" @click.stop="toggleFullscreen"></span>
      </div>
    </div>
    <div class="window-content">
      <slot />
    </div>
    
    <div
      v-for="dir in [
        'top',
        'right',
        'bottom',
        'left',
        'top-left',
        'top-right',
        'bottom-left',
        'bottom-right',
      ]"
      :key="dir"
      :class="['resize-handle', dir]"
      @mousedown.prevent="startResize($event, dir)"
    ></div>
  </div>
</template>

<style scoped>
.window {
  position: absolute;
  background: transparent;
  border-radius: 8px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  z-index: 999;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s ease;
}

.window:hover {
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.6);
}

/* Header bar */
.window-header {
  height: 32px;
  background: transparent;
  display: flex;
  align-items: center;
  padding: 4px 12px 0px 12px;
  cursor: grab;
  user-select: none;
}

.window-header:active {
  cursor: grabbing;
}

.mac-controls {
  display: flex;
  gap: 8px;
}

.btn {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
  cursor: pointer;
}

.btn.close {
  background-color: #ff5f57;
}

.btn.minimize {
  background-color: #febc2e;
}

.btn.maximize {
  background-color: #28c840;
}

.window-content {
  flex: 1;
  padding: 5px;
  overflow: auto;
}

.resize-handle {
  position: absolute;
  background: transparent;
}

.top {
  top: -2px;
  left: 0;
  width: 100%;
  height: 6px;
  cursor: n-resize;
  background-color: transparent;
}
.bottom {
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 6px;
  cursor: s-resize;
  background-color: transparent;

}
.left {
  top: 0;
  left: -2px;
  width: 6px;
  height: 100%;
  cursor: w-resize;
  background-color: transparent;

}
.right {
  top: 0;
  right: -2px;
  width: 6px;
  height: 100%;
  cursor: e-resize;
  background-color: transparent;

}

.top-left {
  top: -4px;
  left: -4px;
  width: 10px;
  height: 10px;
  cursor: nw-resize;
  background-color: transparent;

}
.top-right {
  top: -4px;
  right: -4px;
  width: 10px;
  height: 10px;
  cursor: ne-resize;
  background-color: transparent;

}
.bottom-left {
  bottom: -4px;
  left: -4px;
  width: 10px;
  height: 10px;
  cursor: sw-resize;
  background-color: transparent;

}
.bottom-right {
  bottom: -4px;
  right: -4px;
  width: 10px;
  height: 10px;
  cursor: se-resize;
  background-color: transparent;

}
</style>
