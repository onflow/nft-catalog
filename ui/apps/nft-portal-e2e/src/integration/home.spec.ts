describe('nft-metadata/home', () => {
  beforeEach(() => cy.visit('/'));

  it('should load the home page', () => {
    // Should be on home page.
    cy.get('.font-display > header').contains('Flow NFT Catalog');
    // Should have buttons.
    cy.get(
      ':nth-child(1) > .py-6 > .w-full > :nth-child(1) > .link-card-3-column-link > .display-block > .flex > :nth-child(1) > .text-l'
    ).contains('Catalog');
    cy.get(
      ':nth-child(3) > .py-6 > .w-full > :nth-child(1) > .link-card-3-column-link > .display-block > .flex > :nth-child(1) > .text-l'
    ).contains('Verify Metadata');
  });
});
