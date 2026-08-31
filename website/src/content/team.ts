import andrea from '@/assets/team/andrea.jpg'
import lucas from '@/assets/team/lucas.jpg'
import nathalia from '@/assets/team/nathalia.jpeg'
import joao from '@/assets/team/joao.jpeg'

export interface TeamMember {
  name: string
  role: string
  photo: string
  linkedin?: string
  email?: string
}

export const team: TeamMember[] = [
  { name: 'Andréa Bonifácio', role: 'Coordenadora do projeto — Professora Associada da UNIRIO, Doutora em Engenharia de Produção.', photo: andrea, linkedin: 'https://www.linkedin.com/in/andr%C3%A9a-bonif%C3%A1cio-b718a994/', email: 'andreabonifacio@uniriotec.br' },
  { name: 'Lucas Motta', role: 'Graduando em Engenharia de Produção. Equipe de Desenvolvimento do Site.', photo: lucas, linkedin: 'https://www.linkedin.com/in/lucas-motta09/', email: 'lucas.motta09@gmail.com' },
  { name: 'Nathalia Ferreira', role: 'Graduanda em Engenharia de Produção. Equipe de Desenvolvimento do Site.', photo: nathalia, linkedin: 'https://www.linkedin.com/in/nath%C3%A1lia-ferreira-b42745219/', email: 'nathaliaromeirof@gmail.com' },
  { name: 'João Meirelles', role: 'Graduando em Engenharia de Produção. Equipe de Criação das Vídeo Aulas.', photo: joao, linkedin: 'https://www.linkedin.com/in/joao-pedro-meirelles-conceicao-/', email: 'joaopedrojotape@outlook.com' },
]
