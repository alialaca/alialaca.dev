import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { FileNode } from '~/types'
import fileSystemData from '~/data/filesystem.json'

export const useFileSystemStore = defineStore('fileSystem', () => {
  const root = ref<FileNode>(fileSystemData as FileNode)
  const currentPath = ref('/home/ali')

  const currentNode = computed(() => {
    return getNodeAtPath(currentPath.value)
  })

  function getNodeAtPath(path: string): FileNode | null {
    if (path === '/') return root.value

    const parts = path.split('/').filter(Boolean)
    let node: FileNode | null = root.value

    for (const part of parts) {
      if (!node || node.type !== 'directory' || !node.children) {
        return null
      }
      const child = node.children.find((c) => c.name === part)
      if (!child) return null
      node = child
    }

    return node
  }

  function resolvePath(path: string): string {
    if (path.startsWith('/')) {
      return normalizePath(path)
    }

    if (path === '~') {
      return '/home/ali'
    }

    if (path.startsWith('~/')) {
      return normalizePath('/home/ali/' + path.slice(2))
    }

    const combined = currentPath.value + '/' + path
    return normalizePath(combined)
  }

  function normalizePath(path: string): string {
    const parts = path.split('/').filter(Boolean)
    const result: string[] = []

    for (const part of parts) {
      if (part === '..') {
        result.pop()
      } else if (part !== '.') {
        result.push(part)
      }
    }

    return '/' + result.join('/')
  }

  function setCurrentPath(path: string) {
    const resolvedPath = resolvePath(path)
    const node = getNodeAtPath(resolvedPath)

    if (!node) {
      throw new Error(`Dizin bulunamadı: ${path}`)
    }

    if (node.type !== 'directory') {
      throw new Error(`Bu bir dizin değil: ${path}`)
    }

    currentPath.value = resolvedPath
  }

  function listDirectory(path?: string): FileNode[] {
    const targetPath = path ? resolvePath(path) : currentPath.value
    const node = getNodeAtPath(targetPath)

    if (!node || node.type !== 'directory') {
      return []
    }

    return node.children || []
  }

  function getFileContent(path: string): string | null {
    const resolvedPath = resolvePath(path)
    const node = getNodeAtPath(resolvedPath)

    if (!node || node.type !== 'file') {
      return null
    }

    return node.content || ''
  }

  function getDisplayPath(path: string): string {
    if (path.startsWith('/home/ali')) {
      return '~' + path.slice(9)
    }
    return path
  }

  function buildTree(
    node: FileNode,
    prefix: string = '',
    isLast: boolean = true
  ): string[] {
    const lines: string[] = []
    const connector = isLast ? '└── ' : '├── '
    const name = node.type === 'directory' ? node.name + '/' : node.name

    if (node.name !== '/') {
      lines.push(prefix + connector + name)
    }

    if (node.type === 'directory' && node.children) {
      const newPrefix = node.name === '/' ? '' : prefix + (isLast ? '    ' : '│   ')
      const sortedChildren = [...node.children].sort((a, b) => {
        if (a.type === b.type) return a.name.localeCompare(b.name)
        return a.type === 'directory' ? -1 : 1
      })

      sortedChildren.forEach((child, index) => {
        const childIsLast = index === sortedChildren.length - 1
        lines.push(...buildTree(child, newPrefix, childIsLast))
      })
    }

    return lines
  }

  function getTree(path?: string): string[] {
    const targetPath = path ? resolvePath(path) : currentPath.value
    const node = getNodeAtPath(targetPath)

    if (!node) {
      return ['Dizin bulunamadı']
    }

    const rootName = targetPath === '/' ? '/' : targetPath.split('/').pop() || '/'
    const lines = [rootName + (node.type === 'directory' ? '/' : '')]

    if (node.type === 'directory' && node.children) {
      const sortedChildren = [...node.children].sort((a, b) => {
        if (a.type === b.type) return a.name.localeCompare(b.name)
        return a.type === 'directory' ? -1 : 1
      })

      sortedChildren.forEach((child, index) => {
        const isLast = index === sortedChildren.length - 1
        lines.push(...buildTree(child, '', isLast))
      })
    }

    return lines
  }

  return {
    root,
    currentPath,
    currentNode,
    getNodeAtPath,
    resolvePath,
    setCurrentPath,
    listDirectory,
    getFileContent,
    getDisplayPath,
    getTree,
  }
})
