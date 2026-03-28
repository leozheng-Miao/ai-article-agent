import { ref } from 'vue'

type ThemeMode = 'light' | 'dark'

const THEME_KEY = 'theme-preference'
const isDark = ref(false)
let initialized = false
let mediaQuery: MediaQueryList | null = null

const applyTheme = (mode: ThemeMode) => {
  isDark.value = mode === 'dark'
  document.documentElement.setAttribute('data-theme', mode)
}

const getSystemTheme = (): ThemeMode => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const getStoredTheme = (): ThemeMode | null => {
  const stored = localStorage.getItem(THEME_KEY)
  return stored === 'light' || stored === 'dark' ? stored : null
}

const setTheme = (mode: ThemeMode, persist = true) => {
  applyTheme(mode)
  if (persist) {
    localStorage.setItem(THEME_KEY, mode)
  }
}

const handleSystemThemeChange = (event: MediaQueryListEvent) => {
  const stored = getStoredTheme()
  if (stored) {
    return
  }
  applyTheme(event.matches ? 'dark' : 'light')
}

const initTheme = () => {
  if (initialized) {
    return
  }
  initialized = true
  const stored = getStoredTheme()
  applyTheme(stored ?? getSystemTheme())

  mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', handleSystemThemeChange)
}

const toggleTheme = () => {
  setTheme(isDark.value ? 'light' : 'dark')
}

export const useTheme = () => {
  return {
    isDark,
    initTheme,
    setTheme,
    toggleTheme,
  }
}
