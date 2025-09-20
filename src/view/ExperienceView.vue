<script setup lang="ts">
const experiences = [
  {
    company: "Kaspi.kz",
    role: "Software Engineer",
    duration: "June 2025 – Present",
    description: [
      "Developed and maintained Kaspi Messenger web chat with full E2E ownership (frontend, authentication, API, logging, monitoring) used by millions of marketplace customers.",
      "Integrated QR OAuth flow for 100+ business partners, enabling seamless authentication and reducing login issues.",
      "Migrated legacy chat to Vue 3 with Composition API, accelerating feature integration and simplifying dependency management.",
      "Optimized chat performance (lazy loading, virtual scrolling, service workers, caching, websocket tuning) cutting initial load time by 40%.",
      "Collaborated with cross-functional teams to standardize iframe authentication tokens, improving partner integrations."
    ],
    stack: ["Vue 3", "Node.js", "TypeScript", "WebSocket", "Redis"],
    website: "https://kaspi.kz"
  },
  {
    company: "Kaskyr",
    role: "Software Engineer",
    duration: "Nov 2024 – June 2025",
    description: [
      "Contributed to high-load backend with 20+ domain-focused workers on Fastify + Node.js handling 7B+ requests/month.",
      "Refactored database schemas and optimized query distribution, increasing worker response success rate by 15%.",
      "Redesigned orders syncing algorithms and led Prisma migrations, reducing order-processing time by 30%.",
      "Analyzed BullMQ, PostHog, and Datadog telemetry to guide performance optimizations and capacity planning."
    ],
    stack: ["Fastify", "Node.js", "PostgreSQL", "Redis", "BullMQ", "Datadog", "PostHog", "Prisma"],
    website: "https://kaskyr.com"
  },
  {
    company: "Connected Home",
    role: "Software Engineer",
    duration: "Feb 2023 – Nov 2024",
    description: [
      "Developed PWA mobile app and stateless Gateway API (Fastify + Node.js) enabling real-time IoT control of 1K+ smart devices.",
      "Built monitoring pipeline (MQTT → InfluxDB + Grafana) reducing incident detection latency by 60%.",
      "Designed and deployed smart parking system with billing, dynamic pricing, and slot monitoring achieving 80%+ unit test coverage.",
      "Implemented high-availability caching layer with Redis Cluster and syncing worker, ensuring data consistency with PostgreSQL.",
      "Automated CI/CD with GitLab pipelines and OTA updates via Capgo/AppFlow, cutting release cycles from weeks to days."
    ],
    stack: ["Fastify", "Node.js", "MQTT", "InfluxDB", "Grafana", "Redis Cluster", "PostgreSQL", "Capgo", "AppFlow", "GitLab"],
    website: "https://connectedhome.kz/ru"
  },
  {
    company: "NFactorial Programming School",
    role: "Instructing Mentor",
    duration: "May 2022 – Nov 2024",
    description: [
      "Taught data structures and algorithms (Java) to 100+ students through lectures and seminars.",
      "Guided student projects on recursive graphics, simulations, image classification, and graph theory, improving internship placement outcomes."
    ],
    stack: ["Java", "Teaching", "Algorithms"],
    website: "https://www.nfactorial.school/"
  }
]

function highlightTech(text: string, stack: string[]): string {
  let result = text
  stack.forEach(tech => {
    const regex = new RegExp(`\\b${tech.replace(/\+/g, '\\+')}\\b`, "g")
    result = result.replace(
      regex,
      `<span class="inline-tech">${tech}</span>`
    )
  })
  return result
}
</script>

<template>
  <div class="experience">
    <h1 class="title">Experience</h1>
    <div v-for="experience in experiences" class="experience-item" :key="experience.company">
      <div class="item-header">
        <h3>
          {{ experience.role }} at
          <span class="company">{{ experience.company }}</span>
        </h3>
        <p class="duration">{{ experience.duration }}</p>
      </div>

      <div class="description">
        <span
          v-for="item in experience.description"
          :key="item"
          v-html="highlightTech(item, experience.stack)"
          class="description-item"
        />
      </div>

      <div class="stack">
        <span v-for="item in experience.stack" :key="item" class="stack-item">
          {{ item }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.title {
  padding-left: 1rem;
}

.experience {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.experience-item {
  background-color: var(--bg-color-absolute);
  padding: 1rem;
  border-radius: 1rem;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.company {
  font-weight: 700;
}

.company:hover {
  text-decoration: underline;
}

.duration {
  font-size: 0.9rem;
  color: var(--text-muted, #888);
}

.description {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 1rem;
  margin-bottom: 0.75rem;
}

.description-item {
  display: flex;
  align-items: start;
  position: relative;
  padding-left: 1.2rem;
}

/* ▶️ Triangle before each description */
.description-item::before {
  content: "▶";
  position: absolute;
  left: 0;
  color: var(--text-muted, #888);
  font-size: 0.8rem;
  line-height: 1.2;
}

:deep(.inline-tech) {
  display: inline-block;
  background-color: var(--bg-color-secondary);
  border: 1px solid var(--border-color-contrast);
  border-radius: 1rem;
  padding: 0.1rem 0.35rem;
  margin: 0 0.15rem;
  font-family: monospace;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-color);
}

/* Stack list below each experience */
.stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.stack-item {
  background-color: var(--bg-color-secondary);
  padding: 0.4rem 0.6rem;
  border-radius: 1rem;
  border: 1px solid var(--border-color);
  font-family: monospace;
  font-size: 0.75rem;
  color: var(--text-color);
}
</style>
