describe('nft-metadata/catalog', () => {
  beforeEach(() => cy.visit('/catalog'));

  it('should load the catalog page', () => {
    cy.get('.text-2xl').contains('Explore the catalog');
  });

  it('should search and load an item from the catalog', () => {
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(5000);
    cy.get('.flex-grow > .w-full').type('TopShot');
    cy.get('[href="/catalog/mainnet/NBATopShot"] > .flex-col').click();
    cy.get('.xs\\:text-2xl').contains('NBA-Top-Shot');
  });
});
