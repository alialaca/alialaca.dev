<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { useTerminalStore } from '~/stores/terminal'
import { useTabCompletion } from '~/composables/useTabCompletion'

const emit = defineEmits<{
  submit: [command: string]
}>()

const terminal = useTerminalStore()
const { getCompletion } = useTabCompletion()

const inputValue = ref('')
const inputRef = ref<HTMLInputElement | null>(null)
const suggestions = ref<string[]>([])
const showSuggestions = ref(false)

onMounted(() => {
  focusInput()
})

function focusInput() {
  nextTick(() => {
    inputRef.value?.focus()
  })
}

function handleSubmit() {
  const command = inputValue.value.trim()
  emit('submit', command)
  inputValue.value = ''
  suggestions.value = []
  showSuggestions.value = false
  terminal.resetHistoryIndex()
}

function handleKeyDown(e: KeyboardEvent) {
  // Ctrl+L - Clear
  if (e.ctrlKey && e.key === 'l') {
    e.preventDefault()
    emit('submit', 'clear')
    return
  }

  // Ctrl+C - Cancel
  if (e.ctrlKey && e.key === 'c') {
    e.preventDefault()
    inputValue.value = ''
    suggestions.value = []
    showSuggestions.value = false
    return
  }

  // Tab - Autocomplete
  if (e.key === 'Tab') {
    e.preventDefault()
    handleTabCompletion()
    return
  }

  // Arrow Up - Previous command
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    const prev = terminal.getPreviousCommand()
    if (prev !== null) {
      inputValue.value = prev
    }
    return
  }

  // Arrow Down - Next command
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    const next = terminal.getNextCommand()
    if (next !== null) {
      inputValue.value = next
    }
    return
  }

  // Escape - Clear suggestions
  if (e.key === 'Escape') {
    suggestions.value = []
    showSuggestions.value = false
    return
  }
}

function handleTabCompletion() {
  const result = getCompletion(inputValue.value)

  if (result.suggestions.length === 0) {
    return
  }

  if (result.suggestions.length === 1) {
    inputValue.value = result.completed
    suggestions.value = []
    showSuggestions.value = false
  } else {
    // Birden fazla öneri varsa, ortak prefix'i tamamla ve önerileri göster
    inputValue.value = result.completed
    suggestions.value = result.suggestions
    showSuggestions.value = true
  }
}

// Click anywhere to focus input
function handleContainerClick() {
  focusInput()
}

// Hide suggestions when input changes
watch(inputValue, () => {
  if (showSuggestions.value && suggestions.value.length > 0) {
    // Değer değiştiğinde önerileri gizle
    const result = getCompletion(inputValue.value)
    if (result.suggestions.length <= 1) {
      showSuggestions.value = false
      suggestions.value = []
    }
  }
})

defineExpose({ focusInput })
</script>

<template>
  <div class="terminal-input-container" @click="handleContainerClick">
    <div class="terminal-line">
      <TerminalPrompt />
      <div class="terminal-input-wrapper">
        <input
          ref="inputRef"
          v-model="inputValue"
          type="text"
          class="terminal-input"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
          @keydown="handleKeyDown"
          @keydown.enter="handleSubmit"
        />
      </div>
    </div>

    <!-- Tab completion suggestions -->
    <div v-if="showSuggestions && suggestions.length > 0" class="suggestions">
      <span
        v-for="suggestion in suggestions"
        :key="suggestion"
        class="suggestion-item"
        :class="{ directory: suggestion.endsWith('/') }"
      >
        {{ suggestion }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.terminal-input-container {
  min-height: 1.5rem;
}

.suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 0.5rem;
  padding-left: 0;
}

.suggestion-item {
  color: var(--terminal-text);
}

.suggestion-item.directory {
  color: var(--terminal-blue);
}
</style>
