describe('Login', () => {
  it('should visit login', () => {
    cy.visit('/').title().should('eq', 'Log In');
  });

  it('should show validation error', () => {
    cy.visit('/');
    // @ts-ignore
    cy.error('test@gmail', 'test@gmail.com', '123');
  });

  it('should fill out the form', () => {
    // @ts-ignore
    cy.login('test@gmail.com', '1234');
  });
});
