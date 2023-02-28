describe('nft-metadata/catalog', () => {
  beforeEach(() => cy.visit('/transactions'));

  it('should load the transaction generation page', () => {
    cy.get('.px-4 > .flex-1').contains('Generate Transactions');
  });

  it('Should show when clicking transaction name', () => {
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000);
    cy.get('#default-search').type('UFCStrike');
    cy.get('.lg\\:hidden > .border-t-1 > :nth-child(2)').first().click();
    cy.get(':nth-child(2) > .my-4 > .sc-gswNZR > span > code').contains(
      'import'
    );
  });
});
