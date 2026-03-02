<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import MarkdownIt from 'markdown-it'
import { useTracking } from '~/composables/useTracking'

const props = defineProps<{
  content: string
}>()

const tracking = useTracking()
const containerRef = ref<HTMLElement | null>(null)

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
})

const renderedContent = computed(() => {
  return md.render(props.content)
})

function handleClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  const link = target.closest('a')
  if (link?.href) {
    tracking.trackLinkClick(link.href)
  }
}

onMounted(() => {
  containerRef.value?.addEventListener('click', handleClick)
})

onUnmounted(() => {
  containerRef.value?.removeEventListener('click', handleClick)
})
</script>

<template>
  <div ref="containerRef" class="markdown-content" v-html="renderedContent" />
</template>
