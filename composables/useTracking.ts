declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, string | number>) => void
    }
  }
}

function track(event: string, data?: Record<string, string | number>) {
  if (import.meta.server) return
  window.umami?.track(event, data)
}

let sessionCommandCount = 0
let firstCommandTracked = false
let sessionStartTime = 0

export function useTracking() {
  function initSession() {
    sessionStartTime = Date.now()
    sessionCommandCount = 0
    firstCommandTracked = false
  }

  function trackCommand(name: string, args?: string[]) {
    sessionCommandCount++

    if (!firstCommandTracked) {
      firstCommandTracked = true
      const timeToFirst = Math.round((Date.now() - sessionStartTime) / 1000)
      track('first-command', { command: name, timeToFirst })
    }

    const data: Record<string, string | number> = { name }

    if (name === 'cat' && args?.[0]) {
      data.file = args[0]
    } else if (name === 'cd' && args?.[0]) {
      data.path = args[0]
    } else if (name === 'ls') {
      data.path = args?.[0] || '.'
    }

    track('command', data)
  }

  function trackFileView(file: string) {
    track('file-view', { file })
  }

  function trackFileClose(file: string, durationMs: number) {
    track('file-close', { file, duration: Math.round(durationMs / 1000) })
  }

  function trackError(type: string, input: string) {
    track('error', { type, input: input.slice(0, 100) })
  }

  function trackTabComplete(input: string, resultCount: number) {
    track('tab-complete', { input: input.slice(0, 50), resultCount })
  }

  function trackHintShown() {
    track('hint-shown')
  }

  function trackHistoryNavigate() {
    track('history-navigate')
  }

  function trackLoginAttempt(success: boolean) {
    track('login-attempt', { success: success ? 1 : 0 })
  }

  function trackLinkClick(url: string) {
    track('link-click', { url: url.slice(0, 200) })
  }

  function trackSessionDepth() {
    if (sessionCommandCount > 0) {
      track('session-depth', { commandCount: sessionCommandCount })
    }
  }

  function trackNavigation(from: string, to: string) {
    track('navigation-path', { from, to })
  }

  return {
    initSession,
    trackCommand,
    trackFileView,
    trackFileClose,
    trackError,
    trackTabComplete,
    trackHintShown,
    trackHistoryNavigate,
    trackLoginAttempt,
    trackLinkClick,
    trackSessionDepth,
    trackNavigation,
  }
}
