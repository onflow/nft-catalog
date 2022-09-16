describe('nft-metadata/verifier', () => {
  beforeEach(() => cy.visit('/v'));

  it('should load the verifier page', () => {
    cy.get('.text-h1').contains('Select NFT Contract');
  });

  it('should go through the verifier flow for good contract', () => {
    // On step 1
    cy.get(':nth-child(1) > .group').should(
      'have.class',
      'border-primary-purple'
    );
    cy.get('#default-search').click();
    cy.get('#default-search').type('0x37d92dad2356b641');
    cy.get('.right-2\\.5').click();
    cy.get(':nth-child(8) > .no-underline').click();
    // On step 2
    cy.get(':nth-child(2) > .group').should(
      'have.class',
      'border-primary-purple'
    );
    cy.get('form > :nth-child(4)').click();
    cy.get('[placeholder="e.g. 0x123456abcdef"]').click();
    cy.get('[placeholder="e.g. 0x123456abcdef"]').type('0x2aa77a0776d7c209');
    cy.get('form > .bg-white').click();
    // On step 3
    cy.get(':nth-child(3) > .group').should(
      'have.class',
      'border-primary-purple'
    );
    cy.contains('Continue');
  });

  it('should go through the verifier flow for non standard contract', () => {
    // On step 1
    cy.get(':nth-child(1) > .group').should(
      'have.class',
      'border-primary-purple'
    );
    cy.get('#default-search').click();
    cy.get('#default-search').type('0x37d92dad2356b641');
    cy.get('.right-2\\.5').click();
    cy.get(':nth-child(9) > .no-underline').click();
    // On step 2
    cy.get(':nth-child(2) > .group').should(
      'have.class',
      'border-primary-purple'
    );
    cy.get('form > :nth-child(4)').click();
    cy.get('[placeholder="e.g. 0x123456abcdef"]').click();
    cy.get('[placeholder="e.g. 0x123456abcdef"]').type('0x2aa77a0776d7c209');
    cy.get('form > .bg-white').click();
    // On step 3
    cy.get(':nth-child(3) > .group').should(
      'have.class',
      'border-primary-purple'
    );
    cy.contains(
      'You have not properly implemented all recommended metadata views required to be added to the NFT catalog.'
    );
  });
});
