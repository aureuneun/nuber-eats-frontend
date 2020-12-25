describe('EditProfile', () => {
  beforeEach(() => {
    //@ts-ignore
    cy.login('test@gmail.com', '1234');
  });

  it('should go to edit-profile using the header', () => {
    cy.get('a[href="/edit-profile"]').click();
    cy.wait(1000);
    cy.title().should('eq', 'Edit Profile');
  });

  it('should change email', () => {
    cy.intercept('POST', 'http://localhost:4000/graphql', (req) => {
      console.log(req.body);
      if (req.body.operationName === 'editProfile') {
        req.body.variables.editProfileInput.email = null;
      }
    });
    cy.visit('/edit-profile');
    cy.findByPlaceholderText(/email/i).clear().type('new@gmail.com');
    cy.findByRole(/button/i).click();
    cy.get('div > span').should('have.text', 'Please verify your email');
  });
});
