import type { CommandResult, OutputLine } from '~/types'
import { useFileSystemStore } from '~/stores/fileSystem'
import { useTerminalStore } from '~/stores/terminal'
import { useAuthStore } from '~/stores/auth'

interface CommandDefinition {
  name: string
  description: string
  usage: string
  requiresAuth?: boolean
}

const COMMANDS: CommandDefinition[] = [
  { name: 'help', description: 'Kullanılabilir komutları listeler', usage: 'help' },
  { name: 'pwd', description: 'Mevcut dizini gösterir', usage: 'pwd' },
  { name: 'ls', description: 'Dizin içeriğini listeler', usage: 'ls [-la] [dizin]' },
  { name: 'cd', description: 'Dizin değiştirir', usage: 'cd <dizin>' },
  { name: 'cat', description: 'Dosya içeriğini görüntüler', usage: 'cat <dosya>' },
  { name: 'tree', description: 'Dizin yapısını ağaç olarak gösterir', usage: 'tree [dizin]' },
  { name: 'clear', description: 'Terminali temizler', usage: 'clear' },
  { name: 'whoami', description: 'Mevcut kullanıcıyı gösterir', usage: 'whoami' },
  { name: 'login', description: 'Sisteme giriş yapar', usage: 'login' },
  { name: 'logout', description: 'Sistemden çıkış yapar', usage: 'logout' },
]

