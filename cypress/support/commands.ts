// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import '@testing-library/cypress/add-commands';

Cypress.Commands.add('assertLoggedIn', () => {
  cy.window().its('localStorage.token').should('be.a', 'string');
});

Cypress.Commands.add('assertLoggedOut', () => {
  cy.window().its('localStorage.token').should('be.undefined');
});

Cypress.Commands.add('login', (email, password) => {
  cy.visit('/');
  // @ts-ignore
  cy.assertLoggedOut();
  cy.title().should('eq', 'Log In');
  cy.findByPlaceholderText(/email/i).type(email);
  cy.findByPlaceholderText(/password/i).type(password);
  cy.findByRole(/button/i)
    .should('not.have.class', 'pointer-events-none')
    .click();
  // @ts-ignore
  cy.assertLoggedIn();
});

Cypress.Commands.add('error', (invalidEmail, validEmail, invalidPassword) => {
  cy.findByPlaceholderText(/email/i).type(invalidEmail);
  cy.findByRole(/alert/i).should('have.text', 'Please enter a valid email');
  cy.findByPlaceholderText(/email/i).clear();
  cy.findByRole(/alert/i).should('have.text', 'Email is required');
  cy.findByPlaceholderText(/email/i).type(validEmail);
  cy.findByPlaceholderText(/password/i).type(invalidPassword);
  cy.findByRole(/alert/i).should(
    'have.text',
    'Password must be more than 4 chars'
  );
  cy.findByPlaceholderText(/password/i).clear();
  cy.findByRole(/alert/i).should('have.text', 'Password is required');
  cy.findByRole(/button/i).should('have.class', 'pointer-events-none');
});
