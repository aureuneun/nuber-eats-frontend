describe('CreateAccount', () => {
  it('should show validation error', () => {
    cy.visit('/');
    cy.findByText(/create an account/i).click();
    // @ts-ignore
    cy.error('test@gmail', 'test@gmail.com', '123');
  });

  it('should be able to create account and login', () => {
    cy.intercept('POST', 'http://localhost:4000/graphql', (req) => {
      if (req.body.operationName === 'createAccountMutation')
        req.reply((res) =>
          res.send({
            fixture: 'create-account',
          })
        );
    });
    cy.visit('/create-account');
    cy.findByPlaceholderText(/email/i).type('test@gmail.com');
    cy.findByPlaceholderText(/password/i).type('1234');
    cy.findByRole(/button/i).click();
    cy.wait(1000);
    // @ts-ignore
    cy.login('test@gmail.com', '1234');
  });
});
