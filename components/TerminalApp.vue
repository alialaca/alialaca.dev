<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted, computed } from 'vue'
import { useTerminalStore } from '~/stores/terminal'
import { useFileSystemStore } from '~/stores/fileSystem'
import { useCommands } from '~/composables/useCommands'
import { useTracking } from '~/composables/useTracking'

const terminal = useTerminalStore()
const fileSystem = useFileSystemStore()
const { executeCommand } = useCommands()
const tracking = useTracking()

const terminalBodyRef = ref<HTMLElement | null>(null)
const inputRef = ref<InstanceType<typeof import('./Terminal/TerminalInput.vue').default> | null>(null)

const hasHistory = computed(() => terminal.history.length > 0)

let viewerOpenTime = 0

function handleBeforeUnload() {
  tracking.trackSessionDepth()
}

onMounted(() => {
  tracking.initSession()
  window.addEventListener('beforeunload', handleBeforeUnload)
  scrollToBottom()
})

onUnmounted(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
})

function handleCommand(command: string) {
  const result = executeCommand(command)

  if (result.clear) {
    terminal.clearHistory()
  } else {
    terminal.addHistoryEntry(command, result.output, fileSystem.currentPath)
  }

  if (result.openViewer) {
    terminal.openViewer(
      result.openViewer.fileName,
      result.openViewer.content,
      result.openViewer.type
    )
    tracking.trackFileView(result.openViewer.fileName)
    viewerOpenTime = Date.now()
  }

  nextTick(() => {
    scrollToBottom()
    inputRef.value?.focusInput()
  })
}

function scrollToBottom() {
  if (terminalBodyRef.value) {
    terminalBodyRef.value.scrollTop = terminalBodyRef.value.scrollHeight
  }
}

function handleBodyClick() {
  inputRef.value?.focusInput()
}

function handleViewerClose() {
  if (terminal.viewerContent && viewerOpenTime) {
    tracking.trackFileClose(terminal.viewerContent.fileName, Date.now() - viewerOpenTime)
    viewerOpenTime = 0
  }
  terminal.closeViewer()
  nextTick(() => {
    inputRef.value?.focusInput()
  })
}
</script>

<template>
  <div class="terminal-container" @click="handleBodyClick">
    <!-- Neofetch Welcome (shown when no history) -->
    <TerminalNeofetch v-if="!hasHistory" />

    <!-- Scrollable History Area (shown when has history) -->
    <div v-else ref="terminalBodyRef" class="terminal-history">
      <TerminalOutput :entries="terminal.history" />
    </div>

    <!-- Fixed Bottom Command Line -->
    <div class="terminal-input-area">
      <TerminalInput ref="inputRef" @submit="handleCommand" />
    </div>

    <!-- File Viewer Overlay -->
    <ViewerFileViewer
      v-if="terminal.isViewerOpen && terminal.viewerContent"
      :file-name="terminal.viewerContent.fileName"
      :content="terminal.viewerContent.content"
      :type="terminal.viewerContent.type"
      @close="handleViewerClose"
    />
  </div>
</template>

