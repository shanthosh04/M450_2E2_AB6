describe('Quiz card', () => {
  beforeEach(() => {
    cy.visit('http://localhost:9000/')
  })

  it('creates a card', () => {
    cy.get("input[placeholder='Give your Question']").type("Wo Liegt die Schweiz")
    cy.get("input[placeholder='Give your answer']").type("In Europa")
    cy.get("button").contains("Save").click()
  })

  it('edits a card', () => {
    cy.get("input[placeholder='Give your Question']").type("Wo Liegt die Schweiz")
    cy.get("input[placeholder='Give your answer']").type("In Europa")
    cy.get("button").contains("Save").click()
    cy.get("button").contains("Edit").click()
    cy.get("input[placeholder='Give your Question']").type(" edited")
    cy.get("input[placeholder='Give your answer']").type(" edited")
    cy.get("button").contains("Save").click()
  })

  it('deletes a card', () => {
    cy.get("input[placeholder='Give your Question']").type("Eine Frage")
    cy.get("input[placeholder='Give your answer']").type("In Europa")
    cy.get("button").contains("Save").click()
    cy.get("button").contains("X").click()
  })

  it('shows card answer', () => {
    cy.get("input[placeholder='Give your Question']").type("Wo Liegt die Schweiz")
    cy.get("input[placeholder='Give your answer']").type("In Europa")
    cy.get("button").contains("Save").click()
    cy.get("button").contains("Show").click()
  })
})
