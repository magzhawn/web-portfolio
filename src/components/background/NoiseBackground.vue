<script setup lang="ts">
import { onMounted, ref } from 'vue';

const canvasRef = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const gl = canvas.getContext('webgl');
  if (!gl) return;

  // Vertex shader
  const vertexShaderSource = `
    attribute vec2 a_position;
    varying vec2 v_uv;
    void main() {
      v_uv = a_position * 0.5 + 0.5;
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  // Fragment shader: 3D Perlin-like noise (hash-based) + FBM
  // Fragment shader: 3D Perlin-like noise + FBM + 2 colors
  const fragmentShaderSource = `
precision highp float;
varying vec2 v_uv;
uniform float u_time;
uniform vec3 u_color1;
uniform vec3 u_color2;

// Hash function
float hash(float n) {
  return fract(sin(n) * 43758.5453);
}

// Gradient function
float grad(float hash, float x, float y, float z){
  float h = hash * 15.0;
  float u = h < 8.0 ? x : y;
  float v = h < 4.0 ? y : (h > 12.0 ? x : z);
  return (mod(floor(h),2.0)<1.0? u : -u) + (mod(floor(h/2.0),2.0)<1.0? v : -v);
}

// Fade
float fade(float t) {
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

// 3D Perlin noise
float perlinNoise(vec3 p){
  vec3 pi = floor(p);
  vec3 pf = fract(p);

  float A  = hash(pi.x + pi.y*57.0 + pi.z*113.0);
  float B  = hash(pi.x+1.0 + pi.y*57.0 + pi.z*113.0);
  float C  = hash(pi.x + (pi.y+1.0)*57.0 + pi.z*113.0);
  float D  = hash(pi.x+1.0 + (pi.y+1.0)*57.0 + pi.z*113.0);
  float E  = hash(pi.x + pi.y*57.0 + (pi.z+1.0)*113.0);
  float F  = hash(pi.x+1.0 + pi.y*57.0 + (pi.z+1.0)*113.0);
  float G  = hash(pi.x + (pi.y+1.0)*57.0 + (pi.z+1.0)*113.0);
  float H  = hash(pi.x+1.0 + (pi.y+1.0)*57.0 + (pi.z+1.0)*113.0);

  float u = fade(pf.x);
  float v = fade(pf.y);
  float w = fade(pf.z);

  float n000 = grad(A, pf.x, pf.y, pf.z);
  float n100 = grad(B, pf.x-1.0, pf.y, pf.z);
  float n010 = grad(C, pf.x, pf.y-1.0, pf.z);
  float n110 = grad(D, pf.x-1.0, pf.y-1.0, pf.z);
  float n001 = grad(E, pf.x, pf.y, pf.z-1.0);
  float n101 = grad(F, pf.x-1.0, pf.y, pf.z-1.0);
  float n011 = grad(G, pf.x, pf.y-1.0, pf.z-1.0);
  float n111 = grad(H, pf.x-1.0, pf.y-1.0, pf.z-1.0);

  float nx00 = mix(n000, n100, u);
  float nx01 = mix(n001, n101, u);
  float nx10 = mix(n010, n110, u);
  float nx11 = mix(n011, n111, u);

  float nxy0 = mix(nx00, nx10, v);
  float nxy1 = mix(nx01, nx11, v);

  return mix(nxy0, nxy1, w);
}

// FBM
float fbm(vec3 p){
  float total = 0.0;
  float amplitude = 1.0;
  float frequency = 2.0;
  for(int i=0;i<5;i++){
    total += perlinNoise(p*frequency) * amplitude;
    frequency *= 2.0;
    amplitude *= 0.5;
  }
  return total;
}

void main(){
  float n = fbm(vec3(v_uv*5.0, u_time*0.1));
  // Normalize noise to 0..1
  float noiseVal = 0.5 + 0.5*n;
  vec3 color = mix(u_color1, u_color2, noiseVal);
  gl_FragColor = vec4(color,1.0);
}
`;


  function createShader(gl: WebGLRenderingContext, type: number, source: string) {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
    }
    return shader;
  }

  function createProgram(gl: WebGLRenderingContext, vs: string, fs: string) {
    const program = gl.createProgram()!;
    gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vs));
    gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
    }
    return program;
  }

  const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
  gl.useProgram(program);

  const positionLocation = gl.getAttribLocation(program, 'a_position');
  const timeLocation = gl.getUniformLocation(program, 'u_time')!;
  // const colorLocation = gl.getUniformLocation(program, 'u_color')!;

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1, 1, -1, -1, 1,
    -1, 1, 1, -1, 1, 1
  ]), gl.STATIC_DRAW);

  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  const color1Location = gl.getUniformLocation(program, 'u_color1')!;
  const color2Location = gl.getUniformLocation(program, 'u_color2')!;

  function render(gl: WebGLRenderingContext, canvas: HTMLCanvasElement) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);

    const styles = getComputedStyle(document.documentElement);
    const r1 = parseFloat(styles.getPropertyValue('--noise-r1') || '30') / 255;
    const g1 = parseFloat(styles.getPropertyValue('--noise-g1') || '30') / 255;
    const b1 = parseFloat(styles.getPropertyValue('--noise-b1') || '30') / 255;

    const r2 = parseFloat(styles.getPropertyValue('--noise-r2') || '200') / 255;
    const g2 = parseFloat(styles.getPropertyValue('--noise-g2') || '200') / 255;
    const b2 = parseFloat(styles.getPropertyValue('--noise-b2') || '200') / 255;

    gl.uniform3f(color1Location, r1, g1, b1);
    gl.uniform3f(color2Location, r2, g2, b2);

    gl.uniform1f(timeLocation, performance.now() * 0.001);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(() => render(gl, canvas));
  }

  render(gl, canvas);

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
  });
});
</script>

<template>
  <canvas ref="canvasRef"
    style="position: fixed; top:0; left:0; width:100%; height:100%; z-index:-1; pointer-events:none;"></canvas>
</template>
