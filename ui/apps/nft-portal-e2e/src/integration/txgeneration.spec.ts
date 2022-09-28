describe('nft-metadata/catalog', () => {
  beforeEach(() => cy.visit('/transactions'));

  it('should load the transaction generation page', () => {
    cy.get('.text-h1').contains('Transactions');
  });

  it('Should prompt for proper collection identifier when clicking transaction name', () => {
    cy.wait(2000);
    cy.get('.border-t-1 > :nth-child(1)').first().click()
    cy.get('.text-md').contains("Enter a collection identifier")
  });

  it('Should prompt for proper collection identifier when clicking transaction name', () => {
    cy.wait(2000);
    cy.get('#default-search').type("UFCStrike")
    cy.get('.border-t-1 > :nth-child(1)').first().click()
    cy.get('.cm-activeLine').contains("import")
  });
});
