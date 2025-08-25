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
const prevState = ref({ pos: { x: 100, y: 100 }, size: { width: 800, height: 600 } });

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
    prevState.value = { pos: { ...pos.value }, size: { ...size.value } };
    pos.value = { x: 0, y: 0 };
    size.value = { width: window.innerWidth, height: window.innerHeight };
  } else {
    pos.value = { ...prevState.value.pos };
    size.value = { ...prevState.value.size };
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
    class="window glass-macos"
    :style="{
      top: pos.y + 'px',
      left: pos.x + 'px',
      width: size.width + 'px',
      height: size.height + 'px',
    }"
  >
    <!-- Window Header -->
    <div class="window-header" @mousedown="startDrag" @touchstart="startDrag">
      <div class="mac-controls">
        <span class="btn close" @click.stop="closeWindow"></span>
        <span class="btn minimize"></span>
        <span class="btn maximize" @click.stop="toggleFullscreen"></span>
      </div>
    </div>

    <!-- Window Content -->
    <div class="window-content">
      <slot />
    </div>

    <!-- Resize Handles -->
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
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.25s ease, transform 0.25s ease;
  
}

.window:hover {
  box-shadow: 0 16px 50px rgba(0, 0, 0, 0.6);
}

/* macOS glass effect */
.glass-macos {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(5px) saturate(200%);
  -webkit-backdrop-filter: blur(25px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Header bar */
.window-header {
  height: 32px;
  display: flex;
  align-items: center;
  padding: 4px 12px 0px 12px;
  cursor: grab;
  user-select: none;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(30px);
}

.window-header:active {
  cursor: grabbing;
}

/* macOS buttons */
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
  box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.2);
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

/* Resize handles */
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
}
.bottom {
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 6px;
  cursor: s-resize;
}
.left {
  top: 0;
  left: -2px;
  width: 6px;
  height: 100%;
  cursor: w-resize;
}
.right {
  top: 0;
  right: -2px;
  width: 6px;
  height: 100%;
  cursor: e-resize;
}

.top-left {
  top: -4px;
  left: -4px;
  width: 10px;
  height: 10px;
  cursor: nw-resize;
}
.top-right {
  top: -4px;
  right: -4px;
  width: 10px;
  height: 10px;
  cursor: ne-resize;
}
.bottom-left {
  bottom: -4px;
  left: -4px;
  width: 10px;
  height: 10px;
  cursor: sw-resize;
}
.bottom-right {
  bottom: -4px;
  right: -4px;
  width: 10px;
  height: 10px;
  cursor: se-resize;
}

</style>
