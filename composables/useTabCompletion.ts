import { useFileSystemStore } from '~/stores/fileSystem'
import { useCommands } from './useCommands'

export interface CompletionResult {
  suggestions: string[]
  commonPrefix: string
  completed: string
}

export function useTabCompletion() {
  const fileSystem = useFileSystemStore()
  const { getCommandNames } = useCommands()

  function getCompletion(input: string): CompletionResult {
    const trimmed = input.trimStart()
    const parts = trimmed.split(/\s+/)

    // Boş input veya sadece komut yazılıyor
    if (parts.length <= 1) {
      return completeCommand(parts[0] || '')
    }

    // Komuttan sonra path tamamlama
    const command = parts[0]
    const partial = parts[parts.length - 1]

    // cd, ls, cat, tree gibi komutlar için path completion
    if (['cd', 'ls', 'cat', 'tree'].includes(command)) {
      const pathResult = completePath(partial, command === 'cd' ? 'directory' : 'all')
      const prefix = parts.slice(0, -1).join(' ') + ' '
      return {
        ...pathResult,
        completed: prefix + pathResult.completed,
      }
    }

    return { suggestions: [], commonPrefix: '', completed: input }
  }

  function completeCommand(partial: string): CompletionResult {
    const commands = getCommandNames()
    const matches = commands.filter((cmd) => cmd.startsWith(partial.toLowerCase()))

    if (matches.length === 0) {
      return { suggestions: [], commonPrefix: '', completed: partial }
    }

    if (matches.length === 1) {
      return {
        suggestions: matches,
        commonPrefix: matches[0],
        completed: matches[0] + ' ',
      }
    }

    const commonPrefix = findCommonPrefix(matches)
    return {
      suggestions: matches,
      commonPrefix,
      completed: commonPrefix,
    }
  }

  function completePath(partial: string, type: 'directory' | 'file' | 'all'): CompletionResult {
    let dirPath: string
    let namePrefix: string

    if (partial.includes('/')) {
      const lastSlash = partial.lastIndexOf('/')
      dirPath = partial.slice(0, lastSlash) || '/'
      namePrefix = partial.slice(lastSlash + 1)
    } else if (partial === '~') {
      return {
        suggestions: ['~/'],
        commonPrefix: '~/',
        completed: '~/',
      }
    } else if (partial.startsWith('~')) {
      dirPath = '~'
      namePrefix = partial.slice(2)
    } else {
      dirPath = '.'
      namePrefix = partial
    }

    const resolvedDir = fileSystem.resolvePath(dirPath === '.' ? fileSystem.currentPath : dirPath)
    const items = fileSystem.listDirectory(resolvedDir)

    const matches = items
      .filter((item) => {
        if (!item.name.startsWith(namePrefix)) return false
        if (type === 'directory') return item.type === 'directory'
        if (type === 'file') return item.type === 'file'
        return true
      })
      .map((item) => {
        const suffix = item.type === 'directory' ? '/' : ''
        return item.name + suffix
      })

    if (matches.length === 0) {
      return { suggestions: [], commonPrefix: '', completed: partial }
    }

    const prefix = partial.includes('/') ? partial.slice(0, partial.lastIndexOf('/') + 1) : ''

    if (matches.length === 1) {
      const completed = prefix + matches[0]
      // Eğer directory ise ve / ile bitmiyorsa / ekle
      return {
        suggestions: matches,
        commonPrefix: matches[0],
        completed,
      }
    }

    const commonPrefix = findCommonPrefix(matches)
    return {
      suggestions: matches,
      commonPrefix,
      completed: prefix + commonPrefix,
    }
  }

  function findCommonPrefix(strings: string[]): string {
    if (strings.length === 0) return ''
    if (strings.length === 1) return strings[0]

    let prefix = strings[0]
    for (let i = 1; i < strings.length; i++) {
      while (!strings[i].startsWith(prefix)) {
        prefix = prefix.slice(0, -1)
        if (prefix === '') return ''
      }
    }
    return prefix
  }

  return {
    getCompletion,
    completeCommand,
    completePath,
  }
}
