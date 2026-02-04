export interface FileNode {
  name: string
  type: 'file' | 'directory'
  content?: string
  children?: FileNode[]
  permissions?: string
  owner?: string
  group?: string
  size?: number
  modified?: string
  created?: string
}

export interface HistoryEntry {
  id: number
  command: string
  output: OutputLine[]
  timestamp: Date
  path: string
}

export interface OutputLine {
  type: 'text' | 'error' | 'success' | 'info' | 'html'
  content: string
  className?: string
}

export interface CommandResult {
  output: OutputLine[]
  clear?: boolean
  openViewer?: {
    fileName: string
    content: string
    type: 'text' | 'markdown'
  }
}

export interface Command {
  name: string
  description: string
  usage: string
  execute: (args: string[], context: CommandContext) => CommandResult | Promise<CommandResult>
}

export interface CommandContext {
  currentPath: string
  fileSystem: FileNode
  isAuthenticated: boolean
  user: string
  setCurrentPath: (path: string) => void
  getNodeAtPath: (path: string) => FileNode | null
  resolvePath: (path: string) => string
}

export interface User {
  username: string
  isAuthenticated: boolean
}

export type TabCompletionType = 'command' | 'path' | 'file' | 'directory'

export interface TabCompletionResult {
  suggestions: string[]
  commonPrefix: string
  type: TabCompletionType
}
