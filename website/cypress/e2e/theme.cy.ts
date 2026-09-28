// O botão de tema (faixa institucional no desktop, menu no mobile) alterna
// [data-theme] entre verde (padrão) e azul, e a escolha persiste.
describe('troca de tema', () => {
  it('[desktop] botão na faixa alterna e persiste após reload', () => {
    cy.viewport(1280, 800)
    cy.visit('/')
    cy.get('html').should('have.attr', 'data-theme', 'green')
    cy.get('.inst-strip .theme-toggle').click()
    cy.get('html').should('have.attr', 'data-theme', 'blue')
    cy.reload()
    cy.get('html').should('have.attr', 'data-theme', 'blue')
  })

  it('[mobile] botão no menu colapsável alterna o tema', () => {
    cy.viewport('iphone-x')
    cy.visit('/')
    cy.get('.navbar-toggler').click()
    cy.get('#nav .theme-toggle').click()
    cy.get('html').should('have.attr', 'data-theme', 'blue')
  })
})
