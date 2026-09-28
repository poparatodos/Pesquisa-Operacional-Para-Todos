// Regressão: o drawer de aulas precisa navegar ao clicar num item. O bug era o
// `data-bs-dismiss` do Bootstrap (handler em fase de captura) dando preventDefault
// no <a> e barrando o RouterLink — em desktop e mobile.
describe('drawer de aulas', () => {
  it('[mobile] navega ao tocar num item da lista', () => {
    cy.viewport('iphone-x')
    cy.visit('/po1/aula-1')
    cy.get('[data-bs-target="#lessonDrawer"]').click()
    cy.get('#lessonDrawer').should('have.class', 'show')
    cy.get('#lessonDrawer .drawer__item').eq(4).click()
    cy.location('pathname').should('eq', '/po1/aula-5')
    cy.get('.focus__title').should('contain', 'Algoritmo Simplex')
  })

  it('[desktop] navega ao clicar num item da lista', () => {
    cy.viewport(1280, 800)
    cy.visit('/po1/aula-1')
    cy.get('[data-bs-target="#lessonDrawer"]').click()
    cy.get('#lessonDrawer .drawer__item').eq(4).click()
    cy.location('pathname').should('eq', '/po1/aula-5')
  })

  it('[mobile] permite navegar de novo (drawer fecha, sem backdrop preso)', () => {
    cy.viewport('iphone-x')
    cy.visit('/po1/aula-1')
    cy.get('[data-bs-target="#lessonDrawer"]').click()
    cy.get('#lessonDrawer .drawer__item').eq(4).click()
    cy.location('pathname').should('eq', '/po1/aula-5')
    // drawer fechado e sem backdrop cobrindo a tela
    cy.get('#lessonDrawer').should('not.have.class', 'show')
    cy.get('.offcanvas-backdrop').should('not.exist')
    // reabrir e navegar de novo
    cy.get('[data-bs-target="#lessonDrawer"]').click()
    cy.get('#lessonDrawer').should('have.class', 'show')
    cy.get('#lessonDrawer .drawer__item').eq(1).click()
    cy.location('pathname').should('eq', '/po1/aula-2')
  })
})
