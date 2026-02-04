<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import { useTerminalStore } from '~/stores/terminal'
import { useFileSystemStore } from '~/stores/fileSystem'
import { useCommands } from '~/composables/useCommands'

const terminal = useTerminalStore()
const fileSystem = useFileSystemStore()
const { executeCommand } = useCommands()

const terminalBodyRef = ref<HTMLElement | null>(null)
const inputRef = ref<InstanceType<typeof import('./Terminal/TerminalInput.vue').default> | null>(null)

const welcomeMessage = `
 █████╗ ██╗     ██╗     █████╗ ██╗      █████╗  ██████╗ █████╗
██╔══██╗██║     ██║    ██╔══██╗██║     ██╔══██╗██╔════╝██╔══██╗
███████║██║     ██║    ███████║██║     ███████║██║     ███████║
██╔══██║██║     ██║    ██╔══██║██║     ██╔══██║██║     ██╔══██║
██║  ██║███████╗██║    ██║  ██║███████╗██║  ██║╚██████╗██║  ██║
╚═╝  ╚═╝╚══════╝╚═╝    ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
`

const welcomeInfo = `Welcome to alialaca.dev - Interactive Terminal Portfolio

Type 'help' to see available commands.
Type 'cat about.txt' to learn more about me.
`

onMounted(() => {
  scrollToBottom()
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
  terminal.closeViewer()
  nextTick(() => {
    inputRef.value?.focusInput()
  })
}
</script>

<template>
  <div class="terminal-container">
    <!-- Terminal Body -->
    <div ref="terminalBodyRef" class="terminal-body" @click="handleBodyClick">
      <div class="terminal-content">
        <!-- Welcome Message -->
        <div class="welcome-message">
          <pre class="welcome-ascii">{{ welcomeMessage }}</pre>
          <pre class="welcome-info">{{ welcomeInfo }}</pre>
        </div>

        <!-- Output History -->
        <TerminalOutput :entries="terminal.history" />

        <!-- Input Line -->
        <TerminalInput ref="inputRef" @submit="handleCommand" />
      </div>
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

