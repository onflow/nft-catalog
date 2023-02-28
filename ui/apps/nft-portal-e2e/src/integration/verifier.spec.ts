describe('nft-metadata/verifier', () => {
  beforeEach(() => cy.visit('/v'));

  it('should load the verifier page', () => {
    cy.get('.md\\:mb-8').contains('Add your NFT Collection');
  });

  it('should go through the verifier flow for good contract', () => {
    // On step 1
    cy.get(':nth-child(1) > .group').should('have.class', 'border-black');
    cy.get('#default-search').click();
    cy.get('#default-search').type('0x37d92dad2356b641');
    cy.get('.gap-4 > .cursor-pointer').click();
    cy.get('.flex-wrap > :nth-child(1)').click();
    // On step 2
    cy.get(':nth-child(2) > .group').should('have.class', 'border-black');
    cy.get('form.w-7\\/12 > :nth-child(6)').click();
    cy.get('.mt-8 > #default-search').click();
    cy.get('.mt-8 > #default-search').type('0x2aa77a0776d7c209');
    cy.get('form.w-7\\/12 > .bg-black').click();
    // On step 3
    cy.get(':nth-child(3) > .group').should('have.class', 'border-black');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(5000);
    cy.get('.mt-8 > :nth-child(4)').contains(
      'is implementing all of the recommended views!'
    );
  });

  it('should go through the verifier flow for non standard contract', () => {
    // On step 1
    cy.get(':nth-child(1) > .group').should('have.class', 'border-black');
    cy.get('#default-search').click();
    cy.get('#default-search').type('0x37d92dad2356b641');
    cy.get('.gap-4 > .cursor-pointer').click();
    cy.get('.flex-wrap > :nth-child(2)').click();
    // On step 2
    cy.get(':nth-child(2) > .group').should('have.class', 'border-black');
    cy.get('form.w-7\\/12 > :nth-child(6)').click();
    cy.get('.mt-8 > #default-search').click();
    cy.get('.mt-8 > #default-search').type('0x2aa77a0776d7c209');
    cy.get('form.w-7\\/12 > .bg-black').click();
    // On step 3
    cy.get(':nth-child(3) > .group').should('have.class', 'border-black');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(5000);
    cy.get('.mt-8.max-w-7xl > .mt-8').contains(
      'You have not properly implemented all recommended metadata views required to be added to the NFT catalog.'
    );
  });
});
