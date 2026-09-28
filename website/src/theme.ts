// Tema visual do site, alternável em runtime (azul institucional ⇄ verde do canal).
// As cores trocam via [data-theme] na raiz (ver src/styles/theme.css e
// docs/adr/0002-tema-visual-plugavel-blue-green.md).
import { ref } from 'vue'

export type Theme = 'blue' | 'green'

const STORAGE_KEY = 'po-theme'
const DEFAULT_THEME: Theme = 'green'

function isTheme(v: unknown): v is Theme {
  return v === 'blue' || v === 'green'
}

function readStored(): Theme | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return isTheme(v) ? v : null
  } catch {
    return null
  }
}

function persist(t: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEY, t)
  } catch {
    /* localStorage indisponível (modo privado/bloqueado) — segue sem persistir */
  }
}

/** Tema a aplicar no boot: escolha salva, senão o padrão. */
export function initialTheme(): Theme {
  return readStored() ?? DEFAULT_THEME
}

// Estado único compartilhado por toda a app.
const theme = ref<Theme>(initialTheme())

export function useTheme() {
  function set(t: Theme): void {
    theme.value = t
    document.documentElement.setAttribute('data-theme', t)
    persist(t)
  }
  function toggle(): void {
    set(theme.value === 'blue' ? 'green' : 'blue')
  }
  return { theme, set, toggle }
}
