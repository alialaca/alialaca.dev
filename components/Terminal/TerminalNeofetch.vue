<script setup lang="ts">
const logo = [
  '██████ ██████ ██████',
  '██████ ██████ ██████',
  '██████ ██████ ██████',
  '██████ ██████ ▀▀▀▀▀▀',
  '██████ ██████ ██████',
  '██████ ██████ ██████',
  '██████ ██████ ██████',
  '██████ ██████ ██████',
  '██████ ██████ ██████',
  '██████ ██████ ██████',
  '██████ ██████ ██████',
  '██████ ██████ ██████',
]

const info = [
  { label: 'Role:', value: 'Fullstack Developer' },
  { label: 'Location:', value: 'İzmir, Türkiye' },
  { label: 'Shell:', value: 'Nuxt 3 + Vue 3' },
  { label: 'Languages:', value: 'TypeScript, Go, C#, Java' },
  { label: 'Frontend:', value: 'Vue.js, Nuxt, TailwindCSS' },
  { label: 'Backend:', value: 'Node.js, Go, .NET' },
  { label: 'Desktop:', value: 'Electron.js' },
  { label: 'DevOps:', value: 'Docker, Kubernetes, GitOps' },
  { label: 'Database:', value: 'Supabase, PostgreSQL' },
  { label: 'GitHub:', value: 'github.com/alialaca' },
  { label: 'Website:', value: 'alialaca.dev' },
]

const palette = [
  '--terminal-bg-light',
  '--terminal-red',
  '--terminal-green',
  '--terminal-yellow',
  '--terminal-blue',
  '--terminal-purple',
  '--terminal-cyan',
  '--terminal-text',
]
</script>

<template>
  <div class="neofetch">
    <div class="neofetch__content">
      <div class="neofetch__logo" aria-label="ALİ">
        <div
          v-for="(line, i) in logo"
          :key="i"
          class="neofetch__logo-line"
          :style="{ animationDelay: `${i * 25}ms` }"
        >{{ line }}</div>
      </div>

      <div class="neofetch__info">
        <div class="neofetch__header" :style="{ animationDelay: 'calc(var(--neofetch-info-offset) + 50ms)' }">
          ali<span class="neofetch__at">@</span>alialaca.dev
        </div>
        <div class="neofetch__sep" :style="{ animationDelay: 'calc(var(--neofetch-info-offset) + 80ms)' }">────────────────</div>
        <div
          v-for="(item, i) in info"
          :key="item.label"
          class="neofetch__entry"
          :style="{ animationDelay: `calc(var(--neofetch-info-offset) + ${(i + 2) * 30 + 50}ms)` }"
        >
          <span class="neofetch__label">{{ item.label }}</span>
          <span class="neofetch__value">{{ item.value }}</span>
        </div>
        <div class="neofetch__palette" :style="{ animationDelay: `calc(var(--neofetch-info-offset) + ${(info.length + 3) * 30 + 50}ms)` }">
          <div class="neofetch__palette-row">
            <span v-for="c in palette" :key="c" :style="{ color: `var(${c})` }">███</span>
          </div>
          <div class="neofetch__palette-row neofetch__palette-row--dim">
            <span v-for="c in palette" :key="c" :style="{ color: `var(${c})` }">███</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
