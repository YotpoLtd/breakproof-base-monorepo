describe('Example test', () => {
  beforeEach(() => {
    initTest();
  });

  it('First test', () => {
    cy.url().should('include', '/example/path/to/your/page');
  });

  it('Second test', () => {
    cy.url().should('include', '/example/path/to/your/page');
  });

  function initTest(): void {
    cy.visit(`/example/path/to/your/page`);
  }
});
