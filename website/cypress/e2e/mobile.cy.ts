describe('mobile', () => {
  beforeEach(() => cy.viewport('iphone-x'))
  it('navbar colapsa e navega', () => {
    cy.visit('/')
    cy.get('.navbar-toggler').click()
    cy.contains('Pesquisa Operacional II').click()
    cy.url().should('include', '/po2')
  })
  it('não há scroll horizontal na home', () => {
    cy.visit('/')
    cy.document().then((doc) => {
      expect(doc.documentElement.scrollWidth).to.be.lte(doc.documentElement.clientWidth + 1)
    })
  })
})
