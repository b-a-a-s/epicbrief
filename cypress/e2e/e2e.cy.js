// set timeout to 10 seconds
Cypress.config('defaultCommandTimeout', 10000);

describe('Main Page', () => {
  it('visits the root url', () => {
    cy.visit('/');
    cy.get('h2').contains('Meeting');
  });

  it('can see Filter button and click it', () => {
    cy.visit('/');
    cy.get('button').contains('Filter').click();
  });

  it('can see Action button and click it', () => {
    cy.visit('/');
    cy.get('button').contains('Action').click();
  });

  it('can see Sort button and click it', () => {
    cy.visit('/');
    cy.get('button').contains('Sort').click();
  });

  it('can see Period button and click it', () => {
    cy.visit('/');
    cy.get('button').contains('Period').click();
  });

  it('can see New Meeting button and click it', () => {
    cy.visit('/');
    cy.get('button').contains('New Meeting').click();
  });
});
