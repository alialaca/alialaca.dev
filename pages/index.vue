<script setup lang="ts">
const fileSystem = useFileSystemStore()
const terminal = useTerminalStore()

const pageTitle = computed(() => {
  const displayPath = fileSystem.getDisplayPath(fileSystem.currentPath)
  const lastCmd = terminal.commandHistory.length > 0
    ? terminal.commandHistory[terminal.commandHistory.length - 1]
    : null

  return lastCmd
    ? `${lastCmd}: ${displayPath} — alialaca.dev`
    : `${displayPath} — alialaca.dev`
})

useHead({
  title: pageTitle,
  meta: [
    { name: 'description', content: 'Interactive terminal-style portfolio of Ali Alaca - Fullstack Developer' },
    { name: 'keywords', content: 'Ali Alaca, Developer, Portfolio, Terminal, Vue, Nuxt' },
    { property: 'og:title', content: 'Ali Alaca - Terminal Portfolio' },
    { property: 'og:description', content: 'Interactive terminal-style portfolio' },
    { property: 'og:type', content: 'website' },
  ],
})
</script>

<template>
  <TerminalApp />
</template>
