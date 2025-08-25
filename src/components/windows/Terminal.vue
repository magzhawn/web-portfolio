<script setup lang="ts">
import { ref, onMounted, nextTick, onBeforeUnmount } from "vue";

const terminalRef = ref<HTMLElement | null>(null);
const activeLineRef = ref<HTMLElement | null>(null);
const commandHistory = ref<{ type: string; value: string }[]>([]);
const currentInput = ref("");
const username = "magzhawn";
const hostname = `${navigator.platform}`;

const audio = new Audio("/music.mp3"); 
audio.loop = true; 

const helpText = [
  "HELP INSTRUCTIONS:",
  "Available commands:",
  "help   -> Show this message",
  "clear  -> Clear the terminal",
  "about  -> Show info about this terminal",
  "exit   -> Close the terminal",
  "play   -> Play the music",
  "pause  -> Pause the music"
];

const lastLogin = ref("");
const formatDate = () => {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };

  const formatted = now
    .toLocaleString("en-US", options)
    .replace(",", "")
    .replace(/(\d+):(\d+):(\d+)/, (match, h, m, s) => `${h}:${m}:${s}`);

  lastLogin.value = `Last login: ${formatted} on ttys000`;
};

const handleKeydown = async (e: KeyboardEvent) => {
  if (e.key === "Backspace") {
    currentInput.value = currentInput.value.slice(0, -1);
    return;
  }

  if (e.key === "Enter") {
    const input = currentInput.value.trim();

    if (input === "clear") {
      commandHistory.value = [];
    } else if (input === "help") {
      commandHistory.value.push({ type: "cmd", value: input });
      helpText.forEach((line) => {
        commandHistory.value.push({ type: "output", value: line });
      });
    } else if (input === "about") {
      commandHistory.value.push({ type: "cmd", value: input });
      commandHistory.value.push({
        type: "output",
        value: "This is a simulated macOS terminal built with Vue 3.",
      });
    } else if (input === "exit") {
      commandHistory.value.push({ type: "cmd", value: input });
      commandHistory.value.push({
        type: "output",
        value: "Closing terminal... (not really 😄)",
      });
    } else if (input === "play") {
      commandHistory.value.push({ type: "cmd", value: input });

      if (!audio.paused) {
        commandHistory.value.push({
          type: "output",
          value: "⚠️ Music is already playing.",
        });
      } else {
        try {
          await audio.play();
          commandHistory.value.push({ type: "output", value: "🎵 Now playing: Deftones - Risk" });
        } catch {
          commandHistory.value.push({
            type: "error",
            value: "⚠️ Unable to play music. Interaction required.",
          });
        }
      }
    } else if (input === "pause") {
      commandHistory.value.push({ type: "cmd", value: input });

      if (audio.paused) {
        commandHistory.value.push({
          type: "output",
          value: "⏸ Music is already paused.",
        });
      } else {
        audio.pause();
        commandHistory.value.push({
          type: "output",
          value: "⏸ Music paused.",
        });
      }
    } else if (input !== "") {
      commandHistory.value.push({ type: "cmd", value: input });
      commandHistory.value.push({
        type: "error",
        value: `Command not found: ${input}. Type "help" for instructions.`,
      });
    }

    currentInput.value = "";
    nextTick(() =>
      terminalRef.value?.scrollTo(0, terminalRef.value.scrollHeight)
    );
    return;
  }

  if (e.key.length > 1) return;
  currentInput.value += e.key;
};


onMounted(() => {
  formatDate();
  window.addEventListener("keydown", handleKeydown);
  nextTick(() => activeLineRef.value?.scrollIntoView({ behavior: "smooth" }));
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>


<template>
  <div class="terminal">
    <div class="terminal-body" ref="terminalRef">
      <!-- Dynamic last login -->
      <div class="terminal-line">{{ lastLogin }}</div>
      <div class="terminal-line instruction">
        {{ "Type " }}<span class="highlight">{{ "help" }}</span
        >{{ " to see available commands." }}
      </div>
      <div
        v-for="(entry, index) in commandHistory"
        :key="index"
        class="terminal-line"
        :class="{
          'output-line': entry.type === 'output',
          'error-line': entry.type === 'error',
        }"
      >
        <template v-if="entry.type === 'cmd'">
          <span class="prompt">{{ username }}@{{ hostname }}{{ " ~ %" }}</span>
          <span class="command">{{ entry.value }}</span>
        </template>
        <template v-else>
          <span class="no-prompt">{{ entry.value }}</span>
        </template>
      </div>

      <!-- Active input line -->
      <div class="terminal-line active-line" ref="activeLineRef">
        <span class="prompt">{{ username }}@{{ hostname }}{{ " ~ %" }}</span>
        <span class="input-span">{{ currentInput }}</span>
        <span class="cursor"></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.terminal {
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  font-family: "SF Mono", "Menlo", "Monaco", "Consolas", monospace;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 6px;
  overflow: hidden;
}

/* Body */
.terminal-body {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  overflow-x: hidden;
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-word;
}

.terminal-line {
  font-size: 14px;
  line-height: 1.4em;
  display: flex;
  flex-wrap: wrap;
  align-items: center; /* instead of baseline */
  gap: 2px;
}

.command {
  color: #fff;
  white-space: pre-wrap;
  word-break: break-word;
}

.output-line {
}

.error-line {
  color: #ff5c57;
}

/* Input span */
.input-span {
  color: #fff;
  min-width: 2px;
  word-break: break-word;
  white-space: pre-wrap;
}

.cursor {
  display: inline-block;
  width: 8px;
  height: 1em; /* match text height */
  background: currentColor;
  vertical-align: text-bottom; /* align with text baseline */
  animation: blink 1s step-start infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

.instruction {
  font-style: italic;
}

.highlight {
  font-weight: bold;
}
</style>
