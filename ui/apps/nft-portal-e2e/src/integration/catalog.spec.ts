describe('nft-metadata/catalog', () => {
  beforeEach(() => cy.visit('/catalog'));

  it('should load the catalog page', () => {
    cy.get('.text-h1').contains('NFT Catalog');
  });

  it('should load an item from the catalog', () => {
    cy.get('.w-11\\/12').select('Testnet');
    cy.contains('A.37d92dad2356b641.ExampleNFT.NFT').click();
    cy.get('.px-10').contains('The Example Collection');
  });
});
