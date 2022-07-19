describe('nft-metadata/catalog', () => {
  beforeEach(() => cy.visit('/catalog'));

  it('should load the catalog page', () => {
    cy.get('.text-h1').contains('NFT Catalog');
  });

  it('should load an item from the catalog', () => {
    cy.get('.w-11\\/12').select('Testnet');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(5000);
    cy.get(':nth-child(1) > .font-semibold').click();
    cy.get('.px-10').contains('The Example Collection');
  });
});
