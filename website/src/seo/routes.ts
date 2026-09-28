// Enumeração PURA das rotas que o SSG pré-renderiza. Mantém a lista de rotas de
// pré-render derivada do conteúdo tipado (não hardcoded) e num só lugar, para
// que tanto o build (vite.config.ts → ssgOptions.includedRoutes) quanto os
// testes usem a mesma fonte.
//
// Importa por caminho RELATIVO (não pelo alias `@/`): este módulo é consumido
// pelo vite.config.ts, cujo carregador (esbuild) não conhece o alias.
import { disciplines as allDisciplines } from '../content'
import type { Discipline } from '../types/content'

/**
 * Lista de paths a pré-renderizar: a home, a página de catálogo de cada
 * Disciplina e uma rota própria por Aula (`/{slug}/{lessonId}`). Função pura e
 * determinística; recebe as Disciplinas por parâmetro (padrão: o conteúdo real).
 */
export function ssgRoutes(disciplines: Record<string, Discipline> = allDisciplines): string[] {
  const routes: string[] = ['/']
  for (const d of Object.values(disciplines)) {
    routes.push(`/${d.slug}`)
    for (const lesson of d.lessons) {
      routes.push(`/${d.slug}/${lesson.id}`)
    }
  }
  return routes
}
