<script setup lang="ts">
import { useFileSystemStore } from '~/stores/fileSystem'
import { useAuthStore } from '~/stores/auth'

const fileSystem = useFileSystemStore()
const auth = useAuthStore()

const displayPath = computed(() => fileSystem.getDisplayPath(fileSystem.currentPath))
</script>

<template>
  <span class="terminal-prompt">
    <span class="prompt-user">{{ auth.username }}</span>
    <span class="prompt-at">@</span>
    <span class="prompt-host">alialaca.dev</span>
    <span class="prompt-separator">:</span>
    <span class="prompt-path">{{ displayPath }}</span>
    <span class="prompt-symbol">$</span>
  </span>
</template>
