<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from "vue";

type Tab = { name: string; url?: string };

const props = withDefaults(
  defineProps<{
    tabs?: Tab[];
    size?: number;
    seed?: number;
    showLabels?: boolean;
    gap?: number;
    cornerRadius?: number;
  }>(),
  {
    tabs: () => [
      { name: "Main" },
      { name: "About" },
      { name: "Contact" },
      { name: "Blog" },
    ],
    size: 80,
    seed: 1337,
    showLabels: true,
    gap: 8,
    cornerRadius: 10,
  }
);

const canvas = ref<HTMLCanvasElement | null>(null);
const dpr = ref(1);
const width = ref(0);
const height = ref(0);

const scale = ref(1);
const offset = ref({ x: 0, y: 0 });
const dragging = ref(false);
const last = ref({ x: 0, y: 0 });
const hover = ref<{ q: number; r: number } | null>(null);

let rafId = 0;

function setCanvasSize() {
  const el = canvas.value;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  dpr.value = window.devicePixelRatio || 1;
  width.value = rect.width;
  height.value = rect.height;
  el.width = Math.floor(rect.width * dpr.value);
  el.height = Math.floor(rect.height * dpr.value);
}

function worldFromScreen(sx: number, sy: number) {
  const x = (sx / dpr.value - width.value / 2) / scale.value - offset.value.x;
  const y = (sy / dpr.value - height.value / 2) / scale.value - offset.value.y;
  return { x, y };
}

function screenFromWorld(x: number, y: number) {
  const sx = (x + offset.value.x) * scale.value + width.value / 2;
  const sy = (y + offset.value.y) * scale.value + height.value / 2;
  return { x: sx, y: sy };
}

// pointy-top hex
const SQRT3 = Math.sqrt(3);
function axialToPixel(q: number, r: number, size: number) {
  const x = size * SQRT3 * (q + r / 2);
  const y = size * 1.5 * r;
  return { x, y };
}
function pixelToAxial(x: number, y: number, size: number) {
  const q = (x * SQRT3 / 3 - y / 3) / size;
  const r = (y * 2 / 3) / size;
  return hexRound(q, r);
}
function hexRound(qf: number, rf: number) {
  let x = qf, z = rf, y = -x - z;
  let rx = Math.round(x), ry = Math.round(y), rz = Math.round(z);
  const x_diff = Math.abs(rx - x), y_diff = Math.abs(ry - y), z_diff = Math.abs(rz - z);
  if (x_diff > y_diff && x_diff > z_diff) rx = -ry - rz;
  else if (y_diff > z_diff) ry = -rx - rz;
  else rz = -rx - ry;
  return { q: rx, r: rz };
}
function hexCorners(cx: number, cy: number, size: number) {
  const pts: Array<[number, number]> = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 180) * (60 * i - 30);
    pts.push([cx + size * Math.cos(angle), cy + size * Math.sin(angle)]);
  }
  return pts;
}

// deterministic mapping from (q,r,seed) -> tab index
function xorshift32(a: number) {
  a ^= a << 13; a ^= a >>> 17; a ^= a << 5;
  return a >>> 0;
}
function tabIndexFor(q: number, r: number) {
  const h = xorshift32(q * 374761393 + r * 668265263 + (props.seed | 0));
  return h % props.tabs.length;
}

const palette = computed(() => {
  const base = ["#111827","#1f2937","#374151","#4b5563","#6b7280","#9ca3af","#d1d5db","#e5e7eb"];
  return props.tabs.map((_, i) => base[i % base.length]);
});

