import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { HistoryEntry, OutputLine } from '~/types'

export const useTerminalStore = defineStore('terminal', () => {
  const history = ref<HistoryEntry[]>([])
  const commandHistory = ref<string[]>([])
  const historyIndex = ref(-1)
  const isViewerOpen = ref(false)
  const viewerContent = ref<{ fileName: string; content: string; type: 'text' | 'markdown' } | null>(null)

  let entryIdCounter = 0

  function addHistoryEntry(command: string, output: OutputLine[], path: string) {
    history.value.push({
      id: ++entryIdCounter,
      command,
      output,
      timestamp: new Date(),
      path,
    })

    if (command.trim()) {
      commandHistory.value.push(command)
    }
    historyIndex.value = commandHistory.value.length
  }

  function clearHistory() {
    history.value = []
  }

  function getPreviousCommand(): string | null {
    if (historyIndex.value > 0) {
      historyIndex.value--
      return commandHistory.value[historyIndex.value]
    }
    if (historyIndex.value === 0) {
      return commandHistory.value[0]
    }
    return null
  }

  function getNextCommand(): string | null {
    if (historyIndex.value < commandHistory.value.length - 1) {
      historyIndex.value++
      return commandHistory.value[historyIndex.value]
    }
    historyIndex.value = commandHistory.value.length
    return ''
  }

  function resetHistoryIndex() {
    historyIndex.value = commandHistory.value.length
  }

  function openViewer(fileName: string, content: string, type: 'text' | 'markdown') {
    viewerContent.value = { fileName, content, type }
    isViewerOpen.value = true
  }

  function closeViewer() {
    isViewerOpen.value = false
    viewerContent.value = null
  }

  return {
    history,
    commandHistory,
    historyIndex,
    isViewerOpen,
    viewerContent,
    addHistoryEntry,
    clearHistory,
    getPreviousCommand,
    getNextCommand,
    resetHistoryIndex,
    openViewer,
    closeViewer,
  }
})
