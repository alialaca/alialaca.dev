<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  fileName: string
  content: string
  type: 'text' | 'markdown'
}>()

const emit = defineEmits<{
  close: []
}>()

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' || e.key === 'q') {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <div class="file-viewer">
    <!-- Header -->
    <div class="file-viewer-header">
      <span class="file-viewer-title">{{ fileName }}</span>
      <span class="file-viewer-hint">Press 'q' or ESC to close</span>
    </div>

    <!-- Content -->
    <div class="file-viewer-content">
      <ViewerMarkdownRenderer v-if="type === 'markdown'" :content="content" />
      <pre v-else class="text-content">{{ content }}</pre>
    </div>

    <!-- Footer (vim-like) -->
    <div class="file-viewer-footer">
      <span class="footer-filename">{{ fileName }}</span>
      <span class="footer-info">{{ content.split('\n').length }}L</span>
    </div>
  </div>
</template>

<style scoped>
.file-viewer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--terminal-bg);
  z-index: 100;
  display: flex;
  flex-direction: column;
}

.file-viewer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: var(--terminal-bg-light);
  border-bottom: 1px solid var(--terminal-border);
}

.file-viewer-title {
  color: var(--terminal-green);
  font-weight: 500;
}

.file-viewer-hint {
  color: var(--terminal-gray);
  font-size: 0.875rem;
}

.file-viewer-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.file-viewer-content::-webkit-scrollbar {
  width: 8px;
}

.file-viewer-content::-webkit-scrollbar-track {
  background: var(--terminal-bg);
}

.file-viewer-content::-webkit-scrollbar-thumb {
  background: var(--terminal-border);
  border-radius: 4px;
}

.text-content {
  white-space: pre-wrap;
  word-break: break-word;
  color: var(--terminal-text);
  line-height: 1.6;
  margin: 0;
}

.file-viewer-footer {
  display: flex;
  justify-content: space-between;
  padding: 0.25rem 1rem;
  background-color: var(--terminal-bg-light);
  border-top: 1px solid var(--terminal-border);
  font-size: 0.875rem;
}

.footer-filename {
  color: var(--terminal-text);
}

.footer-info {
  color: var(--terminal-gray);
}
</style>