function draw() {
  const el = canvas.value;
  if (!el) return;
  const ctx = el.getContext("2d");
  if (!ctx) return;

  ctx.save();
  ctx.clearRect(0, 0, el.width, el.height);
  ctx.translate((width.value * dpr.value) / 2, (height.value * dpr.value) / 2);
  ctx.scale(scale.value * dpr.value, scale.value * dpr.value);
  ctx.translate(offset.value.x, offset.value.y);

  const tl = worldFromScreen(0, 0);
  const br = worldFromScreen(width.value * dpr.value, height.value * dpr.value);
  const minX = Math.min(tl.x, br.x) - props.size * 2;
  const maxX = Math.max(tl.x, br.x) + props.size * 2;
  const minY = Math.min(tl.y, br.y) - props.size * 2;
  const maxY = Math.max(tl.y, br.y) + props.size * 2;

  const rMin = Math.floor(minY / (props.size * 1.5)) - 2;
  const rMax = Math.ceil(maxY / (props.size * 1.5)) + 2;
  const drawSize = Math.max(4, props.size - props.gap);
  for (let r = rMin; r <= rMax; r++) {
    const qMin = Math.floor(minX / (props.size * SQRT3) - r / 2) - 2;
    const qMax = Math.ceil(maxX / (props.size * SQRT3) - r / 2) + 2;
    for (let q = qMin; q <= qMax; q++) {
      const { x, y } = axialToPixel(q, r, props.size);
      const idx = tabIndexFor(q, r);
      const color = palette.value[idx];
    // const color = '#111827';
      const corners = hexCorners(x, y, drawSize);

      ctx.beginPath();
      ctx.moveTo(corners[0][0], corners[0][1]);
      for (let i = 1; i < 6; i++) ctx.lineTo(corners[i][0], corners[i][1]);
      ctx.closePath();

      const fill = color + "22";

      ctx.lineJoin = "round";
      ctx.strokeStyle = fill;
      ctx.lineWidth = Math.max(1, (props.cornerRadius ?? 8) * 2) / scale.value; // rounded silhouette
      ctx.stroke();

      ctx.fillStyle = fill;
      ctx.fill();

      ctx.lineWidth = 1.5 / scale.value; // thin border
      ctx.strokeStyle = color;
      ctx.stroke();

      if (props.showLabels && scale.value >= 0.7) {
        const tab = props.tabs[idx];
        ctx.fillStyle = "#e5e7eb";
        ctx.font = `${18 / scale.value}px ui-sans-serif, -apple-system, Segoe UI, Roboto, Helvetica, Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(tab.name, x, y);
      }

      const isHover = hover.value && hover.value.q === q && hover.value.r === r;
      if (isHover) {
        ctx.save();
        ctx.shadowColor = "rgba(255, 0, 0, 0.9)";
        ctx.shadowBlur = 24 / scale.value;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.lineWidth = 2 / scale.value;
        ctx.strokeStyle = "rgba(255, 0, 0, 0.9)";
        ctx.stroke();
        ctx.restore();
      }
    }
  }
  ctx.restore();
}

function loop() {
  draw();
  rafId = requestAnimationFrame(loop);
}

function onPointerDown(e: PointerEvent) {
  dragging.value = true;
  last.value = { x: e.clientX, y: e.clientY };
  (e.target as Element).setPointerCapture(e.pointerId);
}
function onPointerMove(e: PointerEvent) {
  const world = worldFromScreen(e.clientX * dpr.value, e.clientY * dpr.value);
  const { q, r } = pixelToAxial(world.x, world.y, props.size);
  hover.value = { q, r };

  if (!dragging.value) return;
  const dx = (e.clientX - last.value.x) / scale.value;
  const dy = (e.clientY - last.value.y) / scale.value;
  offset.value.x += dx;
  offset.value.y += dy;
  last.value = { x: e.clientX, y: e.clientY };
}
function onPointerUp() { dragging.value = false; }
function onPointerLeave() {
  hover.value = null;
  dragging.value = false;
}

function onWheel(e: WheelEvent) {
  e.preventDefault();
  const zoomFactor = e.ctrlKey ? 1.0015 : 1.0005;
  if (e.ctrlKey) {
    const direction = e.deltaY > 0 ? -1 : 1;
    const mouse = worldFromScreen(e.clientX * dpr.value, e.clientY * dpr.value);
    const pre = screenFromWorld(mouse.x, mouse.y);
    scale.value = clamp(scale.value * Math.pow(zoomFactor, direction * Math.abs(e.deltaY)), 0.2, 3);
    const post = screenFromWorld(mouse.x, mouse.y);
    offset.value.x += (pre.x - post.x) / scale.value;
    offset.value.y += (pre.y - post.y) / scale.value;
  } else {
    offset.value.x -= e.deltaX / scale.value;
    offset.value.y -= e.deltaY / scale.value;
  }
}
function clamp(v: number, min: number, max: number) { return Math.max(min, Math.min(max, v)); }

function onClick(e: MouseEvent) {
  const world = worldFromScreen(e.clientX * dpr.value, e.clientY * dpr.value);
  const { q, r } = pixelToAxial(world.x, world.y, props.size);
  const idx = tabIndexFor(q, r);
  const tab = props.tabs[idx];
  if (tab.url) window.open(tab.url, "_blank", "noopener");
}

onMounted(() => {
  setCanvasSize();
  window.addEventListener("resize", setCanvasSize);
  canvas.value?.addEventListener("pointerdown", onPointerDown);
  canvas.value?.addEventListener("pointermove", onPointerMove);
  canvas.value?.addEventListener("pointerup", onPointerUp);
  canvas.value?.addEventListener("pointercancel", onPointerUp);
  canvas.value?.addEventListener("pointerleave", onPointerLeave);
  canvas.value?.addEventListener("wheel", onWheel, { passive: false });
  canvas.value?.addEventListener("click", onClick);
  loop();
});
onBeforeUnmount(() => {
  cancelAnimationFrame(rafId);
  window.removeEventListener("resize", setCanvasSize);
  canvas.value?.removeEventListener("pointerdown", onPointerDown);
  canvas.value?.removeEventListener("pointermove", onPointerMove);
  canvas.value?.removeEventListener("pointerup", onPointerUp);
  canvas.value?.removeEventListener("pointercancel", onPointerUp);
  canvas.value?.removeEventListener("pointerleave", onPointerLeave);
  canvas.value?.removeEventListener("wheel", onWheel);
  canvas.value?.removeEventListener("click", onClick);
});
</script>

<template>
  <div class="honeycomb">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<style scoped>
.honeycomb {
  width: 100%;
  height: 100%;
  background: #0b0f17;
  color: #fff;
}

canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>