import { existsSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import { disciplines } from '@/content'
import { validateDiscipline } from '@/content/validate'

const publicDir = fileURLToPath(new URL('../public', import.meta.url))
let errors: string[] = []

for (const d of Object.values(disciplines)) {
  errors = errors.concat(validateDiscipline(d))
  for (const lesson of d.lessons) {
    for (const m of lesson.materials) {
      const path = publicDir + m.url
      if (!existsSync(path)) errors.push(`[${d.slug}/${lesson.id}] material ausente: ${m.url}`)
    }
  }
}

if (errors.length) {
  console.error('Conteúdo inválido:\n' + errors.map((e) => ' - ' + e).join('\n'))
  process.exit(1)
}
console.log('Conteúdo OK.')
