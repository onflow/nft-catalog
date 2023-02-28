describe('nft-metadata/viewnfts', () => {
  beforeEach(() => cy.visit('/nfts'));

  it('should load the view nft page', () => {
    cy.get('.px-4 > .flex-1').contains('View NFTs');
  });

  it('Should prompt for proper collection identifier when clicking transaction name', () => {
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000);
    cy.get('#default-search').type('0x2aa77a0776d7c209');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000);
    cy.get('.md\\:flex-row > :nth-child(2) > .h-12').select('Testnet');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000);
    cy.get('.border-t-1 > .flex-col').click();
    cy.get('.text-3xl').contains('NFT | Test NFT Name 1');
  });
});