export function useCommands() {
  const fileSystem = useFileSystemStore()
  const terminal = useTerminalStore()
  const auth = useAuthStore()

  function getCommandNames(): string[] {
    return COMMANDS.map((c) => c.name)
  }

  function text(content: string, className?: string): OutputLine {
    return { type: 'text', content, className }
  }

  function error(content: string): OutputLine {
    return { type: 'error', content, className: 'text-red' }
  }

  function success(content: string): OutputLine {
    return { type: 'success', content, className: 'text-green' }
  }

  function info(content: string): OutputLine {
    return { type: 'info', content, className: 'text-cyan' }
  }

  function executeCommand(input: string): CommandResult {
    const trimmed = input.trim()
    if (!trimmed) {
      return { output: [] }
    }

    const parts = trimmed.split(/\s+/)
    const command = parts[0].toLowerCase()
    const args = parts.slice(1)

    switch (command) {
      case 'help':
        return cmdHelp()
      case 'pwd':
        return cmdPwd()
      case 'ls':
        return cmdLs(args)
      case 'cd':
        return cmdCd(args)
      case 'cat':
        return cmdCat(args)
      case 'tree':
        return cmdTree(args)
      case 'clear':
        return cmdClear()
      case 'whoami':
        return cmdWhoami()
      case 'login':
        return cmdLogin(args)
      case 'logout':
        return cmdLogout()
      default:
        return {
          output: [error(`Komut bulunamadı: ${command}. Kullanılabilir komutlar için 'help' yazın.`)],
        }
    }
  }

  function cmdHelp(): CommandResult {
    const output: OutputLine[] = [
      text(''),
      info('Kullanılabilir Komutlar:'),
      text(''),
    ]

    for (const cmd of COMMANDS) {
      output.push(text(`  ${cmd.name.padEnd(12)} ${cmd.description}`, 'help-line'))
    }

    output.push(text(''))
    output.push(info('Klavye Kısayolları:'))
    output.push(text(''))
    output.push(text('  ↑/↓          Komut geçmişinde gezin'))
    output.push(text('  Tab          Otomatik tamamlama'))
    output.push(text('  Ctrl+L       Ekranı temizle'))
    output.push(text('  Ctrl+C       Komutu iptal et'))
    output.push(text(''))

    return { output }
  }

  function cmdPwd(): CommandResult {
    return {
      output: [text(fileSystem.currentPath)],
    }
  }

  function cmdLs(args: string[]): CommandResult {
    const showHidden = args.includes('-a') || args.includes('-la') || args.includes('-al')
    const longFormat = args.includes('-l') || args.includes('-la') || args.includes('-al')

    const pathArg = args.find((a) => !a.startsWith('-'))
    const items = fileSystem.listDirectory(pathArg)

    if (items.length === 0) {
      const targetPath = pathArg ? fileSystem.resolvePath(pathArg) : fileSystem.currentPath
      const node = fileSystem.getNodeAtPath(targetPath)

      if (!node) {
        return { output: [error(`ls: '${pathArg}' dizini bulunamadı`)] }
      }

      return { output: [text('(boş dizin)')] }
    }

    const sortedItems = [...items].sort((a, b) => {
      if (a.type === b.type) return a.name.localeCompare(b.name)
      return a.type === 'directory' ? -1 : 1
    })

    const filteredItems = showHidden
      ? sortedItems
      : sortedItems.filter((item) => !item.name.startsWith('.'))

    if (longFormat) {
      const output: OutputLine[] = [
        text(`total ${filteredItems.length}`),
      ]

      for (const item of filteredItems) {
        const isDir = item.type === 'directory'
        const permissions = isDir ? 'drwxr-xr-x' : '-rw-r--r--'
        const size = item.content?.length || 0
        const date = 'Jan  1 00:00'
        const name = isDir ? item.name + '/' : item.name
        const colorClass = isDir ? 'text-blue' : 'text-gray'

        output.push(text(`${permissions}  1 ali  ali  ${String(size).padStart(6)}  ${date}  ${name}`, colorClass))
      }

      return { output }
    }

    const output: OutputLine[] = []
    const line: string[] = []

    for (const item of filteredItems) {
      const isDir = item.type === 'directory'
      const name = isDir ? item.name + '/' : item.name
      line.push(name)
    }

    // Format as columns
    const formatted = line.map((name) => {
      const isDir = name.endsWith('/')
      return { name, isDir }
    })

    output.push({
      type: 'html',
      content: formatted
        .map((f) => `<span class="${f.isDir ? 'text-blue' : ''}">${f.name}</span>`)
        .join('  '),
    })

    return { output }
  }

  function cmdCd(args: string[]): CommandResult {
    const target = args[0] || '~'

    try {
      fileSystem.setCurrentPath(target)
      return { output: [] }
    } catch (e) {
      return {
        output: [error(`cd: ${(e as Error).message}`)],
      }
    }
  }

  function cmdCat(args: string[]): CommandResult {
    if (args.length === 0) {
      return { output: [error('cat: dosya adı belirtilmedi')] }
    }

    const path = args[0]
    const resolvedPath = fileSystem.resolvePath(path)
    const node = fileSystem.getNodeAtPath(resolvedPath)

    if (!node) {
      return { output: [error(`cat: '${path}' bulunamadı`)] }
    }

    if (node.type === 'directory') {
      return { output: [error(`cat: '${path}' bir dizin`)] }
    }

    const content = node.content || ''
    const fileName = node.name
    const isMarkdown = fileName.endsWith('.md')

    return {
      output: [],
      openViewer: {
        fileName,
        content,
        type: isMarkdown ? 'markdown' : 'text',
      },
    }
  }

  function cmdTree(args: string[]): CommandResult {
    const pathArg = args[0]
    const lines = fileSystem.getTree(pathArg)

    const output: OutputLine[] = lines.map((line) => {
      const isDir = line.endsWith('/') || line.includes('/')
      return text(line, isDir && !line.includes('──') ? 'text-blue' : '')
    })

    return { output }
  }

  function cmdClear(): CommandResult {
    return { output: [], clear: true }
  }

  function cmdWhoami(): CommandResult {
    return {
      output: [text(auth.username)],
    }
  }

  function cmdLogin(args: string[]): CommandResult {
    if (auth.isAuthenticated) {
      return { output: [info(`Zaten '${auth.username}' olarak giriş yapılmış.`)] }
    }

    // Basit login - gelecekte interactive prompt eklenebilir
    if (args.length < 2) {
      return { output: [error('Kullanım: login <kullanıcı> <şifre>')] }
    }

    const [username, password] = args
    const success_login = auth.login(username, password)

    if (success_login) {
      return { output: [success(`Hoş geldin, ${auth.username}!`)] }
    }

    return { output: [error('Giriş başarısız. Kullanıcı adı veya şifre hatalı.')] }
  }

  function cmdLogout(): CommandResult {
    if (!auth.isAuthenticated) {
      return { output: [info('Zaten giriş yapılmamış.')] }
    }

    const oldUser = auth.username
    auth.logout()
    return { output: [success(`Görüşürüz, ${oldUser}!`)] }
  }

  return {
    executeCommand,
    getCommandNames,
    COMMANDS,
  }
}
