describe('navegação', () => {
  it('navega da home para uma aula de PO1', () => {
    cy.visit('/')
    cy.contains('Pesquisa Operacional I').click()
    cy.contains('Aula 05: Algoritmo Simplex').click()
    cy.get('.lesson-panel').should('contain', 'Algoritmo Simplex')
    cy.url().should('include', '/po1/aula-5')
  })
  it('deep-link abre a aula certa', () => {
    cy.visit('/po2/aula-2')
    cy.get('.lesson-panel').should('contain', 'Teoria dos Grafos')
  })
})
