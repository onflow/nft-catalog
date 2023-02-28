describe('nft-metadata/home', () => {
  beforeEach(() => cy.visit('/'));

  it('should load the home page', () => {
    // Should be on home page.
    cy.get('.text-5xl').contains('Explore the Flow NFT Catalog');
    // Should have buttons.
    cy.get('.items-start > .bg-black').contains('Explore catalog');
  });
});
