<script setup lang="ts">
import type { HistoryEntry } from '~/types'
import { useFileSystemStore } from '~/stores/fileSystem'

defineProps<{
  entries: HistoryEntry[]
}>()

const fileSystem = useFileSystemStore()

function getDisplayPath(path: string): string {
  return fileSystem.getDisplayPath(path)
}
</script>

<template>
  <div class="terminal-output">
    <div v-for="entry in entries" :key="entry.id" class="output-entry">
      <!-- Command line -->
      <div class="terminal-line">
        <span class="terminal-prompt">
          <span class="prompt-user">guest</span>
          <span class="prompt-at">@</span>
          <span class="prompt-host">alialaca.dev</span>
          <span class="prompt-separator">:</span>
          <span class="prompt-path">{{ getDisplayPath(entry.path) }}</span>
          <span class="prompt-symbol">$</span>
        </span>
        <span class="ml-2">{{ entry.command }}</span>
      </div>

      <!-- Output lines -->
      <div v-for="(line, index) in entry.output" :key="index" class="output-line">
        <span v-if="line.type === 'html'" v-html="line.content" />
        <span v-else :class="line.className" class="output-text">{{ line.content }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.output-entry {
  margin-bottom: 0.75rem;
}

.output-line {
  padding-left: 0;
}

.ml-2 {
  margin-left: 0.5rem;
}
</style>
